export enum WalletType {
  EVM = 'EVM (Ethereum/L2s)',
  SOLANA = 'Solana',
  BITCOIN = 'Bitcoin',
  COSMOS = 'Cosmos',
  UNKNOWN = 'Unknown'
}

export interface AirdropItem {
  name: string;
  token: string;
  status: 'Active' | 'Upcoming' | 'Expired' | 'Rumor';
  likelihood: 'High' | 'Medium' | 'Low';
  description: string;
  actionUrl?: string;
  category: 'L2' | 'DeFi' | 'NFT' | 'Infrastructure' | 'Other';
}

export interface SearchResult {
  walletType: WalletType;
  airdrops: AirdropItem[];
  summary: string;
  groundingLinks: string[];
}

export interface ChartData {
  name: string;
  value: number;
}