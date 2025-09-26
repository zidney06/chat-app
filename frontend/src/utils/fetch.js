import axios from "axios";

const url = window.location.href;
const baseUrl = url.slice(0, -1);

export const getFetch = async (url) => {
  const token = sessionStorage.getItem("waclone-token");

  try {
    const res = await axios.get(baseUrl + url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    return { ...res, success: true };
  } catch (err) {
    console.log(err);
    return { ...err, success: false };
  }
};

export const postFetch = async (url, data) => {
  const token = sessionStorage.getItem("waclone-token");

  try {
    const res = await axios.post(baseUrl + url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    return { ...res, success: true };
  } catch (err) {
    console.log(err);
    return { ...err, success: false };
  }
};

export const putfetch = async (url, data) => {
  const token = sessionStorage.getItem("waclone-token");

  try {
    const res = await axios.put(baseUrl + url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    return { ...res, success: true };
  } catch (err) {
    console.log(err);
    return { ...err, success: false };
  }
};

export const delFetch = async (url, data) => {
  const token = sessionStorage.getItem("waclone-token");

  try {
    const res = await axios.delete(baseUrl + url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    return { ...res, success: true };
  } catch (err) {
    console.log(err);
    return { ...err, success: false };
  }
};
