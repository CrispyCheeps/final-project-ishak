import axios from "@/helpers/axios"; // Assuming axios is configured with baseURL

export const getPromo = () => {
  return axios
    .get("/api/v1/promos", {
      headers: {
        apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
      },
    })
    .then((res) => {
      console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      console.error(err);
      throw err; // Re-throw the error to be handled by the caller
    });
};
