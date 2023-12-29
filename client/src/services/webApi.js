import appConstant from "./appConstant";

let BL_BaseUrl = appConstant.DEV_BACKEND_URL;
let IMG_BASE_URL = appConstant.DEV_IMG_BASEURL;

if (appConstant.env === "production") {
  BL_BaseUrl = appConstant.PORD_BACKEND_URL;
  IMG_BASE_URL = appConstant.PORD_IMG_BASEURL;
}

console.log(appConstant.env, BL_BaseUrl);
export { BL_BaseUrl, IMG_BASE_URL };
