import { Button, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { NativeModules } from 'react-native';
const { VolumeControl } = NativeModules;
const { VolumeScheduler } = NativeModules;

import BackgroundTimer from 'react-native-background-timer';
import Home from './src/Home';


export default function App() {

//   const muteMediaVolume = () => {
//     console.log("musted")
//     VolumeControl.setMediaVolumeToZero();
// };

// const scheduleVolumeMute = (timeInMilliseconds) => {
//   BackgroundTimer.setTimeout(() => {
//     muteMediaVolume();
//   }, timeInMilliseconds);
// };





  return (
    <View style={{flex:1}}>


    
<Home />

    </View>
  )
}

const styles = StyleSheet.create({})