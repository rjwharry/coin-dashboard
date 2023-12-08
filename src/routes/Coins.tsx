import { Link } from "react-router-dom";
import styled from "styled-components";
import { fetchCoins } from "../api";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";


const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CoinsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  `;

const Tooltip = styled.span`
  position: absolute;
  display: flex;
  width: 100px;
  height: 100px;
  background-color: white;
  color: ${props => props.theme.bgColor};
  z-index: 1;
  border-style: solid;
  visibility: hidden;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 20px;
  font-weight: 10;
  border-radius: 15px;
`;

const Coin = styled.div`
  background-color: white;
  color: ${props => props.theme.bgColor};
  margin-bottom: 10px;
  border-radius: 15px;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  a {
    display: flex;
    justify-content: center;
    align-items: center;
    padding:15px;
    transition: color 0.2s ease-in;
    img {
      margin: auto;
      width: 50px;
      height: 50px;
    }
  }
  &:hover {
    a {
      color: ${props => props.theme.accentColor};
    }
    ${Tooltip} {
      visibility: visible;
    }
  }
`;


const Title = styled.h1`
  font-size: 48px;
  color: ${props => props.theme.accentColor};
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Img = styled.img`
  width: 35px;
  height: 35px;
  margin-right: 10px;
`;

export interface ICoin {
  id: string,
  name: string,
  symbol: string,
  rank: number
  is_new: boolean,
  is_active: boolean,
  type: string,
}

function Coins() {
  const { isLoading, data } = useQuery<void|ICoin[]>({
    queryKey: ["allCoins"],
    queryFn: fetchCoins,
    select: data => data?.slice(0, 30),
  });

  return (
    <Container>
      <Helmet>
        <title>코인</title>
      </Helmet>
      <Header>
        <Title>코인</Title>
      </Header>
      {isLoading ? <Loader>Loading...</Loader> :
        <CoinsList>
          {data?.map(coin => 
            <Coin 
              key={coin.id}>
              <Link to={{
                pathname: `/${coin.id}`,
                state: {name: coin.name},
              }}>
                <Img src={`https://coinicons-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`}/>
                <Tooltip>{coin.name}</Tooltip>
              </Link>
            </Coin>)}
        </CoinsList>
      }
    </Container>
  )
}

export default Coins;