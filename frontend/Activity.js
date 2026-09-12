import * as React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { colors as staticColors, typography, spacing, radius, cardShadow } from "./theme";
import AuthContext from "./AuthContext";

const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

class Activity extends React.Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      activities: [],
      goalDailyActivity: 0,
      goalDailyCalories: 0,
      loading: true,
    };
  }

  async componentDidMount() {
    const { username, token } = this.context;

    let userResp = await fetch("http://localhost:5000/users/" + username, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "x-access-token": token,
        Connection: "keep-alive",
        "cache-control": "no-cache",
      },
    });
    userResp = await userResp.json();

    let activitiesResp = await fetch("http://localhost:5000/activities", {
      method: "GET",
      headers: {
        Accept: "*/*",
        "x-access-token": token,
        Connection: "keep-alive",
        "cache-control": "no-cache",
      },
    });
    activitiesResp = await activitiesResp.json();

    this.setState({
      activities: activitiesResp.activities || [],
      goalDailyActivity: userResp.goalDailyActivity || 0,
      goalDailyCalories: userResp.goalDailyCalories || 0,
      loading: false,
    });
  }

  render() {
    const c = this.context.colors || staticColors;
    const { activities, goalDailyActivity, goalDailyCalories } = this.state;

    const totalMinutos = activities.reduce((soma, a) => soma + (a.duration || 0), 0);
    const totalCalorias = activities.reduce((soma, a) => soma + (a.calories || 0), 0);
    const totalExercicios = activities.length;

    const minutosPorDia = [0, 0, 0, 0, 0, 0, 0];
    activities.forEach((a) => {
      if (a.date) {
        const dia = new Date(a.date).getDay();
        minutosPorDia[dia] += a.duration || 0;
      }
    });
    const maiorValor = Math.max(...minutosPorDia, 1);

    const percentAtividade = goalDailyActivity > 0
      ? Math.min(100, Math.round((totalMinutos / goalDailyActivity) * 100))
      : 0;
    const percentCalorias = goalDailyCalories > 0
      ? Math.min(100, Math.round((totalCalorias / goalDailyCalories) * 100))
      : 0;

    return (
      <ScrollView style={[styles.container, { backgroundColor: c.background }]} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: c.textPrimary }]}>Atividade</Text>
          <Text style={[styles.subtitle, { color: c.textSecondary }]}>Seu progresso registrado</Text>
        </View>

        <Text style={[styles.sectionTitle, { color: c.textPrimary }]}>Resumo</Text>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: c.surface }]}>
            <Text style={[styles.statValue, { color: c.textPrimary }]}>{totalExercicios}</Text>
            <Text style={[styles.statLabel, { color: c.textSecondary }]}>exercícios</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: c.surface }]}>
            <Text style={[styles.statValue, { color: c.success }]}>{totalMinutos}</Text>
            <Text style={[styles.statLabel, { color: c.textSecondary }]}>minutos</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: c.surface }]}>
            <Text style={[styles.statValue, { color: c.primary }]}>{totalCalorias}</Text>
            <Text style={[styles.statLabel, { color: c.textSecondary }]}>calorias</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: c.textPrimary }]}>Minutos por dia da semana</Text>
        <View style={[styles.chartBox, { backgroundColor: c.surface }]}>
          <View style={styles.chartBars}>
            {minutosPorDia.map((valor, i) => {
              const altura = Math.max(6, (valor / maiorValor) * 90);
              const hoje = new Date().getDay() === i;
              return (
                <View key={i} style={styles.barColumn}>
                  <View
                    style={[
                      styles.bar,
                      { height: altura, backgroundColor: hoje ? c.primary : c.graySoft },
                    ]}
                  />
                  <Text style={[styles.barLabel, { color: c.textSecondary }, hoje && { color: c.primary, fontWeight: "700" }]}>
                    {DIAS[i]}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: c.textPrimary }]}>Metas</Text>
        <View style={[styles.goalCard, { backgroundColor: c.surface }]}>
          <View style={styles.goalHeaderRow}>
            <Text style={[styles.goalLabel, { color: c.textPrimary }]}>Meta de atividade</Text>
            <Text style={[styles.goalValue, { color: c.textSecondary }]}>{totalMinutos} / {goalDailyActivity} min</Text>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: c.background }]}>
            <View style={[styles.progressFill, { width: `${percentAtividade}%`, backgroundColor: c.primary }]} />
          </View>
        </View>

        <View style={[styles.goalCard, { backgroundColor: c.surface }]}>
          <View style={styles.goalHeaderRow}>
            <Text style={[styles.goalLabel, { color: c.textPrimary }]}>Meta de calorias</Text>
            <Text style={[styles.goalValue, { color: c.textSecondary }]}>{totalCalorias} / {goalDailyCalories} cal</Text>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: c.background }]}>
            <View style={[styles.progressFill, { width: `${percentCalorias}%`, backgroundColor: c.success }]} />
          </View>
        </View>
      </ScrollView>
    );
  }
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
  sectionTitle: {
    ...typography.subtitle,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
  },
  statCard: {
    width: "31%",
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: "center",
    ...cardShadow,
  },
  statValue: {
    ...typography.numberLarge,
    fontSize: 22,
  },
  statLabel: {
    ...typography.label,
    marginTop: 2,
    textTransform: "none",
    fontSize: 11,
  },
  chartBox: {
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...cardShadow,
  },
  chartBars: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 110,
  },
  barColumn: {
    alignItems: "center",
    width: "12%",
  },
  bar: {
    width: 16,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  barLabel: {
    fontSize: 11,
  },
  goalCard: {
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...cardShadow,
  },
  goalHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  goalLabel: {
    ...typography.body,
    fontWeight: "600",
  },
  goalValue: {
    ...typography.body,
    fontSize: 12,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
});

export default Activity;
