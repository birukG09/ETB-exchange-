import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Calculator,
  TrendingUp,
  DollarSign,
  Percent,
  Calendar,
  Target,
  PiggyBank,
  ArrowUpDown,
} from "lucide-react";

interface DCAResult {
  totalInvested: number;
  totalValue: number;
  totalShares: number;
  avgCostPerShare: number;
  profitLoss: number;
  profitLossPercent: number;
  chartData: Array<{
    week: number;
    invested: number;
    value: number;
    shares: number;
  }>;
}

interface CompoundResult {
  finalAmount: number;
  totalContributions: number;
  totalInterest: number;
  chartData: Array<{
    year: number;
    principal: number;
    interest: number;
    total: number;
  }>;
}

interface CurrencyConversion {
  fromAmount: number;
  toAmount: number;
  rate: number;
  fees: number;
  netAmount: number;
}

export default function Calculators() {
  // DCA Calculator State
  const [dcaParams, setDcaParams] = useState({
    initialInvestment: "10000",
    recurringAmount: "5000",
    frequency: "weekly",
    duration: "52", // weeks
    expectedReturn: "8", // %
    volatility: "15", // %
  });
  const [dcaResult, setDcaResult] = useState<DCAResult | null>(null);

  // Compound Interest Calculator State
  const [compoundParams, setCompoundParams] = useState({
    principal: "100000",
    monthlyContribution: "10000",
    annualRate: "7",
    compoundFrequency: "monthly",
    years: "10",
  });
  const [compoundResult, setCompoundResult] = useState<CompoundResult | null>(
    null,
  );

  // Currency Exchange Calculator State
  const [exchangeParams, setExchangeParams] = useState({
    fromCurrency: "USD",
    toCurrency: "ETB",
    amount: "1000",
    exchangeRate: "135",
    feePercent: "2",
  });
  const [exchangeResult, setExchangeResult] =
    useState<CurrencyConversion | null>(null);

  // ROI Calculator State
  const [roiParams, setRoiParams] = useState({
    initialInvestment: "50000",
    finalValue: "75000",
    investmentPeriod: "12", // months
  });

  const calculateDCA = () => {
    const initial = parseFloat(dcaParams.initialInvestment);
    const recurring = parseFloat(dcaParams.recurringAmount);
    const periods = parseInt(dcaParams.duration);
    const annualReturn = parseFloat(dcaParams.expectedReturn) / 100;
    const volatility = parseFloat(dcaParams.volatility) / 100;

    let totalInvested = initial;
    let totalShares = 0;
    let totalValue = 0;
    const chartData = [];

    // Calculate period return based on frequency
    const periodsPerYear =
      dcaParams.frequency === "weekly"
        ? 52
        : dcaParams.frequency === "monthly"
          ? 12
          : 26;
    const periodReturn = annualReturn / periodsPerYear;

    // Initial investment
    let currentPrice = 100; // Starting price
    totalShares = initial / currentPrice;

    for (let week = 1; week <= periods; week++) {
      // Simulate price volatility
      const randomFactor = (Math.random() - 0.5) * volatility * 2;
      const growthFactor = 1 + periodReturn + randomFactor;
      currentPrice *= growthFactor;

      // Add recurring investment
      if (week > 1) {
        totalInvested += recurring;
        totalShares += recurring / currentPrice;
      }

      totalValue = totalShares * currentPrice;

      chartData.push({
        week,
        invested: totalInvested,
        value: totalValue,
        shares: totalShares,
      });
    }

    const avgCostPerShare = totalInvested / totalShares;
    const profitLoss = totalValue - totalInvested;
    const profitLossPercent = (profitLoss / totalInvested) * 100;

    setDcaResult({
      totalInvested,
      totalValue,
      totalShares,
      avgCostPerShare,
      profitLoss,
      profitLossPercent,
      chartData,
    });
  };

  const calculateCompound = () => {
    const principal = parseFloat(compoundParams.principal);
    const monthlyContrib = parseFloat(compoundParams.monthlyContribution);
    const annualRate = parseFloat(compoundParams.annualRate) / 100;
    const years = parseInt(compoundParams.years);
    const compoundsPerYear =
      compoundParams.compoundFrequency === "monthly"
        ? 12
        : compoundParams.compoundFrequency === "quarterly"
          ? 4
          : 1;

    const chartData = [];
    let currentPrincipal = principal;
    let totalContributions = principal;

    for (let year = 1; year <= years; year++) {
      // Add monthly contributions throughout the year
      const yearlyContributions = monthlyContrib * 12;
      totalContributions += yearlyContributions;

      // Calculate compound interest
      const rate = annualRate / compoundsPerYear;
      const periods = compoundsPerYear;

      // Compound the principal + contributions for the year
      currentPrincipal =
        (currentPrincipal + yearlyContributions) * Math.pow(1 + rate, periods);

      const totalInterest = currentPrincipal - totalContributions;

      chartData.push({
        year,
        principal: totalContributions,
        interest: totalInterest,
        total: currentPrincipal,
      });
    }

    const finalAmount = currentPrincipal;
    const totalInterest = finalAmount - totalContributions;

    setCompoundResult({
      finalAmount,
      totalContributions,
      totalInterest,
      chartData,
    });
  };

  const calculateExchange = () => {
    const amount = parseFloat(exchangeParams.amount);
    const rate = parseFloat(exchangeParams.exchangeRate);
    const feePercent = parseFloat(exchangeParams.feePercent) / 100;

    const convertedAmount = amount * rate;
    const fees = convertedAmount * feePercent;
    const netAmount = convertedAmount - fees;

    setExchangeResult({
      fromAmount: amount,
      toAmount: convertedAmount,
      rate,
      fees,
      netAmount,
    });
  };

  const calculateROI = () => {
    const initial = parseFloat(roiParams.initialInvestment);
    const final = parseFloat(roiParams.finalValue);
    const months = parseInt(roiParams.investmentPeriod);

    const totalReturn = ((final - initial) / initial) * 100;
    const annualizedReturn = (Math.pow(final / initial, 12 / months) - 1) * 100;

    return {
      totalReturn: totalReturn.toFixed(2),
      annualizedReturn: annualizedReturn.toFixed(2),
      absoluteGain: (final - initial).toLocaleString(),
    };
  };

  const roiResult = calculateROI();

  return (
    <div className="min-h-screen bg-background subtle-grid-bg refined-bg">
      <Navigation />

      {/* Floating Elements */}
      <div className="fixed top-24 right-8 w-36 h-36 opacity-[0.02] animate-pulse duration-[4000ms]">
        <div className="w-full h-full rounded-full bg-gradient-to-r from-accent/20 to-primary/20 blur-2xl"></div>
      </div>

      <main className="container py-8 relative z-10">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="glass-card rounded-3xl p-8 refined-glow">
            <div className="flex items-center gap-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg">
                <Calculator className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Investment Calculators
                </h1>
                <p className="text-xl text-foreground/80 font-medium mt-2">
                  Advanced tools for financial planning and analysis
                </p>
              </div>
            </div>
          </div>

          {/* Calculator Tools */}
          <Tabs defaultValue="dca" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dca">DCA Calculator</TabsTrigger>
              <TabsTrigger value="compound">Compound Interest</TabsTrigger>
              <TabsTrigger value="exchange">Currency Exchange</TabsTrigger>
              <TabsTrigger value="roi">ROI Calculator</TabsTrigger>
            </TabsList>

            {/* Dollar Cost Averaging Calculator */}
            <TabsContent value="dca">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      DCA Parameters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="initialInvestment">
                        Initial Investment (ETB)
                      </Label>
                      <Input
                        id="initialInvestment"
                        type="number"
                        value={dcaParams.initialInvestment}
                        onChange={(e) =>
                          setDcaParams({
                            ...dcaParams,
                            initialInvestment: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="recurringAmount">
                        Recurring Amount (ETB)
                      </Label>
                      <Input
                        id="recurringAmount"
                        type="number"
                        value={dcaParams.recurringAmount}
                        onChange={(e) =>
                          setDcaParams({
                            ...dcaParams,
                            recurringAmount: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="frequency">Investment Frequency</Label>
                      <Select
                        value={dcaParams.frequency}
                        onValueChange={(value) =>
                          setDcaParams({ ...dcaParams, frequency: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="biweekly">Bi-weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration (periods)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={dcaParams.duration}
                        onChange={(e) =>
                          setDcaParams({
                            ...dcaParams,
                            duration: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="expectedReturn">
                        Expected Annual Return (%)
                      </Label>
                      <Input
                        id="expectedReturn"
                        type="number"
                        value={dcaParams.expectedReturn}
                        onChange={(e) =>
                          setDcaParams({
                            ...dcaParams,
                            expectedReturn: e.target.value,
                          })
                        }
                      />
                    </div>
                    <Button onClick={calculateDCA} className="w-full">
                      Calculate DCA Strategy
                    </Button>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>DCA Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {dcaResult ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Total Invested
                            </p>
                            <p className="text-2xl font-bold">
                              {dcaResult.totalInvested.toLocaleString()} ETB
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Total Value
                            </p>
                            <p className="text-2xl font-bold">
                              {dcaResult.totalValue.toLocaleString()} ETB
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Profit/Loss
                            </p>
                            <p
                              className={`text-2xl font-bold ${dcaResult.profitLoss >= 0 ? "text-subtle-green" : "text-red-500"}`}
                            >
                              {dcaResult.profitLoss >= 0 ? "+" : ""}
                              {dcaResult.profitLoss.toLocaleString()} ETB
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Return %
                            </p>
                            <p
                              className={`text-2xl font-bold ${dcaResult.profitLossPercent >= 0 ? "text-subtle-green" : "text-red-500"}`}
                            >
                              {dcaResult.profitLossPercent >= 0 ? "+" : ""}
                              {dcaResult.profitLossPercent.toFixed(2)}%
                            </p>
                          </div>
                        </div>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dcaResult.chartData}>
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="rgba(255,255,255,0.1)"
                              />
                              <XAxis
                                dataKey="week"
                                stroke="rgba(255,255,255,0.7)"
                              />
                              <YAxis stroke="rgba(255,255,255,0.7)" />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "rgba(0,0,0,0.8)",
                                  border: "1px solid rgba(255,255,255,0.2)",
                                  borderRadius: "8px",
                                }}
                              />
                              <Area
                                type="monotone"
                                dataKey="invested"
                                stackId="1"
                                stroke="#5E8CBA"
                                fill="#5E8CBA"
                                fillOpacity={0.6}
                              />
                              <Area
                                type="monotone"
                                dataKey="value"
                                stackId="2"
                                stroke="#997AB8"
                                fill="#997AB8"
                                fillOpacity={0.6}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        Configure parameters and click calculate to see results
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Compound Interest Calculator */}
            <TabsContent value="compound">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PiggyBank className="h-5 w-5" />
                      Compound Interest Parameters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="principal">Initial Principal (ETB)</Label>
                      <Input
                        id="principal"
                        type="number"
                        value={compoundParams.principal}
                        onChange={(e) =>
                          setCompoundParams({
                            ...compoundParams,
                            principal: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="monthlyContribution">
                        Monthly Contribution (ETB)
                      </Label>
                      <Input
                        id="monthlyContribution"
                        type="number"
                        value={compoundParams.monthlyContribution}
                        onChange={(e) =>
                          setCompoundParams({
                            ...compoundParams,
                            monthlyContribution: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="annualRate">
                        Annual Interest Rate (%)
                      </Label>
                      <Input
                        id="annualRate"
                        type="number"
                        value={compoundParams.annualRate}
                        onChange={(e) =>
                          setCompoundParams({
                            ...compoundParams,
                            annualRate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="compoundFrequency">
                        Compound Frequency
                      </Label>
                      <Select
                        value={compoundParams.compoundFrequency}
                        onValueChange={(value) =>
                          setCompoundParams({
                            ...compoundParams,
                            compoundFrequency: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="annually">Annually</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="years">Investment Period (years)</Label>
                      <Input
                        id="years"
                        type="number"
                        value={compoundParams.years}
                        onChange={(e) =>
                          setCompoundParams({
                            ...compoundParams,
                            years: e.target.value,
                          })
                        }
                      />
                    </div>
                    <Button onClick={calculateCompound} className="w-full">
                      Calculate Compound Growth
                    </Button>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Compound Interest Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {compoundResult ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Final Amount
                            </p>
                            <p className="text-3xl font-bold text-subtle-green">
                              {compoundResult.finalAmount.toLocaleString()} ETB
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Total Contributions
                              </p>
                              <p className="text-xl font-semibold">
                                {compoundResult.totalContributions.toLocaleString()}{" "}
                                ETB
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Interest Earned
                              </p>
                              <p className="text-xl font-semibold text-subtle-green">
                                {compoundResult.totalInterest.toLocaleString()}{" "}
                                ETB
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={compoundResult.chartData}>
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="rgba(255,255,255,0.1)"
                              />
                              <XAxis
                                dataKey="year"
                                stroke="rgba(255,255,255,0.7)"
                              />
                              <YAxis stroke="rgba(255,255,255,0.7)" />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "rgba(0,0,0,0.8)",
                                  border: "1px solid rgba(255,255,255,0.2)",
                                  borderRadius: "8px",
                                }}
                              />
                              <Area
                                type="monotone"
                                dataKey="principal"
                                stackId="1"
                                stroke="#5E8CBA"
                                fill="#5E8CBA"
                                fillOpacity={0.6}
                              />
                              <Area
                                type="monotone"
                                dataKey="interest"
                                stackId="1"
                                stroke="#6BB77B"
                                fill="#6BB77B"
                                fillOpacity={0.6}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        Configure parameters and click calculate to see compound
                        growth
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Currency Exchange Calculator */}
            <TabsContent value="exchange">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ArrowUpDown className="h-5 w-5" />
                      Currency Exchange
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fromCurrency">From Currency</Label>
                        <Select
                          value={exchangeParams.fromCurrency}
                          onValueChange={(value) =>
                            setExchangeParams({
                              ...exchangeParams,
                              fromCurrency: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                            <SelectItem value="ETB">ETB</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="toCurrency">To Currency</Label>
                        <Select
                          value={exchangeParams.toCurrency}
                          onValueChange={(value) =>
                            setExchangeParams({
                              ...exchangeParams,
                              toCurrency: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ETB">ETB</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={exchangeParams.amount}
                        onChange={(e) =>
                          setExchangeParams({
                            ...exchangeParams,
                            amount: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="exchangeRate">Exchange Rate</Label>
                      <Input
                        id="exchangeRate"
                        type="number"
                        value={exchangeParams.exchangeRate}
                        onChange={(e) =>
                          setExchangeParams({
                            ...exchangeParams,
                            exchangeRate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="feePercent">Exchange Fee (%)</Label>
                      <Input
                        id="feePercent"
                        type="number"
                        value={exchangeParams.feePercent}
                        onChange={(e) =>
                          setExchangeParams({
                            ...exchangeParams,
                            feePercent: e.target.value,
                          })
                        }
                      />
                    </div>
                    <Button onClick={calculateExchange} className="w-full">
                      Calculate Exchange
                    </Button>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Exchange Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {exchangeResult ? (
                      <div className="space-y-6">
                        <div className="text-center">
                          <div className="text-4xl font-bold mb-2">
                            {exchangeResult.fromAmount.toLocaleString()}{" "}
                            {exchangeParams.fromCurrency}
                          </div>
                          <ArrowUpDown className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <div className="text-4xl font-bold text-subtle-green">
                            {exchangeResult.netAmount.toLocaleString()}{" "}
                            {exchangeParams.toCurrency}
                          </div>
                        </div>
                        <div className="space-y-3 border-t pt-4">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Exchange Rate:
                            </span>
                            <span className="font-semibold">
                              1 {exchangeParams.fromCurrency} ={" "}
                              {exchangeResult.rate} {exchangeParams.toCurrency}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Gross Amount:
                            </span>
                            <span className="font-semibold">
                              {exchangeResult.toAmount.toLocaleString()}{" "}
                              {exchangeParams.toCurrency}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Fees:</span>
                            <span className="font-semibold text-red-500">
                              -{exchangeResult.fees.toLocaleString()}{" "}
                              {exchangeParams.toCurrency}
                            </span>
                          </div>
                          <div className="flex justify-between text-lg font-bold border-t pt-2">
                            <span>Net Amount:</span>
                            <span className="text-subtle-green">
                              {exchangeResult.netAmount.toLocaleString()}{" "}
                              {exchangeParams.toCurrency}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        Configure exchange parameters and calculate
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ROI Calculator */}
            <TabsContent value="roi">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      ROI Parameters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="initialInvestmentROI">
                        Initial Investment (ETB)
                      </Label>
                      <Input
                        id="initialInvestmentROI"
                        type="number"
                        value={roiParams.initialInvestment}
                        onChange={(e) =>
                          setRoiParams({
                            ...roiParams,
                            initialInvestment: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="finalValue">Final Value (ETB)</Label>
                      <Input
                        id="finalValue"
                        type="number"
                        value={roiParams.finalValue}
                        onChange={(e) =>
                          setRoiParams({
                            ...roiParams,
                            finalValue: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="investmentPeriod">
                        Investment Period (months)
                      </Label>
                      <Input
                        id="investmentPeriod"
                        type="number"
                        value={roiParams.investmentPeriod}
                        onChange={(e) =>
                          setRoiParams({
                            ...roiParams,
                            investmentPeriod: e.target.value,
                          })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>ROI Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Total Return
                        </p>
                        <p className="text-3xl font-bold text-subtle-green">
                          {roiResult.totalReturn}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Annualized Return
                        </p>
                        <p className="text-2xl font-bold">
                          {roiResult.annualizedReturn}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Absolute Gain
                        </p>
                        <p className="text-2xl font-bold text-subtle-green">
                          {roiResult.absoluteGain} ETB
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
