import axios from "axios";

export const getPosts = async () => {
  const response = await axios.get("http://localhost:5000/posts");
  return response.data;
};
