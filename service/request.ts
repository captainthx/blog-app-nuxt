import axios from "axios";

const create = () => {
  return axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });
};

const client = create();

export { client as default, create };
