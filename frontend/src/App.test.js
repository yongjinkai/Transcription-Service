import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";
import Upload from "./components/Upload/Upload";
import { wait } from "@testing-library/user-event/dist/utils";
import Search from "./components/Search/Search";
test("App renders with header, description, and buttons", () => {
  render(<App />);
  expect(screen.getByText(/Audio Transcription App/i)).toBeInTheDocument();
  expect(
    screen.getByText(/Upload your audio file\(s\) to transcribe them/i)
  ).toBeInTheDocument();
  expect(screen.getByText("Upload Audio File")).toBeInTheDocument();
  expect(screen.getByText("View All Transcriptions")).toBeInTheDocument();
  expect(screen.getByText("Search Transcriptions")).toBeInTheDocument();
});

// Tests file upload and submit button rendering correctly, as well as call to the correct API
test("submits form and handles successful response", async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          { file_name: "test-audio.mp3", transcription: "Test transcription" },
        ]),
    })
  );

  render(<Upload />);

  // Set up mock file selection
  const fileInput = screen.getByTestId("inputbox");
  const file = new File(["test content"], "test-audio.wav", {
    type: "audio/mp3",
  });
  fireEvent.change(fileInput, { target: { files: [file] } });

  // Click transcribe button to submit form
  const transcribeButton = screen.getByText("Transcribe");
  fireEvent.click(transcribeButton);

  // Check that loading spinner appears
  expect(screen.getByRole("status")).toBeInTheDocument();

  // Wait for the response and check that transcription appears
  await waitFor(() => {
    expect(screen.getByText("Test transcription")).toBeInTheDocument();
  });

  // Check that the loading spinner has disappeared
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledWith(
    "http://127.0.0.1:8000/transcribe",
    expect.anything()
  );
});

test("Submits search query to the correct API", async () => {
  global.fetch = jest.fn(() => Promise.resolve({}));
  render(<Search />);
  fireEvent.change(screen.getByTestId("searchbar"), {
    target: { value: "test-audio" },
  });
  fireEvent.click(screen.getByTestId("search-button"));
  expect(global.fetch).toHaveBeenCalledWith(
    "http://127.0.0.1:8000/search?query=test-audio",
    expect.anything()
  );
});
