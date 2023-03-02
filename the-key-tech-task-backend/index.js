const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); //allow resource sharing between front- and backend
app.use(express.json()); //parses incoming requests with JSON payloads

const WORDPRESS_API_URL = "https://www.thekey.academy/wp-json/wp/v2/posts";

let posts = [];

const fetchPosts = async () => {
  try {
    const response = await axios.get(WORDPRESS_API_URL);
    console.log("fetched posts");
    posts = response.data;
  } catch (error) {
    console.error(error);
  }
};

fetchPosts();
setInterval(fetchPosts, 5000);

app.get("/posts", (req, res) => {
  res.json(posts);
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
