import { PropsWithChildren } from "react";
import "./styles/Landing.css";
import { profile } from "../data/profileData";
import { useEffect } from "react";


const Landing = ({ children }: PropsWithChildren) => {

useEffect(() => {
  const roles = [profile.subtitleA, profile.subtitleB];
  const el = document.querySelector(".typing-text") as HTMLElement;

  let roleIndex = 0;
  let charIndex = 0;
  let typingForward = true;

  const typingSpeed = 100;
  const deletingSpeed = 80;
  const holdDelay = 1200;

  function updateText() {
    const current = roles[roleIndex];

    if (typingForward) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);

      if (charIndex === current.length) {
        typingForward = false;
        setTimeout(() => {}, holdDelay);
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);

      if (charIndex === 0) {
        typingForward = true;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
  }

  const interval = setInterval(updateText, typingSpeed);

  return () => clearInterval(interval);
}, []);

  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              {profile.firstName} 
              <br />
              <span>{profile.lastName}</span>
            </h1>
          </div>
          <div className="landing-info">
            <h3 >A Full Stack</h3>

            <h2 className="typing-role">
              <span className="typing-text"></span>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
