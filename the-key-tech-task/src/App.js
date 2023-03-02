import React, { useEffect, useState } from "react";
import { getHelloWorld } from "./api";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    getHelloWorld().then((response) => {
      setMessage(response);
    });
  }, []);

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
}

export default App;
