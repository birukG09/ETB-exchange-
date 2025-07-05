import { useState, useEffect } from "react";
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
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Bitcoin,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Activity,
  DollarSign,
  BarChart3,
} from "lucide-react";
import { ExchangeRate, RatesResponse } from "@shared/rates";

interface CryptoDashboardProps {
  className?: string;
}

// Generate crypto chart data
const generateCryptoChartData = (symbol: string, basePrice: number) => {
  const data = [];
  const days = 7; // Last 7 days

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const trend = Math.sin(i / 2) * 0.05;
    const volatility = (Math.random() - 0.5) * 0.08;
    const price = basePrice * (1 + trend + volatility);

    data.push({
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      [symbol]: parseFloat(price.toFixed(2)),
      volume: Math.floor(Math.random() * 10000000000),
    });
  }

  return data;
};

export function CryptoDashboard({ className }: CryptoDashboardProps) {
  const [cryptoRates, setCryptoRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchCryptoData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/rates/crypto");
      const data: RatesResponse = await response.json();

      if (data.success) {
        setCryptoRates(data.data);
        setLastUpdated(new Date().toISOString());
      }
    } catch (error) {
      console.error("Failed to fetch crypto data:", error);
      // Fallback data with current prices (ETB converted at ~135 rate)
      setCryptoRates([
        {
          currency: "BTC",
          currencyName: "Bitcoin",
          flag: "₿",
          buyRate: 14598000, // $108,134 * 135 ETB * 0.98
          sellRate: 14896000, // $108,134 * 135 ETB * 1.02
          midRate: 14598100, // $108,134 * 135 ETB
          change24h: 2.1,
          source: "Fallback Data",
          lastUpdated: new Date().toISOString(),
        },
        {
          currency: "ETH",
          currencyName: "Ethereum",
          flag: "Ξ",
          buyRate: 514957, // $3,891 * 135 ETB * 0.98
          sellRate: 525069, // $3,891 * 135 ETB * 1.02
          midRate: 525285, // $3,891 * 135 ETB
          change24h: 1.8,
          source: "Fallback Data",
          lastUpdated: new Date().toISOString(),
        },
        {
          currency: "XRP",
          currencyName: "XRP",
          flag: "◈",
          buyRate: 424, // $3.21 * 135 ETB * 0.98
          sellRate: 442, // $3.21 * 135 ETB * 1.02
          midRate: 433, // $3.21 * 135 ETB
          change24h: 4.2,
          source: "Fallback Data",
          lastUpdated: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(2) + "M";
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + "K";
    }
    return value.toLocaleString();
  };

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

  const getMarketCap = (price: number) => {
    // Simplified market cap calculation
    const priceUSD = price / 138.5; // Convert from ETB to USD
    const supplies: Record<string, number> = {
      BTC: 19700000,
      ETH: 120000000,
      XRP: 57000000000,
      BNB: 153000000,
      SOL: 580000000,
      ADA: 35000000000,
    };

    return priceUSD * (supplies[cryptoRates[0]?.currency] || 1000000);
  };

  const chartData =
    cryptoRates.length > 0 ? generateCryptoChartData("BTC", 102800) : [];

  return (
    <div className={className}>
      <Tabs defaultValue="overview" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="market">Market</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-4">
            <Button
              onClick={fetchCryptoData}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Badge variant="outline" className="text-xs">
              Investing.com
            </Badge>
          </div>
        </div>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Market Cap
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2.95T</div>
                <p className="text-xs text-subtle-green">+2.8% 24h</p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  24h Volume
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$142B</div>
                <p className="text-xs text-muted-foreground">
                  Across all pairs
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  BTC Dominance
                </CardTitle>
                <Bitcoin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">58.2%</div>
                <p className="text-xs text-subtle-green">+0.5%</p>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bitcoin className="h-5 w-5" />
                Top Cryptocurrencies (ETB)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="mt-2 text-foreground/60">
                    Loading crypto data...
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset</TableHead>
                      <TableHead>Price (ETB)</TableHead>
                      <TableHead>24h Change</TableHead>
                      <TableHead>Market Cap</TableHead>
                      <TableHead>Source</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cryptoRates.map((crypto) => (
                      <TableRow key={crypto.currency}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{crypto.flag}</span>
                            <div>
                              <div className="font-bold">{crypto.currency}</div>
                              <div className="text-xs text-muted-foreground">
                                {crypto.currencyName}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">
                          {formatCurrency(crypto.midRate)} ETB
                        </TableCell>
                        <TableCell>{formatChange(crypto.change24h)}</TableCell>
                        <TableCell>
                          ${(getMarketCap(crypto.midRate) / 1e9).toFixed(1)}B
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {crypto.source}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="mt-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Bitcoin Price Chart (7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="btcGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="BTC"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#btcGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="market" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Fear & Greed Index</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-subtle-green mb-2">
                    74
                  </div>
                  <div className="text-lg text-subtle-green">Greed</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Market sentiment is showing strong buying pressure
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Market Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-subtle-green mt-2"></div>
                    <div>
                      <p className="text-sm">
                        Bitcoin reaches new monthly high
                      </p>
                      <p className="text-xs text-muted-foreground">
                        2 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <div>
                      <p className="text-sm">
                        Ethereum network upgrade successful
                      </p>
                      <p className="text-xs text-muted-foreground">
                        5 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent mt-2"></div>
                    <div>
                      <p className="text-sm">XRP shows strong momentum</p>
                      <p className="text-xs text-muted-foreground">
                        8 hours ago
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
