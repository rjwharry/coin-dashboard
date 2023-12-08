import { useQuery } from "@tanstack/react-query";
import { IChart } from "./Chart";
import { fetchCoinHistory } from "../api";
import ReactApexChart from "react-apexcharts";

function Price({ coinId }: IChart) {
  const { isLoading, data } = useQuery({
    queryKey: ["historic", coinId],
    queryFn: () => fetchCoinHistory(coinId),
  })
  return (
    <>
      {isLoading ? "Loading chart..." :
      data?.error ? "No Data" :
      <ReactApexChart
        series={[
          {
            data: data?.map(price => (
              {
                x: new Date(price.time_close),
                y: [
                  Number(price.open),
                  Number(price.high),
                  Number(price.low),
                  Number(price.close)
                ]
              }
            )) ?? [],
            // name: "Price",
          }
        ]}
        type="candlestick"
        options={{
          chart: {
            type: "candlestick",
            height: 300,
            width: 500,
            toolbar: { show: false }
          },
          xaxis: {
            categories: data?.map(price => new Date(price.time_close)) ?? [],
            labels: { show: false },
            axisBorder: { show: false },
            axisTicks: { show: false },
          },
          tooltip: {
            enabled: true,
            theme: "dark"
          },
          yaxis: { 
            tooltip: { enabled: true },
            show: false 
          },
          grid: { show: false }
        }}
      />}
    </>
  )
}

export default Price;