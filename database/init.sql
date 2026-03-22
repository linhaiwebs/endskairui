-- 日本上市公司信息披露平台 - 数据库初始化SQL
-- 创建扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建更新时间自动更新函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 公司表
CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    stock_code VARCHAR(10) UNIQUE NOT NULL,
    company_name VARCHAR(200) NOT NULL,
    company_name_en VARCHAR(200),
    industry VARCHAR(100),
    market VARCHAR(50),
    sector_code VARCHAR(20),
    listing_date TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_companies_stock_code ON companies(stock_code);
CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies(industry);
CREATE INDEX IF NOT EXISTS idx_companies_market ON companies(market);

-- 创建更新触发器
DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 披露表
CREATE TABLE IF NOT EXISTS disclosures (
    id SERIAL PRIMARY KEY,
    doc_id VARCHAR(100) UNIQUE NOT NULL,
    stock_code VARCHAR(10) NOT NULL,
    company_name VARCHAR(200) NOT NULL,
    title VARCHAR(500) NOT NULL,
    doc_type VARCHAR(50),
    doc_type_code VARCHAR(20),
    submit_date TIMESTAMP NOT NULL,
    fiscal_year VARCHAR(10),
    period VARCHAR(20),
    source VARCHAR(20) NOT NULL,
    pdf_url TEXT,
    html_url TEXT,
    xbrl_url TEXT,
    summary TEXT,
    is_important BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_disclosures_doc_id ON disclosures(doc_id);
CREATE INDEX IF NOT EXISTS idx_disclosures_stock_code ON disclosures(stock_code);
CREATE INDEX IF NOT EXISTS idx_disclosures_submit_date ON disclosures(submit_date DESC);
CREATE INDEX IF NOT EXISTS idx_disclosures_doc_type ON disclosures(doc_type);
CREATE INDEX IF NOT EXISTS idx_disclosures_source ON disclosures(source);
CREATE INDEX IF NOT EXISTS idx_disclosures_stock_submit ON disclosures(stock_code, submit_date DESC);

-- 创建更新触发器
DROP TRIGGER IF EXISTS update_disclosures_updated_at ON disclosures;
CREATE TRIGGER update_disclosures_updated_at
    BEFORE UPDATE ON disclosures
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 财报表
CREATE TABLE IF NOT EXISTS financial_reports (
    id SERIAL PRIMARY KEY,
    stock_code VARCHAR(10) NOT NULL,
    fiscal_year VARCHAR(10) NOT NULL,
    period VARCHAR(20) NOT NULL,
    revenue NUMERIC(15, 2),
    operating_income NUMERIC(15, 2),
    ordinary_income NUMERIC(15, 2),
    net_income NUMERIC(15, 2),
    total_assets NUMERIC(15, 2),
    total_liabilities NUMERIC(15, 2),
    total_equity NUMERIC(15, 2),
    operating_cf NUMERIC(15, 2),
    investing_cf NUMERIC(15, 2),
    financing_cf NUMERIC(15, 2),
    eps NUMERIC(10, 2),
    bps NUMERIC(10, 2),
    dividend NUMERIC(10, 2),
    roe NUMERIC(5, 2),
    doc_id VARCHAR(100),
    report_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_financial_reports_stock_code ON financial_reports(stock_code);
CREATE INDEX IF NOT EXISTS idx_financial_reports_fiscal_year ON financial_reports(fiscal_year);
CREATE INDEX IF NOT EXISTS idx_financial_reports_stock_fiscal ON financial_reports(stock_code, fiscal_year);

-- 创建唯一约束
ALTER TABLE financial_reports 
DROP CONSTRAINT IF EXISTS idx_unique_financial_report;

ALTER TABLE financial_reports 
ADD CONSTRAINT idx_unique_financial_report 
UNIQUE (stock_code, fiscal_year, period);

-- 创建更新触发器
DROP TRIGGER IF EXISTS update_financial_reports_updated_at ON financial_reports;
CREATE TRIGGER update_financial_reports_updated_at
    BEFORE UPDATE ON financial_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 插入示例数据（可选）
-- 示例公司数据
INSERT INTO companies (stock_code, company_name, company_name_en, industry, market) VALUES
('7203', 'トヨタ自動車株式会社', 'Toyota Motor Corporation', '輸送用機器', 'プライム'),
('6758', 'ソニーグループ株式会社', 'Sony Group Corporation', '電気機器', 'プライム'),
('9984', 'ソフトバンクグループ株式会社', 'SoftBank Group Corp.', '情報通信業', 'プライム')
ON CONFLICT (stock_code) DO NOTHING;

-- 授予权限
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
