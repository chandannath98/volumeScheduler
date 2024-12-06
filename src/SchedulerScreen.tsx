import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, { useRef } from 'react';
import {BottomSheet, ScreenWrapper, Text, useTheme} from 'react-native-lite-ui';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function SchedulerScreen() {




  const {colors} = useTheme();
  const bottomSheetRef= useRef()






  return (
    <View style={styles.container}>
      <BottomSheet
    
    ref={bottomSheetRef}
    >
      <View style={{flex:1,zIndex:10}}>

      </View>
    </BottomSheet>

    
    <View style={styles.container}>


    



      <View style={{marginTop: verticalScale(30)}}>
        <Text fontSize="extraExtraLarge" >
          Schedule Volume
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: verticalScale(20),
        }}>
        <AntDesign name="plus" size={moderateScale(100)} color="#bfbfbf" />
        <Text>Click + to add new Schedule</Text>
      </View>

      <TouchableOpacity
      onPress={()=>bottomSheetRef?.current?.show()}
        style={{
          zIndex:1,
          position: 'absolute',
          right: scale(10),
          bottom: verticalScale(20),
          backgroundColor: colors.primary,
          padding: moderateScale(15),
          borderRadius: 50,
          elevation:10
        }}>
        <AntDesign name="plus" size={moderateScale(20)} color={'white'} />
      </TouchableOpacity>
    </View>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(10),
  },
});
