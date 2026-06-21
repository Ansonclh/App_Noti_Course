import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Dimensions, StyleSheet } from 'react-native';
import { BarChart, PieChart, ProgressChart } from 'react-native-chart-kit';
import { LineChart} from 'react-native-gifted-charts';
import axios from 'axios';

const screenWidth = Dimensions.get("window").width;


export default function App() {

  const [dailyUsageData, setDailyUsageData] = useState({values:[],labels:[]});
  const [weeklyUsageData, setWeeklyUsageData] = useState({labels: [],datasets: [{data: []}]});
  const [categoryData, setCategoryData] = useState([{}]);
  const [featuresData, setFeaturesData] = useState({labels: [],data: []});

  const fetchDailyUsageMetrics = async () => {
    try {
      const response = await axios.get('https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/ZA40HNE2G0l7ZUgnq5VO4Q/dataoveraweek.json');
      setDailyUsageData(response.data);
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };


  const fetchWeeklyUsageData = async () => {
    try {
      const response = await axios.get('https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/4vOv2DroCvrpvIqvHjRq3w/weeklydata.json');
      setWeeklyUsageData(response.data);
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  const fetchCategoryData = async () => {
    try {
      const response = await axios.get('https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/Q4E2g7pKaK__9XII3C1GEQ/socialmedia.json');

      let getRandomHexColor = ()=> {
        // Generate a random number between 0 and 16777215 (decimal equivalent of #FFFFFF)
        const randomNum = Math.floor(Math.random() * 16777215);
        // Convert the random number to a hexadecimal string and pad with leading zeros if necessary
        return `#${randomNum.toString(16).padStart(6, "0")}`;
      }

      let dataRetrieved = response.data;
      dataRetrieved.map(data => {
        data.color=getRandomHexColor();
        data.legendFontColor = "#7F7F7F";
        data.legendFontSize = 12;
      });
      setCategoryData(response.data);
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  const fetchfeaturesData = async () => {
    try {
      const response = await axios.get('https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/tY7RUI7a7CsHkyatn10gJQ/progress-chart%20-1-');
      setFeaturesData(response.data);
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchDailyUsageMetrics();
    fetchWeeklyUsageData();
    fetchCategoryData();
    fetchfeaturesData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, marginVertical: 8 }}>Daily App Usage</Text>

      <LineChart
        data={dailyUsageData.values}
        width={300}
        height={200}
        initialSpacing={20}
        color="#1e90ff"
        thickness={2}
        hideDataPoints={false}
        dataPointsColor="#ff6347"
        dataPointsRadius={4}
        startFillColor="#add8e6"
        endFillColor="#ffffff"
        startOpacity={0.8}
        endOpacity={0.1}
        curved={true}
        showVerticalLines={true}
        verticalLinesColor="rgba(0, 0, 0, 0.1)"
        showYAxisIndices={true}
        yAxisColor="rgba(0, 0, 0, 0.1)"
        xAxisLabelTextStyle={styles.labelTextStyle}
        yAxisLabelTextStyle={styles.labelTextStyle}
        yAxisTextStyle={{ color: '#333', fontSize: 12 }}
        xAxisThickness={1}
        xAxisColor="black"
        xAxisLabelTexts={dailyUsageData.labels}
      />

<BarChart
          data={weeklyUsageData}
          width={screenWidth - 32}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          showValuesOnTopOfBars="true"
          fromZero = {true}
          chartConfig={{
          backgroundGradientFrom: "#8ccf9e",
          backgroundGradientTo: "#8ccf9e",
          decimalPlaces: 0,
          color: (opacity = 0) => `rgba(0, 0, 0, 1)`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: { borderRadius: 16 },          }}
          style={{ marginVertical: 8, borderRadius: 16 }}
        />

        {/* Pie Chart */}
        <Text style={{ fontSize: 18, marginVertical: 8 }}>App Usage by Category</Text>
        <PieChart
          data ={categoryData}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundGradientFrom: "white",
            backgroundGradientTo: "white",
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
          style={{ marginVertical: 8, borderRadius: 16 }}
        />

        {/* Progress Chart */}
        <Text style={{ fontSize: 18, marginVertical: 8 }}>Feature Completion Progress</Text>
        <ProgressChart
          data={featuresData}
          width={screenWidth - 32}
          height={220}
          strokeWidth={16}
          radius={32}
          chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            strokeWidth: 2, // optional, default 3
            barPercentage: 0.5,
            useShadowColorFromDataset: false // optional
          }}
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1, // Make the ScrollView take up full height
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  },
  contentContainer: {
    width: '100%', // Optional: Depending on your needs
    alignItems: 'center', // Center horizontally inside container
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
});