import express from "express";
import cors from "cors";
import axios from "axios";
import { WebSocketServer, WebSocket } from "ws";
import {
  API_FETCH_INTERVAL,
  WORDPRESS_API_URL,
  getWordCountMap,
} from "./utils.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let posts = [];

let clientConnected = false;

// This function fetches blog posts from the specified wordpress page
const fetchPosts = async () => {
  try {
    // This if statement is only for testing purposes to actually visualize the event of a new post being fetched
    if (clientConnected) {
      const response = await axios.get(`${WORDPRESS_API_URL}?_embed`);
      console.log("Fetched posts from the WordPress API");

      // Simulates new posts by successively processing only 1 post in each call of "fetchPosts" until all posts are fetched
      const simulatedPostsLength = posts.length + 1;
      const simulatedPosts = response.data.slice(0, simulatedPostsLength);

      // Filters for posts that are not yet in the current posts array, and computes its word-count map
      const newPosts = simulatedPosts //replace 'simulatedPosts' with 'response.data' to prevent the simulation from happening
        .filter((post) => {
          return !posts.find((p) => p.id === post.id);
        })
        .map((post) => {
          return {
            id: post.id,
            title: post.title.rendered,
            wordCountMap: getWordCountMap(post.content.rendered),
          };
        });

      // Adds new posts to the beginning of the global posts array
      posts = [...newPosts, ...posts];

      // In case there were new posts, sends the updated posts array to all connected clients
      if (newPosts.length > 0) {
        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            console.log("NEW DATA SENT WITH WEBSOCKET");
            client.send(JSON.stringify(posts));
          }
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
};

// Fetches all available posts when the server starts and then at a regular interval defined by API_FETCH_INTERVAL
fetchPosts();
setInterval(fetchPosts, API_FETCH_INTERVAL);

// Creates a WebSocketServer on port 8080 for any client to connect
const wss = new WebSocketServer({ port: 8080 });

// Handles WebSocket connections
wss.on("connection", function connection(ws) {
  console.log("Client connected");

  // Sends the current posts array to the new client, after a connection is established
  ws.send(JSON.stringify(posts));
  clientConnected = true;

  // Handles WebSocket disconnections
  ws.on("close", function () {
    console.log("Client disconnected");
  });
});

// Starts the express server and returns the server instance
const server = app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

export default server;
