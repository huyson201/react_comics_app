import { LIMIT } from "../constants";
import axiosClient from "./axiosClient";
const chapApi = {
    getChapterByComicId: (comicId, offset) => {
        const url = `/chapters/comics/${comicId}`
        return axiosClient.get(url, {
            params: { limit: LIMIT, offset: offset, sort: "createdAt:desc" },
        })
    },
    create: (comicId, formData, token) => {
        const url = `/chapters/comics/${comicId}/add`
        return axiosClient.post(url, formData,
            {
                headers: {
                    'Content-Type': `multipart/form-data`,
                    Authorization: `Bearer ${token}`,
                },
            })
    },
    delete: (chapId, token) => {
        const url = `/admin/chapters/delete/${chapId}`
        return axiosClient.delete(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    },
    update: (chapId, token) => {
        const url = `/chapters/update/${chapId}`
        return axiosClient.post(url, {
            headers: {
                'Content-Type': `multipart/form-data`,
                Authorization: `Bearer ${token}`,
            },
        })
    }
};
export default chapApi;
