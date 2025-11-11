import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Graficos() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela de Gráficos</Text>
      <Text style={styles.subText}>Gráficos serão exibidos aqui</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});