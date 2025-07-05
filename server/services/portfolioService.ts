import { v4 as uuidv4 } from "uuid";
import { db } from "../database/database";

export interface PortfolioHolding {
  id: string;
  user_id: string;
  symbol: string;
  name: string;
  asset_type: "crypto" | "fiat" | "stock";
  amount: number;
  avg_buy_price: number;
  current_price: number;
  total_value: number;
  gain_loss: number;
  gain_loss_percent: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  holding_id?: string;
  symbol: string;
  transaction_type: "buy" | "sell";
  amount: number;
  price: number;
  total: number;
  fees: number;
  exchange?: string;
  notes?: string;
  transaction_date: string;
  created_at: string;
}

export interface CreateHoldingData {
  symbol: string;
  name: string;
  asset_type: "crypto" | "fiat" | "stock";
  amount: number;
  avg_buy_price: number;
  notes?: string;
}

export interface CreateTransactionData {
  holding_id?: string;
  symbol: string;
  transaction_type: "buy" | "sell";
  amount: number;
  price: number;
  fees?: number;
  exchange?: string;
  notes?: string;
  transaction_date?: string;
}

export interface PortfolioSummary {
  total_value: number;
  total_gain_loss: number;
  total_gain_loss_percent: number;
  holdings_count: number;
  best_performer: string | null;
  worst_performer: string | null;
}

export class PortfolioService {
  static async getUserPortfolio(userId: string): Promise<PortfolioHolding[]> {
    const holdings = await db.all(
      `SELECT * FROM portfolio_holdings WHERE user_id = ? ORDER BY total_value DESC`,
      [userId],
    );

    // Update current prices and recalculate values
    for (const holding of holdings) {
      await this.updateHoldingPrice(holding.id, holding.current_price);
    }

    return holdings;
  }

  static async getPortfolioSummary(userId: string): Promise<PortfolioSummary> {
    const holdings = await this.getUserPortfolio(userId);

    if (holdings.length === 0) {
      return {
        total_value: 0,
        total_gain_loss: 0,
        total_gain_loss_percent: 0,
        holdings_count: 0,
        best_performer: null,
        worst_performer: null,
      };
    }

    const totalValue = holdings.reduce((sum, h) => sum + h.total_value, 0);
    const totalGainLoss = holdings.reduce((sum, h) => sum + h.gain_loss, 0);
    const totalInvested = totalValue - totalGainLoss;
    const totalGainLossPercent =
      totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

    const bestPerformer = holdings.reduce(
      (best, h) =>
        h.gain_loss_percent > (best?.gain_loss_percent || -Infinity) ? h : best,
      holdings[0],
    );

    const worstPerformer = holdings.reduce(
      (worst, h) =>
        h.gain_loss_percent < (worst?.gain_loss_percent || Infinity)
          ? h
          : worst,
      holdings[0],
    );

    return {
      total_value: totalValue,
      total_gain_loss: totalGainLoss,
      total_gain_loss_percent: totalGainLossPercent,
      holdings_count: holdings.length,
      best_performer: bestPerformer?.symbol || null,
      worst_performer: worstPerformer?.symbol || null,
    };
  }

  static async createHolding(
    userId: string,
    holdingData: CreateHoldingData,
  ): Promise<PortfolioHolding> {
    const { symbol, name, asset_type, amount, avg_buy_price, notes } =
      holdingData;

    // Check if holding already exists
    const existingHolding = await db.get(
      "SELECT id FROM portfolio_holdings WHERE user_id = ? AND symbol = ? AND asset_type = ?",
      [userId, symbol, asset_type],
    );

    if (existingHolding) {
      throw new Error(
        `Holding for ${symbol} already exists. Use update instead.`,
      );
    }

    const holdingId = uuidv4();
    const currentPrice = avg_buy_price; // Initially set to buy price
    const totalValue = amount * currentPrice;
    const gainLoss = 0; // Initially no gain/loss
    const gainLossPercent = 0;

    await db.run(
      `INSERT INTO portfolio_holdings 
       (id, user_id, symbol, name, asset_type, amount, avg_buy_price, current_price, total_value, gain_loss, gain_loss_percent, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        holdingId,
        userId,
        symbol,
        name,
        asset_type,
        amount,
        avg_buy_price,
        currentPrice,
        totalValue,
        gainLoss,
        gainLossPercent,
        notes,
      ],
    );

    return this.getHoldingById(holdingId);
  }

  static async updateHolding(
    holdingId: string,
    updateData: Partial<CreateHoldingData>,
  ): Promise<PortfolioHolding> {
    const allowedFields = ["amount", "avg_buy_price", "notes"];
    const updates = Object.keys(updateData)
      .filter((key) => allowedFields.includes(key))
      .map((key) => `${key} = ?`)
      .join(", ");

    if (updates.length === 0) {
      throw new Error("No valid fields to update");
    }

    const values = Object.keys(updateData)
      .filter((key) => allowedFields.includes(key))
      .map((key) => updateData[key as keyof CreateHoldingData]);

    await db.run(
      `UPDATE portfolio_holdings SET ${updates}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [...values, holdingId],
    );

    // Recalculate values
    const holding = await this.getHoldingById(holdingId);
    await this.updateHoldingPrice(holdingId, holding.current_price);

    return this.getHoldingById(holdingId);
  }

