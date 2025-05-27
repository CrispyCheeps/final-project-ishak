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
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c", // ✅ Custom header
        },
      }
    )
    .then((res) => {
      console.log(res.data); // ✅ Logs response
      return res.data;
    })
    .catch((err) => {
      console.log(err); // ⚠️ This line will not be reached after `throw err`
      throw err;
    });
};
