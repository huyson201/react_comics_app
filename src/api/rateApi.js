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
    const url = `/rates?user_uuid=${userId}&comic_id=${comicId}`;
    return axiosClient.get(url);
  },
  getSumRate: (comicId) => {
    const url = `/rates/sum?comic_id=${comicId}`
    return axiosClient.get(url)
  },
  updateRateComic: (rateId, rateStar, token, userId) => {
    const url = `/rates/${rateId}`
    return axiosClient.patch(url, { user_uuid: userId, rate_star: `${+rateStar + 1}` }, { headers: { Authorization: `Bearer ${token}` } })
  }
};
export default rateApi;
