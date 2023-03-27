import {NativeStackNavigationProp} from "@react-navigation/native-stack/lib/typescript/src/types";
import {RouteProp} from "@react-navigation/native";

export type NavigationType = NativeStackNavigationProp<any>;
export type RouteNavigation = {
  route: RouteProp<any>;
  navigation: NavigationType;
};
