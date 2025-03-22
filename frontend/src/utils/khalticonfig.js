import axios from "axios";

export const KHALTI_CONFIG = {
  baseUrl: "https://a.khalti.com/api/v2",
  secretKey: "",
};

console.log(KHALTI_CONFIG);

export const khaltiClient = axios.create({
  baseURL: KHALTI_CONFIG.baseUrl,
  headers: {
    Authorization: `Key ${KHALTI_CONFIG.secretKey}`,
    "Content-Type": "application/json",
  },
});
