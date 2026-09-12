import * as React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import base64 from "base-64";
import { colors, typography, spacing, radius, cardShadow } from "./theme";
import Toast from "./Toast";
import AuthContext from "./AuthContext";

class Login extends React.Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      loading: false,
      toastMessage: "",
      toastVisible: false,
      toastType: "error",
    };
  }

  // Tela inicial: não faz sentido ter uma barra de título/voltar aqui.
  static navigationOptions = {
    header: null,
  };

  showToast = (message, type = "error") => {
    this.setState({ toastMessage: message, toastVisible: true, toastType: type });
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      this.setState({ toastVisible: false });
    }, 2500);
  };

  logIn = () => {
    this.setState({ loading: true });
    fetch("http://localhost:5000/login", {
      method: "GET",
      headers: {
        "cache-control": "no-cache",
        Connection: "keep-alive",
        "Accept-Encoding": "gzip, deflate",
        "Cache-Control": "no-cache",
        Accept: "*/*",
        Authorization: `Basic ${base64.encode(
          `${this.state.username}:${this.state.password}`
        )}`,
      },
    })
      .then((response) => {
        this.setState({ loading: false });
        return response.json();
      })
      .then((response) => {
        if (response.token) {
          this.context.setAuth(this.state.username, response.token);
          this.props.navigation.navigate("Main");
        } else this.showToast("Usuário ou senha incorretos!");
      });
  };

  signUp = () => {
    this.props.navigation.navigate("Signup");
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoCircle}>
          <Text style={styles.icon}>🏃</Text>
        </View>
        <Text style={styles.heading}>Bem-vindo de volta</Text>
        <Text style={styles.subheading}>Entre para continuar seu progresso</Text>

        <View style={styles.card}>
          <Toast
            message={this.state.toastMessage}
            visible={this.state.toastVisible}
            type={this.state.toastType}
          />
          <View style={styles.input_box}>
            <Text style={styles.input_title}>Usuário</Text>
            <TextInput
              style={styles.input_placeholder}
              autoCapitalize="none"
              placeholder="Digite seu usuário"
              placeholderTextColor={colors.textSecondary}
              value={this.state.username}
              onChangeText={(input) => {
                this.setState({ username: input });
              }}
            />
          </View>
          <View style={styles.input_box}>
            <Text style={styles.input_title}>Senha</Text>
            <TextInput
              secureTextEntry={true}
              autoCorrect={false}
              style={styles.input_placeholder}
              autoCapitalize="none"
              placeholder="Digite sua senha"
              placeholderTextColor={colors.textSecondary}
              value={this.state.password}
              onChangeText={(input) => {
                this.setState({ password: input });
              }}
            />
          </View>

          <TouchableOpacity onPress={() => this.logIn()} style={styles.btn_primary}>
            <Text style={styles.btn_text}>Entrar</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => this.signUp()} style={styles.link}>
          <Text style={styles.link_text}>Não tem conta? Criar conta</Text>
        </TouchableOpacity>

        <ActivityIndicator
          animating={this.state.loading}
          style={styles.loading}
          size="large"
          color={colors.primary}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    paddingVertical: spacing.xxl,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primarySoft,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  icon: {
    fontSize: 44,
  },
  heading: {
    ...typography.title,
    marginBottom: spacing.xs,
  },
  subheading: {
    ...typography.body,
    marginBottom: spacing.xl,
  },
  card: {
    width: "85%",
    maxWidth: 340,
    backgroundColor: colors.surface,
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
    color: colors.textPrimary,
    backgroundColor: colors.background,
    fontSize: 15,
  },
  btn_primary: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    height: 48,
    justifyContent: "center",
    marginTop: spacing.xs,
  },
  btn_text: {
    color: colors.textOnPrimary,
    fontSize: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
  link: {
    marginTop: spacing.lg,
  },
  link_text: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  loading: {
    marginTop: spacing.lg,
  },
});

export default Login;
