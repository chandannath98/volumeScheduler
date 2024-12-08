
import {
  Dimensions,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  BottomSheet,
  Button,
  ScreenWrapper,
  Switch,
  Text,
  useTheme,
} from 'react-native-lite-ui';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DatePicker from 'react-native-date-picker';
import CheckBox from '@react-native-community/checkbox';
import extractTimeDetails from './utils/extractTimeDetails';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import generateRandomString from './utils/idGenerator';

import { NativeModules } from 'react-native';
const { VolumeControl } = NativeModules;
const { VolumeScheduler } = NativeModules;



export default function SchedulerScreen() {

//   const muteMediaVolume = () => {
//     console.log("musted")
//     VolumeControl.setMediaVolumeToZero();
// };

// const scheduleVolumeMute = (timeInMilliseconds) => {
//   BackgroundTimer.setTimeout(() => {
//     muteMediaVolume();
//   }, timeInMilliseconds);
// };

const {colors} = useTheme();
const bottomSheetRef = useRef();

const [time, settime] = useState(new Date());
const [repeat, setRepeat] = useState(false);
const [days, setDays] = useState([]);
const [showTimePicket, setShowTimePicket] = useState(false);

const [mediaVolume, setMediaVolume] = useState(0);
const [ringVolume, setRingVolume] = useState(0);
const [alarmVolume, setAlarmVolume] = useState(0);
const [scheduleList, setScheduleList] = useState([]);

const dayList = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
];

const timeDetails = extractTimeDetails(time);

const StreamType = {
  media: 3,
  notification: 2,
  alarm: 4,
  ring: 1,
};

const getSavedList = async () => {
  try {
    await AsyncStorage.getItem('scheduleList')?.then((i: any) => {
      setScheduleList(JSON.parse(i));
    });
  } catch {}
};

async function fetchSchedules() {
  try {
    const schedules = await VolumeScheduler.getSchedules();
    console.log('Scheduled Tasks:', schedules);

    // Example of rendering the schedules
    schedules.forEach(schedule => {
      console.log(`ID: ${schedule.id}`);
      console.log(`Time: ${schedule.hour}:${schedule.minute}`);
      console.log('Volume Levels:', schedule.volumeLevels);
      console.log(`Vibration Mode: ${schedule.vibrationMode}`);
      console.log(`Days: ${schedule.days.join(', ')}`);
    });
  } catch (error) {
    console.error('Error fetching schedules:', error);
  }
}

useEffect(() => {
  fetchSchedules();
}, []);




const createSchedule = async ()=>{
  const hour =timeDetails?.ampm=="PM"?  timeDetails?.hour+12:timeDetails?.hour

  // VolumeScheduler.scheduleMute(hour, timeDetails?.minute, 0, null); // Set media volume to 100% at 10:00 PM on Mondays and Fridays

  //       // Schedule ring volume
  //       VolumeScheduler.scheduleRingVolume(hour, timeDetails?.minute, 0, null); // Set ring volume to 80% at 8:100 AM daily
        
  //       // Schedule alarm volume
  //       VolumeScheduler.scheduleAlarmVolume(hour, timeDetails?.minute, 0, null); // Set alarm volume to 100% at 22:00 AM on Wednesdays
        
  //       // Schedule notification volume
  //       VolumeScheduler.scheduleNotificationVolume(hour, timeDetails?.minute, 0, null); // Set notification volume to 0% at 6:00 PM daily
        
  //       // Toggle vibration mode
  //       VolumeScheduler.toggleVibrationMode(false); // Enable vibration mode
  //       // VolumeScheduler.toggleVibrationMode(false); // Disable vibration mode
  //         console.log("first")

  VolumeScheduler.scheduleAdjustment(
    1, // Unique ID
    timeDetails?.hour24, // Hour
    timeDetails?.minute, // Minute
    {
      media: 0,
      ring: 0,
      alarm: 0,
      notification: 0,
    }, // Volume levels
    true, // Enable vibration
    ["SUNDAY"] // Days of the week
  ).then(console.log).catch(console.error);


          bottomSheetRef?.current?.hide()
}




