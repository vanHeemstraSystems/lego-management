// --------------------------------------------------
// Copyright (c) 2019 lk.lkaz
// Updated 2023 Willem van Heemstra
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// --------------------------------------------------
// [Twitter]: https://twitter.com/lk_lkaz/
// [docs]: https://l3di.netlify.com
// --------------------------------------------------
import { useState } from 'react';
// See https://github.com/fgnass/spin.js
import { Spinner } from 'spin.js';
import * as THREE from "three";
import * as THREE_ADDONS from "three-addons";
// See https://threejs.org/docs/#manual/en/introduction/Installation
import { SceneUtils } from "three/addons/utils/SceneUtils";
// See https://threejs.org/docs/#examples/en/utils/SceneUtils
// import { SceneUtils } from 'three/examples/jsm/utils/SceneUtils.js'
import { Tween } from "@tweenjs/tween.js";

var L3DI = L3DI || { REVISION: "1" };

L3DI.DEG2RAD = Math.PI / 180;

//////////////////////////////////////////////////////////////////////
// L3DI/canvas
//////////////////////////////////////////////////////////////////////
L3DI.Canvas = function (domElement, ops) {
  console.log("Inside L3DI.Canvas");
  var container = domElement || document.body;
  var ops = {
    backgroundColor: ops.backgroundColor || 0xffffff,
    alpha: ops.alpha || 1.0,
    useAlpha: ops.useAlpha || ops.alpha < 1,
    gammaFactor: ops.gammaFactor || 2.2,
    cameraDistance: ops.cameraDistance || 140,
    fov: ops.fov || 60,
    cameraNear: ops.cameraNear || 0.05,
    cameraFar: ops.cameraFar || 1000,
    zoomMin: ops.zoomMin || 0.5,
    zoomMax: ops.zoomMax || 3.0,
    initialRotation: ops.initialRotation || [0, 0, 0],
  };
  var renderer = new THREE.WebGLRenderer({ alpha: ops.useAlpha });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  renderer.setClearColor(ops.backgroundColor, ops.alpha);
  renderer.gammaFactor = ops.gammaFactor;
  renderer.gammaInput = true;
  renderer.gammaOutput = true;

  var canvas = renderer.domElement;
  container.appendChild(canvas);

  var camera = new THREE.PerspectiveCamera(
    ops.fov,
    canvas.width / canvas.height,
    ops.cameraNear,
    ops.cameraFar
  );

  camera.position.set(0, 0, ops.cameraDistance);

  var scene = new THREE.Scene();

  // Added by wvh
  L3DI.Scene = scene;

  var modelContainer = new THREE.Object3D();
  modelContainer.rotation.set(
    ops.initialRotation[0] * L3DI.DEG2RAD,
    ops.initialRotation[1] * L3DI.DEG2RAD,
    ops.initialRotation[2] * L3DI.DEG2RAD
  );
  scene.add(modelContainer);

  var controls = new L3DI.MouseControls(modelContainer, container, {
    zoomMin: ops.zoomMin,
    zoomMax: ops.zoomMax,
  });

  window.addEventListener('resize', this.resize.bind(this));

  //this.canvas = canvas;
  //this.controls = controls;
  this._container = container;
  this._renderer = renderer;
  this._camera = camera;
  this._scene = scene;
  this._modelContainer = modelContainer;
}

Object.assign(L3DI.Canvas.prototype, {
  resize: function () {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    var w = this._container.offsetWidth;
    var h = this._container.offsetHeight;
    this._camera.aspect = w / h;
    this._camera.updateProjectionMatrix();

    this._renderer.setSize(w, h);
  },

  render: function () {
    this._renderer.render(this._scene, this._camera);
  },

  addModel: function (obj) {
    this._modelContainer.add(obj);
  },

  addStaticModel: function (obj) {
    this._scene.add(obj);
  },

  addLight: function (obj) {
    this.addStaticModel(obj);
  },

  setBackgroundColor: function (color, alpha = 1) {
    this._renderer.setClearColor(color, alpha);
  },

  enableShadow: function (bool) {
    this._renderer.shadowMap.enabled = bool;
  },

});

