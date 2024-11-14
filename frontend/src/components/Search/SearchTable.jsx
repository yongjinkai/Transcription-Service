import "./Search.css";
// import "bootstrap/dist/css/bootstrap.min.css";
function SearchTable({ searchTableDisplay, searchResults }) {
  if (!searchTableDisplay) return null;
  if (searchResults.length === 0)
    return (
      <div>
        <p>No matching results found</p>
      </div>
    );
  return (
    <div className="tableDiv">
      <table>
        <thead>
          <tr>
            <th>Filename</th>
            <th>Transcription</th>
            <th>Created at</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.map((r, index) => {
            return (
              <tr key={index}>
                <td>{r.file_name}</td>
                <td>{r.transcription}</td>
                <td>{r.created_at}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default SearchTable;
