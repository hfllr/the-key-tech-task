const express = require("express");
const cors = require("cors");
const axios = require("axios");
const WebSocket = require("ws");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const WORDPRESS_API_URL = "https://www.thekey.academy/wp-json/wp/v2/posts";

let posts = [];

const getWordCountMap = (text) => {
  const words =
    text
      .toLowerCase()
      .replace(/(<([^>]+)>)/gi, "")
      .match(/[a-zA-Zäöüß]+/g) || [];
  const wordCountMap = {};

  words.forEach((word) => {
    if (!wordCountMap[word]) {
      wordCountMap[word] = 1;
    } else {
      wordCountMap[word]++;
    }
  });

  // Converts the wordCountMap object into an array of key-value pairs and sorts it
  const sortedWordCountArray = Object.entries(wordCountMap).sort(
    (a, b) => b[1] - a[1]
  );

  // Converts the sortedWordCountArray back into an object
  const sortedWordCountMap = Object.fromEntries(sortedWordCountArray);

  return sortedWordCountMap;
};

const fetchPosts = async () => {
  try {
    const response = await axios.get(`${WORDPRESS_API_URL}?_embed`);
    console.log("Fetched posts from the WordPress API");

    const newPosts = response.data
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

    posts = [...posts, ...newPosts];

    if (newPosts.lenght > 0) {
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
setInterval(fetchPosts, 5000);

const wss = new WebSocket.Server({ port: 8080 });

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
