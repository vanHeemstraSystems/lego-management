import React, { useRef, useEffect, useMemo } from "react";
import { gql, useQuery } from "@apollo/client";
import initializeApollo from "../lib/apollo";
import CanvasContainer from "./canvasContainer";
import ToolContainer from "./toolContainer";
import { connect } from "react-redux";
import L3DI from "../lib/L3DI";
import * as THREE from "three";
// import * as ColladaLoader from "three-collada-loader"; // Throws duplicate use of Three
// import * as THREE_ADDONS from "three-addons"; // Throws error
// See https://stackoverflow.com/questions/42434398/how-to-use-threejs-collada-loader-with-typescript-angular-cli
import { ColladaLoader } from "../../node_modules/three/examples/jsm/loaders/ColladaLoader";
// REMOVE import * as TWEEN from "@tweenjs/tween.js";
import { InstCSV } from "../models/instCSV.js";
import "../../node_modules/spin.js/spin.css";
import "./playground.scss";

type PlaygroundProps = {
    name: string;
    children?: React.ReactNode;
};

type PlaygroundState = {
    name: string;
};

type Props = {
    name: string;
};

const Playground = (props: PlaygroundProps, state: PlaygroundState) => {

    console.log("+++++++++ props: ", props, " +++++++++++"); // FOR TESTING ONLY

    // See https://www.codingdeft.com/posts/react-add-script/
    useEffect(() => {
        console.log("Start of useEffect()");

        // Functions
        function setupInst(model, instCSV) {
            var inst = L3DI.createInst(model, instCSV);

            var rangeB = document.getElementById("rangeB");
            rangeB.min = inst.getStepMin();
            rangeB.max = inst.getStepMax();
            rangeB.step = inst.getStepStep();
            rangeB.value = inst.getCurStep();
            rangeB.addEventListener("input", function (e) {
                inst.setStep(rangeB.value);
            }, false)

            var inputEvent = new Event("input");

            var stepForward = function (e) {
                e.preventDefault();
                console.log("stepForward");
                rangeB.value = +rangeB.value + +rangeB.step;
                rangeB.dispatchEvent(inputEvent);
            }

            var stepBackward = function (e) {
                e.preventDefault();
                console.log("stepBackward");
                rangeB.value -= rangeB.step;
                rangeB.dispatchEvent(inputEvent);
            }

            var btn_RangeB_Minus = document.getElementById("btn_RangeB_Minus");
            btn_RangeB_Minus.addEventListener("click", stepBackward, false)
            btn_RangeB_Minus.addEventListener("touchstart", stepBackward, false)

            var btn_RangeB_Plus = document.getElementById("btn_RangeB_Plus");
            btn_RangeB_Plus.addEventListener("click", stepForward, false)
            btn_RangeB_Plus.addEventListener("touchstart", stepForward, false)

            var toolContainer = document.getElementById("toolContainer");

            //prevent pinch-zooming
            toolContainer.addEventListener("touchstart", function (e) {
                if (e.touches.length >= 2) e.preventDefault();
            }, false)

            //prevent tap-zooming
            toolContainer.addEventListener("touchend", function (e) {
                e.preventDefault();
            }, false)

            //complex code...
            //touchend doesn't work well in android...
            var btn_canvas = document.getElementById("btn_canvas");
            var isClick: Boolean;
            var startX: any, startY: any;

            var btn_canvas_touchend = function (e) {
                if (!isClick) { return; }

                isClick = false;

                if (startX > btn_canvas.offsetWidth / 2) {
                    stepForward(e);
                } else {
                    stepBackward(e);
                }

            }

            var isMoved = function (endX: any, endY: any) {
                return Math.abs(endX - startX) > 3 || Math.abs(endY - startY) > 3;
            }

            btn_canvas.addEventListener("touchstart", function (e) {
                isClick = true;
                startX = e.touches[0].pageX;
                startY = e.touches[0].pageY;
            }, false)
            btn_canvas.addEventListener("mousedown", function (e) {
                isClick = true;
                startX = e.pageX;
                startY = e.pageY;
            }, false)
            btn_canvas.addEventListener("touchmove", function (e) {
                if (isMoved(e.touches[0].pageX, e.touches[0].pageY)) {
                    isClick = false;
                }
            }, false)
            btn_canvas.addEventListener("mousemove", function (e) {
                if (isMoved(e.pageX, e.pageY)) {
                    isClick = false;
                }
            }, false)
            btn_canvas.addEventListener("touchend", btn_canvas_touchend, false)
            btn_canvas.addEventListener("mouseup", btn_canvas_touchend, false)
        };

        function setupAction(model:any) {
            console.log("model:", model);
            var c0 = model.getObjectByName("c0");
            var c1 = model.getObjectByName("c1");
            var c2 = model.getObjectByName("c2");
            var c4 = model.getObjectByName("c4");
            var c_1 = model.getObjectByName("c_1");
            var c_2 = model.getObjectByName("c_2");
            var c_4 = model.getObjectByName("c_4");
            var r2 = model.getObjectByName("r2");
            var r4 = model.getObjectByName("r4");
            var r_2 = model.getObjectByName("r_2");
            var r_4 = model.getObjectByName("r_4");

            var motion = {
                clockMin: -1,
                clockMax: 1,
                clockStep: .01,
                curClock: 0,
                setClock: function (clock: any) {
                    var clock = clock || 0;
                    var a = Math.PI * clock * -.34;
                    c0.rotation.set(0, a, 0);
                    c1.rotation.set(0, a, 0);
                    c2.rotation.set(0, a, 0);
                    c4.rotation.set(0, a, 0);
                    c_1.rotation.set(0, a, 0);
                    c_2.rotation.set(0, a, 0);
                    c_4.rotation.set(0, a, 0);
                    r2.rotation.set(0, -a, 0);
                    r4.rotation.set(0, -a, 0);
                    r_2.rotation.set(0, -a, 0);
                    r_4.rotation.set(0, -a, 0);
                    model.rotation.set(0, -a / 2, 0);
                    this.curClock = clock;
                },
            }

            var rangeA = document.getElementById("rangeA");
            rangeA.min = motion.clockMin;
            rangeA.max = motion.clockMax;
            rangeA.step = motion.clockStep;
            rangeA.value = motion.curClock;
            rangeA.addEventListener("input", function (e) {
                motion.setClock(rangeA.value);
            }, false)

            var inputEvent = new Event("input");

            var stepForward = function (e:any) {
                e.preventDefault();
                var unit = +rangeA.step * 10;
                rangeA.value = (Math.round(+rangeA.value / unit) + 1) * unit;
                rangeA.dispatchEvent(inputEvent);
            }

            var stepBackward = function (e) {
                e.preventDefault();
                var unit = +rangeA.step * 10;
                rangeA.value = (Math.round(+rangeA.value / unit) - 1) * unit;
                rangeA.dispatchEvent(inputEvent);
            }

            var btn_RangeA_Minus = document.getElementById("btn_RangeA_Minus");
            btn_RangeA_Minus.addEventListener("click", stepBackward, false)
            btn_RangeA_Minus.addEventListener("touchstart", stepBackward, false)

            var btn_RangeA_Plus = document.getElementById("btn_RangeA_Plus");
            btn_RangeA_Plus.addEventListener("click", stepForward, false)
            btn_RangeA_Plus.addEventListener("touchstart", stepForward, false)
        };

        // On Load
        var modelPath = '../models/lego-azure.dae';
        // var modelPath = '../models/model.dae';
        var instCSV = InstCSV || undefined;

        var canvasContainer = document.getElementById("canvasContainer");
        var spinner = L3DI.setupSpinner(canvasContainer, '#ffffff');

        var canvas = new L3DI.Canvas(canvasContainer, {
            backgroundColor: 0x55acfc,
            cameraDistance: 300,
            fov: 80,
            zoomMin: 0.5,
            zoomMax: 3.0,
            initialRotation: [35, 0, 0],
        });

        var light = new THREE.AmbientLight(0xccccff, .2);
        canvas.addLight(light);

        var light2 = new THREE.DirectionalLight(0xffffff, 0.5);
        light2.position.set(-1, 1, 1).normalize();
        canvas.addLight(light2);

        var light3 = new THREE.DirectionalLight(0xffffff, 0.5);
        light3.position.set(1, -1, 1).normalize();
        canvas.addLight(light3);

        var light4 = new THREE.DirectionalLight(0xffffff, 0.5);
        light4.position.set(0, 1, 0.5).normalize();
        canvas.addLight(light4);

        var loader = new ColladaLoader();
        loader.load(modelPath, function (data: any) {
            var model = data.scene;
            model.scale.set(1, 1, 1);
            model.position.set(0, 0, 0);

            model.name = ""; // Correspond to instCSV's first line. '[""],'

            setupInst(model, instCSV);
            setupAction(model);

            canvas.addModel(model);

            spinner.stop(); // spinner.stop is not a function
        });

        function renderLoop() {
            requestAnimationFrame(renderLoop);
            // Tween.update(); // ERROR: Tween.update is not a function ??
            canvas.render();
        }
        renderLoop();

        console.log("End of useEffect()");
    }, []);

    return (
        <>
            <p>Hello from Playground named {props.name}!</p>
            <CanvasContainer />
            <ToolContainer />
        </>
    );
};

export default Playground;