import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import RightPanel from "./components/RightPanel";
import FooterBar from "./components/FooterBar";
import Modals from "./components/Modals";

export default function App() {
  const [section, setSection] = useState("proyectos");

  return (
    <div className="app-grid">
      <Sidebar setSection={setSection} />
      <MainContent section={section} />
      <RightPanel />
      <FooterBar />
      <Modals />
    </div>
  );
}
