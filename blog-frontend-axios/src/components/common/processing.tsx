import React, { CSSProperties } from "react";
import MoonLoader from "react-spinners/MoonLoader";

import useSessionProvider from '../../contexts/session.context';

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

const Processing = () => {

    const { sessionState: { isLoading } } = useSessionProvider();

    return (
        <div className="sweet-loading">
            <MoonLoader color={"blue"} speedMultiplier={0.5} loading={isLoading} cssOverride={override} size={50} />
        </div>
    );
}

export default Processing;