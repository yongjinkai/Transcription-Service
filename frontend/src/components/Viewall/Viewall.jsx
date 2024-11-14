import "./Viewall.css";
import { useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
function Viewall() {
  //useState to capture response from server
  const [data, setData] = useState([]);

  //useState to set display message if no transcriptions
  const [displayMsg, setDisplayMsg] = useState("");

  // useEffect to run data fetching once when page renders
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        "http://127.0.0.1:8000/transcriptions"
      ).catch((error) => {
        console.error("Error:", error);
        setDisplayMsg("Unable to access database");
      });
      if (response && response.ok) {
        setDisplayMsg("No past transcription records");
        const resp = await response.json();
        setData(resp);
      }
    }
    fetchData();
  }, []);

  if (data.length === 0) {
    // Display error message when no data is found
    return (
      <div>
        <p>{displayMsg}</p>
      </div>
    );
  } else
      return (
        <div>
          <table>
            <thead>
              <tr>
                <th>Filename</th>
                <th>Transcription</th>
                <th>Created at</th>
              </tr>
            </thead>
            <tbody>
              {data.map((t, index) => {
                return (
                  <tr key={index}>
                    <td>{t.file_name}</td>
                    <td>{t.transcription}</td>
                    <td>{t.created_at}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
    );
}
export default Viewall;
