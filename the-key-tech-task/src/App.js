import React, { useEffect, useState } from "react";
import BlogPost from "./Blogpost";

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const blogPostSocket = new WebSocket("ws://localhost:8080");

    blogPostSocket.addEventListener("message", (event) => {
      console.log("Received message from server:", event.data);

      setPosts(JSON.parse(event.data));
    });

    return () => {
      blogPostSocket.close();
    };
  }, []);

  return (
    <div>
      {posts.map((post) => {
        return <BlogPost post={post} />;
      })}
    </div>
  );
}

export default App;
