import React, { useRef, useEffect, useMemo } from "react";
import RangeContainer from "./rangeContainer";
// more
import "./toolContainer.scss";

const ToolContainer = () => {

    console.log("Inside ToolContainer"); // FOR TESTING ONLY

    return (
        <div id="toolContainer" className="toolContainer">
            <RangeContainer range="A" color="color1"/>
            <RangeContainer range="B" color="color2" />
            <svg height="0">
                <defs>
                    <symbol id="icon-plus" viewBox="0 0 32 32">
                        <path d="M11 11v-11h1v11h11v1h-11v11h-1v-11h-11v-1h11z">
                        </path>
                    </symbol>
                    <symbol id="icon-minus" viewBox="0 0 32 32">
                        <path d="M0 12v1h23v-1h-23z">
                        </path>
                    </symbol>
                    <symbol id="icon-file-text" viewBox="0 0 32 32">
                        <path d="M22 24h-20v-24h14l6 6v18zm-7-23h-12v22h18v-16h-6v-6zm1 5h4.586l-4.586-4.586v4.586z" />
                    </symbol>
                </defs>
            </svg>
        </div>
    );
};

export default ToolContainer;