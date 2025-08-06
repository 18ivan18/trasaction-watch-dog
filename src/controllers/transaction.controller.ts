import { GET, POST, route } from "awilix-express";
import { Request, Response } from "express";
import { TransactionService } from "../services/transaction.service.js";
import {
  ValidateBody,
  ValidateParams,
} from "../decorators/validation.decorator.js";
import {
  batchInsertTransactionsSchema,
  transactionIdSchema,
  TransactionIdRequest,
  BatchInsertTransactionsRequest,
} from "../schemas/transaction.schemas.js";
import {
  ValidatedBodyRequest,
  ValidatedParamsRequest,
} from "../types/validated-request.js";
import { RuleIdRequest, ruleIdSchema } from "../schemas/rule.schemas.js";

@route("/transactions")
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @route("")
  @GET()
  async getAllTransactions(_req: Request, res: Response) {
    const transactions = await this.transactionService.getAllTransactions();
    return res.json(transactions);
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
  async getTransactionsByRuleId(
    req: ValidatedParamsRequest<RuleIdRequest>,
    res: Response,
  ) {
    const id = req.params.id;
    const transactions =
      await this.transactionService.getTransactionsByRuleId(id);
    return res.json(transactions);
  }
}
