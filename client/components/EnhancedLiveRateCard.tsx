import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface EnhancedLiveRateCardProps {
  currency: string;
  flag: string;
  rate: number;
  change: number;
  source: string;
  isCrypto?: boolean;
}

export function EnhancedLiveRateCard({
  currency,
  flag,
  rate,
  change,
  source,
  isCrypto = false,
}: EnhancedLiveRateCardProps) {
  const isPositive = change > 0;
  const formatRate = (value: number) => {
    if (isCrypto && value > 1000000) {
      return `${(value / 1000000).toFixed(2)}M ETB`;
    }
    if (isCrypto && value > 1000) {
      return `${(value / 1000).toFixed(1)}K ETB`;
    }
    return `${value.toLocaleString()} ETB`;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, rotateY: 5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="glass-card h-full relative overflow-hidden border-0 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl group">
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Floating sparkles for crypto */}
        {isCrypto && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <Sparkles className="h-4 w-4 text-accent animate-pulse" />
          </div>
        )}

        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="text-3xl font-bold"
              >
                {flag}
              </motion.div>
              <div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {currency}
                </h3>
                <Badge
                  variant="outline"
                  className="text-xs bg-muted/50 group-hover:bg-primary/10 transition-colors"
                >
                  {source}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-2xl font-bold text-foreground">
              {formatRate(rate)}
            </div>

            <div
              className={`flex items-center gap-2 text-sm font-medium ${
                isPositive ? "text-subtle-green" : "text-red-500"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>
                {isPositive ? "+" : ""}
                {change.toFixed(2)}%
              </span>
              <span className="text-xs text-muted-foreground">24h</span>
            </div>
          </div>

          {/* Subtle animation line at the bottom */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
