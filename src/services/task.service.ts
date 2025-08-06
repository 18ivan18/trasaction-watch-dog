import { Task } from "../models/task.model.js";

export class TaskService {
  getAllTasks() {
    return Task.findAll();
  }

  createTask(name: string, done: boolean = false) {
    return Task.create({ name, done } as any);
  }

  async updateTask(id: number, updates: { name?: string; done?: boolean }) {
    const task = await Task.findByPk(id);
    if (!task) {
      throw new Error("Task not found");
    }
    return task.update(updates);
  }

  async deleteTask(id: number) {
    const task = await Task.findByPk(id);
    if (!task) {
      throw new Error("Task not found");
    }
    await task.destroy();
    return { message: "Task deleted successfully" };
  }

  async getTaskById(id: number) {
    const task = await Task.findByPk(id);
    if (!task) {
      throw new Error("Task not found");
    }
    return task;
  }
}
