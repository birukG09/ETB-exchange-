import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Treemap,
  ScatterChart,
  Scatter,
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Radar as RadarIcon,
  Target,
  Layers,
} from "lucide-react";

// Generate comprehensive market data for January 7, 2025
const generateMarketData = () => {
  const dates = [];
  const today = new Date("2025-01-07");

  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const baseUSD = 139.25;
    const baseEUR = 157.2;
    const baseBTC = 104250;

    const trend = Math.sin(i / 5) * 0.02;
    const volatility = (Math.random() - 0.5) * 0.03;

    dates.push({
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      fullDate: date.toISOString().split("T")[0],
      USD_ETB: parseFloat((baseUSD * (1 + trend + volatility)).toFixed(2)),
      EUR_ETB: parseFloat(
        (baseEUR * (1 + trend + volatility * 0.8)).toFixed(2),
      ),
      BTC_USD: parseFloat(
        (baseBTC * (1 + trend * 2 + volatility * 2)).toFixed(0),
      ),
      volume: Math.floor(Math.random() * 100000000),
      volatility: Math.abs(volatility) * 100,
    });
  }

  return dates;
};

const generateCurrencyComparison = () => [
  {
    currency: "USD",
    rate: 139.25,
    volume: 45000000,
    volatility: 1.2,
    marketShare: 35,
  },
  {
    currency: "EUR",
    rate: 157.2,
    volume: 28000000,
    volatility: 1.8,
    marketShare: 22,
  },
  {
    currency: "GBP",
    rate: 177.8,
    volume: 15000000,
    volatility: 2.1,
    marketShare: 12,
  },
  {
    currency: "JPY",
    rate: 0.94,
    volume: 38000000,
    volatility: 0.8,
    marketShare: 18,
  },
  {
    currency: "CNY",
    rate: 19.12,
    volume: 22000000,
    volatility: 1.5,
    marketShare: 8,
  },
  {
    currency: "Others",
    rate: 0,
    volume: 12000000,
    volatility: 2.5,
    marketShare: 5,
  },
];

const generateCryptoTreemap = () => [
  { name: "Bitcoin", size: 1950000, value: 104250, change: 3.4 },
  { name: "Ethereum", size: 468000, value: 3952, change: 2.8 },
  { name: "BNB", size: 112000, value: 738, change: 1.6 },
  { name: "XRP", size: 178000, value: 3.18, change: 8.2 },
  { name: "Solana", size: 98000, value: 208, change: 4.5 },
  { name: "Cardano", size: 44000, value: 1.27, change: 2.9 },
  { name: "Others", size: 285000, value: 0, change: 1.8 },
];

const generateRadarData = () => [
  {
    metric: "Liquidity",
    USD: 95,
    EUR: 88,
    GBP: 75,
    JPY: 92,
    CNY: 68,
    fullMark: 100,
  },
  {
    metric: "Volatility",
    USD: 25,
    EUR: 35,
    GBP: 45,
    JPY: 20,
    CNY: 38,
    fullMark: 100,
  },
  {
    metric: "Volume",
    USD: 90,
    EUR: 70,
    GBP: 55,
    JPY: 85,
    CNY: 60,
    fullMark: 100,
  },
  {
    metric: "Stability",
    USD: 85,
    EUR: 78,
    GBP: 65,
    JPY: 88,
    CNY: 72,
    fullMark: 100,
  },
  {
    metric: "Accessibility",
    USD: 95,
    EUR: 85,
    GBP: 80,
    JPY: 90,
    CNY: 70,
    fullMark: 100,
  },
];

const generateFunnelData = () => [
  { name: "Market Inquiry", value: 100000, fill: "hsl(var(--primary))" },
  { name: "Rate Comparison", value: 85000, fill: "hsl(var(--accent))" },
  { name: "Exchange Decision", value: 65000, fill: "hsl(var(--subtle-green))" },
  { name: "Transaction", value: 45000, fill: "hsl(var(--warning))" },
  { name: "Completion", value: 42000, fill: "hsl(var(--chart-5))" },
];

interface AdvancedChartsProps {
  data?: any;
}

