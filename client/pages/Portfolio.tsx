import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { usePortfolio } from "@/hooks/usePortfolio";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Wallet,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  EyeOff,
  Download,
  Calculator,
  PieChart as PieChartIcon,
} from "lucide-react";

interface PortfolioItem {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  avgBuyPrice: number;
  currentPrice: number;
  totalValue: number;
  gainLoss: number;
  gainLossPercent: number;
  lastUpdated: string;
}

interface Transaction {
  id: string;
  symbol: string;
  type: "buy" | "sell";
  amount: number;
  price: number;
  total: number;
  date: string;
  notes?: string;
}

const PORTFOLIO_COLORS = [
  "#5E8CBA",
  "#997AB8",
  "#6BB77B",
  "#F7B947",
  "#E74C3C",
  "#9B59B6",
  "#3498DB",
  "#1ABC9C",
  "#F39C12",
  "#E67E22",
];

export default function Portfolio() {
  const { isAuthenticated, user } = useAuth();
  const {
    holdings,
    transactions,
    summary,
    loading,
    error,
    createHolding,
    exportData,
  } = usePortfolio();

  const [hideBalances, setHideBalances] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state for adding new holdings
  const [newHolding, setNewHolding] = useState({
    symbol: "",
    amount: "",
    buyPrice: "",
    notes: "",
  });

  // Show login dialog if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background subtle-grid-bg refined-bg">
        <Navigation />
        <main className="container py-8 relative z-10">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="glass-card rounded-3xl p-12 refined-glow">
              <div className="space-y-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg mx-auto">
                  <Wallet className="h-8 w-8" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Portfolio Tracker
                </h1>
                <p className="text-xl text-foreground/80">
                  Sign in to track your crypto and currency investments
                </p>
                <AuthDialog>
                  <Button size="lg" className="px-8 py-3">
                    Sign In to Continue
                  </Button>
                </AuthDialog>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const handleAddHolding = () => {
    // In a real app, this would validate and save to backend
    const newId = Date.now().toString();
    const amount = parseFloat(newHolding.amount);
    const buyPrice = parseFloat(newHolding.buyPrice);

    // This would fetch current price from API
    const currentPrice = buyPrice * 1.1; // Simulated current price
    const totalValue = amount * currentPrice;
    const gainLoss = totalValue - amount * buyPrice;
    const gainLossPercent = (gainLoss / (amount * buyPrice)) * 100;

    const newPortfolioItem: PortfolioItem = {
      id: newId,
      symbol: newHolding.symbol.toUpperCase(),
      name: newHolding.symbol,
      amount,
      avgBuyPrice: buyPrice,
      currentPrice,
      totalValue,
      gainLoss,
      gainLossPercent,
      lastUpdated: new Date().toISOString(),
    };

    setPortfolio([...portfolio, newPortfolioItem]);
    setNewHolding({ symbol: "", amount: "", buyPrice: "", notes: "" });
    setIsAddModalOpen(false);
  };

  const exportPortfolio = () => {
    const dataStr = JSON.stringify({ portfolio, transactions }, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `portfolio-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  };

  const pieChartData = portfolio.map((item, index) => ({
    name: item.symbol,
    value: item.totalValue,
    color: PORTFOLIO_COLORS[index % PORTFOLIO_COLORS.length],
  }));

  return (
    <div className="min-h-screen bg-background subtle-grid-bg refined-bg">
      <Navigation />

      {/* Floating Elements */}
      <div className="fixed top-24 left-8 w-40 h-40 opacity-[0.02] animate-pulse duration-[3000ms]">
        <div className="w-full h-full rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-2xl"></div>
      </div>

      <main className="container py-8 relative z-10">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="glass-card rounded-3xl p-8 refined-glow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg">
                  <Wallet className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Portfolio Tracker
                  </h1>
                  <p className="text-xl text-foreground/80 font-medium mt-2">
                    Track your crypto and currency investments
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setHideBalances(!hideBalances)}
                  className="gap-2"
                >
                  {hideBalances ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                  {hideBalances ? "Show" : "Hide"} Balances
                </Button>
                <Button
                  onClick={exportPortfolio}
                  variant="outline"
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Holding
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Holding</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="symbol">Symbol/Currency</Label>
                        <Input
                          id="symbol"
                          placeholder="BTC, ETH, USD, etc."
                          value={newHolding.symbol}
                          onChange={(e) =>
                            setNewHolding({
                              ...newHolding,
                              symbol: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0.00"
                          value={newHolding.amount}
                          onChange={(e) =>
                            setNewHolding({
                              ...newHolding,
                              amount: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="buyPrice">Average Buy Price</Label>
                        <Input
                          id="buyPrice"
                          type="number"
                          placeholder="0.00"
                          value={newHolding.buyPrice}
                          onChange={(e) =>
                            setNewHolding({
                              ...newHolding,
                              buyPrice: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Input
                          id="notes"
                          placeholder="Investment notes..."
                          value={newHolding.notes}
                          onChange={(e) =>
                            setNewHolding({
                              ...newHolding,
                              notes: e.target.value,
                            })
                          }
                        />
                      </div>
                      <Button onClick={handleAddHolding} className="w-full">
                        Add Holding
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {/* Portfolio Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Value
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {hideBalances
                    ? "****"
                    : `${summary?.total_value.toLocaleString() || 0} ETB`}
                </div>
                <p className="text-xs text-muted-foreground">
                  ≈ $
                  {hideBalances
                    ? "****"
                    : ((summary?.total_value || 0) / 135).toFixed(2)}
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
                {totalGainLoss >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-subtle-green" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${(summary?.total_gain_loss || 0) >= 0 ? "text-subtle-green" : "text-red-500"}`}
                >
                  {hideBalances
                    ? "****"
                    : `${(summary?.total_gain_loss || 0) >= 0 ? "+" : ""}${(summary?.total_gain_loss || 0).toLocaleString()} ETB`}
                </div>
                <p
                  className={`text-xs ${(summary?.total_gain_loss_percent || 0) >= 0 ? "text-subtle-green" : "text-red-500"}`}
                >
                  {hideBalances
                    ? "****"
                    : `${(summary?.total_gain_loss_percent || 0) >= 0 ? "+" : ""}${(summary?.total_gain_loss_percent || 0).toFixed(2)}%`}
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Holdings</CardTitle>
                <PieChartIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {summary?.holdings_count || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Active positions
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Best Performer
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-subtle-green" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {summary?.best_performer || "N/A"}
                </div>
                <p className="text-xs text-subtle-green">
                  {holdings.length > 0 && summary?.best_performer
                    ? `+${
                        holdings
                          .find((h) => h.symbol === summary.best_performer)
                          ?.gain_loss_percent.toFixed(2) || "0"
                      }%`
                    : "0%"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Portfolio Details */}
          <Tabs defaultValue="holdings" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="holdings">Holdings</TabsTrigger>
              <TabsTrigger value="allocation">Allocation</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>

            <TabsContent value="holdings">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Portfolio Holdings</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Asset</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Avg Buy Price</TableHead>
                        <TableHead>Current Price</TableHead>
                        <TableHead>Total Value</TableHead>
                        <TableHead>P&L</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {holdings.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            <div>
                              <div className="font-semibold">{item.symbol}</div>
                              <div className="text-sm text-muted-foreground">
                                {item.name}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {hideBalances
                              ? "****"
                              : item.amount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {hideBalances
                              ? "****"
                              : `${item.avg_buy_price.toLocaleString()} ETB`}
                          </TableCell>
                          <TableCell>
                            {hideBalances
                              ? "****"
                              : `${item.current_price.toLocaleString()} ETB`}
                          </TableCell>
                          <TableCell>
                            {hideBalances
                              ? "****"
                              : `${item.total_value.toLocaleString()} ETB`}
                          </TableCell>
                          <TableCell>
                            <div
                              className={`flex items-center gap-2 ${item.gain_loss >= 0 ? "text-subtle-green" : "text-red-500"}`}
                            >
                              {item.gain_loss >= 0 ? (
                                <TrendingUp className="h-4 w-4" />
                              ) : (
                                <TrendingDown className="h-4 w-4" />
                              )}
                              <div>
                                <div className="font-semibold">
                                  {hideBalances
                                    ? "****"
                                    : `${item.gain_loss >= 0 ? "+" : ""}${item.gain_loss.toLocaleString()} ETB`}
                                </div>
                                <div className="text-sm">
                                  {hideBalances
                                    ? "****"
                                    : `${item.gain_loss_percent >= 0 ? "+" : ""}${item.gain_loss_percent.toFixed(2)}%`}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="allocation">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Portfolio Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(1)}%`
                          }
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => [
                            `${value.toLocaleString()} ETB`,
                            "Value",
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Asset</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell>{tx.date}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                tx.type === "buy" ? "default" : "destructive"
                              }
                            >
                              {tx.type.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {tx.symbol}
                          </TableCell>
                          <TableCell>{tx.amount.toLocaleString()}</TableCell>
                          <TableCell>{tx.price.toLocaleString()} ETB</TableCell>
                          <TableCell>{tx.total.toLocaleString()} ETB</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {tx.notes || "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
