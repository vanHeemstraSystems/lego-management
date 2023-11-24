// --------------------------------------------------
// Copyright (c) 2019 lk.lkaz
// Updated 2023 Willem van Heemstra
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// --------------------------------------------------
// [Twitter]: https://twitter.com/lk_lkaz/
// [docs]: https://l3di.netlify.com
// --------------------------------------------------
import {useState} from 'react';
import * as THREE from "three";
import * as THREE_ADDONS from "three-addons";
import { Tween } from "@tweenjs/tween.js";

var L3DI = L3DI || { REVISION: "1" };

L3DI.DEG2RAD = Math.PI / 180;

//////////////////////////////////////////////////////////////////////
// L3DI/canvas
//////////////////////////////////////////////////////////////////////
L3DI.Canvas = function ( domElement, ops ) {

}

//////////////////////////////////////////////////////////////////////
// L3DI/mouseControls
//////////////////////////////////////////////////////////////////////
L3DI.MouseControls = function ( object3D, domElement, ops ) {

}

//////////////////////////////////////////////////////////////////////
// L3DI/inst
//////////////////////////////////////////////////////////////////////
L3DI.createInst = function ( model, lines ) {

}

//////////////////////////////////////////////////////////////////////
// L3DI/LegoObj
//////////////////////////////////////////////////////////////////////
L3DI.LegoObj = function ( obj, dir ) {

}

//////////////////////////////////////////////////////////////////////
// L3DI/Step
//////////////////////////////////////////////////////////////////////
L3DI.Step = function ( objList ) {

}

//////////////////////////////////////////////////////////////////////
// L3DI/Step_translate
//////////////////////////////////////////////////////////////////////
L3DI.Step_translate = function ( obj, v ) {

}

//////////////////////////////////////////////////////////////////////
// L3DI/Step_rotate
//////////////////////////////////////////////////////////////////////
L3DI.Step_rotate = function ( obj, q ) {

}

//////////////////////////////////////////////////////////////////////
// L3DI/Inst
//////////////////////////////////////////////////////////////////////
L3DI.Inst = function ( steps ) {
}


//////////////////////////////////////////////////////////////////////
// L3DI/setupSpinner
//////////////////////////////////////////////////////////////////////
L3DI.setupSpinner = async function ( target, color ) {
  console.log("L3DI.setupSpinner called");
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

  const Spinner = (await import('spin')).default;
  var spinner = new Spinner(opts).spin(target);
  return spinner;
}

export default L3DI;