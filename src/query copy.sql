-- ! Join sales_deals table with user_profiles table to get each rep's name and their total sales.

-- * SELECT what columns we need
select
	user_profiles.name, -- * get name from user_profiles table
	sum(sales_deals.value) -- * sum all deal values from sales_deals table
-- ? FROM which table has the values we need to sum?
from sales_deals
-- *! JOIN to connect sales_deals with user_profiles
INNER JOIN user_profiles ON user_profiles.id = sales_deals.user_id
-- * aggregate results by each unique name (so each rep gets their total)
group by
	user_profiles.name;


-- 
SELECT 
	sum(sales_deals.value),
	user_profiles.name
FROM sales_deals
INNER JOIN user_profiles ON sales_deals.user_id = user_profiles.id
GROUP BY user_profiles.name;