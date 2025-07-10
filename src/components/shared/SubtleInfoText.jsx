import React from "react";

const SubtleInfoText = ({ children }) => (
  <div
    className="text-muted small"
    style={{ fontSize: "0.8em", opacity: 0.8 }}
  >
    {children}
  </div>
);

export default SubtleInfoText;