import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  dialect: "mysql",
  host: process.env.DB_HOST,
  logging: false, // Set to console.log to see SQL queries
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT ?? "3306"),
  username: process.env.DB_USER,
});

export class DatabaseService {
  async close() {
    await sequelize.close();
  }

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
}
