import axiosClient from "./axiosClient"

const api = {
    get: (id, token) => {
        const url = `/users/${id}/notifications`
        return axiosClient.get(url, { headers: { Authorization: `Bearer ${token}` } })
    },
    update: (id, data) => {
        const url = `/notifications/${id}`
        return axiosClient.patch(url, { notification: data })
    }
}
export default api