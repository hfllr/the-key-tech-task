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

const processNewPost = (post) => {
  const newPost = {
    id: post.id,
    title: post.title.rendered,
    wordCountMap: getWordCountMap(post.content.rendered),
  };

  posts.unshift(newPost);

  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      console.log("NEW DATA SENT WITH WEBSOCKET");
      client.send(JSON.stringify(posts));
    }
  });
};

const subscribeToWordPressUpdates = () => {
  const eventSource = new EventSource(`${WORDPRESS_API_URL}/posts/events`);

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

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws) {
  console.log("Client connected");

  ws.send(JSON.stringify(posts));

  ws.on("close", function () {
    console.log("Client disconnected");
  });
});

// Proxy requests to the WordPress API
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

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
