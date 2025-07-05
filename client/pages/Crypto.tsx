import { Navigation } from "@/components/Navigation";
import { CryptoDashboard } from "@/components/CryptoDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bitcoin, TrendingUp, Globe } from "lucide-react";

export default function Crypto() {
  return (
    <div className="min-h-screen bg-background subtle-grid-bg refined-bg">
      <Navigation />

      {/* Subtle Floating Elements */}
      <div className="fixed top-24 left-8 w-40 h-40 opacity-[0.02] animate-pulse duration-[3000ms]">
        <div className="w-full h-full rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-2xl"></div>
      </div>
      <div className="fixed bottom-24 right-8 w-32 h-32 opacity-[0.02] animate-pulse delay-1000 duration-[3000ms]">
        <div className="w-full h-full rounded-full bg-gradient-to-r from-accent/20 to-primary/20 blur-2xl"></div>
      </div>

      <main className="container py-8 relative z-10">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="glass-card rounded-3xl p-8 refined-glow">
              <div className="flex items-center justify-center gap-6 mb-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg">
                  <Bitcoin className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Crypto Exchange
                  </h1>
                  <p className="text-xl text-foreground/80 font-medium mt-2">
                    Real-time cryptocurrency data from Investing.com
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Badge variant="secondary" className="gap-2 px-4 py-2">
                  <Globe className="h-4 w-4" />
                  Investing.com Data
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  Real-time Updates
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  ETB Conversion
                </Badge>
              </div>
            </div>
          </div>

          {/* Market Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Bitcoin Price
                </CardTitle>
                <Bitcoin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$108,134</div>
                <p className="text-xs text-subtle-green flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +2.1% 24h
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ethereum Price
                </CardTitle>
                <span className="text-lg">Ξ</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$3,891</div>
                <p className="text-xs text-subtle-green flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +1.8% 24h
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">XRP Price</CardTitle>
                <span className="text-lg">◈</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$3.21</div>
                <p className="text-xs text-subtle-green flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +4.2% 24h
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Market Cap
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2.95T</div>
                <p className="text-xs text-subtle-green">+2.8% 24h</p>
              </CardContent>
            </Card>
          </div>

          {/* Crypto Dashboard */}
          <CryptoDashboard />

          {/* Investing.com Attribution */}
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Real-time cryptocurrency data powered by{" "}
                  <a
                    href="https://www.investing.com/crypto"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    Investing.com
                  </a>
                </p>
                <p className="text-xs text-muted-foreground">
                  Prices displayed in both USD and Ethiopian Birr (ETB) • Last
                  updated: {new Date().toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
