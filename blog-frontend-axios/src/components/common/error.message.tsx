import * as React from "react";

interface IOwnProps {
  error: any;
}

export const ErrorMessage = (props: IOwnProps) => {
  return (
    <>
      <div className="error">
        <small>{props.error.toString()}</small>
      </div>
    </>
  );
};

