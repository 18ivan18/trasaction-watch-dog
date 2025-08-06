import { GET, POST, route } from "awilix-express";
import { Request, Response } from "express";
import { TransactionService } from "../services/transaction.service.js";
import {
  ValidateBody,
  ValidateParams,
  ValidateQuery,
} from "../decorators/validation.decorator.js";
import {
  batchInsertTransactionsSchema,
  transactionIdSchema,
  TransactionIdRequest,
  BatchInsertTransactionsRequest,
  paginationQuerySchema,
  PaginationQueryRequest,
} from "../schemas/transaction.schemas.js";
import {
  ValidatedBodyRequest,
  ValidatedParamsRequest,
  ValidatedQueryRequest,
  ValidatedRequestWith,
} from "../types/validated-request.js";
import { RuleIdRequest, ruleIdSchema } from "../schemas/rule.schemas.js";

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Transaction management endpoints
 */

@route("/transactions")
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  /**
   * @swagger
   * /transactions:
   *   get:
   *     summary: Get all transactions
   *     description: Retrieve all transactions with pagination support
   *     tags: [Transactions]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: Page number for pagination
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 10
   *         description: Number of items per page
   *     responses:
   *       200:
   *         description: List of transactions with pagination info
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Transaction'
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     page:
   *                       type: integer
   *                     limit:
   *                       type: integer
   *                     total:
   *                       type: integer
   *                     totalPages:
   *                       type: integer
   *       400:
   *         description: Invalid query parameters
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
  @route("")
  @GET()
  @ValidateQuery(paginationQuerySchema)
  async getAllTransactions(
    req: ValidatedQueryRequest<PaginationQueryRequest>,
    res: Response,
  ) {
    const page = req.query.page ?? 1;
    const limit = req.query.limit ?? 10;

    const result = await this.transactionService.getAllTransactions(
      page,
      limit,
    );
    return res.json(result);
  }

  /**
   * @swagger
   * /transactions/{id}:
   *   get:
   *     summary: Get transaction by ID
   *     description: Retrieve a specific transaction by its ID with associated rules
   *     tags: [Transactions]
   *     parameters:
   *       - $ref: '#/components/parameters/TransactionId'
   *     responses:
   *       200:
   *         description: Transaction details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Transaction'
   *       404:
   *         description: Transaction not found
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
  @ValidateParams(transactionIdSchema)
  async getTransactionById(
    req: ValidatedParamsRequest<TransactionIdRequest>,
    res: Response,
  ) {
    const id = req.params.id;
    const transaction = await this.transactionService.getTransactionById(id);
    return res.json(transaction);
  }

  /**
   * @swagger
   * /transactions/batch:
   *   post:
   *     summary: Batch insert transactions
   *     description: Insert multiple transactions at once using optimized bulk operations
   *     tags: [Transactions]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/BatchTransactionRequest'
   *           example:
   *             transactions:
   *               - hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
   *                 to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b8"
   *                 from: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b9"
   *                 nonce: 2
   *                 gasLimit: "21000"
   *                 gasPrice: "20000000000"
   *                 data: "0x"
   *                 value: "500000000000000000"
   *                 chainId: 1
   *                 type: 0
   *                 ruleIds: [1]
   *     responses:
   *       201:
   *         description: Transactions created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Transactions created successfully"
   *                 count:
   *                   type: integer
   *                   description: Number of transactions created
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
  @route("/batch")
  @POST()
  @ValidateBody(batchInsertTransactionsSchema)
  async batchInsertTransactions(
    req: ValidatedBodyRequest<BatchInsertTransactionsRequest>,
    res: Response,
  ) {
    const result = await this.transactionService.batchInsertTransactions(
      req.body,
    );
    return res.status(201).json(result);
  }

  /**
   * @swagger
   * /transactions/rule/{id}:
   *   get:
   *     summary: Get transactions by rule ID
   *     description: Retrieve all transactions associated with a specific rule with pagination support
   *     tags: [Transactions]
   *     parameters:
   *       - $ref: '#/components/parameters/RuleId'
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: Page number for pagination
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 10
   *         description: Number of items per page
   *     responses:
   *       200:
   *         description: List of transactions associated with the rule
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Transaction'
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     page:
   *                       type: integer
   *                     limit:
   *                       type: integer
   *                     total:
   *                       type: integer
   *                     totalPages:
   *                       type: integer
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
  @route("/rule/:id")
  @GET()
  @ValidateParams(ruleIdSchema)
  @ValidateQuery(paginationQuerySchema)
  async getTransactionsByRuleId(
    req: ValidatedRequestWith<never, RuleIdRequest, PaginationQueryRequest>,
    res: Response,
  ) {
    const id = req.params.id;
    const page = req.query.page ?? 1;
    const limit = req.query.limit ?? 10;

    const result = await this.transactionService.getTransactionsByRuleId(
      id,
      page,
      limit,
    );
    return res.json(result);
  }
}
