import { LIMIT } from "../constants";
import axiosClient from "./axiosClient";
const chapApi = {
    getChapterByComicId: (comicId, offset) => {
        const url = `/chapters/comics/${comicId}`
        return axiosClient.get(url, {
            params: { limit: LIMIT, offset: offset, sort: "createdAt:desc" },
        })
    },
    create: (formData, options) => {
        const url = `/admin/chapters`
        return axiosClient.post(url, formData, options)
    },
    delete: (chapId, token) => {
        const url = `/admin/chapters/delete/${chapId}`
        return axiosClient.delete(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    },
    updateImg: (chapId, options, formData) => {
        const url = `/admin/chapters/image/${chapId}`
        return axiosClient.post(url, formData, options)
    },
  
};
export default chapApi;
