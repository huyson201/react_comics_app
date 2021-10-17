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
    getComicsByKeyword: (key,params)=>{
        const url = `/comics/search?q=${key}`;
        return axiosClient.get(url,{params})
    },
    getComicByID: (id)=>{
        const url = `/comics/${id}`;
        return axiosClient.get(url);
    },
    getComicByFilters: (categories,status)=>{
        const url = `/comics/filter?categories=[${categories}]&status=${status}`;
        return axiosClient.get(url);
    },
}
export default comicApi;