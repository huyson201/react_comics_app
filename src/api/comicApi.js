import axiosClient from './axiosClient'
const comicApi={
    getAll: (params)=>{
        const url = "/comics";
        return axiosClient.get(url,{params})
    },
    getAllCategories: (params)=>{
        const url = "/categories";
        return axiosClient.get(url,{params})
    }
}
export default comicApi;