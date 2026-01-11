import React, { useEffect, useState, useRef } from "react";
import "../styles/IntroAnimation.css";

const IntroAnimation = ({ onComplete }) => {
  const [stage, setStage] = useState("start");
  const [targetPos, setTargetPos] = useState({ top: 0, left: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const navbarText = document.querySelector(".main-logo-text");

    if (navbarText) {
      const rect = navbarText.getBoundingClientRect();
      setTargetPos({
        top: rect.top,
        left: rect.left,
      });
    }

    const sloganTimer = setTimeout(() => {
      setStage("hide-slogan");
    }, 2000);

    const moveTimer = setTimeout(() => {
      setStage("move");
    }, 2500);

    const finishTimer = setTimeout(() => {
      setStage("finish");

      setTimeout(() => {
        if (onComplete) onComplete();
      }, 500);
    }, 3300);

    return () => {
      clearTimeout(sloganTimer);
      clearTimeout(moveTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  let containerClass = "intro-overlay";
  if (stage === "hide-slogan") containerClass += " slogan-hidden";
  if (stage === "move" || stage === "finish")
    containerClass += " slogan-hidden move-phase";
  if (stage === "finish") containerClass += " fade-out";

  const dynamicStyle = {
    "--target-top": `${targetPos.top}px`,
    "--target-left": `${targetPos.left}px`,
  };

  return (
    <div className={containerClass} style={dynamicStyle}>
      <div className="intro-logo-container animate-pop" ref={containerRef}>
        <h1 className="intro-logo-text">WORK HIVE</h1>
        <div className="intro-slogan">Reserve the place you need to bee!</div>
      </div>
    </div>
  );
};

export default IntroAnimation;
