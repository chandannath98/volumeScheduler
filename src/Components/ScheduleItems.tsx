import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, { useState } from 'react';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import {Switch, Text} from 'react-native-lite-ui';

export default function ScheduleItems({
  item,
  index,
  cancelSchedule,
  onItemPress,
  createSchedule
}: {
  item: any;
  index: number;
  cancelSchedule:(i:number)=>void
  onItemPress:(i:number)=>void,
  createSchedule:(i:number)=>void,

}) {

    const [enable, setEnable] = useState(item?.enable)

  return (
    <TouchableOpacity
    
    onPress={()=>onItemPress(item)}
    style={styles?.itemContainer}>
        <View style={{gap:verticalScale(5)}}>
      <Text
        fontSize="extraLarge"
        mode="medium">{`${item.hour>12?item?.hour-12:item?.hour}:${item?.minute} ${item?.hour>11?"PM":"AM"}`}</Text>

<Text>{item?.days? item?.days?.toString() :"Once"}</Text> 
        </View>

        <Switch

        isOn={enable}
        onToggle={()=>{
          if(enable){

            cancelSchedule(item?.id)
          }else{
            createSchedule(item)
          }
          
          setEnable(!enable)
        }}
        />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    // elevation:5,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: moderateScale(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    width:"99.7%"
  },
});
