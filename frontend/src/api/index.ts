import axios from "axios";

export type RecommendServer = {
    owner: string;
    address: string;
    name: string;
    symbol: string;
}

type AddServerBody = {
    owner: string;
    address: string;
    name: string;
    symbol: string
}

type AddServerCollectionByUserBody = {
    user: string;
    server: string;
}

type LoginResponse = {
    _id: string;
    address: string;
    token: string;
}

const SUCCESS = {
    message: 'success'
}

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

export const addServer = async (server: AddServerBody) => {
    const response = await axios.post('/api/server/add', server);
    if (response.status !== 200) {
        throw new Error(response.statusText)
    }
    return SUCCESS
}

export const addServerCollectionByUser = async (body: AddServerCollectionByUserBody) => {
    const response = await axios.post('/api/user/addServerCollection', body);
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