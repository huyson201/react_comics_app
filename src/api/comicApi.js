import { LIMIT } from '../constants';
import axiosClient from './axiosClient'
const comicApi={
    getAll: (offset)=>{
        const url = "/comics";
        return axiosClient.get(url,{params:{limit: LIMIT, offset:offset}})
    },
    getAllCategories: ()=>{
        const url = "/categories";
        return axiosClient.get(url)
    },
    getCategoryById: (id)=>{
        const url = "/categories/"+id;
        return axiosClient.get(url)
    },
    getComicsByCategory: (id,offset)=>{
        const url = `/categories/${id}/comics`;
        return axiosClient.get(url,{params:{limit: LIMIT, offset:offset}})
    },
    getComicsByKeyword: (key,offset)=>{
        const url = `/comics/search?q=${key}`;
        return axiosClient.get(url,{params:{limit: LIMIT, offset:offset}})
    },
    getComicByID: (id)=>{
        const url = `/comics/${id}`;
        return axiosClient.get(url);
    },
    getComicByFilters: (categories,status)=>{
        const url = `/comics/filter?categories=[${categories}]&status=${status}`;
        return axiosClient.get(url);
    },
    getChapterByID: (id)=>{
        const url = `/chapters/${id}`;
        return axiosClient.get(url);
    },
}
export default comicApi;