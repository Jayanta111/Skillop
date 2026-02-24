import axios from "axios";

export const BASE_URL = "https://sociallybackend.onrender.com";
export const clientServer=axios.create({
    baseURL:BASE_URL,
})