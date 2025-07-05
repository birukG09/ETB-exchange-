import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Clock } from "lucide-react";

interface LiveRateCardProps {
  currency: string;
  flag: string;
  rate: number;
  change: number;
  source: string;
  volume?: string;
  isCrypto?: boolean;
}

export function LiveRateCard({
  currency,
  flag,
  rate,
  change,
  source,
  volume,
  isCrypto = false,
}: LiveRateCardProps) {
  const isPositive = change >= 0;

  const formatRate = (value: number) => {
    if (isCrypto) {
      if (value >= 1000000) {
        return (value / 1000000).toFixed(2) + "M";
      } else if (value >= 1000) {
        return (value / 1000).toFixed(1) + "K";
      }
      return value.toLocaleString();
    }
    return value.toFixed(2);
  };

  return (
    <Card className="glass-card hover:shadow-lg transition-all duration-300 border-border relative overflow-hidden group">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-accent/[0.02] opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
        <CardTitle className="text-sm font-medium">
          <div className="flex items-center gap-3">
            <span className="text-xl">{flag}</span>
            <span className="text-foreground">{currency}/ETB</span>
          </div>
        </CardTitle>
        <Badge variant="outline" className="text-xs">
          {source}
        </Badge>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="space-y-3">
          <div className="text-2xl font-bold text-primary">
            {formatRate(rate)}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-subtle-green" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              <span
                className={`text-sm font-medium ${
                  isPositive ? "text-subtle-green" : "text-destructive"
                }`}
              >
                {isPositive ? "+" : ""}
                {change.toFixed(2)}%
              </span>
            </div>
            {volume && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{volume}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
