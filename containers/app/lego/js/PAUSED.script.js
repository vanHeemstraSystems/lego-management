// --------------------------------------------------
// Copyright (c) 2019 lk.lkaz
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// --------------------------------------------------
// [Twitter]: https://twitter.com/lk_lkaz/
// 
// [NOTE]:
// I'm not a professional programmer. It's just a hobby.
// So there are probably a lot of bugs...
// I recommend you to use this only for your hobby.
// --------------------------------------------------


var MYAPP = MYAPP || {};

MYAPP.DEG2RAD = Math.PI / 180;

//////////////////////////////////////////////////////////////////////
// MYAPP/canvas
//////////////////////////////////////////////////////////////////////
MYAPP.Canvas = function ( domElement, ops ) {
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
    initialRotation: ops.initialRotation || [0,0,0],
  };

  var renderer = new THREE.WebGLRenderer( { alpha: ops.useAlpha } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( container.offsetWidth, container.offsetHeight );
  renderer.setClearColor( ops.backgroundColor, ops.alpha );
  renderer.gammaFactor = ops.gammaFactor;
  renderer.gammaInput = true;
  renderer.gammaOutput = true;

  var canvas = renderer.domElement;
  container.appendChild( canvas );

  var camera = new THREE.PerspectiveCamera(
    ops.fov,
    canvas.width / canvas.height,
    ops.cameraNear,
    ops.cameraFar
  );
  camera.position.set( 0, 0, ops.cameraDistance );
  //camera.lookAt( new THREE.Vector3(0, 0, 0) );

  var scene = new THREE.Scene();

  var modelContainer = new THREE.Object3D();
  modelContainer.rotation.set(
    ops.initialRotation[0] * MYAPP.DEG2RAD,
    ops.initialRotation[1] * MYAPP.DEG2RAD,
    ops.initialRotation[2] * MYAPP.DEG2RAD
  );
  scene.add( modelContainer );

  var controls = new MYAPP.MouseControls( modelContainer, container, {
    zoomMin: ops.zoomMin,
    zoomMax: ops.zoomMax,
  } );


  window.addEventListener('resize', this.resize.bind(this) );

  //this.canvas = canvas;
  //this.controls = controls;
  this._container = container;
  this._renderer = renderer;
  this._camera = camera;
  this._scene = scene;
  this._modelContainer = modelContainer;

}

Object.assign( MYAPP.Canvas.prototype, {
  resize: function () {
    var w = this._container.offsetWidth;
    var h = this._container.offsetHeight;
    this._camera.aspect = w / h;
    this._camera.updateProjectionMatrix();

    this._renderer.setSize( w, h );
  },

  render: function () {
    this._renderer.render( this._scene, this._camera );
  },

  addModel: function ( obj ) {
    this._modelContainer.add( obj );
  },

  addStaticModel: function ( obj ) {
    this._scene.add( obj );
  },

  addLight: function ( obj ) {
    this.addStaticModel( obj );
  },

  setBackgroundColor: function ( color, alpha = 1 ) {
    this._renderer.setClearColor( color, alpha );
  },

  enableShadow: function ( bool ) {
    this._renderer.shadowMap.enabled = bool;
  },

});


