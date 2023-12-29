import { BL_BaseUrl } from "./webApi";

export const searchByText = async (searchQuery, pageSize, ratePer, dbType) => {
  let res;
  if (dbType === "Master") {
    res = await fetch(`${BL_BaseUrl}/master/search-image-with-text?searchText=${searchQuery}&pageSize=${pageSize}`);
  } else {
    res = await fetch(`${BL_BaseUrl}/search-image-with-text?searchText=${searchQuery}&pageSize=${pageSize}&ratePer=${ratePer}`);
  }
  const result = await res.json();
  if (res.ok && result.success) {
    return { result: result.result, message: "Images found" };
  } else if (result.detail) {
    throw Error(result.detail);
  } else {
    throw Error("Server Error! Something went wrong please try again later");
  }
};

export const getImages = async (imageType, pageSize, pageNo, ratePer) => {
  const res = await fetch(`${BL_BaseUrl}/get-db-images/${imageType}/${pageSize}/${pageNo}?ratePer=${ratePer}`);
  const result = await res.json();
  if (res.ok && result.success) {
    return result;
  } else if (result.detail) {
    throw Error(result.detail);
  } else {
    throw Error("Server Error! Something went wrong please try again later");
  }
};

export const searchByImage = async (binaryFile, pageSize, ratePer, dbType) => {
  let res;
  const formData = new FormData();
  formData.append("file", binaryFile);
  if (dbType === "Master") {
    res = await fetch(`${BL_BaseUrl}/master/search-image-with-image?pageSize=${pageSize}`, {
      method: "POST",
      body: formData,
    });
  } else {
    res = await fetch(`${BL_BaseUrl}/search-image-with-image?pageSize=${pageSize}&ratePer=${ratePer}`, {
      method: "POST",
      body: formData,
    });
  }

  const result = await res.json();
  if (res.ok && result.success) {
    return { result: result.result, message: "Images found" };
  } else if (result.detail) {
    throw Error(result.detail);
  } else {
    throw Error("Server Error! Something went wrong please try again later");
  }
};
