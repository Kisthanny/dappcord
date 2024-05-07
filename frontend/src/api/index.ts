import axios from "axios";

export type RecommendServer = {
    owner: string;
    address: string;
    name: string;
    symbol: string;
}

export const getRecommendServers = async () => {
    const response = await axios.get('/api/server');
    if (response.status !== 200) {
        throw new Error(response.statusText)
    }
    return response.data as RecommendServer[]
}