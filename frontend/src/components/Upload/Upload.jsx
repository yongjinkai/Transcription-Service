import { useState } from "react";
import "./Upload.css";
import UploadTable from "./UploadTable";
import "bootstrap/dist/css/bootstrap.min.css";
function Upload() {
  const [files, setFiles] = useState([]); //useState to capture uploaded file(s)
  const [transcriptions, setTranscriptions] = useState([]); //useState to capture fetched transcriptions
  const [loading, setLoading] = useState(false); //useState to set loading spinner display
  const [errorMessage, setErrorMessage] = useState(""); //useState to set server error

  function handleChange(e) {
    setFiles(Array.from(e.target.files));
  }

  async function handleSubmit() {
    setLoading(true); //Start displaying spinner
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await fetch("http://127.0.0.1:8000/transcribe", {
      method: "POST",
      body: formData,
    })
      .catch((error) => {
        console.error("Error:", error);
        setErrorMessage("Unable to access database");
      })
      .finally(() => {
        setLoading(false); //Stop displaying spinner
      });

    if (response && response.ok) {
      setErrorMessage("");
      const data = await response.json();
      const newTranscriptions = data.map((t) => ({
        filename: t.file_name,
        transcription: t.transcription,
      }));
      setTranscriptions(newTranscriptions);
    } else if (response && !response.ok) {
      setErrorMessage("Invalid file type");
    }
  }

  return (
    <div className="uploadDiv">
      <div className="inputDiv">
        <input
          type="file"
          multiple
          onChange={handleChange}
          accept="audio/*"
          data-testid="inputbox"
        />
        {/* Show transcribe button when a file is selected */}
        {files.length !== 0 && (
          <button onClick={handleSubmit}>Transcribe</button>
        )}
        {/* if loading is true, display spinner */}
        {loading ? (
          <div className="spinner-border text-primary mx-2" role="status">
            <span className="sr-only"> &nbsp;</span>
          </div>
        ) : null}
      </div>
      {/* Show transcription if no Error Message */}
      {errorMessage === "" ? (
        <UploadTable transcriptions={transcriptions} />
      ) : (
        <div>
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
}
export default Upload;
