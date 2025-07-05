import { RequestHandler } from "express";
import {
  PortfolioService,
  CreateHoldingData,
  CreateTransactionData,
} from "../services/portfolioService";
import { AuthenticatedRequest } from "../middleware/auth";

export const handleGetPortfolio: RequestHandler = async (
  req: AuthenticatedRequest,
  res,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
      return;
    }

    const [portfolio, summary] = await Promise.all([
      PortfolioService.getUserPortfolio(userId),
      PortfolioService.getPortfolioSummary(userId),
    ]);

    res.json({
      success: true,
      data: {
        holdings: portfolio,
        summary,
      },
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Get portfolio error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch portfolio",
    });
  }
};

export const handleCreateHolding: RequestHandler = async (
  req: AuthenticatedRequest,
  res,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
      return;
    }

    const {
      symbol,
      name,
      asset_type,
      amount,
      avg_buy_price,
      notes,
    }: CreateHoldingData = req.body;

    // Basic validation
    if (!symbol || !name || !asset_type || !amount || !avg_buy_price) {
      res.status(400).json({
        success: false,
        error:
          "Symbol, name, asset_type, amount, and avg_buy_price are required",
      });
      return;
    }

    if (amount <= 0 || avg_buy_price <= 0) {
      res.status(400).json({
        success: false,
        error: "Amount and price must be positive numbers",
      });
      return;
    }

    const holding = await PortfolioService.createHolding(userId, {
      symbol: symbol.toUpperCase(),
      name,
      asset_type,
      amount,
      avg_buy_price,
      notes,
    });

    res.status(201).json({
      success: true,
      data: holding,
      message: "Holding created successfully",
    });
  } catch (error) {
    console.error("Create holding error:", error);
    res.status(400).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create holding",
    });
  }
};

export const handleUpdateHolding: RequestHandler = async (
  req: AuthenticatedRequest,
  res,
) => {
  try {
    const userId = req.user?.id;
    const { holdingId } = req.params;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
      return;
    }

    // Verify holding belongs to user
    const holding = await PortfolioService.getHoldingById(holdingId);
    if (holding.user_id !== userId) {
      res.status(403).json({
        success: false,
        error: "Unauthorized access to holding",
      });
      return;
    }

    const { amount, avg_buy_price, notes } = req.body;
    const updateData: any = {};

    if (amount !== undefined) {
      if (amount < 0) {
        res.status(400).json({
          success: false,
          error: "Amount must be non-negative",
        });
        return;
      }
      updateData.amount = amount;
    }

    if (avg_buy_price !== undefined) {
      if (avg_buy_price <= 0) {
        res.status(400).json({
          success: false,
          error: "Price must be positive",
        });
        return;
      }
      updateData.avg_buy_price = avg_buy_price;
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const updatedHolding = await PortfolioService.updateHolding(
      holdingId,
      updateData,
    );

    res.json({
      success: true,
      data: updatedHolding,
      message: "Holding updated successfully",
    });
  } catch (error) {
    console.error("Update holding error:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update holding",
    });
  }
};

export const handleDeleteHolding: RequestHandler = async (
  req: AuthenticatedRequest,
  res,
) => {
  try {
    const userId = req.user?.id;
    const { holdingId } = req.params;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
      return;
    }

    // Verify holding belongs to user
    const holding = await PortfolioService.getHoldingById(holdingId);
    if (holding.user_id !== userId) {
      res.status(403).json({
        success: false,
        error: "Unauthorized access to holding",
      });
      return;
    }

    await PortfolioService.deleteHolding(holdingId);

    res.json({
      success: true,
      message: "Holding deleted successfully",
    });
  } catch (error) {
    console.error("Delete holding error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete holding",
    });
  }
};

export const handleGetTransactions: RequestHandler = async (
  req: AuthenticatedRequest,
  res,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
      return;
    }

    const limit = parseInt(req.query.limit as string) || 50;
    const transactions = await PortfolioService.getUserTransactions(
      userId,
      limit,
    );

    res.json({
      success: true,
      data: transactions,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Get transactions error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch transactions",
    });
  }
};

export const handleCreateTransaction: RequestHandler = async (
  req: AuthenticatedRequest,
  res,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
      return;
    }

    const {
      holding_id,
      symbol,
      transaction_type,
      amount,
      price,
      fees,
      exchange,
      notes,
      transaction_date,
    }: CreateTransactionData = req.body;

    // Basic validation
    if (!symbol || !transaction_type || !amount || !price) {
      res.status(400).json({
        success: false,
        error: "Symbol, transaction_type, amount, and price are required",
      });
      return;
    }

    if (amount <= 0 || price <= 0) {
      res.status(400).json({
        success: false,
        error: "Amount and price must be positive numbers",
      });
      return;
    }

    if (!["buy", "sell"].includes(transaction_type)) {
      res.status(400).json({
        success: false,
        error: "Transaction type must be 'buy' or 'sell'",
      });
      return;
    }

    // If holding_id provided, verify it belongs to user
    if (holding_id) {
      const holding = await PortfolioService.getHoldingById(holding_id);
      if (holding.user_id !== userId) {
        res.status(403).json({
          success: false,
          error: "Unauthorized access to holding",
        });
        return;
      }
    }

    const transaction = await PortfolioService.createTransaction(userId, {
      holding_id,
      symbol: symbol.toUpperCase(),
      transaction_type,
      amount,
      price,
      fees,
      exchange,
      notes,
      transaction_date,
    });

    res.status(201).json({
      success: true,
      data: transaction,
      message: "Transaction created successfully",
    });
  } catch (error) {
    console.error("Create transaction error:", error);
    res.status(400).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create transaction",
    });
  }
};

export const handleExportData: RequestHandler = async (
  req: AuthenticatedRequest,
  res,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
      return;
    }

    const exportData = await PortfolioService.exportUserData(userId);

    res.json({
      success: true,
      data: exportData,
      exported_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Export data error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to export data",
    });
  }
};
