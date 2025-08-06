import { Transaction } from "../models/transaction.model.js";
import { Rule } from "../models/rule.model.js";
import type { BatchInsertTransactionsRequest } from "../schemas/transaction.schemas.js";
import { NotFoundError } from "../types/errors.js";

export class TransactionService {
  getAllTransactions() {
    return Transaction.findAll({
      include: [
        {
          model: Rule,
          as: "rules",
        },
      ],
    });
  }

  async getTransactionById(id: number) {
    const transaction = await Transaction.findByPk(id, {
      include: [
        {
          model: Rule,
          as: "rules",
        },
      ],
    });

    if (!transaction) {
      throw new NotFoundError("Transaction", id);
    }

    return transaction;
  }

  async batchInsertTransactions(batchData: BatchInsertTransactionsRequest) {
    const { transactions } = batchData;
    const results = [];

    for (const transactionData of transactions) {
      try {
        const result = await Transaction.create(transactionData as any);
        results.push({ success: true, data: result });
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
          data: transactionData,
        });
      }
    }

    return {
      total: transactions.length,
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results,
    };
  }
}
