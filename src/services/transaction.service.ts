import type { BatchInsertTransactionsRequest } from "../schemas/transaction.schemas.js";

import { Rule } from "../models/rule.model.js";
import { TransactionRule } from "../models/transaction-rule.model.js";
import { Transaction } from "../models/transaction.model.js";
import { sequelize } from "../services/database.service.js";
import { NotFoundError } from "../types/errors.js";

export class TransactionService {
  async batchInsertTransactions(batchData: BatchInsertTransactionsRequest) {
    const { transactions } = batchData;

    // Use transaction to ensure data consistency
    await sequelize.transaction(async (t) => {
      // Prepare transaction data for bulk creation
      const transactionData = transactions.map(({ ruleIds, ...fields }) => ({
        ...fields,
        ruleIds, // Keep ruleIds for later use
      }));

      // Bulk create all transactions at once
      const createdTransactions = await Transaction.bulkCreate(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        transactionData.map(({ ruleIds, ...fields }) => fields as Transaction),
        {
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
          returning: true, // Get the created records back
          transaction: t,
        },
      );

      // Prepare pivot table entries
      const pivotEntries: { ruleId: number; transactionId: number }[] = [];

      createdTransactions.forEach((transaction, index) => {
        const ruleIds = transactionData[index].ruleIds;
        if (ruleIds.length > 0) {
          for (const ruleId of ruleIds) {
            pivotEntries.push({
              ruleId: ruleId,
              transactionId: transaction.id,
            });
          }
        }
      });

      // Bulk create pivot table entries if any exist
      if (pivotEntries.length > 0) {
        await TransactionRule.bulkCreate(pivotEntries as TransactionRule[], {
          fields: ["transactionId", "ruleId", "createdAt", "updatedAt"], // Explicitly specify fields to exclude id
          ignoreDuplicates: true,
          transaction: t,
        });
      }

      return createdTransactions;
    });
  }

  async getAllTransactions(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { count, rows } = await Transaction.findAndCountAll({
      include: [
        {
          as: "rules",
          model: Rule,
        },
      ],
      limit,
      offset,
      order: [["id", "DESC"]], // Most recent first
    });

    return {
      data: rows,
      pagination: {
        hasNext: page < Math.ceil(count / limit),
        hasPrev: page > 1,
        limit,
        page,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async getTransactionById(id: number) {
    const transaction = await Transaction.findByPk(id, {
      include: [
        {
          as: "rules",
          model: Rule,
        },
      ],
    });

    if (!transaction) {
      throw new NotFoundError("Transaction", id);
    }

    return transaction;
  }

  async getTransactionsByRuleId(ruleId: number, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { count, rows } = await Transaction.findAndCountAll({
      include: [
        {
          as: "rules",
          model: Rule,
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
        hasNext: page < Math.ceil(count / limit),
        hasPrev: page > 1,
        limit,
        page,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }
}
