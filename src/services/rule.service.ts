import { Rule } from "../models/rule.model.js";
import { Transaction } from "../models/transaction.model.js";
import type {
  CreateRuleRequest,
  UpdateRuleRequest,
} from "../schemas/rule.schemas.js";
import { NotFoundError } from "../types/errors.js";

export class RuleService {
  getAllRules() {
    return Rule.findAll();
  }

  async getRuleById(id: number) {
    const rule = await Rule.findByPk(id);

    if (!rule) {
      throw new NotFoundError("Rule", id);
    }

    return rule;
  }

  async createRule(ruleData: CreateRuleRequest) {
    console.log(ruleData);
    return await Rule.create(ruleData as any);
  }

  async updateRule(id: number, ruleData: UpdateRuleRequest) {
    const [, ruleId] = await Rule.update(ruleData, {
      where: { id },
      returning: true,
    });

    return this.getRuleById(ruleId as any);
  }

  async deleteRule(id: number) {
    const rule = await Rule.findByPk(id);

    if (!rule) {
      throw new NotFoundError("Rule", id);
    }

    await rule.destroy();
    return rule;
  }

  async getRulesByTransactionId(transactionId: number) {
    return Rule.findAll({
      include: [
        {
          model: Transaction,
          as: "transactions",
          where: { id: transactionId },
        },
      ],
    });
  }
}
