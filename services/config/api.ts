import axios from 'axios';
const api = axios.create({
    baseURL: process.env.EXPO_BASE_API_URL,
    timeout: 10000
})

api.interceptors.request.use(async (config) => {
    // You can add any headers or configurations here
    // config.headers.Authorization = `Bearer ${token}`; // Example of adding an Authorization header
    return config;
});

api.interceptors.response.use(async (config) => {
    // You can handle the response here if needed
    return config;
});

export default api;

//accesstoken - 1h uparima
// refresh token - 7 days uparima