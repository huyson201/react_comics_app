import { LIMIT } from "../constants";
import axiosClient from "./axiosClient";
const chapApi = {
    getChapterByComicId: (comicId, offset) => {
        const url = `/chapters/comics/${comicId}`
        return axiosClient.get(url, {
            params: { limit: LIMIT, offset: offset, sort: "createdAt:desc" },
        })
    },
    create: (comic_id, chapter_name, chapter_imgs, token) => {
        console.log(token);
        const url = `/admin/chapters/create`
        return axiosClient.post(url, {
            comic_id: comic_id,
            chapter_name: chapter_name,
            chapter_imgs: chapter_imgs
        }, {
            headers: {
                Authorization: `Bearer ${token}`
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
    updateImgs: (chapId, chapter_name, chapter_imgs, token) => {
        const url = `/admin/chapters/${chapId}`
        return axiosClient.patch(url, { chapter_name: chapter_name, chapter_imgs: chapter_imgs }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    },
    updateImg: (chapId, options, formData) => {
        const url = `/admin/chapters/img/${chapId}`
        return axiosClient.patch(url, formData, options)
    },
    upload: (formData, token) => {
        const url = `/admin/chapters/upload`
        return axiosClient.post(url, formData, {
            headers: {
                'Content-Type': `multipart/form-data`,
                Authorization: `Bearer ${token}`
            },
        })
    },
    deleteImg: (chapId, chapter_imgs, token) => {
        const url = `admin/chapters/delete/img/${chapId}`
        return axiosClient.patch(url, { chapter_imgs: chapter_imgs }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }

};
export default chapApi;
