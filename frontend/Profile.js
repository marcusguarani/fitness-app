import * as React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Switch,
  Platform,
} from "react-native";
import { NavigationActions, StackActions } from "react-navigation";
import { colors as staticColors, typography, spacing, radius, cardShadow } from "./theme";
import Toast from "./Toast";
import AuthContext from "./AuthContext";

class Profile extends React.Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      firstName: "",
      lastName: "",
      calorieGoal: "",
      activityGoal: "",
      toastMessage: "",
      toastVisible: false,
      toastType: "error",
    };
    this.fileInputRef = React.createRef();
  }

  showToast = (message, type = "error") => {
    this.setState({ toastMessage: message, toastVisible: true, toastType: type });
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      this.setState({ toastVisible: false });
    }, 2500);
  };

  async componentDidMount() {
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
    this.setState({
      username: response.username,
      firstName: response.firstName,
      lastName: response.lastName,
      calorieGoal: response.goalDailyCalories,
      activityGoal: response.goalDailyActivity,
    });
  }

  update = () => {
    fetch("http://localhost:5000/users/" + this.state.username, {
      method: "PUT",
      headers: {
        Accept: "*/*",
        Connection: "keep-alive",
        "cache-control": "no-cache",
        "Content-Type": "application/json",
        "x-access-token": this.context.token,
      },
      body: JSON.stringify({
        username: this.state.username,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        goalDailyCalories: this.state.calorieGoal,
        goalDailyActivity: this.state.activityGoal,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        this.showToast("Perfil atualizado com sucesso!", "success");
      });
  };

  logOut = () => {
    this.context.clearAuth();
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "Login" })],
    });
    this.props.navigation.dispatch(resetAction);
  };

  escolherFoto = () => {
    if (Platform.OS === "web" && this.fileInputRef.current) {
      this.fileInputRef.current.click();
    }
  };

  onFotoSelecionada = (event) => {
    const arquivo = event.target.files && event.target.files[0];
    if (arquivo) {
      const url = URL.createObjectURL(arquivo);
      this.context.setAvatar(url);
    }
  };

  render() {
    const c = this.context.colors || staticColors;

    return (
      <ScrollView
        style={[styles.container, { backgroundColor: c.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ alignItems: "center", paddingTop: 58, paddingBottom: spacing.xl }}
      >
        <Toast
          message={this.state.toastMessage}
          visible={this.state.toastVisible}
          type={this.state.toastType}
        />

        <TouchableOpacity onPress={this.escolherFoto} style={styles.avatarWrapper}>
          <View style={[styles.avatarCircle, { backgroundColor: c.primarySoft }]}>
            {this.context.avatarUri ? (
              <Image source={{ uri: this.context.avatarUri }} style={styles.avatarImage} />
            ) : (
              <Text style={{ fontSize: 34 }}>🙂</Text>
            )}
          </View>
          <View style={[styles.cameraBadge, { backgroundColor: c.surface, borderColor: c.border }]}>
            <Text style={{ fontSize: 12 }}>📷</Text>
          </View>
        </TouchableOpacity>

        {Platform.OS === "web" && (
          <input
            ref={this.fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={this.onFotoSelecionada}
          />
        )}

        <Text style={[styles.heading, { color: c.textPrimary }]}>
          {this.state.firstName ? this.state.firstName + " " + this.state.lastName : "Meu Perfil"}
        </Text>
        <Text style={[styles.subheading, { color: c.textSecondary }]}>Atualize suas informações e metas</Text>

        <View style={[styles.card, { backgroundColor: c.surface }]}>
          <View style={styles.input_box}>
            <Text style={[styles.input_title, { color: c.textSecondary }]}>Nome</Text>
            <TextInput
              style={[styles.input_placeholder, { backgroundColor: c.background, color: c.textPrimary }]}
              placeholder={"Seu nome"}
              placeholderTextColor={c.textSecondary}
              value={this.state.firstName}
              onChangeText={(text) => {
                this.setState({ firstName: text });
              }}
            />
          </View>
          <View style={styles.input_box}>
            <Text style={[styles.input_title, { color: c.textSecondary }]}>Sobrenome</Text>
            <TextInput
              style={[styles.input_placeholder, { backgroundColor: c.background, color: c.textPrimary }]}
              placeholder={"Seu sobrenome"}
              placeholderTextColor={c.textSecondary}
              value={this.state.lastName}
              onChangeText={(text) => {
                this.setState({ lastName: text });
              }}
            />
          </View>
          <View style={styles.input_box}>
            <Text style={[styles.input_title, { color: c.textSecondary }]}>Meta de Calorias</Text>
            <TextInput
              style={[styles.input_placeholder, { backgroundColor: c.background, color: c.textPrimary }]}
              placeholder={"Defina sua meta de calorias"}
              placeholderTextColor={c.textSecondary}
              value={this.state.calorieGoal + ""}
              onChangeText={(text) => {
                this.setState({ calorieGoal: text });
              }}
            />
          </View>
          <View style={styles.input_box}>
            <Text style={[styles.input_title, { color: c.textSecondary }]}>Meta de Atividade (min)</Text>
            <TextInput
              style={[styles.input_placeholder, { backgroundColor: c.background, color: c.textPrimary }]}
              placeholder={"Defina sua meta de atividade"}
              placeholderTextColor={c.textSecondary}
              value={this.state.activityGoal + ""}
              onChangeText={(text) => {
                this.setState({ activityGoal: text });
              }}
            />
          </View>

          <TouchableOpacity onPress={() => this.update()} style={[styles.btn_primary, { backgroundColor: c.primary }]}>
            <Text style={styles.btn_text}>Salvar alterações</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.settingsCard, { backgroundColor: c.surface }]}>
          <View style={styles.settingsRow}>
            <Text style={{ fontSize: 16 }}>🌙</Text>
            <Text style={[styles.settingsLabel, { color: c.textPrimary }]}>Modo Escuro</Text>
            <Switch
              value={this.context.isDark}
              onValueChange={this.context.toggleDark}
              trackColor={{ false: c.graySoft, true: c.primary }}
              thumbColor="#FFFFFF"
              style={{ marginLeft: "auto" }}
            />
          </View>
        </View>

        <TouchableOpacity onPress={() => this.logOut()} style={[styles.logout_button, { borderColor: c.danger }]}>
          <Text style={[styles.logout_text, { color: c.danger }]}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatarWrapper: {
    marginBottom: spacing.md,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  cameraBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
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
  settingsCard: {
    width: "85%",
    maxWidth: 340,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
    ...cardShadow,
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingsLabel: {
    ...typography.body,
    fontWeight: "600",
    marginLeft: spacing.sm,
  },
  logout_button: {
    marginTop: spacing.xl,
    borderWidth: 1.5,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  logout_text: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
});

export default Profile;
