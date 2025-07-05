-- ETB Exchange Database Schema

-- Users table for authentication and profiles
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    country TEXT DEFAULT 'Ethiopia',
    timezone TEXT DEFAULT 'Africa/Addis_Ababa',
    base_currency TEXT DEFAULT 'ETB',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User settings table
CREATE TABLE IF NOT EXISTS user_settings (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    theme TEXT DEFAULT 'dark',
    language TEXT DEFAULT 'English',
    hide_balances BOOLEAN DEFAULT FALSE,
    price_alerts BOOLEAN DEFAULT TRUE,
    news_updates BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT FALSE,
    risk_tolerance TEXT DEFAULT 'moderate',
    preferred_exchange TEXT DEFAULT 'binance',
    session_timeout INTEGER DEFAULT 30,
    two_factor_auth BOOLEAN DEFAULT FALSE,
    biometric_auth BOOLEAN DEFAULT FALSE,
    data_sharing BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Portfolio holdings table
CREATE TABLE IF NOT EXISTS portfolio_holdings (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    symbol TEXT NOT NULL,
    name TEXT NOT NULL,
    asset_type TEXT NOT NULL CHECK (asset_type IN ('crypto', 'fiat', 'stock')),
    amount DECIMAL(20, 8) NOT NULL,
    avg_buy_price DECIMAL(20, 8) NOT NULL,
    current_price DECIMAL(20, 8) DEFAULT 0,
    total_value DECIMAL(20, 2) DEFAULT 0,
    gain_loss DECIMAL(20, 2) DEFAULT 0,
    gain_loss_percent DECIMAL(10, 4) DEFAULT 0,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Transaction history table
CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    holding_id TEXT,
    symbol TEXT NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('buy', 'sell')),
    amount DECIMAL(20, 8) NOT NULL,
    price DECIMAL(20, 8) NOT NULL,
    total DECIMAL(20, 2) NOT NULL,
    fees DECIMAL(20, 2) DEFAULT 0,
    exchange TEXT,
    notes TEXT,
    transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (holding_id) REFERENCES portfolio_holdings (id) ON DELETE SET NULL
);

-- Price alerts table
CREATE TABLE IF NOT EXISTS price_alerts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    symbol TEXT NOT NULL,
    asset_type TEXT NOT NULL,
    condition_type TEXT NOT NULL CHECK (condition_type IN ('above', 'below', 'change_percent')),
    target_price DECIMAL(20, 8),
    change_percent DECIMAL(10, 4),
    is_active BOOLEAN DEFAULT TRUE,
    triggered_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Watchlist table
CREATE TABLE IF NOT EXISTS watchlist (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    symbol TEXT NOT NULL,
    name TEXT NOT NULL,
    asset_type TEXT NOT NULL,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE(user_id, symbol, asset_type)
);

-- User sessions table for authentication
CREATE TABLE IF NOT EXISTS user_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token_hash TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_portfolio_holdings_user_id ON portfolio_holdings(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_symbol ON transactions(symbol);
CREATE INDEX IF NOT EXISTS idx_price_alerts_user_id ON price_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_symbol ON price_alerts(symbol);
CREATE INDEX IF NOT EXISTS idx_watchlist_user_id ON watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(token_hash);

-- Insert sample demo user (password: demo123)
INSERT OR IGNORE INTO users (id, email, password_hash, name, country, timezone) VALUES (
    'demo-user-001',
    'demo@etbexchange.com',
    '$2a$10$YourHashedPasswordHere',
    'Demo User',
    'Ethiopia',
    'Africa/Addis_Ababa'
);

-- Insert sample portfolio data for demo user
INSERT OR IGNORE INTO portfolio_holdings (id, user_id, symbol, name, asset_type, amount, avg_buy_price, current_price) VALUES 
    ('holding-001', 'demo-user-001', 'BTC', 'Bitcoin', 'crypto', 0.5, 95000, 108134),
    ('holding-002', 'demo-user-001', 'ETH', 'Ethereum', 'crypto', 2.5, 3200, 3891),
    ('holding-003', 'demo-user-001', 'USD', 'US Dollar', 'fiat', 1000, 132, 135),
    ('holding-004', 'demo-user-001', 'XRP', 'XRP', 'crypto', 500, 2.8, 3.21);

-- Insert sample transactions
INSERT OR IGNORE INTO transactions (id, user_id, holding_id, symbol, transaction_type, amount, price, total, notes, transaction_date) VALUES 
    ('tx-001', 'demo-user-001', 'holding-001', 'BTC', 'buy', 0.5, 95000, 47500, 'Dollar cost averaging purchase', '2024-12-15 10:30:00'),
    ('tx-002', 'demo-user-001', 'holding-002', 'ETH', 'buy', 2.5, 3200, 8000, 'Long-term investment', '2024-12-20 14:15:00'),
    ('tx-003', 'demo-user-001', 'holding-003', 'USD', 'buy', 1000, 132, 132000, 'Currency exchange for travel', '2025-01-02 09:45:00'),
    ('tx-004', 'demo-user-001', 'holding-004', 'XRP', 'buy', 500, 2.8, 1400, 'Diversification purchase', '2025-01-05 16:20:00');

-- Insert default user settings for demo user
INSERT OR IGNORE INTO user_settings (id, user_id, theme, language, hide_balances, price_alerts, news_updates) VALUES (
    'settings-001',
    'demo-user-001',
    'dark',
    'English',
    FALSE,
    TRUE,
    TRUE
);
