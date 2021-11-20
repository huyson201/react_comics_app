import axiosClient from "./axiosClient";
const historyApi = {
  createHistory: (comicId, chapters, userToken) => {
    const url = "/histories";
    return axiosClient.post(
      url,
      { comic_id: comicId, chapters: chapters },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
  },
  getHistoryListOfUser: (id, userToken) => {
    const url = `/users/${id}/histories`;
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
  },
  getHistory: (user_id, comic_id) => {
    const url = `/histories?user_uuid=${user_id}&comic_id=${comic_id}`;
    return axiosClient.get(url);
  },
};
export default historyApi;
