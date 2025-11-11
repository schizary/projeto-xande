import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function CameraPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela da Câmera</Text>
      <Text style={styles.subText}>Funcionalidade de câmera será implementada aqui</Text>
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