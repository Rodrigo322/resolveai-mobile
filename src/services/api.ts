import axios from "axios";

export const api = axios.create({
  baseURL: "https://api-v1-resolveai.herokuapp.com",
});
