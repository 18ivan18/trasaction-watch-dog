import { GET, POST, PUT, DELETE, route } from "awilix-express";
import { Request, Response } from "express";
import { TaskService } from "../services/task.service.js";

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
  async getTaskById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const task = await this.taskService.getTaskById(id);
      return res.json(task);
    } catch (error) {
      return res.status(404).json({ error: (error as Error).message });
    }
  }

  @POST()
  async createTask(req: Request, res: Response) {
    try {
      const { name, done = false } = req.body;
      if (!name) {
        return res.status(400).json({ error: "Name is required" });
      }
      const task = await this.taskService.createTask(name, done);
      return res.status(201).json(task);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  @route("/:id")
  @PUT()
  async updateTask(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { name, done } = req.body;
      const task = await this.taskService.updateTask(id, { name, done });
      return res.json(task);
    } catch (error) {
      return res.status(404).json({ error: (error as Error).message });
    }
  }

  @route("/:id")
  @DELETE()
  async deleteTask(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const result = await this.taskService.deleteTask(id);
      return res.json(result);
    } catch (error) {
      return res.status(404).json({ error: (error as Error).message });
    }
  }
}
