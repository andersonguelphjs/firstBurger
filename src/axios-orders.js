import axios from "axios";

const instance = axios.create({
  baseURL: "https://react-my-burger-a575d-default-rtdb.firebaseio.com/",
  // headers: {
  //     "Access-Control-Allow-Origin": "*",
  // },
});

export default instance;
