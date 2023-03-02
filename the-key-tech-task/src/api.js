import axios from "axios";

export const getHelloWorld = async () => {
  const response = await axios.get("http://localhost:5000");
  return response.data;
};
