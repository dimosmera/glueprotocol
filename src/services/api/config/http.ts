import axios from "axios";

const http = (timeout?: number) =>
  axios.create({
    timeout: timeout || 15000,
    headers: {
      "Content-Type": "application/json",
    },
  });

export default http;
