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

/**
 * @swagger
 * tags:
 *   name: Rules
 *   description: Rule management endpoints
 */

@route("/rules")
export class RuleController {
  constructor(private readonly ruleService: RuleService) {}

  /**
   * @swagger
   * /rules:
   *   get:
   *     summary: Get all rules
   *     description: Retrieve all rules with their associated transactions
   *     tags: [Rules]
   *     responses:
   *       200:
   *         description: List of all rules
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Rule'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  @route("")
  @GET()
  async getAllRules(_req: Request, res: Response) {
    const rules = await this.ruleService.getAllRules();
    return res.json(rules);
  }

  /**
   * @swagger
   * /rules/{id}:
   *   get:
   *     summary: Get rule by ID
   *     description: Retrieve a specific rule by its ID with associated transactions
   *     tags: [Rules]
   *     parameters:
   *       - $ref: '#/components/parameters/RuleId'
   *     responses:
   *       200:
   *         description: Rule details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Rule'
   *       404:
   *         description: Rule not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  @route("/:id")
  @GET()
  @ValidateParams(ruleIdSchema)
  async getRuleById(req: ValidatedParamsRequest<RuleIdRequest>, res: Response) {
    const id = req.params.id;
    const rule = await this.ruleService.getRuleById(id);
    return res.json(rule);
  }

  /**
   * @swagger
   * /rules:
   *   post:
   *     summary: Create a new rule
   *     description: Create a new transaction filtering rule. At least one property must be provided.
   *     tags: [Rules]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateRuleRequest'
   *           example:
   *             fromAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
   *             toAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b7"
   *             value: "1000000000000000000"
   *             gasPrice: "20000000000"
   *     responses:
   *       201:
   *         description: Rule created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Rule'
   *       400:
   *         description: Invalid request body
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  @POST()
  @ValidateBody(createOrUpdateRuleSchema)
  async createRule(
    req: ValidatedBodyRequest<CreateOrUpdateRuleRequest>,
    res: Response,
  ) {
    const rule = await this.ruleService.createRule(req.body);
    return res.status(201).json(rule);
  }

  /**
   * @swagger
   * /rules/{id}:
   *   delete:
   *     summary: Delete a rule
   *     description: Deactivate a rule by its ID
   *     tags: [Rules]
   *     parameters:
   *       - $ref: '#/components/parameters/RuleId'
   *     responses:
   *       200:
   *         description: Rule deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Rule deleted successfully"
   *       404:
   *         description: Rule not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  @route("/:id")
  @DELETE()
  @ValidateParams(ruleIdSchema)
  async deleteRule(req: ValidatedParamsRequest<RuleIdRequest>, res: Response) {
    const id = req.params.id;
    const result = await this.ruleService.deactivateRule(id);
    return res.json(result);
  }

  /**
   * @swagger
   * /rules/{id}/transactions:
   *   get:
   *     summary: Get transactions by rule ID
   *     description: Retrieve all transactions associated with a specific rule
   *     tags: [Rules]
   *     parameters:
   *       - $ref: '#/components/parameters/RuleId'
   *     responses:
   *       200:
   *         description: List of transactions associated with the rule
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Transaction'
   *       404:
   *         description: Rule not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
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
