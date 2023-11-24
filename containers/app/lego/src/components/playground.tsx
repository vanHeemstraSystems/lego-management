import React, { useRef, useEffect, useMemo } from "react";
import { gql, useQuery } from "@apollo/client";
import initializeApollo from "../lib/apollo";
import CanvasContainer from "./canvasContainer";
import ToolContainer from "./toolContainer";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import * as THREE from "three";
import Spinner from "spin";
import Tween from "@tweenjs/tween.js"
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

    useEffect(() => {
        console.log("Start of useEffect()");
        console.log("End of useEffect()");
    });

    return (
        <>
            <Helmet>
                <script src="../js/L3DI.js"></script>
            </Helmet>
            <p>Hello from Playground named {props.name}!</p>
            <CanvasContainer />
            <ToolContainer />
        </>
    );
};

export default Playground;