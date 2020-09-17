import axios from "axios";
export const register = async (newUser) => {
  return await axios
    .post("http://localhost:3056/api/create", {
      userName: newUser.userName,
      email: newUser.email,
      password: newUser.password,
      confirm_password: newUser.confirm_password,
    })
    .then((response) => {
      console.log("Registered");
    });
};

export const login = async (user) => {
  return await axios
    .post("http://localhost:3056/api/login", {
      email: user.email,
      password: user.password,
    })
    .then((response) => {
      localStorage.setItem("token", response.data);
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });
};
