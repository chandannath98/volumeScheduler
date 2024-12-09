import {
  Dimensions,
  FlatList,
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

import {NativeModules} from 'react-native';
import ScheduleItems from './Components/ScheduleItems';
const {VolumeControl} = NativeModules;
const {VolumeScheduler} = NativeModules;

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


  const [selectedId, setSelectedId] = useState(null)

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
        setScheduleList(JSON.parse(i || []));
      });
    } catch {}
  };

  function generateRandomId() {
    return Math.floor(100 + Math.random() * 900);
  }

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
    getSavedList();
  }, []);

console.log(scheduleList)
  
  const createSchedule = async (item?:any) => {
    
    console.log(item,"-------------------")
    const id = item?.id || generateRandomId();
    const volumeObj = {
      media:item?.volume?.media || mediaVolume,
      ring: item?.volume?.ring || ringVolume,
      alarm: item?.volume?.alarm || alarmVolume,
      notification: item?.volume?.notification || ringVolume,
    };

    const selectedDays = item?.days || (repeat && days?.length > 0) ? days : null;
    VolumeScheduler.scheduleAdjustment(
      id, // Unique ID
      timeDetails?.hour24, // Hour
      timeDetails?.minute, // Minute
      volumeObj, // Volume levels
      true, // Enable vibration
      selectedDays, // Days of the week
    )
      .then(async () => {
        const scheduledItem = {
          id: id,
          hour: timeDetails?.hour24,
          minute: timeDetails?.minute,
          days: selectedDays,
          vibration: true,
          volume: volumeObj,
          enable:true
        };
        if(item){
          const tempList=scheduleList?.map((k:any)=>{

            if(k?.id==item?.id){
              return{
                ...k,
                enable:true
              }
            }else{
              return k
            }
          })
          AsyncStorage.setItem(
            'scheduleList',
            JSON?.stringify([...tempList]),
          );
          setScheduleList([...tempList]) 
        }else{
          AsyncStorage.setItem(
            'scheduleList',
            JSON?.stringify([...scheduleList, scheduledItem]),
          );
          setScheduleList([...scheduleList, scheduledItem])
        }
        
      })
      .catch(console.error);

    bottomSheetRef?.current?.hide();
  };

  const cancelSchedule = async (id:number)=>{

    VolumeScheduler.cancelSchedule(id)?.then(async(i:any)=>{

      const tempList =scheduleList?.map((j:any)=>{
        if(j?.id==id){
          return {
            ...j,
            enable:false
          }
        }

        return j
      })
      
    await  AsyncStorage.setItem(
        'scheduleList',
        JSON?.stringify([...tempList]),
      ); 
      setScheduleList([...tempList]);

    
    
    })




  }


  const deleteSchedule = async(id:number)=>{
    VolumeScheduler.cancelSchedule(id)?.then(async(i:any)=>{

      const tempList =scheduleList?.filter((j:any)=>(j?.id==id))
      
    await  AsyncStorage.setItem(
        'scheduleList',
        JSON?.stringify([...tempList]),
      ); 
      setScheduleList([...tempList]);

    bottomSheetRef?.current?.hide()
    
    })
  }


  const onItemPress =(item:any)=>{
    setSelectedId(item?.id);
    setAlarmVolume(item?.volume?.alarm)
    setRingVolume(item?.volume?.ring)
    setMediaVolume(item?.volume?.media)
    setRepeat(!!item?.days)
    setDays(item?.days)

    settime(new Date(new Date((new Date())?.setHours(item?.hour))?.setMinutes(item?.minute)))
    bottomSheetRef?.current?.show()
  }


  return (
    <View style={styles.container}>
      <BottomSheet

      onDismiss={()=>{
        setDays([])
        setSelectedId(null)
      }}
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
            
              style={{width: Dimensions.get('window').width * 0.95,marginTop:verticalScale(10)}}
              value={mediaVolume}
              onValueChange={(val: number) => {
                console.log("-----------",val)
                setMediaVolume(Math.trunc(val ));
              }}
              
              step={1}
              minimumValue={0}
              maximumValue={100}
              minimumTrackTintColor="#000000"
              maximumTrackTintColor="#000000"
            />
          </View>

          <View style={styles.sliderContainer}>
            <Text>Ring Volume</Text>
            <Slider
              style={{width: Dimensions.get('window').width * 0.95,marginTop:verticalScale(10)}}
              value={ringVolume}
              onValueChange={(val: number) => {
                console.log("-----------",val)
                setRingVolume(Math.trunc(val ));
              }}
              
              step={1}
              minimumValue={0}
              maximumValue={100}
              minimumTrackTintColor="#000000"
              maximumTrackTintColor="#000000"
            />
          </View>

          <View style={styles.sliderContainer}>
            <Text>Alarm Volume</Text>
            <Slider
              style={{width: Dimensions.get('window').width * 0.95,marginTop:verticalScale(10)}}
              value={alarmVolume}
              onMagicTap={() => {
                console.log('tapped');
              }}
              onValueChange={(val: number) => {
                console.log("-----------",val)
                setAlarmVolume(Math.trunc(val ));
              }}
              
              step={1}
              minimumValue={0}
              maximumValue={100}
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
            <Button title="Save" radius="xl" onPress={()=>createSchedule()} />
            <Button
              type="outline"
              title="Cancel"
              radius="xl"
              onPress={() => bottomSheetRef?.current?.hide()}
            />
            <Button
              title="Delete"
              color='red'
              radius="xl"
              onPress={() =>{
                deleteSchedule(selectedId)
              }}
            />
          </View>
        </View>
      </BottomSheet>
      <View style={{marginTop: verticalScale(30)}}>
          <Text fontSize="extraExtraLarge">Schedule Volume</Text>
        </View>

{scheduleList?.length<1 ?

      <View style={styles.container}>
       

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
      :
      <View style={[styles?.container,{paddingHorizontal:0}]}>

<FlatList
contentContainerStyle={{
  marginTop:verticalScale(10),
  paddingBottom:verticalScale(100),
  gap:verticalScale(10)
}}
  data={scheduleList}
  renderItem={({ item, index }: { item: any; index: number }) => (
    <ScheduleItems createSchedule={createSchedule} onItemPress={onItemPress} cancelSchedule={cancelSchedule} item={item} index={index} />
  )}
/>
      </View>
}


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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(10),
  },
  sliderContainer: {
    gap: verticalScale(2),
  },
});
