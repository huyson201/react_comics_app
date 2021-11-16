import axios from "axios";
// https://love-comic.herokuapp.com/api/
// http://localhost:3001/api/
const axiosClient = axios.create({
    baseURL: "http://localhost:3001/api/",
    headers: {
        "Content-Type": "application/json"
    },
})

export default axiosClient
