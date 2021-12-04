import { LIMIT } from "../constants";
import axiosClient from "./axiosClient";
const comicApi = {
  getAll: (offset) => {
    const url = "/comics";
    return axiosClient.get(url, {
      params: { limit: LIMIT, offset: offset, sort: "updatedAt:desc" },
    });
  },
  getAllCategories: () => {
    const url = "/categories";
    return axiosClient.get(url);
  },
  getCategoriesByKey: (key) => {
    const url = `/categories/search?q=${key}`;
    return axiosClient.get(url);
  },
  getCategoryById: (id) => {
    const url = "/categories/" + id;
    return axiosClient.get(url);
  },
  getComicsByCategory: (id, offset) => {
    const url = `/categories/${id}/comics`;
    return axiosClient.get(url, { params: { limit: LIMIT, offset: offset } });
  },
  getComicsByKeyword: (key, offset) => {
    const url = `/comics/search?q=${key}`;
    return axiosClient.get(url, { params: { limit: LIMIT, offset: offset } });
  },
  getComicByID: (id) => {
    const url = `/comics/${id}`;
    return axiosClient.get(url);
  },
  getComicByFilters: (categories, status, offset, sort) => {
    let sortParams = "";
    if (+sort === 0) {
      sortParams = "updatedAt:desc";
    } else if (+sort === 1) {
      sortParams = "comic_name:asc";
    } else {
      sortParams = "comic_name:desc";
    }
    const url = `/comics/filter?categories=[${categories}]&status=${status}&sort=${sortParams}`;
    return axiosClient.get(url, { params: { limit: LIMIT, offset: offset } });
  },
  getChapterByID: (id) => {
    const url = `/chapters/${id}`;
    return axiosClient.get(url);
  },
  getRecommend: (offset) => {
    const url = "/comics";
    return axiosClient.get(url, {
      params: { limit: 10, offset: offset, sort: "updatedAt:desc" },
    });
  },
  getCommentsByComicID: (id) => {
    const url = `comics/${id}/comments?sort=updatedAt:asc`;
    return axiosClient.get(url);
  },
  getSubComment: (id, parentId, option) => {
    let url = `comics/${id}/comments?sort=createdAt:asc&parent_id=${parentId}`;
    if (option) {
      url += `&${option}`;
    }
    return axiosClient.get(url);
  },
  createComment: (id, content, parentId = 0, userToken) => {
    const url = "/comments";
    return axiosClient.post(
      url,
      { comic_id: id, comment_content: content, parent_id: parentId },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
  },
  createComic: (data, userToken) => {
    const url = "/admin/comics";
    return axiosClient.post(url, data, {
      headers: {
        "Content-Type": `multipart/form-data`,
        Authorization: `Bearer ${userToken}`,
      },
    });
  },
  updateComic: (id, data, userToken) => {
    const url = `/admin/comics/${id}`;
    return axiosClient.patch(url, data, {
      headers: {
        "Content-Type": `multipart/form-data`,
        Authorization: `Bearer ${userToken}`,
      },
    });
  },
  deleteComic: (id, token) => {
    const url = `/admin/comics/${id}`;
    return axiosClient.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
export default comicApi;
