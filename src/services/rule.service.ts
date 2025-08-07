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

    // If not in cache, fetch from database - only active rules
    const rules = await Rule.findAll({
      where: { isActive: true },
    });

    // Store in cache
    await this.cacheService.set(
      this.CACHE_KEYS.ALL_RULES,
      rules,
      this.CACHE_TTL,
    );

    return rules;
  }

  async getRuleById(id: number) {
    const rule = await Rule.findOne({
      where: { id, isActive: true },
    });

    if (!rule) {
      throw new NotFoundError("Rule", id);
    }

    return rule;
  }

  async createRule(ruleData: CreateOrUpdateRuleRequest) {
    const rule = await Rule.create(ruleData as any);

    // Invalidate cache after creating a new rule
    await this.cacheService.invalidatePattern("rules");

    return rule;
  }

  async deactivateRule(id: number) {
    const rule = await Rule.findOne({
      where: { id, isActive: true },
    });

    if (!rule) {
      throw new NotFoundError("Rule", id);
    }

    // Soft delete by setting isActive to false
    await rule.update({ isActive: false });

    // Invalidate cache after soft deleting a rule
    await this.cacheService.invalidatePattern("rules");

    return rule;
  }

  async getTransactionsByRuleId(ruleId: number) {
    return Rule.findAll({
      where: { id: ruleId, isActive: true },
      include: [
        {
          model: Transaction,
          as: "transactions",
        },
      ],
    });
  }
}
