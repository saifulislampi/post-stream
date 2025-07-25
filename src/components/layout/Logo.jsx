import React from "react";

export default function Logo({ width = 200, height = 80, onClick }) {
  return (
    <svg
      viewBox="0 0 180 60"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      style={{ cursor: onClick ? "pointer" : "default" }}
      onClick={onClick}
    >
      <rect x="8" y="12" width="28" height="28" rx="6" fill="#007bff" />
      <text
        x="22"
        y="28"
        fontFamily="'Courier New',Monaco,Menlo,Consolas,monospace"
        fontSize="20"
        fontWeight="bold"
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
      >
        P
      </text>
      <text
        x="45"
        y="32"
        fontFamily="system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"
        fontSize="22"
        fontWeight="bold"
        fill="#22223b"
        letterSpacing="-0.5px"
      >
        PostStream
      </text>
      <text
        x="45"
        y="44"
        fontFamily="system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"
        fontSize="10"
        fontWeight={500}
        fill="#6c757d"
        letterSpacing="0.5px"
      >
        stream your vibe
      </text>
    </svg>
  );
}
