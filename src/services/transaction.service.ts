import { Transaction } from "../models/transaction.model.js";
import { Rule } from "../models/rule.model.js";
import { TransactionRule } from "../models/transaction-rule.model.js";
import type { BatchInsertTransactionsRequest } from "../schemas/transaction.schemas.js";
import { NotFoundError } from "../types/errors.js";
import { sequelize } from "../services/database.service.js";

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

    try {
      // Use transaction to ensure data consistency
      const result = await sequelize.transaction(async (t) => {
        // Prepare transaction data for bulk creation
        const transactionData = transactions.map(({ ruleIds, ...fields }) => ({
          ...fields,
          ruleIds, // Keep ruleIds for later use
        }));

        // Bulk create all transactions at once
        const createdTransactions = await Transaction.bulkCreate(
          transactionData.map(({ ruleIds, ...fields }) => fields as any),
          {
            transaction: t,
            returning: true, // Get the created records back
            fields: [
              "hash",
              "to",
              "from",
              "nonce",
              "gasLimit",
              "gasPrice",
              "value",
              "type",
            ], // Explicitly specify fields to exclude id
          },
        );

        // Prepare pivot table entries
        const pivotEntries: Array<{ transactionId: number; ruleId: number }> =
          [];

        createdTransactions.forEach((transaction, index) => {
          const ruleIds = transactionData[index].ruleIds;
          if (ruleIds && ruleIds.length > 0) {
            for (const ruleId of ruleIds) {
              pivotEntries.push({
                transactionId: transaction.id,
                ruleId: ruleId,
              });
            }
          }
        });

        // Bulk create pivot table entries if any exist
        if (pivotEntries.length > 0) {
          await TransactionRule.bulkCreate(pivotEntries as any, {
            transaction: t,
            ignoreDuplicates: true,
            fields: ["transactionId", "ruleId", "createdAt", "updatedAt"], // Explicitly specify fields to exclude id
          });
        }

        return createdTransactions;
      });

      // Return detailed results
      return {
        total: transactions.length,
        successful: result.length,
        failed: 0,
        results: result.map((transaction, index) => ({
          success: true,
          data: transaction,
          originalData: transactions[index],
        })),
      };
    } catch (error) {
      console.log(error);
      // If any transaction fails, the entire batch fails (transaction rollback)
      return {
        total: transactions.length,
        successful: 0,
        failed: transactions.length,
        error: error instanceof Error ? error.message : "Unknown error",
        results: transactions.map((transactionData) => ({
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
          data: transactionData,
        })),
      };
    }
  }

  getTransactionsByRuleId(ruleId: number) {
    return Transaction.findAll({
      include: [
        {
          model: Rule,
          as: "rules",
          where: { id: ruleId },
        },
      ],
    });
  }
}
