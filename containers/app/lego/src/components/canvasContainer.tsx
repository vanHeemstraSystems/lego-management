import React, { useRef, useEffect, useMemo } from "react";
// more
import "./canvasContainer.scss";

const CanvasContainer = () => {

    console.log("Inside CanvasContainer"); // FOR TESTING ONLY

    return (
        <div id="canvasContainer" className="canvasContainer">
            <a id="btn_canvas" className="btn_canvas"></a>
        </div>
    );
};

export default CanvasContainer;