import axiosClient from "./axiosClient";
const authApi = {
  login(params) {
    const url = `/signin`;
    return axiosClient.post(url, params);
  },
  profile(token) {
    const url = `/userProfile`;
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  doLogout() {
    localStorage.removeItem("Token");
    localStorage.removeItem("admin");
    localStorage.removeItem("user");
  },
};
export default authApi;
