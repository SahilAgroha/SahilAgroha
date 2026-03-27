import React from "react";
import "./index.css";
import CyberWaveBackground from "./background/CyberWaveBackground";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import TechStack from "./components/TechStack";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
// import NebulaGalaxyBackground from "./background/NebulaGalaxyBackground";

function App() {
  return (
    <div>
       {/* <NebulaGalaxyBackground/> */}
      <CyberWaveBackground/>
     
      <Navbar />
      <main>
        <Hero />
        {/* <div className="divider" /> */}
        <About />
        {/* <div className="divider" /> */}
        <TechStack />
        {/* <div className="divider" /> */}
        <Projects />
        {/* <div className="divider" /> */}
        <Experience />
        {/* <div className="divider" /> */}
        <Contact />
      </main>
    </div>
  );
}

export default App;
