CREATE TABLE IF NOT EXISTS stocks (
  id SERIAL PRIMARY KEY,
  symbol VARCHAR(20) NOT NULL,
  name VARCHAR(100) NOT NULL,
  market VARCHAR(20) NOT NULL,
  industry VARCHAR(100),
  listing_date DATE,
  total_share BIGINT,
  circulating_share BIGINT,
  total_market_value BIGINT,
  circulating_market_value BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_stocks_symbol ON stocks(symbol);
CREATE INDEX IF NOT EXISTS idx_stocks_name ON stocks(name);

-- 为symbol添加唯一约束
ALTER TABLE stocks ADD CONSTRAINT unique_symbol UNIQUE (symbol); 