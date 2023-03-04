import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  // Set up a mock WebSocket before each test
  beforeEach(() => {
    // Use Jest's `spyOn` to replace the global WebSocket constructor with a mock implementation
    jest.spyOn(global, "WebSocket").mockImplementation(() => ({
      addEventListener: jest.fn(), // Mock the WebSocket's `addEventListener` method
      close: jest.fn(), // Mock the WebSocket's `close` method
    }));
  });

  // Clean up the mock WebSocket after each test
  afterEach(() => {
    global.WebSocket.mockRestore();
  });

  // Test that a post with a chart is rendered
  it("renders a post with a chart", async () => {
    // Define a mock post object
    const mockPost = {
      id: 1,
      title: "First blog post",
      wordCountMap: {
        hello: 1,
        world: 1,
      },
    };

    // Send a mock post object
    global.WebSocket.mockImplementation(() => ({
      addEventListener: jest.fn((event, cb) => {
        if (event === "message") {
          cb({ data: JSON.stringify([mockPost]) });
        }
      }),
      close: jest.fn(),
    }));

    render(<App />);

    // Expect the title of the mock post to be rendered
    expect(await screen.findByText(/First blog post/i)).toBeInTheDocument();
  });
});