//////////////////////////////////////////////////////////////////////
// L3DI/mouseControls
//////////////////////////////////////////////////////////////////////
L3DI.MouseControls = function (object3D, domElement, ops) {
  console.log("Inside L3DI.MouseControls");
  this.obj = object3D;
  this.el = domElement || document;

  var ops = ops || {};
  this.zoomMin = ops.zoomMin || .5;
  this.zoomMax = ops.zoomMax || 3;

  var scope = this;

  var isMouseDown = false;
  var isRightButton = false;
  var oldX = 0;
  var oldY = 0;
  var oldL = 0;

  this.el.oncontextmenu = function () { return false; }
  this.el.addEventListener('mousedown', mouseDown);
  this.el.addEventListener('mousemove', mouseMove);
  this.el.addEventListener('mouseup', mouseUp);
  this.el.addEventListener('touchstart', touchStart);
  this.el.addEventListener('touchmove', touchMove);
  this.el.addEventListener('touchend', touchEnd);

  function mouseDown(e) {
    e.preventDefault();
    isMouseDown = true;
    if (e.button != 2) {
      isRightButton = false;
      oldX = e.pageX;
      oldY = e.pageY;
    } else {
      isRightButton = true;
      oldL = e.pageX - e.pageY;
    }
  }

  function touchStart(e) {
    switch (e.touches.length) {
      case 1:
        e.preventDefault();
        isMouseDown = true;
        oldX = e.changedTouches[0].pageX;
        oldY = e.changedTouches[0].pageY;
        break;
      case 2:
        e.preventDefault();
        isMouseDown = true;
        var dx = e.touches[0].pageX - e.touches[1].pageX;
        var dy = e.touches[0].pageY - e.touches[1].pageY;
        //oldL = Math.sqrt( dx * dx + dy * dy );
        oldL = dx * dx + dy * dy;
        break;
    }
  }

  function mouseMove(e) {
    if (!isMouseDown) return;
    e.preventDefault();
    if (!isRightButton) {
      setRot(e.pageX, e.pageY);
    } else {
      setScale(e.pageX - e.pageY);
    }
  }

  function touchMove(e) {
    if (!isMouseDown) return;

    switch (e.touches.length) {
      case 1:
        e.preventDefault();
        var x = e.changedTouches[0].pageX;
        var y = e.changedTouches[0].pageY;
        setRot(x, y);
        break;
      case 2:
        e.preventDefault();
        var dx = e.touches[0].pageX - e.touches[1].pageX;
        var dy = e.touches[0].pageY - e.touches[1].pageY;
        //var l = Math.sqrt( dx * dx + dy * dy );
        var l = dx * dx + dy * dy;
        setScale(l);
        break;
    }
  }

  function mouseUp() {
    isMouseDown = false;
  }

  function touchEnd() {
    isMouseDown = false;
  }

  function setRot(x, y) {
    var dx = x - oldX;
    var dy = y - oldY;
    oldX = x;
    oldY = y;

    var q = new THREE.Quaternion();
    var q2 = new THREE.Quaternion();
    q.setFromAxisAngle(
      new THREE.Vector3(1, 0, 0),
      dy * .005
    );
    q2.setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      dx * .005
    );

    scope.obj.applyQuaternion(q.multiply(q2));
  }

  function setScale(l) {
    var dl = l - oldL;
    oldL = l;

    var s = scope.obj.scale.x;
    if (dl > 0) {
      s = Math.min(scope.zoomMax, s * 1.03);
    } else {
      s = Math.max(scope.zoomMin, s * .97);
    }

    scope.obj.scale.set(s, s, s);
  }
}

