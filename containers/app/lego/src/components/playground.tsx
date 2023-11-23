import React, { useRef, useEffect, useMemo } from "react";
import { gql, useQuery } from "@apollo/client";
import initializeApollo from "../lib/apollo";
// more
import { connect } from "react-redux";
import "./playground.scss";

type PlaygroundProps = {
    name: string;
    //map_nodes?: Object;
    //newMaps?: any;
    //newNodes?: Array<Object>;
    //newLinks?: any;
    //generateEvent?: Function;
    children?: React.ReactNode;
};

type PlaygroundState = {
    name: string;
    //map_nodes: Object;
    //newMaps: any;
    //newNodes: Array<Object>;
    //newLinks: any;
};

// more

type Props = {
    //graph: dia.Graph;
    graph: []; // temporarily, can be removed later
    //paperOptions: joint.dia.Paper.Options;
    name: string;
    //nodes: Array<Node>;
    //links: Array<dia.Link>;
    //paperRef: (paper: dia.Paper) => void;
};

// more  

const Playground = (props: PlaygroundProps, state: PlaygroundState) => {

    console.log("+++++++++ props: ", props, " +++++++++++"); // FOR TESTING ONLY

    // Temporarily, can be removed later
    let graph:any = [];

    useEffect(() => {
        console.log("Start of useEffect()");
        console.log("End of useEffect()");
    }, [graph]);

    return (
        <>
            Hello from Playground named {props.name}!
        </>
    );
};


function mapStateToProps(state: PlaygroundState) {
    // more
}

function mapDispatchToProps(dispatch: any) {
    // more
}

export default connect(mapStateToProps, mapDispatchToProps)(Playground);