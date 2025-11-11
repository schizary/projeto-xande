import React from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Main from "./pages/Main";
import Maps from "./pages/Maps";
import Graficos from "./pages/Graficos";
import CameraPage from "./pages/Camera";

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen 
          name="Main" 
          component={Main}
          options={{ title: "Cadastro de Usuários" }}
        />
        <Stack.Screen 
          name="Maps" 
          component={Maps}
          options={{ title: "Mapa de Usuários" }}
        />
        <Stack.Screen name="Graficos" component={Graficos} />
        <Stack.Screen name="Camera" component={CameraPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
