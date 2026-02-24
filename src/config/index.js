import axios from "axios";

export const BASE_URL = "https://sociallybackend12.vercel.app/";
export const clientServer=axios.create({
    baseURL:BASE_URL,
})