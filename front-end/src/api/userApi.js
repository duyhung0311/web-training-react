import axiosClient from "./axiosClient";
const userApi = {
  getAll() {
    const url = `/user_management/`;
    return axiosClient.get(url);
  },
  post(params){
     const url = `/user_management/`;
     return axiosClient.post(url,params);
  },
  edit(id,data2){
     const url = `/user_management/${id}`;
     return axiosClient.put(url, data2);
  },
  getId(id){
    const url =`/user_management/${id}`;
    return axiosClient.get(url)
  },
  password(id,newPass){
    const url = `/user_management/${id}`;
    return axiosClient.post(url,{'newPass':newPass})
  }
};
export default userApi;
