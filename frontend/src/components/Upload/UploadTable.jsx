import "./Upload.css"
function UploadTable({ transcriptions }) {
  if (transcriptions.length === 0) return null; // do not show table if no transcriptions
  return (
    <table>
      <thead>
        <tr>
          <th>Filename</th>
          <th>Transcription</th>
        </tr>
      </thead>
      <tbody>
        {transcriptions.map((t, index) => {
          return (
            <tr key={index}>
              <td>{t.filename}</td>
              <td>{t.transcription}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default UploadTable;
