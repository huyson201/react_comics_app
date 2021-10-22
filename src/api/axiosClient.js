import axios from 'axios'
const axiosClient = axios.create({
    baseURL: "http://love-comic-api.herokuapp.com/api/",
    headers: {
        "Content-Type": "application/json"
    },
})
export default axiosClient