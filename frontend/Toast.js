import * as React from "react";
import { Text, StyleSheet } from "react-native";
import { colors } from "./theme";

// Aviso simples e discreto: só texto colorido (vermelho = erro,
// verde = sucesso), sem caixa nem fundo, para não competir
// visualmente com a Dynamic Island no topo da moldura.
export default function Toast({ message, visible, type = "error" }) {
  if (!visible || !message) return null;

  return (
    <Text style={[styles.text, { color: type === "success" ? colors.success : colors.danger }]}>
      {message}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
  },
});
