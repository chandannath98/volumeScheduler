import { Button, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { NativeModules } from 'react-native';
const { VolumeControl } = NativeModules;
const { VolumeScheduler } = NativeModules;

import BackgroundTimer from 'react-native-background-timer';
import Home from './src/Home';


export default function App() {

  const muteMediaVolume = () => {
    console.log("musted")
    VolumeControl.setMediaVolumeToZero();
};

const scheduleVolumeMute = (timeInMilliseconds) => {
  BackgroundTimer.setTimeout(() => {
    muteMediaVolume();
  }, timeInMilliseconds);
};





  return (
    <View style={{flex:1}}>


      {/* <Button
      title='d'
      onPress={()=>{
        VolumeScheduler.scheduleMute(16, 9, 100, null); // Set media volume to 100% at 10:00 PM on Mondays and Fridays

        // Schedule ring volume
        VolumeScheduler.scheduleRingVolume(16, 9, 100, null); // Set ring volume to 80% at 8:100 AM daily
        
        // Schedule alarm volume
        VolumeScheduler.scheduleAlarmVolume(16, 9, 100, null); // Set alarm volume to 100% at 9:00 AM on Wednesdays
        
        // Schedule notification volume
        VolumeScheduler.scheduleNotificationVolume(16, 9, 100, null); // Set notification volume to 0% at 6:00 PM daily
        
        // Toggle vibration mode
        VolumeScheduler.toggleVibrationMode(false); // Enable vibration mode
        // VolumeScheduler.toggleVibrationMode(false); // Disable vibration mode

      }}
      /> */}
<Home />

    </View>
  )
}

const styles = StyleSheet.create({})