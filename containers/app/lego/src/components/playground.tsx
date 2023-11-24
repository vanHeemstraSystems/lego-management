import React, { useRef, useEffect, useMemo } from "react";
import { gql, useQuery } from "@apollo/client";
import initializeApollo from "../lib/apollo";
import CanvasContainer from "./canvasContainer";
import ToolContainer from "./toolContainer";
import { connect } from "react-redux";
import L3DI from "../lib/L3DI";
import * as THREE from "three";
import * as ColladaLoader from "three-collada-loader";
import { Tween } from "@tweenjs/tween.js";
import InstCSV from "../models/instCSV";
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

            
            // More ...
        };

        function setupAction(model) {
            // MORE ...
        };

        // On Load
        var modelPath = '../models/lego-azure.dae';
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

            spinner.stop();
        });

        /**
        function renderLoop() {
            requestAnimationFrame(renderLoop);
            Tween.update();
            canvas.render();
        }
        renderLoop();
        */

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