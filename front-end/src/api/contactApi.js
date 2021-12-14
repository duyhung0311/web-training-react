import axiosClient from "./axiosClient";
class ContactApi{
  getAll=(params)=> {
    const url = `/contacts/list`;
    return axiosClient.post(url,{},{
      headers: {
        Authorization: `Bearer ${params}`,
      },
    });
  };
  post=(params)=> {
    const url = `/contacts/`;
    return axiosClient.post(url, params);
  };
  edit=(id, data2)=> {
    const url = `/contacts/${id}`;
    return axiosClient.put(url, data2);
  };
  deleteOne=(id)=>{
    const url =`/contacts/${id}`;
    return axiosClient.delete(url);
  };
  deleteMultiple=(listId)=>{
    const url =`/contacts/delete`
    return axiosClient.post(url,listId)
  };
  search=(name)=>{
    const url = `/contacts/search/${name}?contactName=${name}`;
    return axiosClient.get(url)
  }
};
const contactApi = new ContactApi();
export default contactApi;
