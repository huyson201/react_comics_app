import axiosClient from "./axiosClient";

const comment = {
    getByParentId: (parentId) => {
        return axiosClient.get(`/comments?parentId=${parentId}`)
    },

    getById: (commentId) => {
        return axiosClient.get(`/comments/${commentId}`)
    }
}

export default comment