import axiosClient from "./axiosClient";
const salesApi = {
  getAll() {
    const url = `/sales_order/list`;
    return axiosClient.post(url);
  },
  post(params) {
    const url = `/sales_order/`;
    return axiosClient.post(url, params);
  },
  edit(id, data2) {
    const url = `/sales_order/${id}`;
    return axiosClient.put(url, data2);
  },
  delete(id) {
    const url = `/sales_order/${id}`;
    return axiosClient.delete(url);
  },
  deleteMultiple(listId) {
    const url = `/sales_order/delete`;
    return axiosClient.post(url, listId);
  },
  search(name) {
    const url = `/sales_order/search/${name}?contactName=${name}`;
    return axiosClient.get(url);
  },
};
export default salesApi;
