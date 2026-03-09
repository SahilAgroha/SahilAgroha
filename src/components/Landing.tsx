import { PropsWithChildren, useEffect } from "react";
import "./styles/Landing.css";
import { profile } from "../data/profileData";

const Landing = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    const roles = [profile.subtitleA, profile.subtitleB];
    const el = document.querySelector(".typing-text") as HTMLElement;

    if (!el) return;

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typingSpeed = 110;
    const deletingSpeed = 60;
    const holdAfterTyping = 1400;

    function typeLoop() {
      const current = roles[roleIndex];

      if (!isDeleting) {
        charIndex++;
        el.textContent = current.slice(0, charIndex);

        if (charIndex === current.length) {
          setTimeout(() => (isDeleting = true), holdAfterTyping);
        }
      } else {
        charIndex--;
        el.textContent = current.slice(0, charIndex);

        if (charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }

      const speed = isDeleting ? deletingSpeed : typingSpeed;
      setTimeout(typeLoop, speed);
    }

    typeLoop();
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
            <h3>A Full Stack</h3>

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