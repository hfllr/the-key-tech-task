import React, { useEffect, useState } from "react";
import BlogPostData from "./BlogPostData";

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // establishes a WebSocket connection to the backend
    const blogPostSocket = new WebSocket("ws://localhost:8080");

    // listens for messages from the server
    blogPostSocket.addEventListener("message", ({ data }) => {
      console.log("Received message from server: ");
      console.log(JSON.parse(data));

      // updates the state with the received data only for new data
      setPosts(JSON.parse(data));
    });

    // closes the WebSocket connection on unmounting of the component
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
