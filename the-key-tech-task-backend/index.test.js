import request from "supertest";
import axios from "axios";
import WebSocket from "ws";
import server from "./index.js";
import { WORDPRESS_API_URL, getWordCountMap } from "./utils.js";

describe("Backend Tests", () => {
  // Test for checking if server starts running without errors (should return 404 as there is no / endpoint defined)
  test("It should respond with a 200 status code", async () => {
    const res = await request(server).get("/");
    expect(res.status).toEqual(404);
  });

  // Test if WebSocket connection is working
  test("WebSocket connection is established", async () => {
    const client = new WebSocket("ws://localhost:8080");
    client.on("open", function () {
      expect(client.readyState).toBe(WebSocket.OPEN);
      client.close();
    });
  });

  // Test for checking if api is available
  test("Test WordPress API", async () => {
    const response = await axios.get(WORDPRESS_API_URL);
    expect(response.status).toEqual(200);
  });

  // Test for checking if the function getWordCountMap computes the word count correctly
  test("Compute the word count of a blog post", () => {
    const postContent =
      "<p>Lorem ipsum ipsum ipsum dolor <div>sit</div> amet, consectetur; <br> adipiscing</br> adipiscing elit.</p>";
    const wordCountMap = getWordCountMap(postContent);
    expect(wordCountMap).toEqual({
      lorem: 1,
      ipsum: 3,
      dolor: 1,
      sit: 1,
      amet: 1,
      consectetur: 1,
      adipiscing: 2,
      elit: 1,
    });
  });
});
