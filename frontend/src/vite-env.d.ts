/// <reference types="vite/client" />

type Eip6963Extension = {
    on: Function<string, Function>
}

interface Window {
    ethereum?: import('ethers').Eip1193Provider & Eip6963Extension;
}