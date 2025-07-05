import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

export default function Alerts() {
  return (
    <div className="min-h-screen currency-bg-4 currency-overlay">
      <Navigation />

      {/* Floating Currency Elements */}
      <div className="floating-currency top-28 left-20 w-34 h-20 opacity-[0.02]">
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2F385bada8b1cf45b18ecdc325e1526531%2Ff9a3cd7a567043eca6246dc86a945974?format=webp&width=200"
          alt=""
          className="w-full h-full object-cover rounded-lg transform rotate-90"
        />
      </div>
      <div className="floating-currency top-52 right-24 w-30 h-18 opacity-[0.03]">
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2F385bada8b1cf45b18ecdc325e1526531%2F84399f42bd3a4b7184855f8d3c4fee3e?format=webp&width=200"
          alt=""
          className="w-full h-full object-cover rounded-lg transform -rotate-45"
        />
      </div>

      <main className="container py-8 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-6">
            <div className="glass-card rounded-3xl p-8 hd-shadow 3d-card">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-xl">
                  <Bell className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Rate Alerts
                  </h1>
                  <p className="text-xl text-foreground/80 font-medium">
                    Get notified when exchange rates hit your target prices
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Card className="glass-card hd-shadow 3d-card border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-20 opacity-[0.03]">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F385bada8b1cf45b18ecdc325e1526531%2Fa28f7bc4a475405689c82bf833b2b37c?format=webp&width=200"
                alt=""
                className="w-full h-full object-cover transform rotate-3"
              />
            </div>
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Coming Soon
                </span>
                <Badge
                  variant="secondary"
                  className="bg-primary/10 border-primary/30 text-primary"
                >
                  In Development
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-8 relative z-10">
              <div className="text-center space-y-6">
                <div className="text-8xl opacity-10">🔔</div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Smart Alert System
                </h3>
                <p className="text-foreground/70 max-w-md mx-auto leading-relaxed">
                  Set up intelligent alerts to monitor ETB exchange rates and
                  never miss the perfect time to exchange.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="space-y-3 text-sm text-foreground/60">
                    <p className="flex items-center gap-2">
                      🎯 Custom rate thresholds
                    </p>
                    <p className="flex items-center gap-2">
                      📧 Email notifications
                    </p>
                    <p className="flex items-center gap-2">
                      📱 Push notifications
                    </p>
                  </div>
                  <div className="space-y-3 text-sm text-foreground/60">
                    <p className="flex items-center gap-2">
                      ⚡ Real-time monitoring
                    </p>
                    <p className="flex items-center gap-2">
                      🤖 Telegram bot integration
                    </p>
                    <p className="flex items-center gap-2">
                      📊 Alert history tracking
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
