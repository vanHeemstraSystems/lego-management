// --------------------------------------------------
// Copyright (c) 2019 lk.lkaz
// Updated 2023 Willem van Heemstra
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// --------------------------------------------------
// [Twitter]: https://twitter.com/lk_lkaz/
// [docs]: https://l3di.netlify.com
// --------------------------------------------------

import * as THREE from "three";
import * as THREE_ADDONS from "three-addons";
// import { Spinner } from "spin";  // Throws Document Undefined
import { Tween } from "@tweenjs/tween.js";

var L3DI = L3DI || { REVISION: "1" };

L3DI.DEG2RAD = Math.PI / 180;

L3DI.instCSV = function () {
    console.log("Hello from L3DI.instCSV()")
}

export default L3DI;