export type UserPortfolio = {
  ticker: string;
  name: string;
  sectorName: string;
  shares: string;
  price?: number | null;
  unitCost: number;
  totalCost: number;
  marketValue?: number | null;
  profit?: number | null;
};

export type PortfolioState = {
  portfolio: UserPortfolio[];
};

export type FinnhubTrade = {
  // symbol
  s: string;
  // price
  p: number;
  // timestamp
  t?: number;
  // volume
  v?: number;
  // trade conditions
  c?: string;
};
