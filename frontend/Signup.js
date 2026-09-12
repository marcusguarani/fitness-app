import * as React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { colors, typography, spacing, radius, cardShadow, headerStyle, headerTitleStyle } from "./theme";
import Toast from "./Toast";

class Signup extends React.Component {
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
  static navigationOptions = {
    title: "Criar Conta",
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

  inputUsername = (text) => {
    this.setState({ username: text });
  };

  inputPassword = (text) => {
    this.setState({ password: text });
  };

  submit = () => {
    if (this.state.username === null || this.state.username === "") {
      this.showToast("Digite um nome de usuário");
      return;
    }

    if (this.state.username.length < 5) {
      this.showToast("Usuário muito curto. Deve ter pelo menos 5 caracteres");
      return;
    }

    if (this.state.password === null || this.state.password === "") {
      this.showToast("Digite uma senha");
      return;
    }

    if (this.state.password.length < 5) {
      this.showToast("Senha muito curta. Deve ter pelo menos 5 caracteres");
      return;
    }

    this.setState({ loading: true });

    fetch("http://localhost:5000/users", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    })
      .then((response) => {
        this.setState({ loading: true });
        return response.json();
      })
      .then((response) => {
        this.setState({ loading: false });
        if (response.message === "User created!") {
          this.showToast("Conta criada com sucesso!", "success");
          setTimeout(() => {
            this.props.navigation.navigate("Login");
          }, 900);
        } else {
          this.showToast(response.message);
        }
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Criar conta</Text>
        <Text style={styles.subheading}>Comece a acompanhar suas metas</Text>

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
              placeholder="Escolha um usuário"
              placeholderTextColor={colors.textSecondary}
              onChangeText={this.inputUsername}
            />
          </View>
          <View style={styles.input_box}>
            <Text style={styles.input_title}>Senha</Text>
            <TextInput
              style={styles.input_placeholder}
              autoCapitalize="none"
              secureTextEntry={true}
              autoCorrect={false}
              placeholder="Crie uma senha"
              placeholderTextColor={colors.textSecondary}
              onChangeText={this.inputPassword}
            />
          </View>

          <TouchableOpacity onPress={() => this.submit()} style={styles.btn_primary}>
            <Text style={styles.btn_text}>Cadastrar</Text>
          </TouchableOpacity>
        </View>

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
  loading: {
    marginTop: spacing.lg,
  },
});

export default Signup;
