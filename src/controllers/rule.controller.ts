import { DELETE, GET, POST, PUT, route } from "awilix-express";
import { Request, Response } from "express";
import { RuleService } from "../services/rule.service.js";
import {
  ValidateBody,
  ValidateParams,
  ValidateQuery,
} from "../decorators/validation.decorator.js";
import {
  ruleIdSchema,
  RuleIdRequest,
  createOrUpdateRuleSchema,
  CreateOrUpdateRuleRequest,
} from "../schemas/rule.schemas.js";
import {
  paginationQuerySchema,
  PaginationQueryRequest,
} from "../schemas/transaction.schemas.js";
import {
  ValidatedBodyRequest,
  ValidatedParamsRequest,
  ValidatedRequestWith,
  ValidatedQueryRequest,
} from "../types/validated-request.js";

@route("/rules")
export class RuleController {
  constructor(private readonly ruleService: RuleService) {}

  @route("")
  @GET()
  async getAllRules(_req: Request, res: Response) {
    const rules = await this.ruleService.getAllRules();
    return res.json(rules);
  }

  @route("/:id")
  @GET()
  @ValidateParams(ruleIdSchema)
  async getRuleById(req: ValidatedParamsRequest<RuleIdRequest>, res: Response) {
    const id = req.params.id;
    const rule = await this.ruleService.getRuleById(id);
    return res.json(rule);
  }

  @POST()
  @ValidateBody(createOrUpdateRuleSchema)
  async createRule(
    req: ValidatedBodyRequest<CreateOrUpdateRuleRequest>,
    res: Response,
  ) {
    const rule = await this.ruleService.createRule(req.body);
    return res.status(201).json(rule);
  }

  @route("/:id")
  @DELETE()
  @ValidateParams(ruleIdSchema)
  async deleteRule(req: ValidatedParamsRequest<RuleIdRequest>, res: Response) {
    const id = req.params.id;
    const result = await this.ruleService.deactivateRule(id);
    return res.json(result);
  }

  @route("/:id/transactions")
  @GET()
  @ValidateParams(ruleIdSchema)
  async getTransactionsByRuleId(
    req: ValidatedRequestWith<never, RuleIdRequest>,
    res: Response,
  ) {
    const id = req.params.id;

    const result = await this.ruleService.getTransactionsByRuleId(id);
    return res.json(result);
  }
}
