import appConstant from "./appConstant";
import { BL_BaseUrl } from "./webApi";

export const userLogin = async (phone, password) => {
  if (!phone) return;
  const res = await fetch(`${BL_BaseUrl}/auth/sign-in`, {
    method: "POST",
    body: JSON.stringify({ phone, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await res.json();
  if (res.ok && result.success) {
    return result;
  } else if (result.detail) {
    throw Error(result.detail);
  } else {
    throw Error("Server Error! Something went wrong please try again later");
  }
};

export const userVerifyOTP = async (otp) => {
  if (!otp) return;

  const res = await fetch(`${BL_BaseUrl}/auth/verify-otp/${otp}`);
  const result = await res.json();
  if (res.ok && result.success) {
    return result;
  } else if (result.detail) {
    throw Error(result.detail);
  } else {
    throw Error("Server Error! Something went wrong please try again later");
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem(appConstant.authToken);
  if (!token) {
    return false;
  }
  return { isLoggedIn: true, token };
};
