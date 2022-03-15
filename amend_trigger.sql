
drop index stock_earnings_idx ;

CREATE UNIQUE INDEX stock_earnings_idx on stock_earnings(stock_id, year_quarter_id); 

drop trigger stock_earnings_trigger on staging_stock_earnings;

CREATE OR REPLACE FUNCTION insert_stock_earnings() RETURNS trigger AS $$
    BEGIN

        INSERT INTO stock_earnings (date_id, stock_id, year_quarter_id, release_time, eps_estimated, eps_reported, revenue_estimated, revenue_reported, created_at)
        (select dd.id, s.id, dyq.id, NEW.release_time, NEW.eps_estimated, NEW.eps_reported, NEW.revenue_estimated, NEW.revenue_reported, NEW.created_at
        from dim_dates as dd, dim_year_quarters as dyq, stocks as s
       	where dd."year" = NEW.year and dd."month" = NEW.month and dd."day" = NEW.day 
       	and dyq."year" = NEW.earning_year and dyq.quarter = NEW.earning_quarter 
       	and s.ticker = NEW.ticker) 
       	on conflict (stock_id, year_quarter_id)
       	DO UPDATE set date_id = EXCLUDED.date_id, eps_reported = NEW.eps_reported, revenue_reported = NEW.revenue_reported, created_at = NEW.created_at, updated_at = NOW();

        return NEW; 
    END
$$ LANGUAGE plpgsql;

CREATE TRIGGER stock_earnings_trigger AFTER INSERT ON staging_stock_earnings FOR EACH ROW EXECUTE PROCEDURE insert_stock_earnings();