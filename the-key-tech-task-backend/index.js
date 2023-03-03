import express from "express";
import cors from "cors";
import axios from "axios";
import { WebSocketServer, WebSocket } from "ws";
import { FETCH_INTERVAL, WORDPRESS_API_URL, getWordCountMap } from "./utils.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let posts = [];

const fetchPosts = async () => {
  try {
    const response = await axios.get(`${WORDPRESS_API_URL}?_embed`);
    console.log("Fetched posts from the WordPress API");

    const simulatedPostsLength = posts.length + 1;
    const simulatedPosts = response.data.slice(0, simulatedPostsLength);

    const newPosts = simulatedPosts
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

    posts = [...newPosts, ...posts];

    if (newPosts.length > 0) {
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          console.log("NEW DATA SENT WITH WEBSOCKET");
          client.send(JSON.stringify(posts));
        }
      });
    }
  } catch (error) {
    console.error(error);
  }
};

fetchPosts();
setInterval(fetchPosts, FETCH_INTERVAL);

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws) {
  console.log("Client connected");

  ws.send(JSON.stringify(posts));

  ws.on("close", function () {
    console.log("Client disconnected");
  });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
