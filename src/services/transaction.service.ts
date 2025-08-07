import { Transaction } from "../models/transaction.model.js";
import { Rule } from "../models/rule.model.js";
import { TransactionRule } from "../models/transaction-rule.model.js";
import type { BatchInsertTransactionsRequest } from "../schemas/transaction.schemas.js";
import { NotFoundError } from "../types/errors.js";
import { sequelize } from "../services/database.service.js";

export class TransactionService {
  async getAllTransactions(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    const { count, rows } = await Transaction.findAndCountAll({
      include: [
        {
          model: Rule,
          as: "rules",
        },
      ],
      limit,
      offset,
      order: [["id", "DESC"]], // Most recent first
    });

    return {
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
        hasNext: page < Math.ceil(count / limit),
        hasPrev: page > 1,
      },
    };
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
      const pivotEntries: Array<{ transactionId: number; ruleId: number }> = [];

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
  }

  async getTransactionsByRuleId(
    ruleId: number,
    page: number = 1,
    limit: number = 10,
  ) {
    const offset = (page - 1) * limit;

    const { count, rows } = await Transaction.findAndCountAll({
      include: [
        {
          model: Rule,
          as: "rules",
          where: { id: ruleId },
        },
      ],
      limit,
      offset,
      order: [["id", "DESC"]], // Most recent first
    });

    return {
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
        hasNext: page < Math.ceil(count / limit),
        hasPrev: page > 1,
      },
    };
  }
}
