import { GET, route } from "awilix-express";
import { Request, Response } from "express";
import { TaskService } from "../services/task.service.js";

@route("/tasks")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  @GET()
  getHelloTask(req: Request, res: Response) {
    return res.json({ mssg: "hello task" });
  }
  @route("/all")
  @GET()
  getAllTask(req: Request, res: Response) {
    return res.json(this.taskService.getAllTasks());
  }
}
