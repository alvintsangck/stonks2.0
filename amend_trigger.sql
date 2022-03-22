
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

drop materialized view screeners ;

drop materialized view industry_rs_view ;

drop materialized view stock_historic_prices ;

create materialized view IF NOT EXISTS stock_historic_prices as
with table1 as (
select s.id as "stock_id", s.ticker as "ticker", sp.price as "price1", sp.date_id, sp.created_at as "date1"
from stocks s join stock_prices sp on s.id = sp.stock_id 
where sp.created_at in (select created_at from stock_prices where created_at <= now() order by created_at desc limit 1)
and s.industry_id < 198
and sp.price > 0
order by s.ticker
),
table2 as (
select s.ticker as "ticker", sp.price as "price2", sp.created_at as "date2"
from stocks s join stock_prices sp on s.id = sp.stock_id 
where sp.created_at in (select created_at from stock_prices where created_at <= (now() - interval '1 WEEK') order by created_at desc limit 1)
order by s.ticker
),
table3 as (
select s.ticker as "ticker", sp.price as "price3", sp.created_at as "date3"
from stocks s join stock_prices sp on s.id = sp.stock_id 
where sp.created_at in (select created_at from stock_prices where created_at <= (now() - interval '1 MONTH') order by created_at desc limit 1)
order by s.ticker
),
table4 as (
select s.ticker as "ticker", sp.price as "price4", sp.created_at as "date4"
from stocks s join stock_prices sp on s.id = sp.stock_id 
where sp.created_at in (select created_at from stock_prices where created_at <= (now() - interval '3 MONTH') order by created_at desc limit 1)
order by s.ticker
),
table5 as (
select s.ticker as "ticker", sp.price as "price5", sp.created_at as "date5"
from stocks s join stock_prices sp on s.id = sp.stock_id 
where sp.created_at in (select created_at from stock_prices where created_at <= (now() - interval '6 MONTH') order by created_at desc limit 1)
order by s.ticker
),
table6 as (
select s.ticker as "ticker", sp.price as "price6", sp.created_at as "date6"
from stocks s join stock_prices sp on s.id = sp.stock_id 
where sp.created_at in (select created_at from stock_prices where created_at <= (now() - interval '12 MONTH') order by created_at desc limit 1)
order by s.ticker
),
table0 as (
select s.ticker as "ticker", max(sp.price) as "year_high"
from stocks s join stock_prices sp on s.id = sp.stock_id
where sp.created_at >= (now() - interval '1 YEAR')
group by s.ticker
order by s.ticker
)
select DISTINCT ON (table1.stock_id) table1.stock_id, table1.date_id, table1.ticker, table0.year_high, table1.price1, table2.price2, table3.price3, table4.price4, table5.price5, table6.price6
from table1 
join table2 on table1.ticker = table2.ticker
join table3 on table1.ticker = table3.ticker
join table4 on table1.ticker = table4.ticker
full join table5 on table1.ticker = table5.ticker
full join table6 on table1.ticker = table6.ticker
full join table0 on table1.ticker = table0.ticker
where table1.ticker is not null
order by table1.stock_id;

create materialized view if not exists industry_rs_view as
select distinct rs.date_id, i.id, i.name as "industry",
(sum(smc.market_cap * rs.rs_rating) over (partition by s.industry_id)) / (sum(smc.market_cap) over (partition by s.industry_id)) as "industry_rs"
from stock_rs rs join stocks s on rs.stock_id = s.id
join stock_market_caps smc on smc.stock_id = s.id
join industries i on i.id = s.industry_id
where rs.created_at in (select created_at from stock_rs order by created_at desc limit 1)
and i.id < 198
order by i.id;

create materialized view if not exists screeners as
with table1 as 
(select s.id as "stock_id", s.ticker as "ticker", s."name" as "name", s.industry_id as "industry_id", sp.price as "price1", sp.created_at as "date1"
from stocks s join stock_prices sp on s.id = sp.stock_id
where sp.date_id in (select distinct date_id from stock_prices order by date_id desc limit 1)
and s.industry_id < 198),
table2 as (
select s.ticker as "ticker", sp.price as "price2", sp.created_at as "date2"
from stocks s join stock_prices sp on s.id = sp.stock_id
where sp.date_id in (select distinct date_id from stock_prices order by date_id desc limit 1 offset 1)
and sp.price > 0 and s.industry_id < 198),
table0 as (
select s.ticker as "ticker", max(sp.price) as "year_high"
from stocks s join stock_prices sp on s.id = sp.stock_id
where sp.created_at >= (now() - interval '1 YEAR')
group by s.ticker)
select table1.stock_id, table1.ticker, table1.name, table1.price1 as "price",
(table1.price1 - table2.price2) as "change",
round ((table1.price1 - table2.price2)/table2.price2 * 100, 2) as "change_per",
table0.year_high,
trs.off_year_high,
smc.market_cap,
rs.rs_rating,
sectors."name" as "sector",
sectors.id  as "sector_id",
i."name" as "industry",
i."id" as "industry_id",
irs.rs_rating as "industry_rs",
irs.ranking as "industry_rank"
from table1
join table2 on table1.ticker = table2.ticker
join table0 on table1.ticker = table0.ticker
join industries i on table1.industry_id = i.id
join sectors on i.sector_id = sectors.id
join industry_rs irs on irs.industry_id = i.id
join stock_rs rs on table1.stock_id = rs.stock_id
join stock_market_caps smc on table1.stock_id = smc.stock_id
join temp_stock_rs trs on table1.stock_id = trs.stock_id
where rs.created_at in (select distinct created_at from stock_rs order by created_at desc limit 1)
and irs.created_at in (select distinct created_at from industry_rs order by created_at desc limit 1)
order by table1.stock_id;