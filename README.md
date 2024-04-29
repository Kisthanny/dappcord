# DAPP Discord Mock Demo

This project demonstrates a blockchain chatroom application mimicking Discord.
User could create their own servers and channels.

Here are steps to fire up this application locally:

First, set your terminal root in the /backend folder.
```shell
npx hardhat node
```
Keep this terminal running and open up another one
```shell
npm run deploy
```

Now switch root to /frontend folder.
```shell
npm run dev
```

Open your browser, make sure you have MetaMask installed.

Go to MetaMask settings -> Networks -> manually add network.



make sure to fill up these two
```
New RPC URL: http://127.0.0.1:8545/
Chain ID: 31337
```

save it.


visit http://localhost:5173/


feel free to play with it.