  static async updateHoldingPrice(
    holdingId: string,
    newPrice: number,
  ): Promise<void> {
    const holding = await this.getHoldingById(holdingId);

    const totalValue = holding.amount * newPrice;
    const totalCost = holding.amount * holding.avg_buy_price;
    const gainLoss = totalValue - totalCost;
    const gainLossPercent = totalCost > 0 ? (gainLoss / totalCost) * 100 : 0;

    await db.run(
      `UPDATE portfolio_holdings 
       SET current_price = ?, total_value = ?, gain_loss = ?, gain_loss_percent = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [newPrice, totalValue, gainLoss, gainLossPercent, holdingId],
    );
  }

  static async deleteHolding(holdingId: string): Promise<void> {
    await db.run("DELETE FROM portfolio_holdings WHERE id = ?", [holdingId]);
  }

  static async getHoldingById(holdingId: string): Promise<PortfolioHolding> {
    const holding = await db.get(
      "SELECT * FROM portfolio_holdings WHERE id = ?",
      [holdingId],
    );

    if (!holding) {
      throw new Error("Holding not found");
    }

    return holding;
  }

  static async getUserTransactions(
    userId: string,
    limit: number = 50,
  ): Promise<Transaction[]> {
    return db.all(
      `SELECT * FROM transactions WHERE user_id = ? ORDER BY transaction_date DESC LIMIT ?`,
      [userId, limit],
    );
  }

  static async createTransaction(
    userId: string,
    transactionData: CreateTransactionData,
  ): Promise<Transaction> {
    const {
      holding_id,
      symbol,
      transaction_type,
      amount,
      price,
      fees = 0,
      exchange,
      notes,
      transaction_date = new Date().toISOString(),
    } = transactionData;

    const transactionId = uuidv4();
    const total = amount * price;

    await db.transaction(async () => {
      // Insert transaction
      await db.run(
        `INSERT INTO transactions 
         (id, user_id, holding_id, symbol, transaction_type, amount, price, total, fees, exchange, notes, transaction_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          transactionId,
          userId,
          holding_id,
          symbol,
          transaction_type,
          amount,
          price,
          total,
          fees,
          exchange,
          notes,
          transaction_date,
        ],
      );

      // Update holding if provided
      if (holding_id) {
        const holding = await this.getHoldingById(holding_id);

        if (transaction_type === "buy") {
          // Add to existing holding
          const newAmount = holding.amount + amount;
          const newTotalCost = holding.amount * holding.avg_buy_price + total;
          const newAvgPrice = newTotalCost / newAmount;

          await db.run(
            `UPDATE portfolio_holdings 
             SET amount = ?, avg_buy_price = ?, updated_at = CURRENT_TIMESTAMP 
             WHERE id = ?`,
            [newAmount, newAvgPrice, holding_id],
          );
        } else if (transaction_type === "sell") {
          // Subtract from existing holding
          const newAmount = Math.max(0, holding.amount - amount);

          await db.run(
            `UPDATE portfolio_holdings 
             SET amount = ?, updated_at = CURRENT_TIMESTAMP 
             WHERE id = ?`,
            [newAmount, holding_id],
          );
        }

        // Recalculate values
        await this.updateHoldingPrice(holding_id, holding.current_price);
      }
    });

    return this.getTransactionById(transactionId);
  }

  static async getTransactionById(transactionId: string): Promise<Transaction> {
    const transaction = await db.get(
      "SELECT * FROM transactions WHERE id = ?",
      [transactionId],
    );

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    return transaction;
  }

  static async deleteTransaction(transactionId: string): Promise<void> {
    await db.run("DELETE FROM transactions WHERE id = ?", [transactionId]);
  }

  static async exportUserData(userId: string): Promise<{
    portfolio: PortfolioHolding[];
    transactions: Transaction[];
    summary: PortfolioSummary;
  }> {
    const [portfolio, transactions, summary] = await Promise.all([
      this.getUserPortfolio(userId),
      this.getUserTransactions(userId, 1000), // Get all transactions
      this.getPortfolioSummary(userId),
    ]);

    return { portfolio, transactions, summary };
  }
}
