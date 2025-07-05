import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleGetRates, handleGetCryptoRates } from "./routes/rates";
import {
  handleGetAnalytics,
  handleGetHistoricalData,
} from "./routes/analytics";
import {
  handleRegister,
  handleLogin,
  handleLogout,
  handleGetProfile,
  handleUpdateProfile,
} from "./routes/auth";
import {
  handleGetPortfolio,
  handleCreateHolding,
  handleUpdateHolding,
  handleDeleteHolding,
  handleGetTransactions,
  handleCreateTransaction,
  handleExportData,
} from "./routes/portfolio";
import { authenticateToken, optionalAuth } from "./middleware/auth";
import { db } from "./database/database";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Exchange rates API
  app.get("/api/rates", handleGetRates);
  app.get("/api/rates/crypto", handleGetCryptoRates);

  // Analytics API
  app.get("/api/analytics", handleGetAnalytics);
  app.get("/api/analytics/historical", handleGetHistoricalData);

  // Authentication Routes
  app.post("/api/auth/register", handleRegister);
  app.post("/api/auth/login", handleLogin);
  app.post("/api/auth/logout", authenticateToken, handleLogout);
  app.get("/api/auth/profile", authenticateToken, handleGetProfile);
  app.put("/api/auth/profile", authenticateToken, handleUpdateProfile);

  // Portfolio Routes (Protected)
  app.get("/api/portfolio", authenticateToken, handleGetPortfolio);
  app.post("/api/portfolio/holdings", authenticateToken, handleCreateHolding);
  app.put(
    "/api/portfolio/holdings/:holdingId",
    authenticateToken,
    handleUpdateHolding,
  );
  app.delete(
    "/api/portfolio/holdings/:holdingId",
    authenticateToken,
    handleDeleteHolding,
  );
  app.get(
    "/api/portfolio/transactions",
    authenticateToken,
    handleGetTransactions,
  );
  app.post(
    "/api/portfolio/transactions",
    authenticateToken,
    handleCreateTransaction,
  );
  app.get("/api/portfolio/export", authenticateToken, handleExportData);

  // Test endpoint
  app.get("/api/test", (_req, res) => {
    res.json({
      message: "Server is working with database!",
      timestamp: new Date().toISOString(),
    });
  });

  return app;
}
