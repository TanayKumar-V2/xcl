import { getDefaultConfig } from "expo/metro-config.js";
import { withNativeWind } from 'nativewind/metro';
 
const config = getDefaultConfig(__dirname)
 
export default withNativeWind(config, { input: './global.css' })