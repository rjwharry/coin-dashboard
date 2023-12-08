import { useQuery } from "@tanstack/react-query"
import { fetchCoinHistory } from "../api"
import ReactApexChart from "react-apexcharts"

export interface IHistorical{
  "time_open":number
  "time_close":number
  "open":string
  "high":string
  "low":string
  "close":string
  "volume":string
  "market_cap":number
}

export interface IHistoricalError {
  "error":string
}

export interface IChart {
  coinId: string;
}

function Chart({ coinId }:IChart) {
  const { isLoading, data } = useQuery({
    queryKey: ["historic", coinId],
    queryFn: () => fetchCoinHistory(coinId),
  })
  return (
    <>
      {isLoading ? "Loading chart..." : 
      data?.error ? "No Data" :
      <ReactApexChart 
        type="line" 
        series={[
          {
            data: data?.map(price => Number(price.close)) ?? [],
            name: "Price",
          },
        ]}
        options={{
          theme: {mode: "dark"},
          grid: { show: false },
          chart: {
            height: 300,
            width: 500,
            toolbar: { show: false },
            background: "transparent",
          },
          stroke: {
            curve: "smooth",
            width: 5,
          },
          yaxis: { show: false },
          xaxis: {
            categories: data?.map(price => new Date(price.time_close)) ?? [],
            labels: { show: false },
            axisBorder: { show: false },
            axisTicks: { show: false },
          },
          fill: { 
            type: "gradient",
            gradient: { gradientToColors: ["#0be881"], stops: [0, 100] },
          },
          colors: ["blue"],
          tooltip: {
            y: {
              formatter: value => `$${value}`
            }
          },
        }}
      />}
    </>
  )
}

export default Chart;