import type { Application } from "express";

import { asClass, createContainer } from "awilix";
import { scopePerRequest } from "awilix-express";

import { CacheService } from "./services/cache.service.js";
import { DatabaseService } from "./services/database.service.js";
import { RuleService } from "./services/rule.service.js";
import { TransactionService } from "./services/transaction.service.js";

export const loadContainer = async (app: Application) => {
  const Container = createContainer({
    injectionMode: "CLASSIC",
  });

  Container.register({
    cacheService: asClass(CacheService).singleton(),
    databaseService: asClass(DatabaseService).singleton(),
    ruleService: asClass(RuleService).singleton(),
    transactionService: asClass(TransactionService).singleton(),
  });

  // Initialize database
  const databaseService = Container.resolve<DatabaseService>("databaseService");
  await databaseService.initialize();

  app.use(scopePerRequest(Container));
};
