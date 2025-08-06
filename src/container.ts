import { asClass, createContainer } from "awilix";
import { scopePerRequest } from "awilix-express";
import type { Application } from "express";
import { TaskService } from "./services/task.service.js";

export const loadContainer = (app: Application) => {
  const Container = createContainer({
    injectionMode: "CLASSIC",
  });
  Container.register({
    taskService: asClass(TaskService).singleton(),
  });
  app.use(scopePerRequest(Container));
};
