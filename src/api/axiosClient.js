import axios from "axios";
// https://love-comic.herokuapp.com/api/
// http://localhost:3001/api/
const axiosClient = axios.create({
    baseURL: "https://api-my-comics.herokuapp.com/api/",
    headers: {
        "Content-Type": "application/json"
    },
})

export default axiosClient
