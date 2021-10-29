import axiosClient from "./axiosClient";
import axios from "axios";
const userApi = {
    register: (user) => {
        const url = "/users";
        return axiosClient.post(url, user);
    },
    login: (user_email, user_password) => {
        const url = "/login";
        return axiosClient.post(url, {
            user_email: user_email,
            user_password: user_password,
        });
    },
    logout: (token) => {
        const url = "/logout";
        return axiosClient.post(url, {}, { headers: { Authorization: `Bearer ${token}` } });
    },
    refreshToken: (refreshCookie) => {
        const url = "/refresh-token";
        return axiosClient.post(url, {
            refreshToken: refreshCookie,
        });
    },
    update: (user_name, token) => {
        const url = "/users/";
        return axiosClient.patch(
            url,
            {
                user_name: user_name,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }
        );
    },
    updateUserImage: (token, data) => {
        const url = "https://love-comic-api.herokuapp.com/api/users/";
        return axios.patch(
            url,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                data: data
            }
        );
    },

};
export default userApi;