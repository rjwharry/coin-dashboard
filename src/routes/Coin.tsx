import { 
  Link, 
  Route, 
  Switch,
  useLocation,
  useParams,
  useRouteMatch,
  useHistory } from "react-router-dom";
import styled from "styled-components";
import Price from "./Price";
import Chart from "./Chart";
import { useQuery } from "@tanstack/react-query";
import { fetchCoinInfo, fetchCoinPrice } from "../api";
import { Helmet } from "react-helmet";

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${props => props.theme.accentColor};
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  gap: 10px;
  position: relative;
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 10px;
`;
const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;
const Description = styled.p`
  margin: 20px 0px;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;

const Tab = styled.span<{isActive: boolean}>`
  text-align: center;
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 400;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 7px 0px;
  border-radius: 10px;
  color: ${props => props.isActive ? props.theme.accentColor : props.theme.textColor};
  a {
    display: block;
  };
`;

const Back = styled.label`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;


interface Params {
  coinId: string;
};

interface RouteState {
  name: string;
};

export interface IInfo {
  id: string,
  name: string,
  symbol: string,
  rank: number,
  is_new: boolean,
  is_active: boolean,
  type: string,
  logo: string,
  description: string,
  message: string,
  open_source: boolean,
  started_at: string,
  development_status: string,
  hardware_wallet: boolean,
  proof_type: string,
  org_structure: string,
  hash_algorithm: string,
  first_data_at: string,
  last_data_at: string,
};

export interface IPrice {
  id: string,
  name: string,
  symbol: string,
  rank: number,
  circulating_supply: number,
  total_supply: number,
  max_supply: number,
  beta_value: number,
  first_data_at: string,
  last_updated: string,
  quotes: {
    USD: {
      ath_date: string
      ath_price: number,
      market_cap: number,
      market_cap_change_24h: number,
      percent_change_1h: number,
      percent_change_1y: number,
      percent_change_6h: number,
      percent_change_7d: number,
      percent_change_12h: number,
      percent_change_15m: number,
      percent_change_24h: number,
      percent_change_30d: number,
      percent_change_30m: number,
      percent_from_price_ath: number,
      price : number,
      volume_24h : number,
      volume_24h_change_24h: number,
    }
  },
}

function Coin() {
  const history = useHistory();
  const { coinId }= useParams<Params>();
  const { state } = useLocation<RouteState>();
  const priceMatch = useRouteMatch("/:coinId/price");
  const chartMatch = useRouteMatch("/:coinId/chart");
  const { isLoading: infoLoading, data: info } = useQuery<void|IInfo>({
    queryKey: ["coinInfo", coinId],
    queryFn: () => fetchCoinInfo(coinId),
  });
  const { isLoading: priceLoading, data: priceInfo } = useQuery<void|IPrice>({
    queryKey: ["coinPrice", coinId],
    queryFn: () => fetchCoinPrice(coinId),
    // refetchInterval: 5000,
  });
  const loading = infoLoading && priceLoading;

  return (
    <Container>
      <Helmet>
        <title>{state?.name ? state.name : 
          loading ? "Loading..." : info?.name}</title>
      </Helmet>
      <Header>
        <Back onClick={() => {history.push("/")}}>
          <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path clipRule="evenodd" fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" />
          </svg>
        </Back>
        <Title>{state?.name ? state.name : 
          loading ? "Loading..." : info?.name}</Title>
      </Header>
      {loading ? <Loader>Loading...</Loader> : (
        <>
          <Overview>
            <OverviewItem>
              <span>Rank:</span>
              <span>{info?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Symbol:</span>
              <span>${info?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Price:</span>
              <span>${priceInfo?.quotes.USD.price}</span>
            </OverviewItem>
          </Overview>
          <Description>{info?.description}</Description>
          <Overview>
            <OverviewItem>
              <span>Total Suply:</span>
              <span>{priceInfo?.total_supply}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Max Supply:</span>
              <span>{priceInfo?.max_supply}</span>
            </OverviewItem>
          </Overview>
          <Tabs>
            <Tab isActive={chartMatch !== null}>
              <Link to={`/${coinId}/line`}>Line</Link>
            </Tab>
            <Tab isActive={priceMatch !== null}>
              <Link to={`/${coinId}/candle`}>Candle</Link>
            </Tab>
          </Tabs>

          <Switch>
            <Route path={`/:coinId/candle`}>
              <Price coinId={coinId}/>
            </Route>
            <Route path={`/:coinId/line`}>
              <Chart coinId={coinId} />
            </Route>
          </Switch>
        </>
      ) } 
    </Container>
  )
}

export default Coin;