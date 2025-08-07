import axios from "axios";
import { providers, type Transaction } from "ethers";
import chunk from "lodash/chunk.js";
import { isMainThread, parentPort, workerData } from "node:worker_threads";
import { fileURLToPath } from "url";
import z from "zod";

import type { RuleType } from "../models/rule.model.js";
import type { BatchInsertTransactionsRequest } from "../schemas/transaction.schemas.js";

export const workerFileName = fileURLToPath(import.meta.url);

export const workerDataSchema = z.object({
  apiBaseUrl: z.string(),
  blockCount: z.number(),
  blockNumber: z.number(),
  infuraProjectId: z.string(),
  verboseLogging: z.boolean().optional().default(false),
});

export type WorkerData = z.infer<typeof workerDataSchema>;

async function batchInsertTransactions(
  { transactions }: BatchInsertTransactionsRequest,
  apiBaseUrl: string,
) {
  const batches = chunk(transactions, 100);
  await Promise.all(
    batches.map((batch) =>
      axios.post(`${apiBaseUrl}/transactions/batch`, {
        transactions: batch,
      }),
    ),
  );
}

function filterApplicableRules(
  rules: RuleType[],
  blockCount: number,
): RuleType[] {
  const maximumBlockDelay =
    rules.sort((a, b) => b.blockDelay - a.blockDelay)[0]?.blockDelay ?? 0;

  if (blockCount - maximumBlockDelay - 1 === 0) {
    return rules;
  }

  return [];
}

async function getAllRules(apiBaseUrl: string) {
  const response = await axios.get<RuleType[]>(`${apiBaseUrl}/rules`);
  return response.data;
}

async function main() {
  const input = workerDataSchema.parse(workerData);
  const provider = new providers.InfuraProvider(
    "mainnet",
    input.infuraProjectId,
  );
  await processBlockTransactions(input, provider, input.apiBaseUrl);
}

function matchTransactionToRules(
  transaction: Transaction,
  rules: RuleType[],
  verboseLogging: boolean,
): number[] {
  const matchingRuleIds: number[] = [];

  for (const rule of rules) {
    // Check fromAddress
    if (
      rule.fromAddress &&
      transaction.from?.toLowerCase() !== rule.fromAddress.toLowerCase()
    ) {
      if (verboseLogging) {
        console.log(
          `Transaction ${transaction.hash} does not match rule ${rule.id} for fromAddress`,
        );
      }
      continue;
    }

    // Check toAddress
    if (rule.toAddress && transaction.to !== rule.toAddress) {
      if (verboseLogging) {
        console.log(
          `Transaction ${transaction.hash} does not match rule ${rule.id} for toAddress`,
        );
      }
      continue;
    }

    // Check value
    if (
      rule.valueFrom &&
      rule.valueTo &&
      !(
        transaction.value.gt(rule.valueFrom) &&
        transaction.value.lte(rule.valueTo)
      )
    ) {
      if (verboseLogging) {
        console.log(
          `Transaction ${transaction.hash} does not match rule ${rule.id} for value`,
        );
      }
      continue;
    }

    // Check nonce
    if (rule.nonce && transaction.nonce !== rule.nonce) {
      if (verboseLogging) {
        console.log(
          `Transaction ${transaction.hash} does not match rule ${rule.id} for nonce`,
        );
      }
      continue;
    }

    // Check gasPrice
    if (rule.gasPrice && !transaction.gasPrice?.eq(rule.gasPrice)) {
      if (verboseLogging) {
        console.log(
          `Transaction ${transaction.hash} does not match rule ${rule.id} for gasPrice`,
        );
      }
      continue;
    }

    // Check gasLimit
    if (rule.gasLimit && !transaction.gasLimit.eq(rule.gasLimit)) {
      if (verboseLogging) {
        console.log(
          `Transaction ${transaction.hash} does not match rule ${rule.id} for gasLimit`,
        );
      }
      continue;
    }

    matchingRuleIds.push(rule.id);
  }

  return matchingRuleIds;
}

async function processBlockTransactions(
  workerData: WorkerData,
  provider: providers.InfuraProvider,
  apiBaseUrl: string,
) {
  console.log(
    `Processing block ${workerData.blockNumber} transactions (block count: ${workerData.blockCount})`,
  );

  // 1. Get all rules
  const allRules = await getAllRules(apiBaseUrl);
  console.log(`Fetched ${allRules.length} total rules`);

  // 2. Filter rules based on block delay
  const applicableRules = filterApplicableRules(
    allRules,
    workerData.blockCount,
  );

  // If no applicable rules, return early
  if (applicableRules.length === 0) {
    console.log("No applicable rules found for this block count");
    return;
  }

  // 3. Get transactions
  const transactions = await provider.getBlockWithTransactions(
    workerData.blockNumber,
  );

  // 4. Match transactions to applicable rules
  const transactionsWithRules: BatchInsertTransactionsRequest["transactions"] =
    [];

  for (const transaction of transactions.transactions) {
    const matchingRuleIds = matchTransactionToRules(
      transaction,
      applicableRules,
      workerData.verboseLogging,
    );

    if (matchingRuleIds.length > 0) {
      transactionsWithRules.push({
        from: transaction.from,
        gasLimit: transaction.gasLimit.toString(),
        gasPrice: transaction.gasPrice?.toString(),
        hash: transaction.hash,
        nonce: transaction.nonce,
        ruleIds: matchingRuleIds,
        to: transaction.to,
        type: transaction.type ?? undefined,
        value: transaction.value.toString(),
      });
    }
  }

  // 5. Batch insert matching transactions
  if (transactionsWithRules.length > 0) {
    await batchInsertTransactions(
      {
        transactions: transactionsWithRules,
      },
      apiBaseUrl,
    );
  } else {
    console.log("No transactions matched any applicable rules");
  }

  // 6. If the maximum block delay is reached, send the block hash to the main thread
  // it'll pop the block from the queue
  if (applicableRules.length > 0) {
    parentPort?.postMessage({ blockNumber: workerData.blockNumber });
  }
}

if (!isMainThread) {
  await main();
}
