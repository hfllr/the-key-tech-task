import React, { useEffect, useState } from "react";

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
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
