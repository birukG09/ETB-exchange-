import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  ArrowLeftRight,
  TrendingUp,
  Table,
  Bell,
  Moon,
  Sun,
  Banknote,
  Bitcoin,
  Wallet,
  Calculator,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    title: "Converter",
    href: "/",
    icon: ArrowLeftRight,
    description: "Real-time currency conversion",
  },
  {
    title: "Crypto",
    href: "/crypto",
    icon: Bitcoin,
    description: "Cryptocurrency market data",
  },
  {
    title: "Portfolio",
    href: "/portfolio",
    icon: Wallet,
    description: "Track your investments",
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: TrendingUp,
    description: "Charts and market insights",
  },
  {
    title: "Calculators",
    href: "/calculators",
    icon: Calculator,
    description: "Investment calculation tools",
  },
  {
    title: "Rate Table",
    href: "/rates",
    icon: Table,
    description: "Compare rates across banks",
  },
  {
    title: "Alerts",
    href: "/alerts",
    icon: Bell,
    description: "Set rate notifications",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    description: "App preferences",
  },
];

export function Navigation() {
  const [isDark, setIsDark] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const NavLinks = ({
    className,
    onClick,
  }: {
    className?: string;
    onClick?: () => void;
  }) => (
    <nav className={cn("flex gap-2", className)}>
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;

        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={onClick}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 relative group",
              isActive
                ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg scale-105"
                : "text-foreground/70 hover:text-foreground hover:bg-primary/10 hover:scale-105 border border-transparent hover:border-primary/20",
            )}
          >
            <Icon className="h-5 w-5" />
            <span
              className={
                isActive
                  ? ""
                  : "group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent group-hover:bg-clip-text group-hover:text-transparent"
              }
            >
              {item.title}
            </span>
            {isActive && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 -z-10 blur-sm" />
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full glass-card border-b border-primary/20 hd-shadow">
      <div className="container flex h-18 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg group-hover:scale-110 transition-transform duration-200">
              <Banknote className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ETB Exchange
            </span>
            <Badge
              variant="secondary"
              className="text-xs bg-accent/10 border-accent/30 text-accent animate-pulse"
            >
              4K
            </Badge>
          </Link>

          <div className="hidden md:block">
            <NavLinks className="flex-row" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-10 w-10 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:scale-110 transition-all duration-200"
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-accent" />
            ) : (
              <Moon className="h-5 w-5 text-primary" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/20"
                >
                  <Menu className="h-5 w-5 text-primary" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-80 glass-card border-primary/20"
              >
                <div className="flex flex-col gap-6 py-6">
                  <div className="flex items-center gap-3 px-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
                      <Banknote className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      ETB Exchange
                    </span>
                  </div>
                  <NavLinks
                    className="flex-col"
                    onClick={() => setIsOpen(false)}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
