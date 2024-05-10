import axios from "axios";

export type RecommendServer = {
    owner: string;
    address: string;
    name: string;
    symbol: string;
}

type LoginResponse = {
    _id: string;
    address: string;
    token: string;
}

const SUCCESS = {
    message: 'success'
}

axios.interceptors.request.use(
    function (config) {
        const token = sessionStorage.getItem('token');

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
)

export const getRecommendServers = async () => {
    const response = await axios.get('/api/server');
    if (response.status !== 200) {
        throw new Error(response.statusText)
    }
    return response.data as RecommendServer[]
}

export const getServerCollectionByUser = async (address: string) => {
    const response = await axios.get(`/api/user/serverCollection/${address}`);
    if (response.status !== 200) {
        throw new Error(response.statusText)
    }
    return response.data as string[]
}

export const addServer = async (address: string) => {
    const response = await axios.post('/api/server/add', { address });
    if (response.status !== 200) {
        throw new Error(response.statusText)
    }
    return SUCCESS
}

export const addServerCollectionByUser = async (server: string) => {
    const response = await axios.post('/api/user/addServerCollection', { server });
    if (response.status !== 200) {
        throw new Error(response.statusText)
    }
    return SUCCESS
}

export const login = async (address: string, signature: string) => {
    const response = await axios.post('/api/user/login', {
        address,
        signature
    })
    console.log(response)
    if (response.status !== 201) {
        throw new Error(response.statusText)
    }
    return response.data as LoginResponse
}