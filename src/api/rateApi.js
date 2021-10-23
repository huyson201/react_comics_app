import axiosClient from "./axiosClient";
const rateApi = {
  rateComic: (comicId, token, starIndex) => {
    const url = "/rates";
    return axiosClient.post(
      url,
      {
        comic_id: comicId,
        rate_star: `${+starIndex + 1}`,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
  getRateComic: (userId, comicId) => {
    const url = `/rates?user_uud=${userId}&comic_id=${comicId}`;
    return axiosClient.get(url);
  },
};
export default rateApi;
