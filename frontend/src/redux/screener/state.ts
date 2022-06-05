import { ScreenerFormState } from "../../components/ScreenerForm";

export type Item = {
  id: number;
  name: string;
  isInclude?: boolean;
};

export type Sector = {
  id: number;
  name: string;
};

export type Industry = {
  id: number;
  name: string;
};

export type IScreener = {
  id: number;
  ticker: string;
  name: string;
  price: string;
  change: string;
  changePer: string;
  yearHigh: string;
  marketCap: string;
  rsRating: string;
  sector: string;
  industry: string;
  industryRs: string;
  industryRank: string;
};

export enum ScreenerItemOptions {
  Include = "include",
  Exclude = "exclude",
}

export enum ScreenerStateKey {
  AddedIndustries = "addedIndustries",
  AddedSectors = "addedSectors",
}

export type LoadScreenerBody = ScreenerFormState & {
  includedIndustry: (number | undefined)[];
  excludedIndustry: (number | undefined)[];
  includedSector: (number | undefined)[];
  excludedSector: (number | undefined)[];
};

export type ScreenerState = {
  [ScreenerStateKey.AddedIndustries]: Item[];
  [ScreenerStateKey.AddedSectors]: Item[];
};
