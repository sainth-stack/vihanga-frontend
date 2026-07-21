import React from "react";

export function LoadingIndicator({ size = "3", text = "Loading..." }) {
  const pxSize = parseInt(size) * 18;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(249,251,255,0.74)",
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "22px",
          background: "rgba(255,255,255,0.95)",
          borderRadius: "24px",
        
          padding: "36px 52px",
          minWidth: "240px",
        }}
      >
        <div
          className="spinner-border text-primary"
          role="status"
          style={{
            width: pxSize,
            height: pxSize,
            borderWidth: 7,
            borderColor: "#678BF7 transparent #BFD7FF transparent",
            animation: "spinner-grow 0.78s cubic-bezier(0.6, 0, 0.5, 1) infinite",
            marginBottom: "2px",
          }}
        >
          <span className="sr-only">{text}</span>
        </div>
        <span style={{
          color: "#345",
          fontWeight: 600,
          fontSize: "1.20rem",
          letterSpacing: "0.025em",
          textShadow: "0 2px 6px rgba(120,140,220,0.08)",
        }}>
          {text}
        </span>
        {/* Custom Spinner CSS */}
        <style>
          {`
            @keyframes spinner-grow {
              0% {
                transform: scale(0.75) rotate(0deg);
              }
              60% {
                transform: scale(1.11) rotate(170deg);
              }
              100% {
                transform: scale(0.75) rotate(360deg);
              }
            }
            .spinner-border {
              border-radius: 50%;
              border-style: solid;
              border-top-color: #678BF7 !important;
              border-right-color: #EAF0FF !important;
              border-bottom-color: #BFD7FF !important;
              border-left-color: #EAF0FF !important;
              background: transparent;
            }
          `}
        </style>
      </div>
    </div>
  );
}