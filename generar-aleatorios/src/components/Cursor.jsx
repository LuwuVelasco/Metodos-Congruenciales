import React, { useEffect, useState } from "react";

const Cursor = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePos = e => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", updatePos);
    return () => window.removeEventListener("mousemove", updatePos);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: pos.y,
        left: pos.x,
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        backgroundColor: "rgba(0, 255, 200, 0.7)",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        mixBlendMode: "difference",
        zIndex: 9999
      }}
    />
  );
};

export default Cursor;
