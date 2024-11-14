import "./App.css";
import Search from "./components/Search/Search.jsx";
import Upload from "./components/Upload/Upload.jsx";
import Viewall from "./components/Viewall/Viewall.jsx";
import { useState } from "react";

function App() {
  //useState to determine which section to show depending on user's choice
  const [activeSection, setActiveSection] = useState(""); 

  return (
    <div>
      <h1>Audio Transcription App</h1>
      <p>
        Upload your audio file(s) to transcribe them, or view all and search
        existing transcriptions
      </p>

      <div className="buttonsDiv">
        <button onClick={() => setActiveSection("upload")}>Upload Audio File</button>
        <button onClick={() => setActiveSection("viewall")}>
          View All Transcriptions
        </button>
        <button onClick={() => setActiveSection("search")}>
          Search Transcriptions
        </button>
      </div>
      {activeSection === "upload" && <Upload />}
      {activeSection === "viewall" && <Viewall />}
      {activeSection === "search" && <Search />}
    </div>
  );
}

export default App;
