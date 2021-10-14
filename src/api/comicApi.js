import axiosClient from './axiosClient'
const comicApi={
    getAll: (params)=>{
        const url = "/comics";
        return axiosClient.get(url,{params})
    },
    getAllCategories: (params)=>{
        const url = "/categories";
        return axiosClient.get(url,{params})
    },
    getComicsByCategory: (id,params)=>{
        const url = `/categories/${id}/comics`;
        return axiosClient.get(url,{params})
    },
    getComicsByKeyword: (key)=>{
        const url = `/comics/search?q=${key}`;
        return axiosClient.get(url)
    },
}
export default comicApi;