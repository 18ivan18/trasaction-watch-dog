import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
  logging: false, // Set to console.log to see SQL queries
});

export class DatabaseService {
  async initialize() {
    try {
      await sequelize.authenticate();
      console.log("Database connection established successfully.");

      // Sync all models
      await sequelize.sync({ force: false }); // Set force: true to recreate tables
      console.log("Database models synchronized.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
  }

  async close() {
    await sequelize.close();
  }
}
