import React, { useEffect, useState } from "react";
import BlogPostData from "./BlogPostData";

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const blogPostSocket = new WebSocket("ws://localhost:8080");

    blogPostSocket.addEventListener("message", ({ data }) => {
      console.log("Received message from server");
      setPosts(JSON.parse(data));
    });

    return () => {
      blogPostSocket.close();
    };
  }, []);

  return (
    <div>
      {posts.map((post) => {
        return <BlogPostData key={post.id} post={post} />;
      })}
    </div>
  );
}

export default App;
