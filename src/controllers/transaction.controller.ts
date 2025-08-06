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

@route("/transactions")
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

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
