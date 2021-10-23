import axios from "axios";
// https://love-comic-api.herokuapp.com/api/
const axiosClient = axios.create({
    baseURL: "http://love-comic-api.herokuapp.com/api/",
    headers: {
        "Content-Type": "application/json"
    },
})
export default axiosClient
