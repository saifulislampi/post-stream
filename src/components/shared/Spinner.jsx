import React from "react";

export default function Spinner() {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "50vh" }}
    >
      <div className="spinner-border text-accent" role="status">
        <span className="visually-hidden">Loading…</span>
      </div>
    </div>
  );
}
