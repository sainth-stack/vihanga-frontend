import axios from "axios";
import { AuthEmail } from "utilities";
import { api } from "./api";
let baseURL = "";
if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "") {
  //localhost
  baseURL = "local";
} else {
  baseURL = "ollaa-company";
}
export const axiosInstance = axios.create({
  headers: {},
});

export const logout = () => {
  axiosInstance.defaults.headers.common["Authorization"] = "";

  let user = api({
    method: "post",
    api: "users/logout",
    baseURL,
    body: { email: AuthEmail },
  });
  user
    .then((data) => {
      if (data.success) {
        localStorage.clear();
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 100);
      } else {
        console.log("Something went wrong");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
