import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Palette,
  Shield,
  Download,
  Upload,
  Trash2,
  Save,
  Moon,
  Sun,
  Globe,
  DollarSign,
} from "lucide-react";

interface UserSettings {
  // Profile Settings
  name: string;
  email: string;
  country: string;
  timezone: string;

  // Display Preferences
  currency: string;
  language: string;
  theme: "light" | "dark" | "system";
  compactView: boolean;
  hideBalances: boolean;

  // Notifications
  priceAlerts: boolean;
  newsUpdates: boolean;
  marketSummary: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;

  // Trading Preferences
  defaultAmount: string;
  preferredExchange: string;
  riskTolerance: "conservative" | "moderate" | "aggressive";

  // Privacy & Security
  twoFactorAuth: boolean;
  biometricAuth: boolean;
  sessionTimeout: string;
  dataSharing: boolean;
}

export default function Settings() {
  const [settings, setSettings] = useState<UserSettings>({
    // Profile Settings
    name: "Biruk Gebre",
    email: "biruk@example.com",
    country: "Ethiopia",
    timezone: "Africa/Addis_Ababa",

    // Display Preferences
    currency: "ETB",
    language: "English",
    theme: "dark",
    compactView: false,
    hideBalances: false,

    // Notifications
    priceAlerts: true,
    newsUpdates: true,
    marketSummary: false,
    emailNotifications: true,
    pushNotifications: false,

    // Trading Preferences
    defaultAmount: "10000",
    preferredExchange: "binance",
    riskTolerance: "moderate",

    // Privacy & Security
    twoFactorAuth: false,
    biometricAuth: false,
    sessionTimeout: "30",
    dataSharing: false,
  });

  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = (key: keyof UserSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    // In production, this would save to backend
    console.log("Saving settings:", settings);
    setHasChanges(false);
    // Show success toast
  };

  const resetSettings = () => {
    // Reset to default values
    setHasChanges(false);
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `etb-exchange-settings-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          setSettings(importedSettings);
          setHasChanges(true);
        } catch (error) {
          console.error("Failed to import settings:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-background subtle-grid-bg refined-bg">
      <Navigation />

      {/* Floating Elements */}
      <div className="fixed top-24 left-8 w-32 h-32 opacity-[0.02] animate-pulse duration-[3500ms]">
        <div className="w-full h-full rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-2xl"></div>
      </div>

      <main className="container py-8 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="glass-card rounded-3xl p-8 refined-glow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg">
                  <SettingsIcon className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Settings
                  </h1>
                  <p className="text-xl text-foreground/80 font-medium mt-2">
                    Customize your ETB Exchange experience
                  </p>
                </div>
              </div>

              {hasChanges && (
                <div className="flex items-center gap-4">
                  <Button variant="outline" onClick={resetSettings}>
                    Cancel
                  </Button>
                  <Button onClick={saveSettings} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Settings Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="display">Display</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="trading">Trading</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            {/* Profile Settings */}
            <TabsContent value="profile">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={settings.name}
                        onChange={(e) => updateSetting("name", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={settings.email}
                        onChange={(e) => updateSetting("email", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Select
                        value={settings.country}
                        onValueChange={(value) =>
                          updateSetting("country", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ethiopia">Ethiopia</SelectItem>
                          <SelectItem value="United States">
                            United States
                          </SelectItem>
                          <SelectItem value="United Kingdom">
                            United Kingdom
                          </SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="Germany">Germany</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={settings.timezone}
                        onValueChange={(value) =>
                          updateSetting("timezone", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Africa/Addis_Ababa">
                            Africa/Addis_Ababa (EAT)
                          </SelectItem>
                          <SelectItem value="America/New_York">
                            America/New_York (EST)
                          </SelectItem>
                          <SelectItem value="Europe/London">
                            Europe/London (GMT)
                          </SelectItem>
                          <SelectItem value="Asia/Tokyo">
                            Asia/Tokyo (JST)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Display Settings */}
            <TabsContent value="display">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Display Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="currency">Base Currency</Label>
                      <Select
                        value={settings.currency}
                        onValueChange={(value) =>
                          updateSetting("currency", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ETB">
                            Ethiopian Birr (ETB)
                          </SelectItem>
                          <SelectItem value="USD">US Dollar (USD)</SelectItem>
                          <SelectItem value="EUR">Euro (EUR)</SelectItem>
                          <SelectItem value="GBP">
                            British Pound (GBP)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={settings.language}
                        onValueChange={(value) =>
                          updateSetting("language", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Amharic">
                            አማርኛ (Amharic)
                          </SelectItem>
                          <SelectItem value="Oromo">Afaan Oromoo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={settings.theme}
                      onValueChange={(value) => updateSetting("theme", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="compactView">Compact View</Label>
                        <p className="text-sm text-muted-foreground">
                          Use smaller cards and dense layouts
                        </p>
                      </div>
                      <Switch
                        id="compactView"
                        checked={settings.compactView}
                        onCheckedChange={(checked) =>
                          updateSetting("compactView", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="hideBalances">
                          Hide Balances by Default
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Protect privacy by hiding monetary values
                        </p>
                      </div>
                      <Switch
                        id="hideBalances"
                        checked={settings.hideBalances}
                        onCheckedChange={(checked) =>
                          updateSetting("hideBalances", checked)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="priceAlerts">Price Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when prices hit your targets
                        </p>
                      </div>
                      <Switch
                        id="priceAlerts"
                        checked={settings.priceAlerts}
                        onCheckedChange={(checked) =>
                          updateSetting("priceAlerts", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="newsUpdates">News Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Breaking financial news and market updates
                        </p>
                      </div>
                      <Switch
                        id="newsUpdates"
                        checked={settings.newsUpdates}
                        onCheckedChange={(checked) =>
                          updateSetting("newsUpdates", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="marketSummary">
                          Daily Market Summary
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Daily digest of market performance
                        </p>
                      </div>
                      <Switch
                        id="marketSummary"
                        checked={settings.marketSummary}
                        onCheckedChange={(checked) =>
                          updateSetting("marketSummary", checked)
                        }
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-semibold">Delivery Methods</h3>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="emailNotifications">
                          Email Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive updates via email
                        </p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) =>
                          updateSetting("emailNotifications", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="pushNotifications">
                          Push Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Browser and mobile push notifications
                        </p>
                      </div>
                      <Switch
                        id="pushNotifications"
                        checked={settings.pushNotifications}
                        onCheckedChange={(checked) =>
                          updateSetting("pushNotifications", checked)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Trading Preferences */}
            <TabsContent value="trading">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Trading Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="defaultAmount">
                        Default Trading Amount (ETB)
                      </Label>
                      <Input
                        id="defaultAmount"
                        type="number"
                        value={settings.defaultAmount}
                        onChange={(e) =>
                          updateSetting("defaultAmount", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="preferredExchange">
                        Preferred Exchange
                      </Label>
                      <Select
                        value={settings.preferredExchange}
                        onValueChange={(value) =>
                          updateSetting("preferredExchange", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="binance">Binance</SelectItem>
                          <SelectItem value="coinbase">Coinbase</SelectItem>
                          <SelectItem value="kraken">Kraken</SelectItem>
                          <SelectItem value="local">Local Banks</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                    <Select
                      value={settings.riskTolerance}
                      onValueChange={(value) =>
                        updateSetting("riskTolerance", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conservative">
                          Conservative - Low risk, stable returns
                        </SelectItem>
                        <SelectItem value="moderate">
                          Moderate - Balanced risk and reward
                        </SelectItem>
                        <SelectItem value="aggressive">
                          Aggressive - High risk, high reward
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security & Privacy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="twoFactorAuth">
                          Two-Factor Authentication
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch
                        id="twoFactorAuth"
                        checked={settings.twoFactorAuth}
                        onCheckedChange={(checked) =>
                          updateSetting("twoFactorAuth", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="biometricAuth">
                          Biometric Authentication
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Use fingerprint or face recognition
                        </p>
                      </div>
                      <Switch
                        id="biometricAuth"
                        checked={settings.biometricAuth}
                        onCheckedChange={(checked) =>
                          updateSetting("biometricAuth", checked)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="sessionTimeout">
                      Session Timeout (minutes)
                    </Label>
                    <Select
                      value={settings.sessionTimeout}
                      onValueChange={(value) =>
                        updateSetting("sessionTimeout", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="240">4 hours</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="dataSharing">
                        Anonymous Usage Analytics
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Help improve the app by sharing anonymous usage data
                      </p>
                    </div>
                    <Switch
                      id="dataSharing"
                      checked={settings.dataSharing}
                      onCheckedChange={(checked) =>
                        updateSetting("dataSharing", checked)
                      }
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-semibold">Data Management</h3>

                    <div className="flex flex-wrap gap-4">
                      <Button
                        variant="outline"
                        onClick={exportSettings}
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Export Settings
                      </Button>

                      <div className="relative">
                        <input
                          type="file"
                          accept=".json"
                          onChange={importSettings}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Button
                          variant="outline"
                          className="gap-2 pointer-events-none"
                        >
                          <Upload className="h-4 w-4" />
                          Import Settings
                        </Button>
                      </div>

                      <Button variant="destructive" className="gap-2">
                        <Trash2 className="h-4 w-4" />
                        Clear All Data
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