//////////////////////////////////////////////////////////////////////
// L3DI/inst
//////////////////////////////////////////////////////////////////////
L3DI.createInst = function (model, lines) {
  console.log("Inside L3DI.createInst");
  if (lines == null) {
    var lines = [];
    model.children.foreach(function (obj) {
      lines.push([obj.name]);
    });
    console.log(
      'L3DI.instCSV = [\n'
      + '[0, "buildDir", 0,1,0 ],\n'
      + '["'
      + lines.join('"],\n["')
      + '"],\n'
      + '];'
    )
  }

  var inst = new L3DI.Inst();
  var buildStroke = 50;
  var buildDir = new THREE.Vector3(0, buildStroke, 0);
  var curGroup = [model]; //Save current group nest. Top is 'model'.
  var groupSteps = {}; //key:group.name, val:[step_translate/rotate,...]

  lines.forEach(function (line) {
    if (line[0] === 0) { //LDraw-like comment style
      parseCommand(line);
    } else {
      var objs = [];
      line.forEach(function (name) {
        var obj = model.getObjectByName(name);
        if (curGroup.length > 1) {
          var g = curGroup[curGroup.length - 1];
          // THREE_ADDONS.SceneUtils.attach(obj, model, g); WRONG, SceneUtils should be referenced directly
          // See https://stackoverflow.com/questions/23385623/three-js-proper-way-to-add-and-remove-child-objects-using-three-sceneutils-atta/48919815#48919815
          // SceneUtils.attach/detach has been deprecatd since Three.js r105. One should use Object3D's attach() method directly:
          // SceneUtils.attach(obj, model, g); DEPRECATED
          L3DI.Scene.attach(obj, model, g); // Use previousely defined L3DI.Scene
          //obj.updateMatrixWorld();
        }
        var lobj = new L3DI.LegoObj(obj, buildDir);
        objs.push(lobj);
      });
      if (objs.length > 0) inst.addStep(new L3DI.Step(objs));
    }
  });

  function parseCommand(line) {
    switch (line[1].toLowerCase()) {
      case 'builddirection':
      case 'builddir':
      case 'bd':
        if (typeof (line[2]) == 'number') {
          setBuildDir(new THREE.Vector3(line[2], line[3], line[4]));
        } else {
          var v = new THREE.Vector3(0, 1, 0);
          switch (line[2].toLowerCase()) {
            case 'x':
              v.set(1, 0, 0);
              break;
            case 'y':
              v.set(0, 1, 0);
              break;
            case 'z':
              v.set(0, 0, 1);
              break;
            case '-x':
              v.set(-1, 0, 0);
              break;
            case '-y':
              v.set(0, -1, 0);
              break;
            case '-z':
              v.set(0, 0, -1);
              break;
          }

          if (line[3] != null) {
            var obj = model.getObjectByName(line[3]);
            v.applyQuaternion(obj.quaternion);
          }

          setBuildDir(v);

        }
        break;

      case 'buildstroke':
      case 'bs':
        buildStroke = line[2];
        //buildDir.normalize().multiplyScalar( buildStroke );
        setBuildDir();
        break;

      case 'group':
      case 'g':
        var g = new THREE.Group();
        g.name = line[2];
        if (line[3] != null) {
          g.position.set(line[3], line[4], line[5]);
        }
        curGroup[curGroup.length - 1].add(g);
        g.updateMatrixWorld();
        curGroup.push(g);
        groupSteps[g.name] = [];
        break;

      case 'endgroup':
      case 'eg':
        //case 'ge':
        curGroup.pop();
        break;

      case 'groupitem':
      case 'gi':
        line.slice(2).forEach(function (name) {
          var obj = model.getObjectByName(name);
          var g = curGroup[curGroup.length - 1];
          // THREE_ADDONS.SceneUtils.attach(obj, model, g); WRONG, SceneUtils should be referenced directly
          // See https://stackoverflow.com/questions/23385623/three-js-proper-way-to-add-and-remove-child-objects-using-three-sceneutils-atta/48919815#48919815
          // SceneUtils.attach/detach has been deprecatd since Three.js r105. One should use Object3D's attach() method directly:
          // SceneUtils.attach(obj, model, g); DEPRECATED
          L3DI.Scene.attach(obj, model, g); // Use previously defined L3DI.Scene
          //obj.updateMatrixWorld();
        });
        break;

      case 'translate':
      case 't':
        var g = model.getObjectByName(line[2]);
        var v = buildDir.clone().normalize().multiplyScalar(line[3]);
        var step = new L3DI.Step_translate(g, v);
        groupSteps[g.name].push(step);
        inst.addStep(step);
        break;

      case 'rotate':
      case 'r':
        var g = model.getObjectByName(line[2]);
        var q = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(line[3], line[4], line[5]).normalize(),
          line[6] * L3DI.DEG2RAD
        );
        var step = new L3DI.Step_rotate(g, q);
        groupSteps[g.name].push(step);
        inst.addStep(step);
        break;

    }
  }

  for (var groupName in groupSteps) {
    var steps = groupSteps[groupName];
    var g = model.getObjectByName(groupName);
    var q = g.quaternion.clone();
    var p = g.position.clone();
    for (var i = steps.length - 1; i >= 0; i--) {
      var step = steps[i];
      switch (step.type) {
        case 'translate':
          step.pos0 = { x: p.x, y: p.y, z: p.z };
          p.add(step.pos1);
          step.pos1 = { x: p.x, y: p.y, z: p.z };
          break;
        case 'rotate':
          step.q0 = q.clone();
          q.multiply(step.q1);
          step.q1 = q.clone();
          break;
      }
    }
  }

  function setBuildDir(vec3) {
    if (vec3 != null) {
      buildDir.copy(vec3);
    }
    buildDir.normalize().multiplyScalar(buildStroke);
  }

  return inst;
}

