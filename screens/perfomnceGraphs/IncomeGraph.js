import { View, Text, SafeAreaView, StatusBar } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { BarChart } from "react-native-chart-kit";
import { screenHeight, screenWidth } from "../../constants/Constants";
import Colors from "../../constants/Colors";
import AppStatusBar from "../../components/AppStatusBar";
import {
  convertDateFormat,
  datesAreEqual,
  formatNumberWithCommas,
} from "../../utils/Utils";
import TopHeader from "../../components/TopHeader";
import { BaseApiService } from "../../utils/BaseApiService";
import { UserContext } from "../../context/UserContext";
import Loader from "../../components/Loader";

const IncomeGraph = () => {
  let initData = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"],
    datasets: [
      {
        data: [],
      },
    ],
  };

  const { userParams, shops, selectedShop } = useContext(UserContext);

  const { shopOwnerId } = userParams;

  const [isLoading, setisloading] = useState(true);
  const [weekSales, setWeekSales] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [weeklyData, setWeeklyData] = useState(initData);

  const [datesOfWeek, setDatesOfWeek] = useState([]);

  const getSaleChartData = () => {
    if (weekSales.length > 0) {
      let incomeValues = [];

      for (let date of datesOfWeek) {
        let dateSales = [...weekSales].filter((sale) => {
          return datesAreEqual(date, new Date(sale.soldOnDate));
        });

        //profits array for the date
        const profits = dateSales
          .map(
            (item) =>
              item.lineItems?.reduce((a, i) => a + i.totalProfit, 0) || 0
          )
          .filter((profit) => profit !== undefined);
        let income = Math.round(profits.reduce((a, b) => a + b, 0)); //getting the sum profit in all carts

        incomeValues.push(income);
      }

      let newData = {
        ...weeklyData,
        datasets: [
          {
            data: incomeValues,
          },
        ],
      };

      setWeeklyData(newData);
      setisloading(false);
    }
  };

  const getWeekSales = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday

    // Calculate the date of the previous Saturday
    const saturday = new Date(today);
    saturday.setDate(today.getDate() - dayOfWeek - 1); // Subtracting 1 to get the previous Saturday
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - dayOfWeek);

    for (let i = 0; i < 7; i++) {
      const date = new Date(sunday);
      date.setDate(sunday.getDate() + i);
      if (!datesOfWeek.includes(date)) {
        datesOfWeek.push(date);
      }
    }

    let searchParameters = {
      offset: 0,
      limit: 0,
      shopOwnerId: shopOwnerId,
      startDate: convertDateFormat(saturday),
    };

    new BaseApiService("/shop-sales")
      .getRequestWithJsonResponse(searchParameters)
      .then((response) => {
        setWeekSales(response.records);
        setTotalSales(response.totalItems);
      })
      .catch((error) => {
        // setLoading(false);
      });
  };

  useEffect(() => {
    getWeekSales();
  }, []);

  useEffect(() => {
    getSaleChartData();
  }, [weekSales]);
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <AppStatusBar />
      <TopHeader title="Daily Income" />
      <Loader loading={isLoading} />
      <View style={{ marginTop: 10, paddingHorizontal: 15, gap: 10 }}>
        <Text>Daily Income from {totalSales} sales</Text>
        <BarChart
          data={weeklyData}
          width={screenWidth}
          showValuesOnTopOfBars
          height={screenHeight / 2}
        //   fromZero
          withInnerLines={false}
          showBarTops={false}
          yLabelsOffset={1}
          // withHorizontalLabels={false}
          chartConfig={{
            backgroundGradientFrom: Colors.light_2,
            backgroundGradientTo: Colors.light_2,
            decimalPlaces: 0,
            labelColor: (opacity = 1) => Colors.dark,
            formatYLabel: (label) => formatNumberWithCommas(label),
            formatTopBarValue: (label) => formatNumberWithCommas(label),
            color: (opacity = 1) => Colors.dark,
            fillShadowGradientToOpacity: 1,
            fillShadowGradientFromOpacity: 1,
            // fillShadowGradientTo: Colors.primary,
            // fillShadowGradientFrom: Colors.primary,
            horizontalOffset: 1,
          }}
          style={{
            alignItems: "center",
            marginLeft: -StatusBar.currentHeight,
            paddingHorizontal: 20,
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default IncomeGraph;
