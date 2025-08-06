import { loadControllers } from "awilix-express";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { loadContainer } from "./container.js";
import { __dirname } from "./utils.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { specs } from "./swagger.js";

const app = express();
const port = process.env.PORT || "3000";

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize container and start server
(async () => {
  await loadContainer(app);

  // Swagger UI
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      customSiteTitle: "Transaction Rules API Documentation",
    }),
  );

  app.use(loadControllers("controllers/*.ts", { cwd: __dirname }));

  // Error handling middleware (must be last)
  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    console.log(
      `API Documentation available at: http://localhost:${port}/api-docs`,
    );
  });
})();
