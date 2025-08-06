import { asClass, createContainer } from "awilix";
import { scopePerRequest } from "awilix-express";
import type { Application } from "express";
import { RuleService } from "./services/rule.service.js";
import { TransactionService } from "./services/transaction.service.js";
import { DatabaseService } from "./services/database.service.js";
import { CacheService } from "./services/cache.service.js";

export const loadContainer = async (app: Application) => {
  const Container = createContainer({
    injectionMode: "CLASSIC",
  });

  Container.register({
    databaseService: asClass(DatabaseService).singleton(),
    cacheService: asClass(CacheService).singleton(),
    ruleService: asClass(RuleService).singleton(),
    transactionService: asClass(TransactionService).singleton(),
  });

  // Initialize database
  const databaseService = Container.resolve<DatabaseService>("databaseService");
  await databaseService.initialize();

  app.use(scopePerRequest(Container));
};
