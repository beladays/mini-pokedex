import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeTela from "./telas/HomeTela";
import DetalhesTela from "./telas/DetalhesTela";

export type RootStackParamList = {
  Lista: undefined;
  Detalhe: { name: string }; // parâmetro para buscar o Pokémon
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Lista"
        component={HomeTela}
        options={{ title: "Mini Pokédex" }}
      />
      <Stack.Screen
        name="Detalhe"
        component={DetalhesTela}
        options={{ title: "Detalhes do Pokémon" }}
      />
    </Stack.Navigator>
  );
}
