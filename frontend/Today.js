import * as React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import { colors as staticColors, typography, spacing, radius, cardShadow } from "./theme";
import AuthContext from "./AuthContext";
import Toast from "./Toast";

function saudacaoPorHorario() {
  const hora = new Date().getHours();
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

class Today extends React.Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      goalDailyActivity: "",
      activities: [],
      confirmDeleteId: null,
      toastMessage: "",
      toastVisible: false,
      toastType: "success",
    };
  }

  async componentDidMount() {
    await this.loadData();
  }

  async loadData() {
    const { username, token } = this.context;
    let response = await fetch("http://localhost:5000/users/" + username, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "x-access-token": token,
        Connection: "keep-alive",
        "cache-control": "no-cache",
      },
    });

    response = await response.json();
    let activities = await fetch("http://localhost:5000/activities", {
      method: "GET",
      headers: {
        Accept: "*/*",
        "x-access-token": token,
        Connection: "keep-alive",
        "cache-control": "no-cache",
      },
    });
    activities = await activities.json();
    this.setState({
      goalDailyActivity: response.goalDailyActivity,
      activities: activities.activities,
    });
  }

  async refresh() {
    await this.loadData();
  }

  showToast = (message, type = "success") => {
    this.setState({ toastMessage: message, toastVisible: true, toastType: type });
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      this.setState({ toastVisible: false });
    }, 2500);
  };

  pedirConfirmacao = (id) => {
    this.setState({ confirmDeleteId: id });
    clearTimeout(this._confirmTimer);
    this._confirmTimer = setTimeout(() => {
      this.setState((prev) => (prev.confirmDeleteId === id ? { confirmDeleteId: null } : null));
    }, 4000);
  };

  cancelarConfirmacao = () => {
    clearTimeout(this._confirmTimer);
    this.setState({ confirmDeleteId: null });
  };

  apagarAtividade = async (id) => {
    const { token } = this.context;
    try {
      const resp = await fetch("http://localhost:5000/activities/" + id, {
        method: "DELETE",
        headers: {
          Accept: "*/*",
          "x-access-token": token,
          Connection: "keep-alive",
          "cache-control": "no-cache",
        },
      });
      const result = await resp.json();
      if (result.message === "Activity deleted!") {
        this.setState({ confirmDeleteId: null });
        this.showToast("Exercício removido!", "success");
        await this.loadData();
      } else {
        this.showToast(result.message || "Não foi possível remover.", "error");
      }
    } catch (e) {
      this.showToast("Erro de conexão ao remover.", "error");
    }
  };

  render() {
    const c = this.context.colors || staticColors;

    let exercise = [];
    let activityTotal = 0.0;
    const activities = this.state.activities;

    activities.forEach((x) => {
      const confirmando = this.state.confirmDeleteId === x.id;
      exercise.push(
        <View key={x.id} style={[styles.activityCard, { backgroundColor: c.background }]}>
          <View style={[styles.activityIconCircle, { backgroundColor: c.surface }]}>
            <Text style={{ fontSize: 18 }}>🏋️</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.activityName, { color: c.textPrimary }]}>{x.name}</Text>
            <Text style={[styles.activityMeta, { color: c.textSecondary }]}>
              {x.duration + " min  ·  " + x.calories + " cal"}
            </Text>
          </View>

          {confirmando ? (
            <View style={styles.confirmRow}>
              <TouchableOpacity onPress={() => this.apagarAtividade(x.id)} style={[styles.confirmYes, { backgroundColor: c.dangerSoft }]}>
                <Text style={[styles.confirmYesText, { color: c.danger }]}>Apagar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.cancelarConfirmacao} style={[styles.confirmNo, { backgroundColor: c.graySoft }]}>
                <Text style={[styles.confirmNoText, { color: c.textSecondary }]}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => this.pedirConfirmacao(x.id)} style={styles.deleteButton}>
              <Text style={styles.deleteIcon}>🗑️</Text>
            </TouchableOpacity>
          )}
        </View>
      );
      activityTotal = activityTotal + x.duration;
    });

    return (
      <ScrollView style={[styles.container, { backgroundColor: c.background }]} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <Toast
          message={this.state.toastMessage}
          visible={this.state.toastVisible}
          type={this.state.toastType}
        />

        <View style={styles.header}>
          <View style={[styles.avatarCircle, { backgroundColor: c.surface }]}>
            {this.context.avatarUri ? (
              <Image source={{ uri: this.context.avatarUri }} style={styles.avatarImage} />
            ) : (
              <Text style={{ fontSize: 22 }}>🙂</Text>
            )}
          </View>
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <Text style={[styles.greeting, { color: c.textPrimary }]}>{saudacaoPorHorario()}! 👋</Text>
            <Text style={[styles.greetingSub, { color: c.textSecondary }]}>Pronto para o treino de hoje?</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: c.surface }]}>
            <View style={[styles.statIconCircle, { backgroundColor: c.primarySoft }]}>
              <Text style={{ fontSize: 15 }}>🎯</Text>
            </View>
            <Text style={[styles.statValue, { color: c.textPrimary }]}>{this.state.goalDailyActivity || 0}</Text>
            <Text style={[styles.statLabel, { color: c.textSecondary }]}>min meta</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: c.surface }]}>
            <View style={[styles.statIconCircle, { backgroundColor: c.successSoft }]}>
              <Text style={{ fontSize: 15 }}>✅</Text>
            </View>
            <Text style={[styles.statValue, { color: c.success }]}>{activityTotal}</Text>
            <Text style={[styles.statLabel, { color: c.textSecondary }]}>min feitos</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: c.surface }]}>
            <View style={[styles.statIconCircle, { backgroundColor: c.graySoft }]}>
              <Text style={{ fontSize: 15 }}>🏋️</Text>
            </View>
            <Text style={[styles.statValue, { color: c.textPrimary }]}>{activities.length}</Text>
            <Text style={[styles.statLabel, { color: c.textSecondary }]}>exercícios</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: c.textPrimary }]}>Sugestão para hoje</Text>
        <TouchableOpacity
          style={[styles.suggestionCard, { backgroundColor: c.primarySoft }]}
          onPress={() => this.props.navigation.navigate("Workouts")}
        >
          <View style={[styles.suggestionIconCircle, { backgroundColor: c.surface }]}>
            <Text style={{ fontSize: 20 }}>🏃</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.suggestionTitle, { color: c.textPrimary }]}>Treino de resistência</Text>
            <Text style={[styles.suggestionMeta, { color: c.textSecondary }]}>25 min · Intermediário</Text>
          </View>
          <Text style={[styles.suggestionArrow, { color: c.primary }]}>→</Text>
        </TouchableOpacity>

        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: c.textPrimary }]}>Atividades de hoje</Text>
          <TouchableOpacity onPress={() => this.refresh()}>
            <Text style={[styles.refreshText, { color: c.gray }]}>↻ Atualizar</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.activitiesBox, { backgroundColor: c.surface }]}>
          {exercise.length > 0 ? (
            exercise
          ) : (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyTitle, { color: c.textPrimary }]}>Ainda não treinou hoje 💪</Text>
              <Text style={[styles.emptyText, { color: c.textSecondary }]}>Seu próximo treino pode começar agora.</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("Exercise")}
          style={[styles.ctaButton, { backgroundColor: c.primary }]}
        >
          <Text style={styles.ctaText}>＋ Registrar exercício</Text>
        </TouchableOpacity>
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
    flexDirection: "row",
    alignItems: "center",
    marginTop: 46,
    marginBottom: spacing.lg,
  },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    ...cardShadow,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  greeting: {
    ...typography.title,
    fontSize: 19,
  },
  greetingSub: {
    ...typography.body,
    marginTop: 2,
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
    ...cardShadow,
  },
  statIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xs,
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
  sectionTitle: {
    ...typography.subtitle,
    marginBottom: spacing.md,
  },
  suggestionCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  suggestionIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  suggestionTitle: {
    ...typography.subtitle,
    fontSize: 15,
  },
  suggestionMeta: {
    ...typography.body,
    fontSize: 12,
    marginTop: 2,
  },
  suggestionArrow: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  refreshText: {
    ...typography.body,
    fontSize: 12,
  },
  activitiesBox: {
    borderRadius: radius.md,
    padding: spacing.md,
    minHeight: 110,
    marginBottom: spacing.xl,
    ...cardShadow,
  },
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.sm,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  activityIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  activityName: {
    ...typography.subtitle,
    fontSize: 15,
  },
  activityMeta: {
    ...typography.body,
    fontSize: 12,
    marginTop: 2,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  deleteIcon: {
    fontSize: 16,
  },
  confirmRow: {
    flexDirection: "row",
  },
  confirmYes: {
    borderRadius: radius.sm,
    paddingVertical: 6,
    paddingHorizontal: spacing.sm,
    marginRight: spacing.xs,
  },
  confirmYesText: {
    fontSize: 11,
    fontWeight: "700",
  },
  confirmNo: {
    borderRadius: radius.sm,
    paddingVertical: 6,
    paddingHorizontal: spacing.sm,
  },
  confirmNoText: {
    fontSize: 11,
    fontWeight: "700",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl,
  },
  emptyTitle: {
    ...typography.subtitle,
    marginBottom: spacing.xs,
  },
  emptyText: {
    ...typography.body,
  },
  ctaButton: {
    borderRadius: radius.md,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    ...cardShadow,
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Today;
