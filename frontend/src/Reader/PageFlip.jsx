import React, { useState, useEffect } from "react";
import PageContent from "./PageContent";
import "./reader.css";

function PageFlip({ pages, onPageChange }) {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState(null);
  const [resist, setResist] = useState("");

  const current = pages[index];
  const next = pages[index + 1];
  const prev = pages[index - 1];

  useEffect(() => {
    onPageChange?.(index);
  }, [index, onPageChange]);

  const navigate = (dir) => {
    if (animating) return;

    if (dir === "forward") {
      if (!next) {
        setResist("resist-right");
        setTimeout(() => setResist(""), 250);
        return;
      }
      setDirection("forward");
      setAnimating(true);
      setTimeout(() => {
        setIndex(i => i + 1);
        setAnimating(false);
      }, 1100);
    }

    if (dir === "backward") {
      if (!prev) {
        setResist("resist-left");
        setTimeout(() => setResist(""), 250);
        return;
      }
      setDirection("backward");
      setAnimating(true);
      setTimeout(() => {
        setIndex(i => i - 1);
        setAnimating(false);
      }, 1100);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (animating) return;
      if (e.key === "ArrowRight") navigate("forward");
      if (e.key === "ArrowLeft") navigate("backward");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [animating]);

  const handleClick = (e) => {
    const x = e.nativeEvent.offsetX;
    const w = e.currentTarget.clientWidth;
    if (x > w / 2) navigate("forward");
    else navigate("backward");
  };

  return (
    <div className={`page-wrapper ${resist}`} onClick={handleClick}>
      <div className="page">
        <PageContent page={current} />
      </div>

      {animating && (
        <div
          className={`page flip-page ${
            direction === "forward" ? "flip-backward" : "flip-forward"
          }`}
        >
          <PageContent page={current} />
        </div>
      )}
    </div>
  );
}

export default PageFlip;