import React, { useEffect, useState } from "react";
import { getPosts } from "./api";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    getPosts().then((response) => {
      console.log(response);
    });
  }, []);

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
}

export default App;
