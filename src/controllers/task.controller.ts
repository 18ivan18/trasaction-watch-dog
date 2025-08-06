import { GET, POST, PUT, DELETE, route } from "awilix-express";
import { Request, Response } from "express";
import { TaskService } from "../services/task.service.js";
import { ValidateRequest } from "../decorators/validation.decorator.js";
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdSchema,
} from "../schemas/task.schemas.js";

@route("/tasks")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @route("/all")
  @GET()
  async getAllTask(req: Request, res: Response) {
    const tasks = await this.taskService.getAllTasks();
    return res.json(tasks);
  }

  @route("/:id")
  @GET()
  @ValidateRequest(taskIdSchema, "params")
  async getTaskById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const task = await this.taskService.getTaskById(id);
    return res.json(task);
  }

  @POST()
  @ValidateRequest(createTaskSchema, "body")
  async createTask(req: Request, res: Response) {
    const { name, done = false } = req.body;
    const task = await this.taskService.createTask(name, done);
    return res.status(201).json(task);
  }

  @route("/:id")
  @PUT()
  @ValidateRequest(updateTaskSchema, "body")
  @ValidateRequest(taskIdSchema, "params")
  async updateTask(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { name, done } = req.body;
    const task = await this.taskService.updateTask(id, { name, done });
    return res.json(task);
  }

  @route("/:id")
  @DELETE()
  @ValidateRequest(taskIdSchema, "params")
  async deleteTask(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const result = await this.taskService.deleteTask(id);
    return res.json(result);
  }
}
