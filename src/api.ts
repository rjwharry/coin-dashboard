import { IHistorical, IHistoricalError } from "./routes/Chart";
import { IInfo, IPrice } from "./routes/Coin";
import { ICoin } from "./routes/Coins";

const BASE_URL = "https://api.coinpaprika.com/v1"
const CHART_BASE_URL = "https://ohlcv-api.nomadcoders.workers.dev"

export function fetchCoins(): Promise<void|ICoin[]> {
  return fetch(`${BASE_URL}/coins`).then(res => 
    res.json()
  )
}

export function fetchCoinInfo(coinId: string): Promise<void|IInfo> {
  return fetch(`${BASE_URL}/coins/${coinId}`).then(res =>
    res.json()
  )
}

export function fetchCoinPrice(coinId: string): Promise<void|IPrice> {
  return fetch(`${BASE_URL}/tickers/${coinId}`).then(res =>
    res.json()
  )
}

export function fetchCoinHistory(coinId: string): Promise<void|IHistorical[]&IHistoricalError> {
  return fetch(`${CHART_BASE_URL}?coinId=${coinId}`).then(res => res.json());
}