import { asClass, createContainer } from "awilix";
import { scopePerRequest } from "awilix-express";
import type { Application } from "express";
import { TaskService } from "./services/task.service.js";
import { DatabaseService } from "./services/database.service.js";

export const loadContainer = async (app: Application) => {
  const Container = createContainer({
    injectionMode: "CLASSIC",
  });

  Container.register({
    databaseService: asClass(DatabaseService).singleton(),
    taskService: asClass(TaskService).singleton(),
  });

  // Initialize database
  const databaseService = Container.resolve<DatabaseService>("databaseService");
  await databaseService.initialize();

  app.use(scopePerRequest(Container));
};
