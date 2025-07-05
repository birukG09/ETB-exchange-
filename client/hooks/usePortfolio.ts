import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

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

export interface PortfolioSummary {
  total_value: number;
  total_gain_loss: number;
  total_gain_loss_percent: number;
  holdings_count: number;
  best_performer: string | null;
  worst_performer: string | null;
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

export const usePortfolio = () => {
  const { token, isAuthenticated } = useAuth();
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const fetchPortfolio = useCallback(async () => {
    if (!isAuthenticated || !token) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/portfolio", {
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch portfolio");
      }

      setHoldings(data.data.holdings);
      setSummary(data.data.summary);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch portfolio",
      );
      console.error("Portfolio fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  const fetchTransactions = useCallback(
    async (limit: number = 50) => {
      if (!isAuthenticated || !token) return;

      try {
        const response = await fetch(
          `/api/portfolio/transactions?limit=${limit}`,
          {
            headers: getAuthHeaders(),
          },
        );

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch transactions");
        }

        setTransactions(data.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch transactions",
        );
        console.error("Transactions fetch error:", err);
      }
    },
    [isAuthenticated, token],
  );

  const createHolding = async (
    holdingData: CreateHoldingData,
  ): Promise<PortfolioHolding> => {
    if (!isAuthenticated || !token) {
      throw new Error("Not authenticated");
    }

    try {
      const response = await fetch("/api/portfolio/holdings", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(holdingData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to create holding");
      }

      // Refresh portfolio after creating holding
      await fetchPortfolio();

      return data.data;
    } catch (err) {
      const error =
        err instanceof Error ? err.message : "Failed to create holding";
      setError(error);
      throw new Error(error);
    }
  };

  const updateHolding = async (
    holdingId: string,
    updateData: Partial<CreateHoldingData>,
  ): Promise<PortfolioHolding> => {
    if (!isAuthenticated || !token) {
      throw new Error("Not authenticated");
    }

    try {
      const response = await fetch(`/api/portfolio/holdings/${holdingId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to update holding");
      }

      // Refresh portfolio after updating holding
      await fetchPortfolio();

      return data.data;
    } catch (err) {
      const error =
        err instanceof Error ? err.message : "Failed to update holding";
      setError(error);
      throw new Error(error);
    }
  };

  const deleteHolding = async (holdingId: string): Promise<void> => {
    if (!isAuthenticated || !token) {
      throw new Error("Not authenticated");
    }

    try {
      const response = await fetch(`/api/portfolio/holdings/${holdingId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to delete holding");
      }

      // Refresh portfolio after deleting holding
      await fetchPortfolio();
    } catch (err) {
      const error =
        err instanceof Error ? err.message : "Failed to delete holding";
      setError(error);
      throw new Error(error);
    }
  };

  const createTransaction = async (
    transactionData: CreateTransactionData,
  ): Promise<Transaction> => {
    if (!isAuthenticated || !token) {
      throw new Error("Not authenticated");
    }

    try {
      const response = await fetch("/api/portfolio/transactions", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(transactionData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to create transaction");
      }

      // Refresh portfolio and transactions after creating transaction
      await Promise.all([fetchPortfolio(), fetchTransactions()]);

      return data.data;
    } catch (err) {
      const error =
        err instanceof Error ? err.message : "Failed to create transaction";
      setError(error);
      throw new Error(error);
    }
  };

  const exportData = async () => {
    if (!isAuthenticated || !token) {
      throw new Error("Not authenticated");
    }

    try {
      const response = await fetch("/api/portfolio/export", {
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to export data");
      }

      // Create and download file
      const dataStr = JSON.stringify(data.data, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `portfolio-export-${new Date().toISOString().split("T")[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      const error =
        err instanceof Error ? err.message : "Failed to export data";
      setError(error);
      throw new Error(error);
    }
  };

  // Fetch portfolio on mount and when authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchPortfolio();
      fetchTransactions();
    } else {
      setHoldings([]);
      setTransactions([]);
      setSummary(null);
    }
  }, [isAuthenticated, fetchPortfolio, fetchTransactions]);

  return {
    holdings,
    transactions,
    summary,
    loading,
    error,
    createHolding,
    updateHolding,
    deleteHolding,
    createTransaction,
    exportData,
    refreshPortfolio: fetchPortfolio,
    refreshTransactions: fetchTransactions,
  };
};
