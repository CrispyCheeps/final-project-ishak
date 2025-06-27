import axios from "@/helpers/axios"; // ✅ Assuming @ alias is configured correctly

export const login = (email, password) => {
  return axios
    .post(
      "/api/v1/login",  // ✅ Relative URL, will use baseURL from axios instance
      {
        email,
        password,
      },
      {
        headers: {
          "apiKey": "24405e01-fbc1-45a5-9f5a-be13afcd757c", // ✅ Custom header
        },
      }
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
