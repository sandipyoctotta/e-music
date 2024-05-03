// Navbar.js
import React, { useEffect, useState } from "react";

const Navigationbar = ({ onClickAbout, onClickHome }) => {
  const [text, setText] = useState("");
  const fullText =
    "Dance like nobody's watching, sing like nobody is listening.";
  const typingSpeed = 100;
  const deleteSpeed = 50;
  const pauseSpeed = 1000;

  useEffect(() => {
    let currentIndex = 0;
    let isDeleting = false;

    const animateText = () => {
      let interval;
      if (!isDeleting) {
        interval = setInterval(() => {
          setText((prevText) => prevText + fullText[currentIndex]);
          currentIndex++;
          if (currentIndex === fullText.length) {
            clearInterval(interval);
            setTimeout(() => {
              isDeleting = true;
              currentIndex = fullText.length - 1;
              interval = setInterval(() => {
                setText((prevText) => prevText.slice(0, -1));
                currentIndex--;
                if (currentIndex === -1) {
                  clearInterval(interval);
                  setTimeout(() => {
                    isDeleting = false;
                    currentIndex = 0;
                    animateText(); // Restart the animation
                  }, pauseSpeed);
                }
              }, deleteSpeed);
            }, pauseSpeed);
          }
        }, typingSpeed);
      }
    };

    animateText();

    return () => {}; // No cleanup needed for this effect
  }, [fullText]);
  return (
    <nav style={{ boxShadow: "0 2px 4px #4C4949" }}>
      <ul
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <li style={{ cursor: "pointer" }} onClick={onClickHome}>
            Home
          </li>
          <li style={{ cursor: "pointer" }} onClick={onClickAbout}>
            About
          </li>
        </div>
        <p style={{ marginInline: 50 }}>{text}</p>
      </ul>
    </nav>
  );
};
export default Navigationbar;
