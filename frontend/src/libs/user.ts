import { login } from "../api";

export const signIn = async (account: string) => {
    sessionStorage.removeItem('token')
    const ethereum = window.ethereum;
    try {
        if (!ethereum) {
            throw new Error('Please install Metamask')
        }
        const loginMessage = import.meta.env.VITE_SIGN_MESSAGE;
        const signature = await ethereum.request({
            method: "personal_sign",
            params: [loginMessage, account],
        });
        const response = await login(account, signature);
        sessionStorage.setItem("token", response.token)
    } catch (error) {
        console.error(error)
    }
}