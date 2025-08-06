import { GET, POST, PUT, DELETE, route } from "awilix-express";
import { Request, Response } from "express";
import { RuleService } from "../services/rule.service.js";
import {
  ValidateBody,
  ValidateParams,
} from "../decorators/validation.decorator.js";
import {
  createRuleSchema,
  updateRuleSchema,
  ruleIdSchema,
  RuleIdRequest,
  CreateRuleRequest,
  UpdateRuleRequest,
} from "../schemas/rule.schemas.js";
import {
  ValidatedBodyRequest,
  ValidatedParamsRequest,
  ValidatedRequestWith,
} from "../types/validated-request.js";

@route("/rules")
export class RuleController {
  constructor(private readonly ruleService: RuleService) {}

  @route("/all")
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
  @ValidateBody(createRuleSchema)
  async createRule(
    req: ValidatedBodyRequest<CreateRuleRequest>,
    res: Response,
  ) {
    const rule = await this.ruleService.createRule(req.body);
    return res.status(201).json(rule);
  }

  @route("/:id")
  @PUT()
  @ValidateBody(updateRuleSchema)
  @ValidateParams(ruleIdSchema)
  async updateRule(
    req: ValidatedRequestWith<UpdateRuleRequest, RuleIdRequest>,
    res: Response,
  ) {
    const id = req.params.id;
    const rule = await this.ruleService.updateRule(id, req.body);
    return res.json(rule);
  }

  @route("/:id")
  @DELETE()
  @ValidateParams(ruleIdSchema)
  async deleteRule(req: ValidatedParamsRequest<RuleIdRequest>, res: Response) {
    const id = req.params.id;
    const result = await this.ruleService.deleteRule(id);
    return res.json(result);
  }

  @route("/:id/transactions")
  @GET()
  @ValidateParams(ruleIdSchema)
  async getTransactionsByRuleId(
    req: ValidatedParamsRequest<RuleIdRequest>,
    res: Response,
  ) {
    const id = req.params.id;
    const transactions = await this.ruleService.getRulesByTransactionId(id);
    return res.json(transactions);
  }
}
