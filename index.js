/**
 * @format
 */

import {AppRegistry,Text,TextInput} from 'react-native';
import App from './App';
import {name as appName} from './app.json';


// Disable font scaling for Text and TextInput components globally
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;


AppRegistry.registerComponent(appName, () => App);
