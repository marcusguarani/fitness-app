import * as React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { colors as staticColors, typography, spacing, radius, cardShadow, headerStyle, headerTitleStyle } from "./theme";
import Toast from "./Toast";
import AuthContext from "./AuthContext";

class Exercise extends React.Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    const prefill = (props.navigation.state.params && props.navigation.state.params.prefill) || {};
    this.state = {
      name: prefill.name || "",
      duration: prefill.duration || "",
      calories: prefill.calories || "",
      date: "",
      toastMessage: "",
      toastVisible: false,
      toastType: "error",
    };
  }
  static navigationOptions = {
    title: "Registrar Exercício",
    headerStyle: headerStyle,
    headerTitleStyle: headerTitleStyle,
    headerTitle: () => null,
  };

  showToast = (message, type = "error") => {
    this.setState({ toastMessage: message, toastVisible: true, toastType: type });
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      this.setState({ toastVisible: false });
    }, 2500);
  };

  handleDateChange = (text) => {
    const digits = text.replace(/\D/g, "").slice(0, 8);
    let formatted = digits;
    if (digits.length > 4) {
      formatted = digits.slice(0, 2) + "/" + digits.slice(2, 4) + "/" + digits.slice(4);
    } else if (digits.length > 2) {
      formatted = digits.slice(0, 2) + "/" + digits.slice(2);
    }
    this.setState({ date: formatted });
  };

  addActivity = () => {
    let name = this.state.name;
    let duration = this.state.duration;
    let calories = this.state.calories;

    let token = this.context.token;
    fetch("http://localhost:5000/activities", {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        "x-access-token": token,
        Connection: "keep-alive",
        "cache-control": "no-cache",
      },

      body: JSON.stringify({
        name: name,
        calories: calories,
        duration: duration,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        if (result.message === "Activity created!") {
          this.showToast("Exercício adicionado com sucesso!", "success");
          setTimeout(() => {
            this.props.navigation.goBack();
          }, 900);
        } else {
          this.showToast(result.message);
        }
      });
  };

  render() {
    const c = this.context.colors || staticColors;

    return (
      <ScrollView style={[styles.container, { backgroundColor: c.background }]} showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: "center", paddingVertical: spacing.xxl }}>
        <View style={[styles.iconCircle, { backgroundColor: c.primarySoft }]}>
          <Text style={{ fontSize: 28 }}>🏋️</Text>
        </View>
        <Text style={[styles.heading, { color: c.textPrimary }]}>Novo Exercício</Text>
        <Text style={[styles.subheading, { color: c.textSecondary }]}>Registre sua atividade de hoje</Text>

        <View style={[styles.card, { backgroundColor: c.surface }]}>
          <Toast
            message={this.state.toastMessage}
            visible={this.state.toastVisible}
            type={this.state.toastType}
          />
          <View style={styles.input_box}>
            <Text style={[styles.input_title, { color: c.textSecondary }]}>Nome do Exercício</Text>
            <TextInput
              placeholder={"Ex.: Corrida"}
              placeholderTextColor={c.textSecondary}
              style={[styles.input_placeholder, { backgroundColor: c.background, color: c.textPrimary }]}
              value={this.state.name + ""}
              onChangeText={(input) => {
                this.setState({ name: input });
              }}
            />
          </View>
          <View style={styles.input_box}>
            <Text style={[styles.input_title, { color: c.textSecondary }]}>Duração (min)</Text>
            <TextInput
              placeholder={"0"}
              placeholderTextColor={c.textSecondary}
              style={[styles.input_placeholder, { backgroundColor: c.background, color: c.textPrimary }]}
              value={this.state.duration + ""}
              onChangeText={(input) => {
                this.setState({ duration: input });
              }}
            />
          </View>
          <View style={styles.input_box}>
            <Text style={[styles.input_title, { color: c.textSecondary }]}>Calorias</Text>
            <TextInput
              style={[styles.input_placeholder, { backgroundColor: c.background, color: c.textPrimary }]}
              value={this.state.calories + ""}
              placeholder={"0"}
              placeholderTextColor={c.textSecondary}
              onChangeText={(input) => {
                this.setState({ calories: input });
              }}
            />
          </View>
          <View style={styles.input_box}>
            <Text style={[styles.input_title, { color: c.textSecondary }]}>Data</Text>
            <TextInput
              placeholder={"dd/mm/aaaa"}
              placeholderTextColor={c.textSecondary}
              style={[styles.input_placeholder, { backgroundColor: c.background, color: c.textPrimary }]}
              value={this.state.date}
              keyboardType="numeric"
              maxLength={10}
              onChangeText={this.handleDateChange}
            />
          </View>

          <TouchableOpacity onPress={() => this.addActivity()} style={[styles.btn_primary, { backgroundColor: c.primary }]}>
            <Text style={styles.btn_text}>Salvar Exercício</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  heading: {
    ...typography.title,
  },
  subheading: {
    ...typography.body,
    marginBottom: spacing.xl,
  },
  card: {
    width: "85%",
    maxWidth: 340,
    borderRadius: radius.lg,
    padding: spacing.xl,
    ...cardShadow,
  },
  input_box: {
    width: "100%",
    marginBottom: spacing.lg,
  },
  input_title: {
    ...typography.label,
    marginBottom: spacing.sm,
  },
  input_placeholder: {
    padding: spacing.md,
    borderRadius: radius.sm,
    fontSize: 15,
  },
  btn_primary: {
    borderRadius: radius.sm,
    height: 48,
    justifyContent: "center",
    marginTop: spacing.xs,
  },
  btn_text: {
    color: "#FFFFFF",
    fontSize: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default Exercise;
