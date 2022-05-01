import * as React from "react";

interface IOwnProps {
  message?: any;
}

const Loading = (props: IOwnProps) => {
  return (
    <>
      <div className="loading">
        <small>{props.message ? props.message : "Loading..."}</small>
      </div>
    </>
  );
};

export default Loading;