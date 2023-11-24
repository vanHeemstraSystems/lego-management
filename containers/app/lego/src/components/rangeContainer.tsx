import React, { useRef, useEffect, useMemo } from "react";
// more
import "./rangeContainer.scss";

type RangeContainerProps = {
    color: string;
    range: string;
    children?: React.ReactNode;
};

type RangeContainerState = {
    color: string;
    range: string;
};

type Props = {
    color: string;
    range: string;
};

const RangeContainer = (props: RangeContainerProps, state: RangeContainerState) => {

    console.log("Inside RangeContainer"); // FOR TESTING ONLY

    return (
        <div className={`rangeContainer ${props.color}`}>
            <a id={`btn_Range${props.range}_Minus`} className="btn">
                <svg className="icon">
                    <use xlinkHref="#icon-minus"></use>
                </svg>
            </a>
            <input type="range" id={`range${props.range}`} className="range" />
            <a id={`btn_Range${props.range}_Plus`} className="btn">
                <svg className="icon">
                    <use xlinkHref="#icon-plus"></use>
                </svg>
            </a>
        </div>
    );
};

export default RangeContainer;