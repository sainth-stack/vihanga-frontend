import React from "react";

export default function Heading({ fullname }) {
  return (
    <div>
      <h5 className="d-flex justify-content-end text-green mt-2">
        Talent Spotify Feedback Report for {fullname}
      </h5>
      <div className="boldline mt-4"></div>
    </div>
  );
}
