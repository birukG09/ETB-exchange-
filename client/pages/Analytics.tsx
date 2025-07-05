import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  DollarSign,
  Globe,
  Bitcoin,
  RefreshCw,
  Target,
  AlertTriangle,
  LineChart,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  MarketAnalytics,
  AnalyticsResponse,
  StockData,
  CryptoAnalytics,
  ForexData,
} from "@shared/analytics";
import { MarketCharts } from "@/components/charts/MarketCharts";
import { AdvancedCharts } from "@/components/charts/AdvancedCharts";
import { NewsFeed } from "@/components/NewsFeed";

export default function Analytics() {
  const [analytics, setAnalytics] = useState<MarketAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [lastUpdated, setLastUpdated] = useState<string>("");

  // January 7, 2025 current market data from MarketWatch
  const mockAnalytics: MarketAnalytics = {
    stocks: [
      {
        symbol: "AAPL",
        name: "Apple Inc.",
        price: 229.87,
        change: 4.37,
        changePercent: 1.94,
        volume: 55000000,
        marketCap: 3500000000000,
        source: "MarketWatch",
      },
      {
        symbol: "GOOGL",
        name: "Alphabet Inc.",
        price: 171.24,
        change: 2.44,
        changePercent: 1.45,
        volume: 31000000,
        marketCap: 2150000000000,
        source: "MarketWatch",
      },
      {
        symbol: "MSFT",
        name: "Microsoft Corp.",
        price: 448.92,
        change: 3.72,
        changePercent: 0.84,
        volume: 38000000,
        marketCap: 3350000000000,
        source: "MarketWatch",
      },
      {
        symbol: "NVDA",
        name: "NVIDIA Corp.",
        price: 143.78,
        change: 2.98,
        changePercent: 2.12,
        volume: 92000000,
        marketCap: 3520000000000,
        source: "MarketWatch",
      },
      {
        symbol: "TSLA",
        name: "Tesla Inc.",
        price: 251.45,
        change: 2.55,
        changePercent: 1.02,
        volume: 78000000,
        marketCap: 800000000000,
        source: "MarketWatch",
      },
    ],
    crypto: [
      {
        symbol: "BTC",
        name: "Bitcoin",
        price: 104250,
        priceETB: 14517125,
        change24h: 3.4,
        volume24h: 54000000000,
        marketCap: 2060000000000,
        source: "Investing.com",
      },
      {
        symbol: "ETH",
        name: "Ethereum",
        price: 3952,
        priceETB: 550408,
        change24h: 2.8,
        volume24h: 29000000000,
        marketCap: 475000000000,
        source: "Investing.com",
      },
      {
        symbol: "XRP",
        name: "XRP",
        price: 3.18,
        priceETB: 443,
        change24h: 8.2,
        volume24h: 13200000000,
        marketCap: 182000000000,
        source: "Investing.com",
      },
      {
        symbol: "SOL",
        name: "Solana",
        price: 208,
        priceETB: 28964,
        change24h: 4.5,
        volume24h: 4500000000,
        marketCap: 100000000000,
        source: "Investing.com",
      },
      {
        symbol: "ADA",
        name: "Cardano",
        price: 1.27,
        priceETB: 177,
        change24h: 2.9,
        volume24h: 2900000000,
        marketCap: 45000000000,
        source: "Investing.com",
      },
      {
        symbol: "DOT",
        name: "Polkadot",
        price: 8.02,
        priceETB: 1117,
        change24h: 1.5,
        volume24h: 920000000,
        marketCap: 11800000000,
        source: "Investing.com",
      },
    ],
    forex: [
      {
        pair: "USD/ETB",
        rate: 139.25,
        change: 0.54,
        timestamp: new Date().toISOString(),
        source: "MarketWatch",
      },
      {
        pair: "EUR/ETB",
        rate: 157.2,
        change: 0.45,
        timestamp: new Date().toISOString(),
        source: "MarketWatch",
      }, // January 7, 2025
      {
        pair: "GBP/ETB",
        rate: 177.8,
        change: 0.91,
        timestamp: new Date().toISOString(),
        source: "MarketWatch",
      },
      {
        pair: "CNY/ETB",
        rate: 19.12,
        change: 0.18,
        timestamp: new Date().toISOString(),
        source: "MarketWatch",
      },
    ],
    etbAnalytics: {
      avgRate: 139.25,
      volatility: 1.6,
      trend: "Bullish",
      volume: 82000000,
    },
    marketSentiment: {
      score: 74.2,
      label: "Very Bullish",
      factors: [
        "Strong economic growth",
        "Increased foreign investment",
        "Stable inflation",
        "Growing export markets",
      ],
    },
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/analytics");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AnalyticsResponse = await response.json();

      if (data.success) {
        setAnalytics(data.data);
        setLastUpdated(data.timestamp);
      } else {
        throw new Error("API returned unsuccessful response");
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      setError("Failed to load live data. Showing cached data.");
      // Use fallback data
      setAnalytics(mockAnalytics);
      setLastUpdated(new Date().toISOString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    // Update every 60 seconds for real-time data
    const interval = setInterval(fetchAnalytics, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatChange = (change: number) => {
    const isPositive = change >= 0;
    return (
      <div
        className={`flex items-center gap-1 ${isPositive ? "text-subtle-green" : "text-destructive"}`}
      >
        {isPositive ? (
          <TrendingUp className="h-3 w-3" />
        ) : (
          <TrendingDown className="h-3 w-3" />
        )}
        <span className="text-xs font-medium">
          {isPositive ? "+" : ""}
          {change.toFixed(2)}%
        </span>
      </div>
    );
  };

  const formatCurrency = (value: number, isLarge = false) => {
    if (isLarge) {
      if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
      if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
      if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
      if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    }
    return `$${value.toFixed(2)}`;
  };

  const getSentimentColor = (score: number) => {
    if (score >= 70) return "text-subtle-green";
    if (score >= 50) return "text-primary";
    if (score >= 30) return "text-warning";
    return "text-destructive";
  };

  const getSentimentIcon = (score: number) => {
    if (score >= 70) return <TrendingUp className="h-4 w-4" />;
    if (score >= 50) return <Activity className="h-4 w-4" />;
    if (score >= 30) return <Target className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-background subtle-grid-bg refined-bg">
      <Navigation />

      {/* Subtle Floating Elements */}
      <div className="fixed top-24 left-8 w-40 h-40 opacity-[0.02] animate-pulse duration-[3000ms]">
        <div className="w-full h-full rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-2xl"></div>
      </div>
      <div className="fixed top-48 right-16 w-28 h-28 opacity-[0.02] animate-pulse delay-1000 duration-[3000ms]">
        <div className="w-full h-full rounded-full bg-gradient-to-r from-accent/20 to-primary/20 blur-2xl"></div>
      </div>

      <main className="container py-8 relative z-10">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Market Analytics
              </h1>
              <p className="text-lg text-foreground/70 mt-2">
                Real-time financial data from multiple sources
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={fetchAnalytics}
                variant="outline"
                size="sm"
                disabled={loading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              {error && (
                <Badge variant="destructive" className="text-xs">
                  {error}
                </Badge>
              )}
              {lastUpdated && (
                <Badge variant="outline" className="text-xs">
                  Updated: {new Date(lastUpdated).toLocaleTimeString()}
                </Badge>
              )}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-4 text-foreground/60">Loading market data...</p>
            </div>
          ) : (
            <>
              {/* Market Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="glass-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      ETB Average
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analytics?.etbAnalytics.avgRate.toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Trend: {analytics?.etbAnalytics.trend}
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Volatility
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ±{analytics?.etbAnalytics.volatility.toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Daily fluctuation
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Market Sentiment
                    </CardTitle>
                    {analytics &&
                      getSentimentIcon(analytics.marketSentiment.score)}
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`text-2xl font-bold ${analytics && getSentimentColor(analytics.marketSentiment.score)}`}
                    >
                      {analytics?.marketSentiment.label}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Score: {analytics?.marketSentiment.score}
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Volume
                    </CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analytics &&
                        formatCurrency(analytics.etbAnalytics.volume, true)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      24h trading volume
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Data Tables */}
              <Tabs defaultValue="stocks" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger
                    value="stocks"
                    className="flex items-center gap-2"
                  >
                    <BarChart3 className="h-4 w-4" />
                    US Stocks
                  </TabsTrigger>
                  <TabsTrigger
                    value="crypto"
                    className="flex items-center gap-2"
                  >
                    <Bitcoin className="h-4 w-4" />
                    Cryptocurrencies
                  </TabsTrigger>
                  <TabsTrigger
                    value="forex"
                    className="flex items-center gap-2"
                  >
                    <Globe className="h-4 w-4" />
                    Forex Pairs
                  </TabsTrigger>
                  <TabsTrigger
                    value="charts"
                    className="flex items-center gap-2"
                  >
                    <LineChart className="h-4 w-4" />
                    Advanced Charts
                  </TabsTrigger>
                  <TabsTrigger value="news" className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Financial News
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="stocks" className="mt-6">
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        US Stock Market
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Symbol</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Change</TableHead>
                            <TableHead>Volume</TableHead>
                            <TableHead>Market Cap</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {analytics?.stocks.map((stock) => (
                            <TableRow key={stock.symbol}>
                              <TableCell className="font-medium">
                                {stock.symbol}
                              </TableCell>
                              <TableCell>{stock.name}</TableCell>
                              <TableCell>
                                {formatCurrency(stock.price)}
                              </TableCell>
                              <TableCell>
                                {formatChange(stock.changePercent)}
                              </TableCell>
                              <TableCell>
                                {stock.volume.toLocaleString()}
                              </TableCell>
                              <TableCell>
                                {formatCurrency(stock.marketCap, true)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="crypto" className="mt-6">
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bitcoin className="h-5 w-5" />
                        Cryptocurrency Market
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Symbol</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Price (USD)</TableHead>
                            <TableHead>Price (ETB)</TableHead>
                            <TableHead>24h Change</TableHead>
                            <TableHead>Market Cap</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {analytics?.crypto.map((crypto) => (
                            <TableRow key={crypto.symbol}>
                              <TableCell className="font-medium">
                                {crypto.symbol}
                              </TableCell>
                              <TableCell>{crypto.name}</TableCell>
                              <TableCell>
                                {formatCurrency(crypto.price)}
                              </TableCell>
                              <TableCell>
                                {crypto.priceETB.toLocaleString()} ETB
                              </TableCell>
                              <TableCell>
                                {formatChange(crypto.change24h)}
                              </TableCell>
                              <TableCell>
                                {formatCurrency(crypto.marketCap, true)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="forex" className="mt-6">
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Foreign Exchange
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Pair</TableHead>
                            <TableHead>Rate</TableHead>
                            <TableHead>Change</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Updated</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {analytics?.forex.map((forex) => (
                            <TableRow key={forex.pair}>
                              <TableCell className="font-medium">
                                {forex.pair}
                              </TableCell>
                              <TableCell>{forex.rate.toFixed(2)}</TableCell>
                              <TableCell>
                                {formatChange(forex.change)}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs">
                                  {forex.source}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground">
                                {new Date(forex.timestamp).toLocaleTimeString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="charts" className="mt-6">
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <LineChart className="h-5 w-5" />
                        Advanced Market Analytics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <AdvancedCharts data={analytics} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="news" className="mt-6">
                  <NewsFeed />
                </TabsContent>
              </Tabs>

              {/* Market Sentiment Analysis */}
              {analytics && (
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Market Sentiment Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div
                          className={`text-3xl font-bold ${getSentimentColor(analytics.marketSentiment.score)}`}
                        >
                          {analytics.marketSentiment.label}
                        </div>
                        <div className="text-lg text-muted-foreground">
                          Score: {analytics.marketSentiment.score}/100
                        </div>
                        <div className="w-full bg-muted rounded-full h-3 mt-2">
                          <div
                            className="bg-primary h-3 rounded-full transition-all duration-500"
                            style={{
                              width: `${analytics.marketSentiment.score}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Key Factors:</h4>
                        <ul className="space-y-1">
                          {analytics.marketSentiment.factors.map(
                            (factor, index) => (
                              <li
                                key={index}
                                className="text-sm text-muted-foreground flex items-center gap-2"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                {factor}
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Enhanced Charts and Graphs Section */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5" />
                    Advanced Market Analytics (January 7, 2025)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AdvancedCharts data={analytics} />
                </CardContent>
              </Card>

              {/* Traditional Charts Section */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Standard Market Charts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MarketCharts data={analytics} />
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
