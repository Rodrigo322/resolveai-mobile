import axios from "axios";

export const api = axios.create({
  baseURL: "https://api-resolveai-v1.herokuapp.com",
});
