import { loadControllers } from "awilix-express";
import express from "express";
import { loadContainer } from "./container.js";
import { __dirname } from "./utils.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();
const port = process.env.PORT || "3000";

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize container and start server
(async () => {
  await loadContainer(app);
  app.use(loadControllers("controllers/*.ts", { cwd: __dirname }));

  // Error handling middleware (must be last)
  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
})();
