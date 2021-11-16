import axiosClient from "./axiosClient";

const comment = {
    getByParentId: (parentId) => {
        return axiosClient.get(`/comments?parentId=${parentId}`)
    }
}

export default comment