import { providers } from "ethers";
import { Worker } from "node:worker_threads";

import { workerFileName } from "./worker.js";

const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const API_BASE_URL = process.env.API_BASE_URL;

const provider = new providers.InfuraProvider("mainnet", INFURA_PROJECT_ID);

const blockQueue: number[] = [];

export function startBlockMonitor() {
  console.log("Starting Ethereum block monitor...");

  provider.on("block", (blockNumber: number) => {
    console.log(`Processing block ${blockNumber}`);
    blockQueue.push(blockNumber);
    console.log({ blockQueue });
    processBlock().catch(console.error);
  });
}

async function processBlock() {
  const blockNumber = blockQueue[blockQueue.length - 1];
  if (!blockNumber) {
    return;
  }

  const worker = new Promise<{ blockNumber: number }>((resolve, reject) => {
    const worker = new Worker(workerFileName, {
      workerData: {
        apiBaseUrl: API_BASE_URL,
        blockCount: blockQueue.length,
        blockNumber,
        infuraProjectId: INFURA_PROJECT_ID,
      },
    });

    worker.addListener("message", (result) => {
      resolve(result as { blockNumber: number });
    });
    worker.addListener("error", reject);
  });

  worker
    .then((result) => {
      if (result.blockNumber === blockNumber) {
        blockQueue.shift();
      }
    })
    .catch(console.error);

  return worker;
}

startBlockMonitor();
