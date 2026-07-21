import React from "react";
import { Toaster } from "react-hot-toast";

export function PsychometricLayout(props) {
  return (
    <div style={{ minHeight: "100vh", background: "#f4f5f7" }}>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: { fontSize: "16px" },
        }}
      />
      <div className="w-100">{props.children}</div>
    </div>
  );
}
