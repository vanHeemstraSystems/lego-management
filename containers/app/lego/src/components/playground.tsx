import React, { useRef, useEffect, useMemo } from "react";
import { gql, useQuery } from "@apollo/client";
import initializeApollo from "../lib/apollo";
import CanvasContainer from "./canvasContainer";
import ToolContainer from "./toolContainer";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
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
                <script src="https://cdnjs.cloudflare.com/ajax/libs/spin.js/2.3.2/spin.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/87/three.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/tween.js/17.3.0/Tween.min.js"></script>
            </Helmet>
            Hello from Playground named {props.name}!
            <CanvasContainer />
            <ToolContainer />
        </>
    );
};

export default Playground;