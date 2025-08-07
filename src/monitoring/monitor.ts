import { providers } from "ethers";
import { Worker } from "node:worker_threads";
import { workerFileName } from "./worker.js";

const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const API_BASE_URL = process.env.API_BASE_URL;

const provider = new providers.InfuraProvider("mainnet", INFURA_PROJECT_ID);

const blockQueue: number[] = [];

async function processBlock() {
  const blockNumber = blockQueue[blockQueue.length - 1];
  if (!blockNumber) {
    return;
  }

  const worker = new Promise((resolve, reject) => {
    const worker = new Worker(workerFileName, {
      workerData: {
        blockNumber,
        blockCount: blockQueue.length,
        infuraProjectId: INFURA_PROJECT_ID,
        apiBaseUrl: API_BASE_URL,
      },
    });

    worker.addListener("message", (result) => resolve(result));
    worker.addListener("error", reject);
  });

  worker.then((result: any) => {
    console.log(result);
    if (
      typeof result.blockNumber === "number" &&
      result.blockNumber === blockNumber
    ) {
      blockQueue.shift();
    }
  });

  return worker;
}

export function startBlockMonitor() {
  console.log("Starting Ethereum block monitor...");

  provider.on("block", async (blockNumber) => {
    console.log(`Processing block ${blockNumber}`);
    blockQueue.push(blockNumber);
    console.log({ blockQueue });
    await processBlock();
  });
}

startBlockMonitor();
