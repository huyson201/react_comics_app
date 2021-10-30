import axiosClient from "./axiosClient";
const userApi = {
    register: (user) => {
        const url = "/register";
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
        const url = "/users/";
        return axiosClient.patch(
            url,
            data,
            {
                headers: {
                    'Content-Type': `multipart/form-data`,
                    Authorization: `Bearer ${token}`
                },
            }
        );
    },
    changePassword: (old_password, new_password, token) => {
        const url = "/users/change-password"
        return axiosClient.patch(
            url,
            {
                old_password: old_password,
                new_password: new_password,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }
        );
    }

};
export default userApi;