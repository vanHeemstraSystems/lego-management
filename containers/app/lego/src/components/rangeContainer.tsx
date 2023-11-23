import React, { useRef, useEffect, useMemo } from "react";
// more
import "./rangeContainer.scss";

type RangeContainerProps = {
    color: string;
    children?: React.ReactNode;
};

type RangeContainerState = {
    color: string;
};

type Props = {
    color: string;
};

const RangeContainer = (props: RangeContainerProps, state: RangeContainerState) => {

    console.log("Inside RangeContainer"); // FOR TESTING ONLY

    return (
        <div className={`rangeContainer ${props.color}`}>
            <a id="btn_RangeA_Minus" className="btn">
                <svg className="icon">
                    <use xlinkHref="#icon-minus"></use>
                </svg>
            </a>
            <input type="range" id="rangeA" className="range" />
            <a id="btn_RangeA_Plus" className="btn">
                <svg className="icon">
                    <use xlinkHref="#icon-plus"></use>
                </svg>
            </a>
        </div>
    );
};

export default RangeContainer;