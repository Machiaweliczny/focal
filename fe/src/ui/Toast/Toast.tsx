import React from "react";

export function ErrorToast({ message = "" }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        minWidth: "300px",
        minHeight: "100px",
        right: "5px",
        bottom: "5px",
        color: "white",
        backgroundColor: "red",
        border: "1px solid black",
      }}
    >
      {message}
    </div>
  );
}
