import axiosClient from "./axiosClient";
const followApi = {
  followComics: (comicId, userToken) => {
    console.log(userToken)
    const url = "/follows";
    return axiosClient.post(
      url,
      { comic_id: comicId },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
  },
  getFollowUser: (id, userToken, params) => {
    const url = `/users/${id}/follows`;
    return axiosClient.get(
      url,
      { params },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
  },
};
export default followApi;
