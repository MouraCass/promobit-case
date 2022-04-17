import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3/'


export const api = axios.create({
    baseURL: BASE_URL 
})
    