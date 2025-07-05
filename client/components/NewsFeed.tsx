import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Newspaper,
  TrendingUp,
  Clock,
  ExternalLink,
  RefreshCw,
  Bitcoin,
  DollarSign,
  Globe,
} from "lucide-react";

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: "crypto" | "forex" | "markets" | "eth";
  publishedAt: string;
  imageUrl?: string;
  url: string;
  sentiment: "positive" | "negative" | "neutral";
  relevanceScore: number;
}

interface NewsFeedProps {
  className?: string;
}

export function NewsFeed({ className }: NewsFeedProps) {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Sample news data - in production this would come from real news APIs
  const sampleNews: NewsArticle[] = [
    {
      id: "1",
      title: "Bitcoin Reaches New All-Time High Above $108,000",
      summary:
        "Bitcoin continues its bullish momentum, breaking previous records as institutional adoption grows and ETF inflows accelerate.",
      source: "CoinDesk",
      category: "crypto",
      publishedAt: "2025-01-07T14:30:00Z",
      url: "https://coindesk.com",
      sentiment: "positive",
      relevanceScore: 95,
    },
    {
      id: "2",
      title: "Ethiopian Birr Stabilizes Against Major Currencies",
      summary:
        "The Ethiopian Birr shows signs of stabilization against USD and EUR following recent monetary policy adjustments by the National Bank of Ethiopia.",
      source: "Reuters Africa",
      category: "eth",
      publishedAt: "2025-01-07T12:15:00Z",
      url: "https://reuters.com",
      sentiment: "positive",
      relevanceScore: 88,
    },
    {
      id: "3",
      title: "Ethereum Network Upgrade Boosts Performance and Reduces Fees",
      summary:
        "Latest Ethereum update improves transaction throughput by 40% while cutting average gas fees, making DeFi more accessible to retail users.",
      source: "Ethereum Foundation",
      category: "crypto",
      publishedAt: "2025-01-07T10:45:00Z",
      url: "https://ethereum.org",
      sentiment: "positive",
      relevanceScore: 82,
    },
    {
      id: "4",
      title:
        "Global FX Markets See Increased Volatility Amid Economic Uncertainty",
      summary:
        "Major currency pairs experience heightened volatility as central banks signal potential policy shifts in response to changing inflation dynamics.",
      source: "Financial Times",
      category: "forex",
      publishedAt: "2025-01-07T09:20:00Z",
      url: "https://ft.com",
      sentiment: "neutral",
      relevanceScore: 75,
    },
    {
      id: "5",
      title: "XRP Surges 15% Following Regulatory Clarity",
      summary:
        "XRP sees significant gains after positive regulatory developments and increased adoption by financial institutions for cross-border payments.",
      source: "Crypto News",
      category: "crypto",
      publishedAt: "2025-01-07T08:30:00Z",
      url: "https://cryptonews.com",
      sentiment: "positive",
      relevanceScore: 78,
    },
    {
      id: "6",
      title: "African Central Banks Explore Digital Currency Initiatives",
      summary:
        "Several African central banks, including Ethiopia's, announce pilot programs for Central Bank Digital Currencies (CBDCs) to improve financial inclusion.",
      source: "African Business",
      category: "eth",
      publishedAt: "2025-01-07T07:15:00Z",
      url: "https://africanbusiness.com",
      sentiment: "positive",
      relevanceScore: 85,
    },
    {
      id: "7",
      title: "US Dollar Strengthens Against Emerging Market Currencies",
      summary:
        "The USD gains momentum against EM currencies as Federal Reserve maintains hawkish stance, affecting exchange rates globally.",
      source: "Bloomberg",
      category: "forex",
      publishedAt: "2025-01-06T16:45:00Z",
      url: "https://bloomberg.com",
      sentiment: "negative",
      relevanceScore: 70,
    },
    {
      id: "8",
      title: "DeFi Protocol Launches ETB-Backed Stablecoin",
      summary:
        "New decentralized finance protocol introduces Ethiopian Birr-backed stablecoin, aiming to bridge traditional finance with DeFi ecosystem.",
      source: "DeFi Pulse",
      category: "crypto",
      publishedAt: "2025-01-06T14:20:00Z",
      url: "https://defipulse.com",
      sentiment: "positive",
      relevanceScore: 90,
    },
  ];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setNews(sampleNews);
      setLoading(false);
    }, 1000);
  }, []);

  const refreshNews = () => {
    setLoading(true);
    // Simulate refresh with slightly updated data
    setTimeout(() => {
      const updatedNews = sampleNews.map((article) => ({
        ...article,
        publishedAt: new Date().toISOString(),
      }));
      setNews(updatedNews);
      setLoading(false);
    }, 800);
  };

  const filteredNews =
    selectedCategory === "all"
      ? news
      : news.filter((article) => article.category === selectedCategory);

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const publishedAt = new Date(dateString);
    const diffInHours = Math.floor(
      (now.getTime() - publishedAt.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-subtle-green";
      case "negative":
        return "text-red-500";
      default:
        return "text-gray-400";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "crypto":
        return <Bitcoin className="h-4 w-4" />;
      case "forex":
        return <DollarSign className="h-4 w-4" />;
      case "eth":
        return <Globe className="h-4 w-4" />;
      default:
        return <Newspaper className="h-4 w-4" />;
    }
  };

  const getCategoryBadgeVariant = (category: string) => {
    switch (category) {
      case "crypto":
        return "default";
      case "forex":
        return "secondary";
      case "eth":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <Card className={`glass-card ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            Financial News Feed
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshNews}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
            <TabsTrigger value="forex">Forex</TabsTrigger>
            <TabsTrigger value="eth">Ethiopia</TabsTrigger>
            <TabsTrigger value="markets">Markets</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredNews.map((article) => (
                  <div
                    key={article.id}
                    className="border border-border/50 rounded-lg p-4 hover:border-border transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant={getCategoryBadgeVariant(article.category)}
                            className="gap-1 text-xs"
                          >
                            {getCategoryIcon(article.category)}
                            {article.category.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {article.source}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            •
                          </span>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(article.publishedAt)}
                          </div>
                        </div>

                        <h3 className="font-semibold text-sm leading-tight">
                          {article.title}
                        </h3>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {article.summary}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={`text-xs font-medium ${getSentimentColor(article.sentiment)}`}
                            >
                              {article.sentiment.charAt(0).toUpperCase() +
                                article.sentiment.slice(1)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Relevance: {article.relevanceScore}%
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 text-xs h-6 px-2"
                            onClick={() => window.open(article.url, "_blank")}
                          >
                            <ExternalLink className="h-3 w-3" />
                            Read
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
