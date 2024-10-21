import axios, { HttpStatusCode } from "axios"
import instance from "../utils/axios-interceptors"
import React, { useEffect, useState, createContext, useContext } from "react"
import { View, Text, StyleSheet } from 'react-native';
import { SERVER_ROOT } from '../config/config'

const CourseListScreen = () => {
  const [medicineInfo, setMedicineInfo] = useState({});
  
  const getMedicineInfo = async () => {
    await axios({
        method: 'GET',
        url: `${SERVER_ROOT}/medicines/195900001`
    })
    .then(res => {
        const response = res.data
        console.log("[getMedicineInfo] > " + JSON.stringify(response));
        
        if (response.statusCode === HttpStatusCode.Ok) {
            setMedicineInfo(response.resultData)
        } else {
          console.log("[getMedicineInfo] then err > " + response.resultMsg);
        }
    })
    .catch(err => {
        console.log("[getMedicineInfo] catch err > " + err);
    })
  }

  useEffect(() => {
      getMedicineInfo();
  }, [])
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Course List Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default CourseListScreen;