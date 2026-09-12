import * as React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { NavigationActions } from "react-navigation";
import { colors as staticColors, typography, spacing, radius, cardShadow } from "./theme";
import AuthContext from "./AuthContext";

const CATEGORIAS = ["Todos", "Força", "Cardio", "Yoga"];

const TREINOS = [
  { id: 1, name: "Treino de Força Total", duration: 45, calories: 350, level: "Intermediário", category: "Força", icon: "🏋️" },
  { id: 2, name: "Cardio Matinal", duration: 30, calories: 280, level: "Iniciante", category: "Cardio", icon: "🏃" },
  { id: 3, name: "Yoga Flow", duration: 25, calories: 120, level: "Iniciante", category: "Yoga", icon: "🧘" },
  { id: 4, name: "HIIT Intenso", duration: 20, calories: 300, level: "Avançado", category: "Cardio", icon: "🔥" },
  { id: 5, name: "Força · Pernas", duration: 40, calories: 320, level: "Intermediário", category: "Força", icon: "🦵" },
];

function nivelCorPara(level, c) {
  if (level === "Iniciante") return { texto: c.success, fundo: c.successSoft };
  if (level === "Avançado") return { texto: c.danger, fundo: c.dangerSoft };
  return { texto: c.primary, fundo: c.primarySoft };
}

export default function Workouts({ navigation }) {
  const { colors: contextColors } = React.useContext(AuthContext);
  const c = contextColors || staticColors;
  const [categoriaAtiva, setCategoriaAtiva] = React.useState("Todos");

  const treinosFiltrados =
    categoriaAtiva === "Todos"
      ? TREINOS
      : TREINOS.filter((t) => t.category === categoriaAtiva);

  const iniciarTreino = (treino) => {
    navigation.navigate(
      "Home",
      {},
      NavigationActions.navigate({
        routeName: "Exercise",
        params: {
          prefill: {
            name: treino.name,
            duration: String(treino.duration),
            calories: String(treino.calories),
          },
        },
      })
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: c.background }]} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xl }}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: c.textPrimary }]}>Treinos</Text>
        <Text style={[styles.subtitle, { color: c.textSecondary }]}>Escolha o treino perfeito para você</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
        {CATEGORIAS.map((cat) => {
          const ativo = cat === categoriaAtiva;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => setCategoriaAtiva(cat)}
              style={[
                styles.chip,
                { borderColor: c.border, backgroundColor: c.surface },
                ativo && { backgroundColor: c.primary, borderColor: c.primary },
              ]}
            >
              <Text style={[styles.chipText, { color: c.textSecondary }, ativo && { color: c.textOnPrimary }]}>{cat}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {treinosFiltrados.map((treino) => {
        const nivelCor = nivelCorPara(treino.level, c);
        return (
          <View key={treino.id} style={[styles.card, { backgroundColor: c.surface }]}>
            <View style={styles.cardTop}>
              <View style={[styles.iconCircle, { backgroundColor: c.background }]}>
                <Text style={{ fontSize: 22 }}>{treino.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.workoutName, { color: c.textPrimary }]}>{treino.name}</Text>
                <View style={[styles.levelBadge, { backgroundColor: nivelCor.fundo }]}>
                  <Text style={[styles.levelText, { color: nivelCor.texto }]}>{treino.level}</Text>
                </View>
              </View>
            </View>

            <View style={styles.metaRow}>
              <Text style={[styles.metaText, { color: c.textSecondary }]}>⏱ {treino.duration} min</Text>
              <Text style={[styles.metaText, { color: c.textSecondary }]}>🔥 {treino.calories} cal</Text>
            </View>

            <TouchableOpacity style={[styles.startButton, { backgroundColor: c.primary }]} onPress={() => iniciarTreino(treino)}>
              <Text style={styles.startButtonText}>Iniciar Treino</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  header: {
    marginTop: 46,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.title,
  },
  subtitle: {
    ...typography.body,
    marginTop: 2,
  },
  chipsRow: {
    marginBottom: spacing.lg,
  },
  chip: {
    borderWidth: 1.5,
    borderRadius: 999,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginRight: spacing.sm,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
  },
  card: {
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...cardShadow,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  workoutName: {
    ...typography.subtitle,
    fontSize: 15,
    marginBottom: spacing.xs,
  },
  levelBadge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
  },
  levelText: {
    fontSize: 11,
    fontWeight: "700",
  },
  metaRow: {
    flexDirection: "row",
    marginBottom: spacing.md,
  },
  metaText: {
    ...typography.body,
    fontSize: 13,
    marginRight: spacing.lg,
  },
  startButton: {
    borderRadius: radius.sm,
    height: 42,
    justifyContent: "center",
  },
  startButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
  },
});
