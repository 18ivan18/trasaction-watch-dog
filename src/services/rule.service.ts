import { Rule } from "../models/rule.model.js";
import { Transaction } from "../models/transaction.model.js";
import type { CreateOrUpdateRuleRequest } from "../schemas/rule.schemas.js";
import { NotFoundError } from "../types/errors.js";
import { CacheService } from "./cache.service.js";

export class RuleService {
  constructor(private readonly cacheService: CacheService) {}

  private readonly CACHE_KEYS = {
    ALL_RULES: "rules:all",
    RULE_BY_ID: "rules:id:",
  } as const;

  private readonly CACHE_TTL = 60 * 60 * 1000; // 1 hour
  async getAllRules() {
    // Try to get from cache first
    const cachedRules = await this.cacheService.get(this.CACHE_KEYS.ALL_RULES);
    if (cachedRules) {
      return cachedRules;
    }

    // If not in cache, fetch from database
    const rules = await Rule.findAll();

    // Store in cache
    await this.cacheService.set(
      this.CACHE_KEYS.ALL_RULES,
      rules,
      this.CACHE_TTL,
    );

    return rules;
  }

  async getRuleById(id: number) {
    const rule = await Rule.findByPk(id);

    if (!rule) {
      throw new NotFoundError("Rule", id);
    }

    return rule;
  }

  async createRule(ruleData: CreateOrUpdateRuleRequest) {
    console.log(ruleData);
    const rule = await Rule.create(ruleData as any);

    // Invalidate cache after creating a new rule
    await this.cacheService.invalidatePattern("rules");

    return rule;
  }

  async updateRule(id: number, ruleData: CreateOrUpdateRuleRequest) {
    const [, ruleId] = await Rule.update(ruleData, {
      where: { id },
      returning: true,
    });

    // Invalidate cache after updating a rule
    await this.cacheService.invalidatePattern("rules");

    return this.getRuleById(ruleId as any);
  }

  async deleteRule(id: number) {
    const rule = await Rule.findByPk(id);

    if (!rule) {
      throw new NotFoundError("Rule", id);
    }

    await rule.destroy();

    // Invalidate cache after deleting a rule
    await this.cacheService.invalidatePattern("rules");

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

  async getCacheStats() {
    return await this.cacheService.getStats();
  }

  async clearCache() {
    await this.cacheService.clear();
  }
}
