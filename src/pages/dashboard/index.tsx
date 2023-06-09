import { Option, Select } from "@material-tailwind/react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Echart from "../../components/Echart";
import { useProvine } from "../../hooks/useProvinde";
import MapComponent from "./map"
// import Input from "../../components/Input";
import { fetchWeather, getForecastWeather, getLocationSelector, setCityCurrent } from "../../redux/weather/weatherSlice";
import { optDashboardFake, optHomeChart } from "../../ultils/fakeData";
import Weather from "./weather";
import { temp } from "../../ultils";
import { List } from "../../redux/weather/weather";
const Dashboard = () => {
  const foreCastWeather = useSelector(getForecastWeather);
  // console.log(force.list.slice(0,5).map((item: List) => temp(item.main.temp)));
const colors = ["#5470C6", "#EE6666"];

  const weatherFake = {
    color: colors,
    tooltip: {
      trigger: "none",
      axisPointer: {
        type: "cross",
      },
    },
    legend: {},
    grid: {
      top: 90,
      bottom: 50,
    },
    xAxis: [
      {
        
        type: "category",
        axisTick: {
          alignWithLabel: true,
        },
        axisLine: {
          onZero: false,
          lineStyle: {
            color: colors[1],
          },
        },
        axisPointer: {
          label: {
            formatter: function (params: any) {
              return (
                "Nhiệt độ  " +
                params.value +
                (params.seriesData.length
                  ? "：" + params.seriesData[0].data
                  : "")
              );
            },
          },
        },
        // prettier-ignore
        data: foreCastWeather.list.slice(0,5).map((item) => item.dt_txt.replace(/^[^ ]* /, "")),
      },
      {
        type: "category",
        axisTick: {
          alignWithLabel: true,
        },
        axisLine: {
          onZero: true,
          lineStyle: {
            color: colors[0],
          },
        },
        axisPointer: {
          label: {
            formatter: function (params: any) {
              return (
                "Nhiệt độ  " +
                params.value +
                (params.seriesData.length
                  ? "：" + params.seriesData[0].data
                  : "")
              );
            },
          },
        },
        // prettier-ignore
        data:  foreCastWeather.list.slice(8,13).map((item) => item.dt_txt.replace(/^[^ ]* /, "")),
      },
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    series: [
      {
        name: "Hôm nay",
        type: "line",
        xAxisIndex: 1,
        smooth: true,
        emphasis: {
          focus: "series",
        },
        data: foreCastWeather.list
          .slice(0, 5)
          .map((item) => temp(item.main.temp)),
      },
      {
        name: "Ngày Mai",
        type: "line",
        smooth: true,
        emphasis: {
          focus: "series",
        },
        data: foreCastWeather.list
          .slice(8, 13)
          .map((item) => temp(item.main.temp)),
      },
    ],
  };
  const dispatch = useDispatch();
  const provinde = useProvine();
  const location = useSelector(getLocationSelector)
  const handleChangeCity = (event: string | undefined) => {
    const regex = /(Tỉnh|Thành phố)\s*(.*)/i;
    const match = event?.match(regex);
    const cityName = match ? match[2] : "";
    // setCity(cityName);  
    dispatch(setCityCurrent(cityName));
    dispatch(fetchWeather());
  };
  return (
    <>
      <div className="flex border rounded-lg border-1 p-5">
        <div className="basis-1/3">
          <div className="flex mb-5 ml-5 w-72">
            <Select
              label="Tỉnh/Thành Phố"
              // value={city}
              onChange={(value) => handleChangeCity(value)}
            >
              {provinde?.map((ite) => (
                <Option value={ite.name} key={ite.code}>
                  {ite.name}
                </Option>
              ))}
            </Select>
          </div>
          <div className="ml-5 w-96">
            <Weather />
          </div>
          <div className="p-5 mt-3 rounded-md shadow-inner">
            <MapComponent
              center={{
                lat: location.lat,
                lng: location.lon,
              }}
            />
          </div>
        </div>
        <div className="basis-2/3 border-l-2 rounded-lg">
          <Echart style={{height: '70vh', width: '820px'}} option={weatherFake} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
