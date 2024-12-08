import {StyleSheet, View} from 'react-native';
import React, { useState } from 'react';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import {Switch, Text} from 'react-native-lite-ui';

export default function ScheduleItems({
  item,
  index,
}: {
  item: any;
  index: number;
}) {

    const [enable, setEnable] = useState(item?.enable || true)

  return (
    <View style={styles?.itemContainer}>
        <View style={{gap:verticalScale(5)}}>
      <Text
        fontSize="extraLarge"
        mode="medium">{`${item.hour}:${item?.minute} AM`}</Text>

<Text>{item?.days? item?.days?.toString() :"Once"}</Text> 
        </View>

        <Switch

        isOn={enable}
        onToggle={()=>setEnable(false)}
        />
    </View>
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
