import React, { CSSProperties } from "react";
import MoonLoader from "react-spinners/MoonLoader";

import { useUIContext } from '@Contexts';

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
  position: "absolute",
  top: "50%",
  left: "50%",
  marginTop: "-50px",
  marginLeft: "-50px"
};

export const Processing = () => {

    const { uiState: { isLoading } } = useUIContext();

    return (
        <div className="sweet-loading">
            <MoonLoader color={"blue"} speedMultiplier={0.5} loading={isLoading} cssOverride={override} size={50} />
        </div>
    );
}
