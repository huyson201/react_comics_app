import axiosClient from "./axiosClient";
import comicApi from "./comicApi";
const chapApi = {
    getChapters: async (comicId) => {
        try {
            const res = await comicApi.getComicByID(comicId);
            if (res.data.data) {
                return res.data.data.chapters
            }
        } catch (error) {
            return error
        }
    }

};
export default chapApi;
