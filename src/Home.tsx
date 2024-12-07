import React from 'react';
import { ScreenWrapper, ThemeProvider } from 'react-native-lite-ui';
import SchedulerScreen from './SchedulerScreen';
import { View } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

const Home = () => {
  const theme = {
    colors: {
      primary: '#6200EE',
      secondary: '#03DAC6',
      backgroundColor: '#FFFFFF',
      // buttonColor: '#6200EE',
      textColor: '#000000',
      disabledColor: '#A9A9A9',
    },
    themesColors: {
      light: {
        primary: '#6200EE',
        backgroundColor: '#FFFFFF',
        textColor: '#424242',
        // buttonColor: '#03DAC6',
        disabledColor: '#A9A9A9',
      },
      dark: {
        primary: '#BB86FC',
        backgroundColor: '#121212',
        textColor: '#FFFFFF',
        // buttonColor: '#03DAC6',
        disabledColor: '#444444',
      },
    },
    fontSizes: {
        medium: moderateScale(14),
        large: moderateScale(16),
        extraLarge: moderateScale(20),
        extraExtraLarge: moderateScale(24),
        small:moderateScale(12),
        extraSmall: moderateScale(10)
      
    },
    fonts: {
    //   regular: 'System-Regular',
    //   medium: 'System-Medium',
    //   bold: 'System-Bold',
    },
  };

  return (
    <View style={{flex:1}} >
    <ThemeProvider initialValues={theme}>
      <ScreenWrapper>

        <SchedulerScreen/>
        </ScreenWrapper>
      {/* Your app code */}
    </ThemeProvider>
        </View>
  );
};

export default Home