import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  Globe,
  Shield,
} from "lucide-react";
import { useState, useEffect } from "react";
import { ExchangeRate, RatesResponse } from "@shared/rates";

export default function RateTable() {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [cryptoRates, setCryptoRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchRates = async () => {
    try {
      setLoading(true);
      const [fiatResponse, cryptoResponse] = await Promise.all([
        fetch("/api/rates"),
        fetch("/api/rates/crypto"),
      ]);

      const fiatData: RatesResponse = await fiatResponse.json();
      const cryptoData: RatesResponse = await cryptoResponse.json();

      if (fiatData.success) {
        setRates(fiatData.data);
        setLastUpdated(fiatData.lastUpdated);
      }

      if (cryptoData.success) {
        setCryptoRates(cryptoData.data);
      }
    } catch (error) {
      console.error("Failed to fetch rates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();

    if (autoRefresh) {
      const interval = setInterval(fetchRates, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const formatChange = (change: number) => {
    const isPositive = change >= 0;
    return (
      <div
        className={`flex items-center gap-1 ${isPositive ? "text-neon-green" : "text-red-400"}`}
      >
        {isPositive ? (
          <TrendingUp className="h-3 w-3" />
        ) : (
          <TrendingDown className="h-3 w-3" />
        )}
        <span className="font-mono text-xs">
          {isPositive ? "+" : ""}
          {change.toFixed(2)}%
        </span>
      </div>
    );
  };

  const RateTableComponent = ({
    data,
    isCrypto = false,
  }: {
    data: ExchangeRate[];
    isCrypto?: boolean;
  }) => (
    <Table>
      <TableHeader>
        <TableRow className="border-neon-cyan/20">
          <TableHead className="text-neon-cyan font-mono">[CURRENCY]</TableHead>
          <TableHead className="text-neon-cyan font-mono">[BUY]</TableHead>
          <TableHead className="text-neon-cyan font-mono">[SELL]</TableHead>
          <TableHead className="text-neon-cyan font-mono">[MID]</TableHead>
          <TableHead className="text-neon-cyan font-mono">
            [24H_CHANGE]
          </TableHead>
          <TableHead className="text-neon-cyan font-mono">[SOURCE]</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((rate) => (
          <TableRow
            key={rate.currency}
            className="border-neon-cyan/10 hover:bg-neon-cyan/5 transition-all"
          >
            <TableCell className="font-medium">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{rate.flag}</span>
                <div>
                  <div className="text-neon-cyan font-mono font-bold">
                    {rate.currency}
                  </div>
                  <div className="text-xs text-foreground/60">
                    {rate.currencyName}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell className="font-mono text-neon-green">
              {rate.buyRate ? rate.buyRate.toFixed(2) : rate.midRate.toFixed(2)}
            </TableCell>
            <TableCell className="font-mono text-neon-pink">
              {rate.sellRate
                ? rate.sellRate.toFixed(2)
                : rate.midRate.toFixed(2)}
            </TableCell>
            <TableCell className="font-mono text-neon-purple font-bold">
              {isCrypto
                ? rate.midRate.toLocaleString()
                : rate.midRate.toFixed(2)}
            </TableCell>
            <TableCell>{formatChange(rate.change24h)}</TableCell>
            <TableCell>
              <Badge className="bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30 font-mono text-xs">
                {rate.source}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="min-h-screen bg-background crypto-grid-bg web3-bg">
      <Navigation />

      {/* Cyberpunk Floating Elements */}
      <div className="fixed top-32 left-16 w-36 h-36 opacity-[0.03] animate-pulse">
        <div className="w-full h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple blur-2xl"></div>
      </div>
      <div className="fixed top-56 right-12 w-32 h-32 opacity-[0.03] animate-pulse delay-1000">
        <div className="w-full h-full rounded-full bg-gradient-to-r from-neon-pink to-neon-green blur-2xl"></div>
      </div>

      <main className="container py-8 relative z-10">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <div className="cyber-card glass-card rounded-3xl p-8 cyber-glow 3d-card relative overflow-hidden">
              <div className="flex items-center justify-center gap-6 mb-8">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-neon-cyan to-neon-purple text-background shadow-2xl cyber-glow relative">
                  <Globe className="h-10 w-10" />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-neon-cyan to-neon-purple opacity-20 animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-6xl font-bold tracking-tight neon-text bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent font-mono">
                    [LIVE_MATRIX]
                  </h1>
                  <p className="text-2xl text-neon-cyan/80 font-light mt-2">
                    Real-Time Exchange Rate Grid
                  </p>
                  <div className="text-sm text-neon-purple/60 mt-2 font-mono">
                    [XE.COM] • [BANKSETHIOPIA.COM] • [LIVE_FEEDS]
                  </div>
                </div>
              </div>

              {/* Control Panel */}
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Button
                  onClick={fetchRates}
                  disabled={loading}
                  className="bg-gradient-to-r from-neon-cyan to-neon-purple text-background hover:from-neon-purple hover:to-neon-pink transition-all duration-300 cyber-glow font-mono"
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                  />
                  [REFRESH_DATA]
                </Button>
                <Badge className="gap-2 px-6 py-3 bg-gradient-to-r from-neon-green/20 to-neon-cyan/20 border-neon-green/30 text-neon-green neon-border">
                  <Zap className="h-4 w-4" />
                  AUTO-SYNC: {autoRefresh ? "ACTIVE" : "DISABLED"}
                </Badge>
                <Badge className="px-6 py-3 bg-gradient-to-r from-neon-purple/20 to-neon-pink/20 border-neon-purple/30 text-neon-purple neon-border">
                  <Clock className="h-4 w-4" />
                  {lastUpdated
                    ? new Date(lastUpdated).toLocaleTimeString()
                    : "INITIALIZING..."}
                </Badge>
              </div>
            </div>
          </div>

          {/* Data Tables */}
          <Tabs defaultValue="fiat" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-background/50 border border-neon-cyan/20">
              <TabsTrigger
                value="fiat"
                className="font-mono data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-cyan/20 data-[state=active]:to-neon-purple/20 data-[state=active]:text-neon-cyan"
              >
                [FIAT_CURRENCIES]
              </TabsTrigger>
              <TabsTrigger
                value="crypto"
                className="font-mono data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-purple/20 data-[state=active]:to-neon-pink/20 data-[state=active]:text-neon-purple"
              >
                [CRYPTO_ASSETS]
              </TabsTrigger>
            </TabsList>

            <TabsContent value="fiat" className="mt-6">
              <Card className="cyber-card glass-card cyber-glow relative overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl font-mono">
                    <Shield className="h-6 w-6 text-neon-cyan" />
                    <span className="neon-text bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
                      [FIAT_EXCHANGE_MATRIX]
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-neon-cyan"></div>
                      <p className="mt-2 text-neon-cyan font-mono">
                        [SYNCHRONIZING_DATA...]
                      </p>
                    </div>
                  ) : (
                    <RateTableComponent data={rates} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="crypto" className="mt-6">
              <Card className="cyber-card glass-card cyber-glow relative overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl font-mono">
                    <Zap className="h-6 w-6 text-neon-purple" />
                    <span className="neon-text bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent">
                      [CRYPTO_ASSET_MATRIX]
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-neon-purple"></div>
                      <p className="mt-2 text-neon-purple font-mono">
                        [SCANNING_BLOCKCHAIN...]
                      </p>
                    </div>
                  ) : (
                    <RateTableComponent data={cryptoRates} isCrypto={true} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
