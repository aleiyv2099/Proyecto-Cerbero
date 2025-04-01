import * as express from "express";
import * as dotenv from "dotenv";
import * as cors from "cors";
import "reflect-metadata";
import { AppDataSource } from "./adapters/database/data-source";
import { Middleware } from "./adapters/http/middleware/middleware";

// Import routes
import userRoutes from "./adapters/http/routes/user.routes";
import personaRoutes from "./adapters/http/routes/persona.routes";
import roleRoutes from "./adapters/http/routes/role.routes";
import sessionRoutes from "./adapters/http/routes/session.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(Middleware.errorHandler);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/personas", personaRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/sessions", sessionRoutes);

// 404 Handler
app.get("*", (req: express.Request, res: express.Response) => {
  res.status(404).json({ message: "Page not found" });
});

// Initialize database and start server
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully!");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });