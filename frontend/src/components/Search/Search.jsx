import "./Search.css";

import { useState } from "react";
import SearchTable from "./SearchTable";
function Search() {
  const [searchBar, setSearchBar] = useState(""); // useState for controlled input field
  const [searchResults, setSearchResults] = useState([]); //useState for results from API
  const [searchTableDisplay, setSearchTableDisplay] = useState(false); //useState for displaying search result
  const [serverError, setServerError] = useState(false); //useState to display error msg if unable to fetch
  function handleChange(e) {
    setSearchBar(e.target.value);
  }

  async function handleClick() {
    const response = await fetch(
      `http://127.0.0.1:8000/search?query=${searchBar}`,
      {
        method: "GET",
      }
    ).catch((error) => {
      console.error("Error:", error);
      setServerError(true);
    });

    setSearchTableDisplay(true);
    if (response && response.ok) {
      setServerError(false);
      const data = await response.json();
      setSearchResults(data);
    } else {
      setSearchResults([]);
    }
  }

  return (
    <div className="searchDiv">
      <h2>Search Transcriptions by file name</h2>
      <input
        type="text"
        name=""
        onChange={handleChange}
        value={searchBar}
        data-testid="searchbar"
      />
      <button onClick={handleClick} data-testid="search-button">
        Search
      </button>

      {!serverError ? (
        <SearchTable
          searchTableDisplay={searchTableDisplay}
          searchResults={searchResults}
        />
      ) : (
        <div>
          <p>Unable to access database</p>
        </div>
      )}
    </div>
  );
}
export default Search;