//////////////////////////////////////////////////////////////////////
// MYAPP/mouseControls
//////////////////////////////////////////////////////////////////////
MYAPP.MouseControls = function ( object3D, domElement, ops ) {
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
  this.el.addEventListener('mousedown', mouseDown );
  this.el.addEventListener('mousemove', mouseMove );
  this.el.addEventListener('mouseup', mouseUp );
  this.el.addEventListener('touchstart', touchStart );
  this.el.addEventListener('touchmove', touchMove );
  this.el.addEventListener('touchend', touchEnd );


  function mouseDown (e) {
    e.preventDefault();
    isMouseDown = true;
    if ( e.button != 2 ) {
      isRightButton = false;
      oldX = e.pageX;
      oldY = e.pageY;
    } else {
      isRightButton = true;
      oldL = e.pageX - e.pageY;
    }
  }

  function touchStart (e) {
    switch ( e.touches.length ) {
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

  function mouseMove (e) {
    if ( !isMouseDown ) return;
    e.preventDefault();
    if ( !isRightButton ) {
      setRot( e.pageX, e.pageY );
    } else {
      setScale( e.pageX - e.pageY );
    }
  }

  function touchMove (e) {
    if ( !isMouseDown ) return;

    switch ( e.touches.length ) {
      case 1:
        e.preventDefault();
        var x = e.changedTouches[0].pageX;
        var y = e.changedTouches[0].pageY;
        setRot( x, y );
        break;
      case 2:
        e.preventDefault();
        var dx = e.touches[0].pageX - e.touches[1].pageX;
        var dy = e.touches[0].pageY - e.touches[1].pageY;
        //var l = Math.sqrt( dx * dx + dy * dy );
        var l = dx * dx + dy * dy;
        setScale( l );
        break;
    }
  }

  function mouseUp () {
    isMouseDown = false;
  }

  function touchEnd () {
    isMouseDown = false;
  }

  function setRot ( x, y ) {
    var dx = x - oldX;
    var dy = y - oldY;
    oldX = x;
    oldY = y;

    var q = new THREE.Quaternion();
    var q2 = new THREE.Quaternion();
    q.setFromAxisAngle(
      new THREE.Vector3(1,0,0),
      dy * .005
    );
    q2.setFromAxisAngle(
      new THREE.Vector3(0,1,0),
      dx * .005
    );

    scope.obj.applyQuaternion( q.multiply(q2) );
  }

  function setScale ( l ) {
    var dl = l - oldL;
    oldL = l;
    
    var s = scope.obj.scale.x;
    if ( dl > 0 ) {
      s = Math.min( scope.zoomMax, s * 1.03 );
    } else {
      s = Math.max( scope.zoomMin, s * .97 );
    }

    scope.obj.scale.set(s,s,s);
  }

}


//////////////////////////////////////////////////////////////////////
// MYAPP/inst
//////////////////////////////////////////////////////////////////////
MYAPP.createInst = function ( model, lines ) {
  if ( lines == null ) {
    var lines = [];
    model.children.forEach( function ( obj ) {
      lines.push( [obj.name] );
    });
    console.log(
      'MYAPP.instCSV = [\n'
      + '[0, "buildDir", 0,1,0 ],\n'
      + '["'
      + lines.join('"],\n["')
      + '"],\n'
      + '];'
    )
  }

  var inst = new MYAPP.Inst();
  var buildStroke = 50;
  var buildDir = new THREE.Vector3( 0, buildStroke, 0 );
  var curGroup = [ model ]; //Save current group nest. Top is 'model'.
  var groupSteps = {}; //key:group.name, val:[step_translate/rotate,...]

  lines.forEach( function ( line ) {
    if ( line[0] === 0 ) { //LDraw-like comment style
      parseCommand( line );
    } else {
      var objs = [];
      line.forEach( function ( name ) {
        var obj = model.getObjectByName( name );
        if ( curGroup.length > 1 ) {
          var g = curGroup[ curGroup.length - 1 ];
          THREE.SceneUtils.attach( obj, model, g );
          //obj.updateMatrixWorld();
        }
        var lobj = new MYAPP.LegoObj( obj, buildDir );
        objs.push( lobj );
      });
      if ( objs.length > 0 ) inst.addStep( new MYAPP.Step( objs ) );
    }
  });

  function parseCommand ( line ) {
    switch ( line[1].toLowerCase() ) {
      case 'builddirection':
      case 'builddir':
      case 'bd':
        if ( typeof( line[2] ) == 'number' ) {
          setBuildDir( new THREE.Vector3( line[2], line[3], line[4] ) );
        } else {
          var v = new THREE.Vector3( 0,1,0 );
          switch ( line[2].toLowerCase() ) {
            case 'x':
              v.set( 1,0,0 );
              break;
            case 'y':
              v.set( 0,1,0 );
              break;
            case 'z':
              v.set( 0,0,1 );
              break;
            case '-x':
              v.set( -1,0,0 );
              break;
            case '-y':
              v.set( 0,-1,0 );
              break;
            case '-z':
              v.set( 0,0,-1 );
              break;
          }

          if ( line[3] != null ) {
            var obj = model.getObjectByName( line[3] );
            v.applyQuaternion( obj.quaternion );
          }

          setBuildDir( v );

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
        if ( line[3] != null ) {
          g.position.set( line[3], line[4], line[5] );
        }
        curGroup[ curGroup.length - 1 ].add( g );
        g.updateMatrixWorld();
        curGroup.push( g );
        groupSteps[ g.name ] = [];
        break;

      case 'endgroup':
      case 'eg':
      //case 'ge':
        curGroup.pop();
        break;

      case 'groupitem':
      case 'gi':
        line.slice(2).forEach( function ( name ) {
          var obj = model.getObjectByName( name );
          var g = curGroup[ curGroup.length - 1 ];
          THREE.SceneUtils.attach( obj, model, g );
          //obj.updateMatrixWorld();
        });
        break;

      case 'translate':
      case 't':
        var g = model.getObjectByName( line[2] );
        var v = buildDir.clone().normalize().multiplyScalar( line[3] );
        var step = new MYAPP.Step_translate( g, v );
        groupSteps[ g.name ].push( step );
        inst.addStep( step );
        break;

      case 'rotate':
      case 'r':
        var g = model.getObjectByName( line[2] );
        var q = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3( line[3],line[4],line[5] ).normalize(),
          line[6] * MYAPP.DEG2RAD
        );
        var step = new MYAPP.Step_rotate( g, q );
        groupSteps[ g.name ].push( step );
        inst.addStep( step );
        break;

     }
  }


  for( var groupName in groupSteps ) {
    var steps = groupSteps[ groupName ];
    var g = model.getObjectByName( groupName );
    var q = g.quaternion.clone();
    var p = g.position.clone();
    for (var i = steps.length - 1; i >= 0; i--) {
      var step = steps[i];
      switch ( step.type ) {
        case 'translate':
          step.pos0 = { x:p.x, y:p.y, z:p.z };
          p.add( step.pos1 );
          step.pos1 = { x:p.x, y:p.y, z:p.z };
          break;
        case 'rotate':
          step.q0 = q.clone();
          q.multiply( step.q1 );
          step.q1 = q.clone();
          break;
      }
    }
  }


  function setBuildDir ( vec3 ) {
    if ( vec3 != null ) {
      buildDir.copy( vec3 );
    }
    buildDir.normalize().multiplyScalar( buildStroke );
  }

  return inst;
}


MYAPP.LegoObj = function ( obj, dir ) {
  this.obj = obj; //THREE.Object3D
  var buildDir = dir || new THREE.Vector3( 0, 50, 0 );

  this.pos0 = new THREE.Vector3().copy( this.obj.position );
  this.pos1 = this.pos0.clone().add( buildDir );
  this.tween = undefined; //TWEEN.Tween
}

Object.assign( MYAPP.LegoObj.prototype, {
  playForward: function () {
    if ( this.tween ) this.tween.stop();
    this.obj.visible = true;
    this.tween = new TWEEN.Tween( this.obj.position )
      .to( this.pos0, 1000 )
      //.easing( TWEEN.Easing.Bounce.Out )
      .easing( TWEEN.Easing.Quadratic.Out )
      .onComplete( function () {
        this.tween = undefined;
      }.bind(this) )
      .start();
  },

  playBackward: function () {
    if ( this.tween ) this.tween.stop();
    this.tween = new TWEEN.Tween( this.obj.position )
      .to( this.pos1, 300 )
      .easing( TWEEN.Easing.Linear.None )
      .onComplete( function () {
        this.tween = undefined;
        this.obj.visible = false;
      }.bind(this) )
      .start();
  },

});


MYAPP.Step = function ( objList ) {
  this.objList = objList || []; //[ LegoObj, ... ]
}

Object.assign( MYAPP.Step.prototype, {
  type: 'build',

  playForward: function () {
    this.objList.forEach( function ( obj ) {
      obj.playForward();
    });
  },

  playBackward: function () {
    this.objList.forEach( function ( obj ) {
      obj.playBackward();
    });
  },

});


MYAPP.Step_translate = function ( obj, v ) {
  this.obj = obj; //THREE.Object3D
  this.pos0 = undefined; //{ x:0, y:0, z:0 };
  this.pos1 = { x: v.x, y: v.y, z: v.z };
  this.tween = undefined; //TWEEN.Tween
}

Object.assign( MYAPP.Step_translate.prototype, {
  type: 'translate',

  playForward: function () {
    if ( this.tween ) this.tween.stop();
    this.tween = new TWEEN.Tween( this.obj.position )
      .to( this.pos0, 800 )
      .easing( TWEEN.Easing.Quadratic.Out )
      .onComplete( function () {
        this.tween = undefined;
      }.bind(this) )
      .start();
  },

  playBackward: function () {
    if ( this.tween ) this.tween.stop();
    this.tween = new TWEEN.Tween( this.obj.position )
      .to( this.pos1, 300 )
      .easing( TWEEN.Easing.Quadratic.Out )
      .onComplete( function () {
        this.tween = undefined;
      }.bind(this) )
      .start();
  },

});


MYAPP.Step_rotate = function ( obj, q ) {
  this.obj = obj; //THREE.Object3D
  this.q0 = undefined; //THREE.Quaternion
  this.q1 = q;
  this.tween = undefined; //TWEEN.Tween
}

Object.assign( MYAPP.Step_rotate.prototype, {
  type: 'rotate',

  playForward: function () {
    if ( this.tween ) this.tween.stop();
    var q = this.obj.quaternion.clone();
    var cords = { t: 0 };
    this.tween = new TWEEN.Tween( cords )
      .to( { t: 1 }, 800 )
      .easing( TWEEN.Easing.Quadratic.Out )
      .onUpdate( function () {
        THREE.Quaternion.slerp(
          q,
          this.q0,
          this.obj.quaternion,
          cords.t
        );
      }.bind(this) )
      .onComplete( function () {
        this.tween = undefined;
      }.bind(this) )
      .start();
  },

  playBackward: function () {
    if ( this.tween ) this.tween.stop();
    var q = this.obj.quaternion.clone();
    var cords = { t: 0 };
    this.tween = new TWEEN.Tween( cords )
      .to( { t: 1 }, 800 )
      .easing( TWEEN.Easing.Quadratic.Out )
      .onUpdate( function () {
        THREE.Quaternion.slerp(
          q,
          this.q1,
          this.obj.quaternion,
          cords.t
        );
      }.bind(this) )
      .onComplete( function () {
        this.tween = undefined;
      }.bind(this) )
      .start();
  },

});


MYAPP.Inst = function ( steps ) {
  this.steps = steps || [[]]; //[ [], Step, Step, ... ]
                              //steps[0] is empty (or pivot obj?)
  //this.stepMin = 1;
  //this.stepMax = this.steps.length - 1;
  //this.stepStep = 1;
  this.curStep = this.steps.length - 1;
}

Object.assign( MYAPP.Inst.prototype, {
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

  addStep: function ( step ) {
    this.steps.push( step );
    this.curStep += 1;
  },

  setStep: function ( n ) { //? no-tween option?
    var n = Math.round( n );
    if ( n > this.curStep ) {
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
// MYAPP/setupSpinner
//////////////////////////////////////////////////////////////////////
MYAPP.setupSpinner = function ( target, color ) {
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
  
  //var target = document.getElementById('foo');
  var spinner = new Spinner(opts).spin(target);

  return spinner;
}


THREE.ColladaLoader=function(){var e,t,s,r,i=null,a=null,o={},n={},h={},c={},l={},p={convertUpAxis:!1,subdivideFaces:!0,upAxis:"Y",defaultEnvMap:null},d=1,u="Y",f=null;function m(r,o,m){if(i=(new DOMParser).parseFromString(r,"text/xml"),void 0!==m){var E=m.split("/");E.pop(),s=(E.length<1?".":E.join("/"))+"/"}!function(){var e=i.querySelectorAll("asset")[0];if(e&&e.childNodes)for(var t=0;t<e.childNodes.length;t++){var s=e.childNodes[t];switch(s.nodeName){case"unit":var r=s.getAttribute("meter");r&&(d=parseFloat(r));break;case"up_axis":u=s.textContent.charAt(0)}}}(),function(){if(!0!==p.convertUpAxis||u===p.upAxis)f=null;else switch(u){case"X":f="Y"===p.upAxis?"XtoY":"XtoZ";break;case"Y":f="X"===p.upAxis?"YtoX":"YtoZ";break;case"Z":f="X"===p.upAxis?"ZtoX":"ZtoY"}}(),n=b("library_images image",v,"image"),c=b("library_materials material",S,"material"),l=b("library_effects effect",D,"effect"),h=b("library_geometries geometry",T,"geometry"),t=b("library_visual_scenes visual_scene",y,"visual_scene"),e=function(){var e=i.querySelectorAll("scene instance_visual_scene")[0];if(e){var s=e.getAttribute("url").replace(/^#/,"");return t[s.length>0?s:"visual_scene0"]}return null}(),a=new THREE.Group;for(var w=0;w<e.nodes.length;w++)a.add(g(e.nodes[w]));a.scale.multiplyScalar(d);var N={scene:a};return o&&o(N),N}function b(e,t,s){for(var r=i.querySelectorAll(e),a={},o=0,n=r.length,h=0;h<n;h++){var c=r[h],l=(new t).parse(c);l.id&&0!==l.id.length||(l.id=s+o++),a[l.id]=l}return a}function g(e,t){var s,r,i=new THREE.Object3D,a={};for(s=0;s<e.geometries.length;s++){var o,n=e.geometries[s],p=n.instance_material,d=h[n.url],u={},f=[],m=0;if(d){if(!d.mesh||!d.mesh.primitives)continue;if(0===i.name.length&&(i.name=d.id),p)for(r=0;r<p.length;r++){var b=p[r],v=c[b.target],y=v.instance_effect.url,E=l[y].shader.material;if(d.doubleSided){if(!(b.symbol in a)){var w=E.clone();w.side=THREE.DoubleSide,a[b.symbol]=w}E=a[b.symbol]}E.opacity=E.opacity?E.opacity:1,u[b.symbol]=m,f.push(E),(o=E).name=null===v.name||""===v.name?v.id:v.name,m++}var N,x=o||new THREE.MeshLambertMaterial({color:14540253,side:d.doubleSided?THREE.DoubleSide:THREE.FrontSide}),T=d.mesh.geometry3js;if(m>1)for(x=new THREE.MultiMaterial(f),r=0;r<T.faces.length;r++){var R=T.faces[r];R.materialIndex=u[R.daeMaterial]}N=!0===T.isLineStrip?new THREE.Line(T):new THREE.Mesh(T,x),i.add(N)}}for(i.name=e.name||e.id||"",i.colladaId=e.id||"",i.layer=e.layer||"",i.matrix=e.matrix,i.matrix.decompose(i.position,i.quaternion,i.scale),s=0;s<e.nodes.length;s++)i.add(g(e.nodes[s],e));return i}function v(){this.id="",this.init_from=""}function y(){this.id="",this.name="",this.nodes=[],this.scene=new THREE.Group}function E(){this.id="",this.name="",this.sid="",this.nodes=[],this.transforms=[],this.geometries=[],this.matrix=new THREE.Matrix4}function w(){this.sid="",this.type="",this.data=[],this.obj=null}function N(){this.symbol="",this.target=""}function x(){this.url="",this.instance_material=[]}function T(){this.id="",this.mesh=null}function R(e){this.geometry=e.id,this.primitives=[],this.vertices=null,this.geometry3js=null}function k(){this.material="",this.count=0,this.inputs=[],this.vcount=null,this.p=[],this.geometry=new THREE.Geometry}function A(){k.call(this),this.vcount=[]}function C(){k.call(this),this.vcount=1}function H(){k.call(this),this.vcount=3}function j(){this.source="",this.count=0,this.stride=0,this.params=[]}function M(){this.input={}}function _(){this.semantic="",this.offset=0,this.source="",this.set=0}function O(e){this.id=e,this.type=null}function S(){this.id="",this.name="",this.instance_effect=null}function I(){this.color=new THREE.Color,this.color.setRGB(Math.random(),Math.random(),Math.random()),this.color.a=1,this.texture=null,this.texcoord=null,this.texOpts=null}function L(e,t){this.type=e,this.effect=t,this.material=null}function V(e){this.effect=e,this.init_from=null,this.format=null}function X(e){this.effect=e,this.source=null,this.wrap_s=null,this.wrap_t=null,this.minfilter=null,this.magfilter=null,this.mipfilter=null}function D(){this.id="",this.name="",this.shader=null,this.surface={},this.sampler={}}function U(){this.url=""}function q(e){var t=e.getAttribute("id");return null!=o[t]?o[t]:(o[t]=new O(t).parse(e),o[t])}function F(e){for(var t=G(e),s=[],r=0,i=t.length;r<i;r++)s.push("true"===t[r]||"1"===t[r]);return s}function Y(e){for(var t=G(e),s=[],r=0,i=t.length;r<i;r++)s.push(parseFloat(t[r]));return s}function B(e){for(var t=G(e),s=[],r=0,i=t.length;r<i;r++)s.push(parseInt(t[r],10));return s}function G(e){return e.length>0?function(e){return e.replace(/^\s+/,"").replace(/\s+$/,"")}(e).split(/\s+/):[]}function P(e,t,s){return e.hasAttribute(t)?parseInt(e.getAttribute(t),10):s}function Z(e,t){(new THREE.ImageLoader).load(t,function(t){e.image=t,e.needsUpdate=!0})}function W(e,t){e.doubleSided=!1;var s=t.querySelectorAll("extra double_sided")[0];s&&s&&1===parseInt(s.textContent,10)&&(e.doubleSided=!0)}function z(e,t){if(!0===p.convertUpAxis&&u!==p.upAxis)switch(f){case"XtoY":var s=e[0];e[0]=t*e[1],e[1]=s;break;case"XtoZ":s=e[2];e[2]=e[1],e[1]=e[0],e[0]=s;break;case"YtoX":s=e[0];e[0]=e[1],e[1]=t*s;break;case"YtoZ":s=e[1];e[1]=t*e[2],e[2]=s;break;case"ZtoX":s=e[0];e[0]=e[1],e[1]=e[2],e[2]=s;break;case"ZtoY":s=e[1];e[1]=e[2],e[2]=t*s}}function J(e,t){var s=[e[t],e[t+1],e[t+2]];return z(s,-1),new THREE.Vector3(s[0],s[1],s[2])}function $(e){if(p.convertUpAxis){var t=[e[0],e[4],e[8]];z(t,-1),e[0]=t[0],e[4]=t[1],e[8]=t[2],z(t=[e[1],e[5],e[9]],-1),e[1]=t[0],e[5]=t[1],e[9]=t[2],z(t=[e[2],e[6],e[10]],-1),e[2]=t[0],e[6]=t[1],e[10]=t[2],z(t=[e[0],e[1],e[2]],-1),e[0]=t[0],e[1]=t[1],e[2]=t[2],z(t=[e[4],e[5],e[6]],-1),e[4]=t[0],e[5]=t[1],e[6]=t[2],z(t=[e[8],e[9],e[10]],-1),e[8]=t[0],e[9]=t[1],e[10]=t[2],z(t=[e[3],e[7],e[11]],-1),e[3]=t[0],e[7]=t[1],e[11]=t[2]}return(new THREE.Matrix4).set(e[0],e[1],e[2],e[3],e[4],e[5],e[6],e[7],e[8],e[9],e[10],e[11],e[12],e[13],e[14],e[15])}return v.prototype.parse=function(e){this.id=e.getAttribute("id");for(var t=0;t<e.childNodes.length;t++){var s=e.childNodes[t];"init_from"===s.nodeName&&(this.init_from=s.textContent)}return this},y.prototype.getChildById=function(e,t){for(var s=0;s<this.nodes.length;s++){var r=this.nodes[s].getChildById(e,t);if(r)return r}return null},y.prototype.getChildBySid=function(e,t){for(var s=0;s<this.nodes.length;s++){var r=this.nodes[s].getChildBySid(e,t);if(r)return r}return null},y.prototype.parse=function(e){this.id=e.getAttribute("id"),this.name=e.getAttribute("name"),this.nodes=[];for(var t=0;t<e.childNodes.length;t++){var s=e.childNodes[t];if(1==s.nodeType)switch(s.nodeName){case"node":this.nodes.push((new E).parse(s))}}return this},E.prototype.getChildById=function(e,t){if(this.id===e)return this;if(t)for(var s=0;s<this.nodes.length;s++){var r=this.nodes[s].getChildById(e,t);if(r)return r}return null},E.prototype.getChildBySid=function(e,t){if(this.sid===e)return this;if(t)for(var s=0;s<this.nodes.length;s++){var r=this.nodes[s].getChildBySid(e,t);if(r)return r}return null},E.prototype.getTransformBySid=function(e){for(var t=0;t<this.transforms.length;t++)if(this.transforms[t].sid===e)return this.transforms[t];return null},E.prototype.parse=function(e){this.id=e.getAttribute("id"),this.sid=e.getAttribute("sid"),this.name=e.getAttribute("name"),this.type=e.getAttribute("type"),this.layer=e.getAttribute("layer"),this.type="JOINT"===this.type?this.type:"NODE",this.nodes=[],this.transforms=[],this.geometries=[],this.matrix=new THREE.Matrix4;for(var t=0;t<e.childNodes.length;t++){var s=e.childNodes[t];if(1==s.nodeType)switch(s.nodeName){case"node":this.nodes.push((new E).parse(s));break;case"instance_geometry":this.geometries.push((new x).parse(s));break;case"rotate":case"translate":case"scale":case"matrix":case"lookat":case"skew":this.transforms.push((new w).parse(s));break;case"extra":break;default:console.log(s.nodeName)}}return this.updateMatrix(),this},E.prototype.updateMatrix=function(){this.matrix.identity();for(var e=0;e<this.transforms.length;e++)this.transforms[e].apply(this.matrix)},w.prototype.parse=function(e){return this.sid=e.getAttribute("sid"),this.type=e.nodeName,this.data=Y(e.textContent),this.convert(),this},w.prototype.convert=function(){switch(this.type){case"matrix":this.obj=$(this.data);break;case"rotate":this.angle=THREE.Math.degToRad(this.data[3]);case"translate":z(this.data,-1),this.obj=new THREE.Vector3(this.data[0],this.data[1],this.data[2]);break;case"scale":z(this.data,1),this.obj=new THREE.Vector3(this.data[0],this.data[1],this.data[2]);break;default:console.log("Can not convert Transform of type "+this.type)}},w.prototype.apply=(r=new THREE.Matrix4,function(e){switch(this.type){case"matrix":e.multiply(this.obj);break;case"translate":e.multiply(r.makeTranslation(this.obj.x,this.obj.y,this.obj.z));break;case"rotate":e.multiply(r.makeRotationAxis(this.obj,this.angle));break;case"scale":e.scale(this.obj)}}),w.prototype.update=function(e,t){var s=["X","Y","Z","ANGLE"];switch(this.type){case"matrix":if(t)if(1===t.length)switch(t[0]){case 0:this.obj.n11=e[0],this.obj.n21=e[1],this.obj.n31=e[2],this.obj.n41=e[3];break;case 1:this.obj.n12=e[0],this.obj.n22=e[1],this.obj.n32=e[2],this.obj.n42=e[3];break;case 2:this.obj.n13=e[0],this.obj.n23=e[1],this.obj.n33=e[2],this.obj.n43=e[3];break;case 3:this.obj.n14=e[0],this.obj.n24=e[1],this.obj.n34=e[2],this.obj.n44=e[3]}else if(2===t.length){var r="n"+(t[0]+1)+(t[1]+1);this.obj[r]=e}else console.log("Incorrect addressing of matrix in transform.");else this.obj.copy(e);break;case"translate":case"scale":switch("[object Array]"===Object.prototype.toString.call(t)&&(t=s[t[0]]),t){case"X":this.obj.x=e;break;case"Y":this.obj.y=e;break;case"Z":this.obj.z=e;break;default:this.obj.x=e[0],this.obj.y=e[1],this.obj.z=e[2]}break;case"rotate":switch("[object Array]"===Object.prototype.toString.call(t)&&(t=s[t[0]]),t){case"X":this.obj.x=e;break;case"Y":this.obj.y=e;break;case"Z":this.obj.z=e;break;case"ANGLE":this.angle=THREE.Math.degToRad(e);break;default:this.obj.x=e[0],this.obj.y=e[1],this.obj.z=e[2],this.angle=THREE.Math.degToRad(e[3])}}},N.prototype.parse=function(e){return this.symbol=e.getAttribute("symbol"),this.target=e.getAttribute("target").replace(/^#/,""),this},x.prototype.parse=function(e){this.url=e.getAttribute("url").replace(/^#/,""),this.instance_material=[];for(var t=0;t<e.childNodes.length;t++){var s=e.childNodes[t];if(1==s.nodeType&&"bind_material"===s.nodeName){for(var r=s.querySelectorAll("instance_material"),i=0;i<r.length;i++){var a=r[i];this.instance_material.push((new N).parse(a))}break}}return this},T.prototype.parse=function(e){this.id=e.getAttribute("id"),W(this,e);for(var t=0;t<e.childNodes.length;t++){var s=e.childNodes[t];switch(s.nodeName){case"mesh":this.mesh=new R(this).parse(s)}}return this},R.prototype.parse=function(e){this.primitives=[];for(var t=0;t<e.childNodes.length;t++){var s=e.childNodes[t];switch(s.nodeName){case"source":q(s);break;case"vertices":this.vertices=(new M).parse(s);break;case"linestrips":this.primitives.push((new C).parse(s));break;case"triangles":this.primitives.push((new H).parse(s));break;case"polygons":this.primitives.push((new k).parse(s));break;case"polylist":this.primitives.push((new A).parse(s))}}if(this.geometry3js=new THREE.Geometry,null===this.vertices)return this;var r=o[this.vertices.input.POSITION.source].data;for(t=0;t<r.length;t+=3)this.geometry3js.vertices.push(J(r,t).clone());for(t=0;t<this.primitives.length;t++){var i=this.primitives[t];i.setVertices(this.vertices),this.handlePrimitive(i,this.geometry3js)}return this.geometry3js.calcNormals&&(this.geometry3js.computeVertexNormals(),delete this.geometry3js.calcNormals),this},R.prototype.handlePrimitive=function(e,t){if(e instanceof C)t.isLineStrip=!0;else{var s,r,i,a,n,h,c,l,d=e.p,u=e.inputs,f=0,m=0,b=[];for(s=0;s<u.length;s++){var g=(i=u[s]).offset+1;switch(m=m<g?g:m,i.semantic){case"TEXCOORD":b.push(i.set)}}for(var v=0;v<d.length;++v)for(var y=d[v],E=0;E<y.length;){var w=[],N=[],x=null,T=[];for(l=e.vcount?e.vcount.length?e.vcount[f++]:e.vcount:y.length/m,s=0;s<l;s++)for(r=0;r<u.length;r++)switch(i=u[r],h=o[i.source],n=(a=y[E+s*m+i.offset])*(c=h.accessor.params.length),i.semantic){case"VERTEX":w.push(a);break;case"NORMAL":N.push(J(h.data,n));break;case"TEXCOORD":void 0===(x=x||{})[i.set]&&(x[i.set]=[]),x[i.set].push(new THREE.Vector2(h.data[n],h.data[n+1]));break;case"COLOR":T.push((new THREE.Color).setRGB(h.data[n],h.data[n+1],h.data[n+2]))}if(0===N.length)if(i=this.vertices.input.NORMAL){c=(h=o[i.source]).accessor.params.length;for(var R=0,k=w.length;R<k;R++)N.push(J(h.data,w[R]*c))}else t.calcNormals=!0;if(!x&&(x={},i=this.vertices.input.TEXCOORD)){b.push(i.set),c=(h=o[i.source]).accessor.params.length;for(R=0,k=w.length;R<k;R++)n=w[R]*c,void 0===x[i.set]&&(x[i.set]=[]),x[i.set].push(new THREE.Vector2(h.data[n],1-h.data[n+1]))}if(0===T.length&&(i=this.vertices.input.COLOR)){c=(h=o[i.source]).accessor.params.length;for(R=0,k=w.length;R<k;R++)n=w[R]*c,T.push((new THREE.Color).setRGB(h.data[n],h.data[n+1],h.data[n+2]))}var A,H,j=null,M=[];if(3===l)M.push(new THREE.Face3(w[0],w[1],w[2],N,T.length?T:new THREE.Color));else if(4===l)M.push(new THREE.Face3(w[0],w[1],w[3],N.length?[N[0].clone(),N[1].clone(),N[3].clone()]:[],T.length?[T[0],T[1],T[3]]:new THREE.Color)),M.push(new THREE.Face3(w[1],w[2],w[3],N.length?[N[1].clone(),N[2].clone(),N[3].clone()]:[],T.length?[T[1],T[2],T[3]]:new THREE.Color));else if(l>4&&p.subdivideFaces){var _=T.length?T:new THREE.Color;for(r=1;r<l-1;)M.push(new THREE.Face3(w[0],w[r],w[r+1],N.length?[N[0].clone(),N[r++].clone(),N[r].clone()]:[],_))}if(M.length)for(R=0,k=M.length;R<k;R++)for((j=M[R]).daeMaterial=e.material,t.faces.push(j),r=0;r<b.length;r++)A=x[b[r]],H=l>4?[A[0],A[R+1],A[R+2]]:4===l?0===R?[A[0],A[1],A[3]]:[A[1].clone(),A[2],A[3].clone()]:[A[0],A[1],A[2]],void 0===t.faceVertexUvs[r]&&(t.faceVertexUvs[r]=[]),t.faceVertexUvs[r].push(H);else console.log("dropped face with vcount "+l+" for geometry with id: "+t.id);E+=m*l}}},k.prototype.setVertices=function(e){for(var t=0;t<this.inputs.length;t++)this.inputs[t].source===e.id&&(this.inputs[t].source=e.input.POSITION.source)},k.prototype.parse=function(e){this.material=e.getAttribute("material"),this.count=P(e,"count",0);for(var t=0;t<e.childNodes.length;t++){var s=e.childNodes[t];switch(s.nodeName){case"input":this.inputs.push((new _).parse(e.childNodes[t]));break;case"vcount":this.vcount=B(s.textContent);break;case"p":this.p.push(B(s.textContent));break;case"ph":console.warn("polygon holes not yet supported!")}}return this},A.prototype=Object.create(k.prototype),A.prototype.constructor=A,C.prototype=Object.create(k.prototype),C.prototype.constructor=C,H.prototype=Object.create(k.prototype),H.prototype.constructor=H,j.prototype.parse=function(e){this.params=[],this.source=e.getAttribute("source"),this.count=P(e,"count",0),this.stride=P(e,"stride",0);for(var t=0;t<e.childNodes.length;t++){var s=e.childNodes[t];if("param"===s.nodeName){var r={};r.name=s.getAttribute("name"),r.type=s.getAttribute("type"),this.params.push(r)}}return this},M.prototype.parse=function(e){this.id=e.getAttribute("id");for(var t=0;t<e.childNodes.length;t++)if("input"===e.childNodes[t].nodeName){var s=(new _).parse(e.childNodes[t]);this.input[s.semantic]=s}return this},_.prototype.parse=function(e){return this.semantic=e.getAttribute("semantic"),this.source=e.getAttribute("source").replace(/^#/,""),this.set=P(e,"set",-1),this.offset=P(e,"offset",0),"TEXCOORD"===this.semantic&&this.set<0&&(this.set=0),this},O.prototype.parse=function(e){this.id=e.getAttribute("id");for(var t=0;t<e.childNodes.length;t++){var s=e.childNodes[t];switch(s.nodeName){case"bool_array":this.data=F(s.textContent),this.type=s.nodeName;break;case"float_array":this.data=Y(s.textContent),this.type=s.nodeName;break;case"int_array":this.data=B(s.textContent),this.type=s.nodeName;break;case"IDREF_array":case"Name_array":this.data=G(s.textContent),this.type=s.nodeName;break;case"technique_common":for(var r=0;r<s.childNodes.length;r++)if("accessor"===s.childNodes[r].nodeName){this.accessor=(new j).parse(s.childNodes[r]);break}}}return this},O.prototype.read=function(){var e=[],t=this.accessor.params[0];switch(t.type){case"IDREF":case"Name":case"name":case"float":return this.data;case"float4x4":for(var s=0;s<this.data.length;s+=16){var r=$(this.data.slice(s,s+16));e.push(r)}break;default:console.log("ColladaLoader: Source: Read dont know how to read "+t.type+".")}return e},S.prototype.parse=function(e){this.id=e.getAttribute("id"),this.name=e.getAttribute("name");for(var t=0;t<e.childNodes.length;t++)if("instance_effect"===e.childNodes[t].nodeName){this.instance_effect=(new U).parse(e.childNodes[t]);break}return this},I.prototype.isColor=function(){return null===this.texture},I.prototype.isTexture=function(){return null!=this.texture},I.prototype.parse=function(e){"transparent"===e.nodeName&&(this.opaque=e.getAttribute("opaque"));for(var t=0;t<e.childNodes.length;t++){var s=e.childNodes[t];if(1==s.nodeType)switch(s.nodeName){case"color":var r=Y(s.textContent);this.color=new THREE.Color,this.color.setRGB(r[0],r[1],r[2]),this.color.a=r[3];break;case"texture":this.texture=s.getAttribute("texture"),this.texcoord=s.getAttribute("texcoord"),this.texOpts={offsetU:0,offsetV:0,repeatU:1,repeatV:1,wrapU:1,wrapV:1},this.parseTexture(s)}}return this},I.prototype.parseTexture=function(e){if(!e.childNodes)return this;e.childNodes[1]&&"extra"===e.childNodes[1].nodeName&&(e=e.childNodes[1]).childNodes[1]&&"technique"===e.childNodes[1].nodeName&&(e=e.childNodes[1]);for(var t=0;t<e.childNodes.length;t++){var s=e.childNodes[t];switch(s.nodeName){case"offsetU":case"offsetV":case"repeatU":case"repeatV":this.texOpts[s.nodeName]=parseFloat(s.textContent);break;case"wrapU":case"wrapV":"TRUE"===s.textContent.toUpperCase()?this.texOpts[s.nodeName]=1:this.texOpts[s.nodeName]=parseInt(s.textContent);break;default:this.texOpts[s.nodeName]=s.textContent}}return this},L.prototype.parse=function(e){for(var t=0;t<e.childNodes.length;t++){var s=e.childNodes[t];if(1==s.nodeType)switch(s.nodeName){case"emission":case"diffuse":case"specular":case"transparent":this[s.nodeName]=(new I).parse(s);break;case"bump":var r=s.getAttribute("bumptype");r?"heightfield"===r.toLowerCase()?this.bump=(new I).parse(s):"normalmap"===r.toLowerCase()?this.normal=(new I).parse(s):(console.error("Shader.prototype.parse: Invalid value for attribute 'bumptype' ("+r+") - valid bumptypes are 'HEIGHTFIELD' and 'NORMALMAP' - defaulting to 'HEIGHTFIELD'"),this.bump=(new I).parse(s)):(console.warn("Shader.prototype.parse: Attribute 'bumptype' missing from bump node - defaulting to 'HEIGHTFIELD'"),this.bump=(new I).parse(s));break;case"shininess":case"reflectivity":case"index_of_refraction":case"transparency":var i=s.querySelectorAll("float");i.length>0&&(this[s.nodeName]=parseFloat(i[0].textContent))}}return this.create(),this},L.prototype.create=function(){var e={},t=!1;if(void 0!==this.transparency&&void 0!==this.transparent){this.transparent;var r=(this.transparent.color.r+this.transparent.color.g+this.transparent.color.b)/3*this.transparency;r>0&&(t=!0,e.transparent=!0,e.opacity=1-r)}var i={diffuse:"map",ambient:"lightMap",specular:"specularMap",emission:"emissionMap",bump:"bumpMap",normal:"normalMap"};for(var a in this)switch(a){case"ambient":case"emission":case"diffuse":case"specular":case"bump":case"normal":var o=this[a];if(o instanceof I)if(o.isTexture()){var h=o.texture,c=this.effect.sampler[h];if(void 0!==c&&void 0!==c.source){var l=this.effect.surface[c.source];if(void 0!==l){var d=n[l.init_from];if(d){var u,f=s+d.init_from,m=THREE.Loader.Handlers.get(f);null!==m?u=m.load(f):Z(u=new THREE.Texture,f),"MIRROR"===c.wrap_s?u.wrapS=THREE.MirroredRepeatWrapping:"WRAP"===c.wrap_s||o.texOpts.wrapU?u.wrapS=THREE.RepeatWrapping:u.wrapS=THREE.ClampToEdgeWrapping,"MIRROR"===c.wrap_t?u.wrapT=THREE.MirroredRepeatWrapping:"WRAP"===c.wrap_t||o.texOpts.wrapV?u.wrapT=THREE.RepeatWrapping:u.wrapT=THREE.ClampToEdgeWrapping,u.offset.x=o.texOpts.offsetU,u.offset.y=o.texOpts.offsetV,u.repeat.x=o.texOpts.repeatU,u.repeat.y=o.texOpts.repeatV,e[i[a]]=u,"emission"===a&&(e.emissive=16777215)}}}}else"diffuse"!==a&&t||("emission"===a?e.emissive=o.color.getHex():e[a]=o.color.getHex());break;case"shininess":e[a]=this[a];break;case"reflectivity":e[a]=this[a],e[a]>0&&(e.envMap=p.defaultEnvMap),e.combine=THREE.MixOperation;break;case"index_of_refraction":e.refractionRatio=this[a],1!==this[a]&&(e.envMap=p.defaultEnvMap)}switch(e.side=this.effect.doubleSided?THREE.DoubleSide:THREE.FrontSide,void 0!==e.diffuse&&(e.color=e.diffuse,delete e.diffuse),this.type){case"constant":null!=e.emissive&&(e.color=e.emissive),this.material=new THREE.MeshBasicMaterial(e);break;case"phong":case"blinn":this.material=new THREE.MeshPhongMaterial(e);break;case"lambert":default:this.material=new THREE.MeshLambertMaterial(e)}return this.material},V.prototype.parse=function(e){for(var t=0;t<e.childNodes.length;t++){var s=e.childNodes[t];if(1==s.nodeType)switch(s.nodeName){case"init_from":this.init_from=s.textContent;break;case"format":this.format=s.textContent;break;default:console.log("unhandled Surface prop: "+s.nodeName)}}return this},X.prototype.parse=function(e){for(var t=0;t<e.childNodes.length;t++){var s=e.childNodes[t];if(1==s.nodeType)switch(s.nodeName){case"source":this.source=s.textContent;break;case"minfilter":this.minfilter=s.textContent;break;case"magfilter":this.magfilter=s.textContent;break;case"mipfilter":this.mipfilter=s.textContent;break;case"wrap_s":this.wrap_s=s.textContent;break;case"wrap_t":this.wrap_t=s.textContent;break;default:console.log("unhandled Sampler2D prop: "+s.nodeName)}}return this},D.prototype.create=function(){if(null===this.shader)return null},D.prototype.parse=function(e){this.id=e.getAttribute("id"),this.name=e.getAttribute("name"),W(this,e),this.shader=null;for(var t=0;t<e.childNodes.length;t++){var s=e.childNodes[t];if(1==s.nodeType)switch(s.nodeName){case"profile_COMMON":this.parseTechnique(this.parseProfileCOMMON(s))}}return this},D.prototype.parseNewparam=function(e){for(var t=e.getAttribute("sid"),s=0;s<e.childNodes.length;s++){var r=e.childNodes[s];if(1==r.nodeType)switch(r.nodeName){case"surface":this.surface[t]=new V(this).parse(r);break;case"sampler2D":this.sampler[t]=new X(this).parse(r);break;case"extra":break;default:console.log(r.nodeName)}}},D.prototype.parseProfileCOMMON=function(e){for(var t,s=0;s<e.childNodes.length;s++){var r=e.childNodes[s];if(1==r.nodeType)switch(r.nodeName){case"profile_COMMON":this.parseProfileCOMMON(r);break;case"technique":t=r;break;case"newparam":this.parseNewparam(r);break;case"image":var i=(new v).parse(r);n[i.id]=i;break;case"extra":break;default:console.log(r.nodeName)}}return t},D.prototype.parseTechnique=function(e){for(var t=0;t<e.childNodes.length;t++){var s=e.childNodes[t];if(1==s.nodeType)switch(s.nodeName){case"constant":case"lambert":case"blinn":case"phong":this.shader=new L(s.nodeName,this).parse(s);break;case"extra":this.parseExtra(s)}}},D.prototype.parseExtra=function(e){for(var t=0;t<e.childNodes.length;t++){var s=e.childNodes[t];if(1==s.nodeType)switch(s.nodeName){case"technique":this.parseExtraTechnique(s)}}},D.prototype.parseExtraTechnique=function(e){for(var t=0;t<e.childNodes.length;t++){var s=e.childNodes[t];if(1==s.nodeType)switch(s.nodeName){case"bump":this.shader.parse(e)}}},U.prototype.parse=function(e){return this.url=e.getAttribute("url").replace(/^#/,""),this},{load:function(e,t,s,r){var i=0;if(document.implementation&&document.implementation.createDocument){var a=new XMLHttpRequest;a.onreadystatechange=function(){4===a.readyState?0===a.status||200===a.status?a.response?m(a.response,t,e):r?r({type:"error",url:e}):console.error("ColladaLoader: Empty or non-existing file ("+e+")"):r?r({type:"error",url:e}):console.error("ColladaLoader: Couldn't load \""+e+'" ('+a.status+")"):3===a.readyState&&s&&(0===i&&(i=a.getResponseHeader("Content-Length")),s({total:i,loaded:a.responseText.length}))},a.open("GET",e,!0),a.send(null)}else alert("Don't know how to parse XML!")},parse:m,geometries:h,options:p}};