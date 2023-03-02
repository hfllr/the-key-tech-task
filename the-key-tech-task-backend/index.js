const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); //allow resource sharing between front- and backend
app.use(express.json()); //parses incoming requests with JSON payloads

const WORDPRESS_API_URL = "https://www.thekey.academy/wp-json/wp/v2/posts";

let posts = [];

const countWords = (text) => {
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

  return wordCountMap;
};

const fetchPosts = async () => {
  try {
    const response = await axios.get(`${WORDPRESS_API_URL}?_embed`);
    posts = response.data.map((post) => {
      return {
        id: post.id,
        title: post.title.rendered,
        wordCountMap: countWords(post.content.rendered),
        date: post.date,
        author: post.author,
        featuredImage: post._embedded["wp:featuredmedia"]
          ? post._embedded["wp:featuredmedia"][0].source_url
          : null,
      };
    });
    console.log("Fetched posts from the WordPress API");
    return posts;
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
