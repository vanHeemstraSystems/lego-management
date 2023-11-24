import React, { useRef, useEffect, useMemo } from "react";
import { gql, useQuery } from "@apollo/client";
import initializeApollo from "../lib/apollo";
import CanvasContainer from "./canvasContainer";
import ToolContainer from "./toolContainer";
import { connect } from "react-redux";
import L3DI from "../lib/L3DI";
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

        var modelPath = '../models/lego-azure.dae';
        var instCSV = InstCSV || undefined;

        // var canvasContainer = document.getElementById("canvasContainer");
        // var spinner = L3DI.setupSpinner(canvasContainer, '#ffffff');

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