export function AdvancedCharts({ data }: AdvancedChartsProps) {
  const marketData = generateMarketData();
  const currencyComparison = generateCurrencyComparison();
  const cryptoTreemap = generateCryptoTreemap();
  const radarData = generateRadarData();
  const funnelData = generateFunnelData();

  const COLORS = [
    "hsl(var(--primary))",
    "hsl(var(--accent))",
    "hsl(var(--subtle-green))",
    "hsl(var(--warning))",
    "hsl(var(--chart-5))",
    "hsl(var(--chart-4))",
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card rounded-lg p-3 border border-border">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}:{" "}
              {typeof entry.value === "number"
                ? entry.value.toLocaleString()
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="advanced" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Advanced
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <RadarIcon className="h-4 w-4" />
            Comparison
          </TabsTrigger>
          <TabsTrigger value="distribution" className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" />
            Distribution
          </TabsTrigger>
          <TabsTrigger value="patterns" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Patterns
          </TabsTrigger>
        </TabsList>

        <TabsContent value="advanced" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Multi-Currency Trend Analysis */}
            <Card className="glass-card lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Multi-Currency Trend Analysis (January 7, 2025)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={marketData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="date"
                      stroke="hsl(var(--foreground))"
                      fontSize={12}
                    />
                    <YAxis
                      yAxisId="left"
                      stroke="hsl(var(--foreground))"
                      fontSize={12}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="hsl(var(--foreground))"
                      fontSize={12}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="USD_ETB"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.1}
                      name="USD/ETB"
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="EUR_ETB"
                      stroke="hsl(var(--accent))"
                      fill="hsl(var(--accent))"
                      fillOpacity={0.1}
                      name="EUR/ETB"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="volume"
                      fill="hsl(var(--subtle-green))"
                      fillOpacity={0.6}
                      name="Volume"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Volatility Heat Map */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Currency Volatility Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={currencyComparison}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="volatility"
                      name="Volatility %"
                      stroke="hsl(var(--foreground))"
                      fontSize={12}
                    />
                    <YAxis
                      dataKey="volume"
                      name="Volume"
                      stroke="hsl(var(--foreground))"
                      fontSize={12}
                    />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3" }}
                      content={<CustomTooltip />}
                    />
                    <Scatter
                      dataKey="marketShare"
                      fill="hsl(var(--primary))"
                      name="Market Share %"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Exchange Process Funnel */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Exchange Process Flow
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <FunnelChart>
                    <Tooltip content={<CustomTooltip />} />
                    <Funnel dataKey="value" data={funnelData} isAnimationActive>
                      <LabelList position="center" fill="#fff" stroke="none" />
                    </Funnel>
                  </FunnelChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Radar Chart - Currency Metrics */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RadarIcon className="h-5 w-5" />
                  Currency Performance Radar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis
                      dataKey="metric"
                      stroke="hsl(var(--foreground))"
                      fontSize={12}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                    />
                    <Radar
                      name="USD"
                      dataKey="USD"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                    <Radar
                      name="EUR"
                      dataKey="EUR"
                      stroke="hsl(var(--accent))"
                      fill="hsl(var(--accent))"
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                    <Radar
                      name="GBP"
                      dataKey="GBP"
                      stroke="hsl(var(--subtle-green))"
                      fill="hsl(var(--subtle-green))"
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                    <Legend />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Currency Market Share */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  ETB Exchange Market Share
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={currencyComparison.filter(
                        (c) => c.currency !== "Others",
                      )}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="marketShare"
                      label={({ currency, marketShare }) =>
                        `${currency}: ${marketShare}%`
                      }
                    >
                      {currencyComparison.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="mt-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Cryptocurrency Market Capitalization Treemap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={500}>
                <Treemap
                  data={cryptoTreemap}
                  dataKey="size"
                  ratio={4 / 3}
                  stroke="hsl(var(--border))"
                  strokeWidth={2}
                  content={({
                    x,
                    y,
                    width,
                    height,
                    name,
                    size,
                    value,
                    change,
                  }) => (
                    <g>
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        fill={
                          COLORS[
                            cryptoTreemap.findIndex((c) => c.name === name) %
                              COLORS.length
                          ]
                        }
                        fillOpacity={0.8}
                        stroke="hsl(var(--border))"
                      />
                      {width > 80 && height > 40 && (
                        <>
                          <text
                            x={x + width / 2}
                            y={y + height / 2 - 10}
                            textAnchor="middle"
                            fill="white"
                            fontSize="14"
                            fontWeight="bold"
                          >
                            {name}
                          </text>
                          <text
                            x={x + width / 2}
                            y={y + height / 2 + 5}
                            textAnchor="middle"
                            fill="white"
                            fontSize="12"
                          >
                            ${(size / 1000).toFixed(0)}B
                          </text>
                          <text
                            x={x + width / 2}
                            y={y + height / 2 + 20}
                            textAnchor="middle"
                            fill="white"
                            fontSize="11"
                          >
                            +{change}%
                          </text>
                        </>
                      )}
                    </g>
                  )}
                />
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Volume vs Price Correlation */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Volume vs Price Correlation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={marketData.slice(-14)}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="date"
                      stroke="hsl(var(--foreground))"
                      fontSize={12}
                    />
                    <YAxis
                      yAxisId="left"
                      stroke="hsl(var(--foreground))"
                      fontSize={12}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="hsl(var(--foreground))"
                      fontSize={12}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="USD_ETB"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      name="USD/ETB Rate"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="volume"
                      stroke="hsl(var(--accent))"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Trading Volume"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Market Volatility Patterns */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Market Volatility Patterns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={marketData.slice(-14)}>
                    <defs>
                      <linearGradient
                        id="volatilityGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--warning))"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--warning))"
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
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="volatility"
                      stroke="hsl(var(--warning))"
                      fillOpacity={1}
                      fill="url(#volatilityGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
