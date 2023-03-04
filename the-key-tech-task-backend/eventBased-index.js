import express from "express";
import cors from "cors";
import axios from "axios";
import { WebSocketServer, WebSocket } from "ws";
import EventSource from "eventsource";
import { createProxyMiddleware } from "http-proxy-middleware";
import { WORDPRESS_API_URL, getWordCountMap } from "./utils.js";

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let posts = [];

// This function processes a new WordPress post and updates the WebSocket clients
const processNewPost = (post) => {
  // constructs an object using the id, title, and word-count map of the post
  const newPost = {
    id: post.id,
    title: post.title.rendered,
    wordCountMap: getWordCountMap(post.content.rendered),
  };

  // adds the new post to the beginning of the posts array
  posts.unshift(newPost);

  // sends the updated posts array to all connected WebSocket clients
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      console.log("NEW DATA SENT WITH WEBSOCKET");
      client.send(JSON.stringify(posts));
    }
  });
};

// subscribes to updates of the specified url using Server-Sent Events (SSE)
const subscribeToWordPressUpdates = () => {
  // creates a new EventSource object that listens for WordPress post events
  const eventSource = new EventSource(`${WORDPRESS_API_URL}/posts/events`);

  // fetches the data and processes it when a new post is published
  eventSource.addEventListener("wp:post_new", (event) => {
    const postId = JSON.parse(event.data);
    axios
      .get(`${WORDPRESS_API_URL}/posts/${postId}?_embed`)
      .then((response) => {
        console.log(`Received new post with ID ${postId}`);
        const post = response.data;
        processNewPost(post);
      })
      .catch((error) => {
        console.error(`Failed to fetch post with ID ${postId}`, error);
      });
  });

  eventSource.addEventListener("open", (event) => {
    console.log("Subscribed to WordPress updates");
  });

  eventSource.addEventListener("error", (event) => {
    console.error("Failed to subscribe to WordPress updates", event);
  });
};

subscribeToWordPressUpdates();

// create a WebSocket server that listens on port 8080
const wss = new WebSocketServer({ port: 8080 });

// when a client connects to the WebSocket server, sends them the current posts array
wss.on("connection", function connection(ws) {
  console.log("Client connected");

  ws.send(JSON.stringify(posts));

  ws.on("close", function () {
    console.log("Client disconnected");
  });
});

// proxy requests to the WordPress API
app.use(
  "/wp-json",
  createProxyMiddleware({
    target: WORDPRESS_API_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/wp-json": "",
    },
  })
);

// starts the express server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