//////////////////////////////////////////////////////////////////////
// L3DI/LegoObj
//////////////////////////////////////////////////////////////////////
L3DI.LegoObj = function (obj, dir) {
  console.log("Inside L3DI.LegoObj");
  this.obj = obj; //THREE.Object3D
  var buildDir = dir || new THREE.Vector3(0, 50, 0);

  this.pos0 = new THREE.Vector3().copy(this.obj.position);
  this.pos1 = this.pos0.clone().add(buildDir);
  this.tween = undefined; //TWEEN.Tween
}

Object.assign(L3DI.LegoObj.prototype, {
  playForward: function () {
    if (this.tween) this.tween.stop();
    this.obj.visible = true;
    this.tween = new TWEEN.Tween(this.obj.position)
      .to(this.pos0, 1000)
      //.easing( TWEEN.Easing.Bounce.Out )
      .easing(TWEEN.Easing.Quadratic.Out)
      .onComplete(function () {
        this.tween = undefined;
      }.bind(this))
      .start();
  },

  playBackward: function () {
    if (this.tween) this.tween.stop();
    this.tween = new TWEEN.Tween(this.obj.position)
      .to(this.pos1, 300)
      .easing(TWEEN.Easing.Linear.None)
      .onComplete(function () {
        this.tween = undefined;
        this.obj.visible = false;
      }.bind(this))
      .start();
  },

});

//////////////////////////////////////////////////////////////////////
// L3DI/Step
//////////////////////////////////////////////////////////////////////
L3DI.Step = function (objList) {
  console.log("Inside L3DI.Step");
  this.objList = objList || []; //[ LegoObj, ... ]
}

Object.assign(L3DI.Step.prototype, {
  type: 'build',

  playForward: function () {
    this.objList.forEach(function (obj) {
      obj.playForward();
    });
  },

  playBackward: function () {
    this.objList.forEach(function (obj) {
      obj.playBackward();
    });
  },

});

//////////////////////////////////////////////////////////////////////
// L3DI/Step_translate
//////////////////////////////////////////////////////////////////////
L3DI.Step_translate = function (obj, v) {
  console.log("Inside L3DI.Step_translate");
  this.obj = obj; //THREE.Object3D
  this.pos0 = undefined; //{ x:0, y:0, z:0 };
  this.pos1 = { x: v.x, y: v.y, z: v.z };
  this.tween = undefined; //TWEEN.Tween
}

Object.assign(L3DI.Step_translate.prototype, {
  type: 'translate',

  playForward: function () {
    if (this.tween) this.tween.stop();
    this.tween = new TWEEN.Tween(this.obj.position)
      .to(this.pos0, 800)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onComplete(function () {
        this.tween = undefined;
      }.bind(this))
      .start();
  },

  playBackward: function () {
    if (this.tween) this.tween.stop();
    this.tween = new TWEEN.Tween(this.obj.position)
      .to(this.pos1, 300)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onComplete(function () {
        this.tween = undefined;
      }.bind(this))
      .start();
  },

});

