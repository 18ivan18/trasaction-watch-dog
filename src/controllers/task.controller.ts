import { GET, POST, PUT, DELETE, route } from "awilix-express";
import { Request, Response } from "express";
import { TaskService } from "../services/task.service.js";
import {
  ValidateBody,
  ValidateParams,
} from "../decorators/validation.decorator.js";
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdSchema,
  TaskIdRequest,
  CreateTaskRequest,
  UpdateTaskRequest,
} from "../schemas/task.schemas.js";
import {
  ValidatedBodyRequest,
  ValidatedParamsRequest,
  ValidatedRequestWith,
} from "../types/validated-request.js";

@route("/tasks")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @route("/all")
  @GET()
  async getAllTask(_req: Request, res: Response) {
    const tasks = await this.taskService.getAllTasks();
    return res.json(tasks);
  }

  @route("/:id")
  @GET()
  @ValidateParams(taskIdSchema)
  async getTaskById(req: ValidatedParamsRequest<TaskIdRequest>, res: Response) {
    const id = req.params.id;
    const task = await this.taskService.getTaskById(id);
    return res.json(task);
  }

  @POST()
  @ValidateBody(createTaskSchema)
  async createTask(
    req: ValidatedBodyRequest<CreateTaskRequest>,
    res: Response,
  ) {
    const { name, done } = req.body;
    const task = await this.taskService.createTask(name, done);
    return res.status(201).json(task);
  }

  @route("/:id")
  @PUT()
  @ValidateBody(updateTaskSchema)
  @ValidateParams(taskIdSchema)
  async updateTask(
    req: ValidatedRequestWith<UpdateTaskRequest, TaskIdRequest>,
    res: Response,
  ) {
    const id = req.params.id; // Now typed as number
    const { name, done } = req.body; // Now properly typed
    const task = await this.taskService.updateTask(id, { name, done });
    return res.json(task);
  }

  @route("/:id")
  @DELETE()
  @ValidateParams(taskIdSchema)
  async deleteTask(req: ValidatedParamsRequest<TaskIdRequest>, res: Response) {
    const id = req.params.id; // Now typed as number
    const result = await this.taskService.deleteTask(id);
    return res.json(result);
  }
}
