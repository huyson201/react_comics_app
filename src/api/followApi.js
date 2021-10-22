import axiosClient from "./axiosClient";
const followApi = {
  followComics: (comicId, userToken) => {
    const url = "/comics";
    return axiosClient.post(
      url,
      { comic_id: comicId },
      {
        headers: {
          Authorization: "Bearer " + userToken,
        },
      }
    );
  },
};
export default followApi;