//////////////////////////////////////////////////////////////////////
// L3DI/Step_rotate
//////////////////////////////////////////////////////////////////////
L3DI.Step_rotate = function (obj, q) {
  console.log("Inside L3DI.Step_rotate");
  this.obj = obj; //THREE.Object3D
  this.q0 = undefined; //THREE.Quaternion
  this.q1 = q;
  this.tween = undefined; //TWEEN.Tween
}

Object.assign(L3DI.Step_rotate.prototype, {
  type: 'rotate',

  playForward: function () {
    if (this.tween) this.tween.stop();
    var q = this.obj.quaternion.clone();
    var cords = { t: 0 };
    this.tween = new TWEEN.Tween(cords)
      .to({ t: 1 }, 800)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(function () {
        THREE.Quaternion.slerp(
          q,
          this.q0,
          this.obj.quaternion,
          cords.t
        );
      }.bind(this))
      .onComplete(function () {
        this.tween = undefined;
      }.bind(this))
      .start();
  },

  playBackward: function () {
    if (this.tween) this.tween.stop();
    var q = this.obj.quaternion.clone();
    var cords = { t: 0 };
    this.tween = new TWEEN.Tween(cords)
      .to({ t: 1 }, 800)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(function () {
        THREE.Quaternion.slerp(
          q,
          this.q1,
          this.obj.quaternion,
          cords.t
        );
      }.bind(this))
      .onComplete(function () {
        this.tween = undefined;
      }.bind(this))
      .start();
  },

});

//////////////////////////////////////////////////////////////////////
// L3DI/Inst
//////////////////////////////////////////////////////////////////////
L3DI.Inst = function (steps) {
  console.log("Inside L3DI.Inst");
  this.steps = steps || [[]]; //[ [], Step, Step, ... ]
  //steps[0] is empty (or pivot obj?)
  //this.stepMin = 1;
  //this.stepMax = this.steps.length - 1;
  //this.stepStep = 1;
  this.curStep = this.steps.length - 1;
}

Object.assign(L3DI.Inst.prototype, {
  getStepMin: function () {
    //return this.stepMin;
    return 1;
  },

  getStepMax: function () {
    //return this.stepMax;
    return this.steps.length - 1;
  },

  getStepStep: function () {
    //return this.stepStep;
    return 1;
  },

  getCurStep: function () {
    return this.curStep;
  },

  addStep: function (step) {
    this.steps.push(step);
    this.curStep += 1;
  },

  setStep: function (n) { //? no-tween option?
    var n = Math.round(n);
    if (n > this.curStep) {
      for (var i = this.curStep + 1; i <= n; i++) {
        this.steps[i].playForward();
      }
    } else {
      for (var i = this.curStep; i > n; i--) {
        this.steps[i].playBackward();
      }
    }
    this.curStep = n;
  },

});

//////////////////////////////////////////////////////////////////////
// L3DI/setupSpinner
//////////////////////////////////////////////////////////////////////
// L3DI.setupSpinner = async function (target, color) {
L3DI.setupSpinner = function (target, color) {
  console.log("Inside L3DI.setupSpinner");
  var opts = {
    lines: 13, // The number of lines to draw
    length: 38, // The length of each line
    width: 17, // The line thickness
    radius: 45, // The radius of the inner circle
    scale: .5,//1, // Scales overall size of the spinner
    corners: 1, // Corner roundness (0..1)
    color: color || '#ffffff', // CSS color or array of colors
    fadeColor: 'transparent', // CSS color or array of colors
    speed: 1, // Rounds per second
    rotate: 0, // The rotation offset
    animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
    direction: 1, // 1: clockwise, -1: counterclockwise
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    className: 'spinner', // The CSS class to assign to the spinner
    top: '50%', // Top position relative to parent
    left: '50%', // Left position relative to parent
    shadow: '0 0 1px transparent', // Box-shadow for the lines
    position: 'absolute' // Element positioning
  };

  // const Spinner = (await import('spin')).default;
  var spinner = new Spinner(opts).spin(target);
  return spinner;
}

export default L3DI