return (
  <View style={styles.container}>



    <BottomSheet
      height={Dimensions.get('window').height * 0.9}
      ref={bottomSheetRef}>
      <View
        style={{
          flex: 1,
          paddingTop: verticalScale(20),
          paddingHorizontal: scale(10),
          gap: verticalScale(25),
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text mode="medium">Time</Text>
          <TouchableOpacity
            onPress={() => setShowTimePicket(true)}
            style={{
              flexDirection: 'row',
              gap: scale(10),
              alignItems: 'center',
              borderWidth: 1,
              borderColor: colors.textColor,
              borderRadius: 5,
              paddingVertical: verticalScale(10),
              paddingHorizontal: scale(20),
            }}>
            <AntDesign
              name="clockcircle"
              size={moderateScale(15)}
              color={colors.textColor}
            />

            <Text>{`${timeDetails.hour}:${timeDetails.minute} ${timeDetails.ampm}`}</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text mode="regular">Repeat</Text>
          <Switch isOn={repeat} onToggle={() => setRepeat(!repeat)} />
        </View>

        {repeat && (
          <View style={{gap: verticalScale(5)}}>
            {dayList?.map((i: string, index: number) => (
              <TouchableOpacity
                onPress={() => {
                  if (days?.includes(i as never)) {
                    const tempArr = days.filter((d: string) => d != i);
                    setDays(tempArr);
                  } else {
                    const tempArr = [...days, i];
                    setDays(tempArr);
                  }
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: scale(10),
                }}>
                <CheckBox
                  style={{zIndex: -1}}
                  disabled={true}
                  onValueChange={() => {
                    // if( days?.includes(i as never)){
                    //   const tempArr= days.filter((d:string)=>d!=i)
                    //   setDays(tempArr)
                    //  }else{
                    //   const tempArr =[...days,i]
                    //   setDays(tempArr)
                    //  }
                  }}
                  value={days?.includes(i as never)}
                />
                <Text>{i}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.sliderContainer}>
          <Text>Media Volume</Text>
          <Slider
            style={{width: Dimensions.get('window').width * 0.95, height: 40}}
            value={mediaVolume}
            onValueChange={(val: number) => {
              setMediaVolume(Math.trunc(val * 100));
            }}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="#000000"
            maximumTrackTintColor="#000000"
          />
        </View>

        <View style={styles.sliderContainer}>
          <Text>Ring Volume</Text>
          <Slider
            style={{width: Dimensions.get('window').width * 0.95, height: 40}}
            value={ringVolume}
            onValueChange={(val: number) => {
              setRingVolume(Math.trunc(val * 100));
            }}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="#000000"
            maximumTrackTintColor="#000000"
          />
        </View>

        <View style={styles.sliderContainer}>
          <Text>Alarm Volume</Text>
          <Slider
            style={{width: Dimensions.get('window').width * 0.95, height: 40}}
            value={alarmVolume}
            onMagicTap={() => {
              console.log('tapped');
            }}
            onValueChange={(val: number) => {
              setAlarmVolume(Math.trunc(val * 100));
            }}
            tapToSeek={false}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="#000000"
            maximumTrackTintColor="#000000"
          />
        </View>

        <DatePicker
          modal={true}
          open={showTimePicket}
          mode="time"
          date={time}
          onConfirm={date => {
            settime(date);
            setShowTimePicket(false);
            // setDate(date)
          }}
          onCancel={() => {
            setShowTimePicket(false);

            // setOpen(false)
          }}
        />
        <View style={{flexDirection: 'row', gap: scale(10)}}>
          <Button title="Save" radius="xl" onPress={createSchedule} />
          <Button
            type="outline"
            title="Cancel"
            radius="xl"
            onPress={() => bottomSheetRef?.current?.hide()}
          />
        </View>
      </View>
    </BottomSheet>

    <View style={styles.container}>
      <View style={{marginTop: verticalScale(30)}}>
        <Text fontSize="extraExtraLarge">Schedule Volume</Text>
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
    </View>
    <Pressable
      onPress={() => bottomSheetRef?.current?.show()}
      style={{
        // zIndex:1,
        position: 'absolute',
        right: scale(10),
        bottom: verticalScale(20),
        backgroundColor: colors.primary,
        padding: moderateScale(15),
        borderRadius: 50,
        // elevation:10
      }}>
      <AntDesign name="plus" size={moderateScale(20)} color={'white'} />
    </Pressable>
  </View>
);

  return (
    <View style={{flex:1}}>


      <Button
      title='d'
      onPress={()=>{
        VolumeScheduler.scheduleMute(22, 22, 0, null); // Set media volume to 100% at 10:00 PM on Mondays and Fridays

        // Schedule ring volume
        VolumeScheduler.scheduleRingVolume(22, 30, 0, null); // Set ring volume to 80% at 8:100 AM daily
        
        // Schedule alarm volume
        VolumeScheduler.scheduleAlarmVolume(22, 30, 0, null); // Set alarm volume to 100% at 22:00 AM on Wednesdays
        
        // Schedule notification volume
        VolumeScheduler.scheduleNotificationVolume(22, 30, 0, null); // Set notification volume to 0% at 6:00 PM daily
        
        // Toggle vibration mode
        VolumeScheduler.toggleVibrationMode(false); // Enable vibration mode
        // VolumeScheduler.toggleVibrationMode(false); // Disable vibration mode
          console.log("first")
      }}
      
      />
{/* <Home /> */}

    </View>
  )
}



// import {
//   Dimensions,
//   Pressable,
//   StyleSheet,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React, {useEffect, useRef, useState} from 'react';
// import {
//   BottomSheet,
//   Button,
//   ScreenWrapper,
//   Switch,
//   Text,
//   useTheme,
// } from 'react-native-lite-ui';
// import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import RNDateTimePicker from '@react-native-community/datetimepicker';
// import DatePicker from 'react-native-date-picker';
// import CheckBox from '@react-native-community/checkbox';
// import extractTimeDetails from './utils/extractTimeDetails';
// import Slider from '@react-native-community/slider';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import generateRandomString from './utils/idGenerator';

// import {NativeModules} from 'react-native';
// const {VolumeControl} = NativeModules;
// const {VolumeScheduler} = NativeModules;

// export default function SchedulerScreen() {
//   const {colors} = useTheme();
//   const bottomSheetRef = useRef();

//   const [time, settime] = useState(new Date());
//   const [repeat, setRepeat] = useState(false);
//   const [days, setDays] = useState([]);
//   const [showTimePicket, setShowTimePicket] = useState(false);

//   const [mediaVolume, setMediaVolume] = useState(0);
//   const [ringVolume, setRingVolume] = useState(0);
//   const [alarmVolume, setAlarmVolume] = useState(0);
//   const [scheduleList, setScheduleList] = useState([]);

//   const dayList = [
//     'SUNDAY',
//     'MONDAY',
//     'TUESDAY',
//     'WEDNESDAY',
//     'THURSDAY',
//     'FRIDAY',
//     'SATURDAY',
//   ];

//   const timeDetails = extractTimeDetails(time);

//   const StreamType = {
//     media: 3,
//     notification: 2,
//     alarm: 4,
//     ring: 1,
//   };

//   const getSavedList = async () => {
//     try {
//       await AsyncStorage.getItem('scheduleList')?.then((i: any) => {
//         setScheduleList(JSON.parse(i));
//       });
//     } catch {}
//   };

//   useEffect(() => {
//     getSavedList();
//   }, []);

//   const createSchedule = async () => {
//     console.log('first');

//     // Generate random ID
//     const id = generateRandomString();

//     // Save the schedule in AsyncStorage
//     const savedSchedule = {
//       media: mediaVolume,
//       alarm: alarmVolume,
//       ring: ringVolume,
//       isEnabled: true,
//       hour:timeDetails?.hour,
//       minute:timeDetails?.minute,
//       days:days,
//       id: id,
//     };
//     console.log(savedSchedule)
//     // Map selectedDays correctly
//     const selectedDays =
//       days?.length > 0
//         ? days
//         : null;

//     console.log('selectedDays', selectedDays);

//     // Ensure selectedDays is not null or empty, if so, schedule for the next available time
    

//     const hour = timeDetails?.ampm=="PM"?  timeDetails?.hour+12:timeDetails?.hour

//     console.log(hour, timeDetails?.minute, 0, null)
//       // Schedule for media
//       VolumeScheduler.scheduleMute(hour, timeDetails?.minute, 0, null); // Set media volume to 100% at 10:00 PM on Mondays and Fridays

//         // Schedule ring volume
//         VolumeScheduler.scheduleRingVolume(hour, timeDetails?.minute, 0, null); // Set ring volume to 80% at 8:100 AM daily
        
//         // Schedule alarm volume
//         VolumeScheduler.scheduleAlarmVolume(hour, timeDetails?.minute, 0, null); // Set alarm volume to 100% at 9:00 AM on Wednesdays
        
//         // Schedule notification volume
//         VolumeScheduler.scheduleNotificationVolume(hour, timeDetails?.minute, 0, null); // Set notification volume to 0% at 6:00 PM daily
        
//         // Toggle vibration mode
//         VolumeScheduler.toggleVibrationMode(false); // Enable vibration mode
//         // VolumeScheduler.toggleVibrationMode(false); // Disable vibration mode
//       console.log('Ring volume scheduled');
    

    

//     console.log('fourth');

//     // // Append to saved schedule list
//     // await AsyncStorage.setItem(
//     //   'scheduleList',
//     //   JSON.stringify([...scheduleList, savedSchedule]),
//     // );

//     // // Retrieve and update saved schedule list
//     // getSavedList();

//     // Close bottom sheet
//     bottomSheetRef?.current?.hide();
//   };

//   return (
//     <View style={styles.container}>
//       <BottomSheet
//         height={Dimensions.get('window').height * 0.9}
//         ref={bottomSheetRef}>
//         <View
//           style={{
//             flex: 1,
//             paddingTop: verticalScale(20),
//             paddingHorizontal: scale(10),
//             gap: verticalScale(25),
//           }}>
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//             }}>
//             <Text mode="medium">Time</Text>
//             <TouchableOpacity
//               onPress={() => setShowTimePicket(true)}
//               style={{
//                 flexDirection: 'row',
//                 gap: scale(10),
//                 alignItems: 'center',
//                 borderWidth: 1,
//                 borderColor: colors.textColor,
//                 borderRadius: 5,
//                 paddingVertical: verticalScale(10),
//                 paddingHorizontal: scale(20),
//               }}>
//               <AntDesign
//                 name="clockcircle"
//                 size={moderateScale(15)}
//                 color={colors.textColor}
//               />

//               <Text>{`${timeDetails.hour}:${timeDetails.minute} ${timeDetails.ampm}`}</Text>
//             </TouchableOpacity>
//           </View>

//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//             }}>
//             <Text mode="regular">Repeat</Text>
//             <Switch isOn={repeat} onToggle={() => setRepeat(!repeat)} />
//           </View>

//           {repeat && (
//             <View style={{gap: verticalScale(5)}}>
//               {dayList?.map((i: string, index: number) => (
//                 <TouchableOpacity
//                   onPress={() => {
//                     if (days?.includes(i as never)) {
//                       const tempArr = days.filter((d: string) => d != i);
//                       setDays(tempArr);
//                     } else {
//                       const tempArr = [...days, i];
//                       setDays(tempArr);
//                     }
//                   }}
//                   style={{
//                     flexDirection: 'row',
//                     alignItems: 'center',
//                     gap: scale(10),
//                   }}>
//                   <CheckBox
//                     style={{zIndex: -1}}
//                     disabled={true}
//                     onValueChange={() => {
//                       // if( days?.includes(i as never)){
//                       //   const tempArr= days.filter((d:string)=>d!=i)
//                       //   setDays(tempArr)
//                       //  }else{
//                       //   const tempArr =[...days,i]
//                       //   setDays(tempArr)
//                       //  }
//                     }}
//                     value={days?.includes(i as never)}
//                   />
//                   <Text>{i}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           )}

//           <View style={styles.sliderContainer}>
//             <Text>Media Volume</Text>
//             <Slider
//               style={{width: Dimensions.get('window').width * 0.95, height: 40}}
//               value={mediaVolume}
//               onValueChange={(val: number) => {
//                 setMediaVolume(Math.trunc(val * 100));
//               }}
//               minimumValue={0}
//               maximumValue={1}
//               minimumTrackTintColor="#000000"
//               maximumTrackTintColor="#000000"
//             />
//           </View>

//           <View style={styles.sliderContainer}>
//             <Text>Ring Volume</Text>
//             <Slider
//               style={{width: Dimensions.get('window').width * 0.95, height: 40}}
//               value={ringVolume}
//               onValueChange={(val: number) => {
//                 setRingVolume(Math.trunc(val * 100));
//               }}
//               minimumValue={0}
//               maximumValue={1}
//               minimumTrackTintColor="#000000"
//               maximumTrackTintColor="#000000"
//             />
//           </View>

//           <View style={styles.sliderContainer}>
//             <Text>Alarm Volume</Text>
//             <Slider
//               style={{width: Dimensions.get('window').width * 0.95, height: 40}}
//               value={alarmVolume}
//               onMagicTap={() => {
//                 console.log('tapped');
//               }}
//               onValueChange={(val: number) => {
//                 setAlarmVolume(Math.trunc(val * 100));
//               }}
//               tapToSeek={false}
//               minimumValue={0}
//               maximumValue={1}
//               minimumTrackTintColor="#000000"
//               maximumTrackTintColor="#000000"
//             />
//           </View>

//           <DatePicker
//             modal={true}
//             open={showTimePicket}
//             mode="time"
//             date={time}
//             onConfirm={date => {
//               settime(date);
//               setShowTimePicket(false);
//               // setDate(date)
//             }}
//             onCancel={() => {
//               setShowTimePicket(false);

//               // setOpen(false)
//             }}
//           />
//           <View style={{flexDirection: 'row', gap: scale(10)}}>
//             <Button title="Save" radius="xl" onPress={createSchedule} />
//             <Button
//               type="outline"
//               title="Cancel"
//               radius="xl"
//               onPress={() => bottomSheetRef?.current?.hide()}
//             />
//           </View>
//         </View>
//       </BottomSheet>

//       <View style={styles.container}>
//         <View style={{marginTop: verticalScale(30)}}>
//           <Text fontSize="extraExtraLarge">Schedule Volume</Text>
//         </View>

//         <View
//           style={{
//             flex: 1,
//             justifyContent: 'center',
//             alignItems: 'center',
//             gap: verticalScale(20),
//           }}>
//           <AntDesign name="plus" size={moderateScale(100)} color="#bfbfbf" />
//           <Text>Click + to add new Schedule</Text>
//         </View>
//       </View>
//       <Pressable
//         onPress={() => bottomSheetRef?.current?.show()}
//         style={{
//           // zIndex:1,
//           position: 'absolute',
//           right: scale(10),
//           bottom: verticalScale(20),
//           backgroundColor: colors.primary,
//           padding: moderateScale(15),
//           borderRadius: 50,
//           // elevation:10
//         }}>
//         <AntDesign name="plus" size={moderateScale(20)} color={'white'} />
//       </Pressable>
//     </View>
//   );
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(10),
  },
  sliderContainer: {
    gap: verticalScale(2),
  },
});
