import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

type PokemonItemProps = {
  name: string;
  onPress: () => void;
};

export default function PokemonItem({ name, onPress }: PokemonItemProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View>
        <Text style={styles.name}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginVertical: 6,
    backgroundColor: "#e8e8e8",
    borderRadius: 10,
    elevation: 2, // leve sombra no Android
    shadowColor: "#000", // sombra no iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    textTransform: "capitalize",
  },
});
