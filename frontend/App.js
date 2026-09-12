import * as React from "react";
import { Platform, View, Text, StyleSheet } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import Login from "./Login.js";
import Signup from "./Signup.js";
import Today from "./Today.js";
import Workouts from "./Workouts.js";
import Activity from "./Activity.js";
import Profile from "./Profile.js";
import Exercise from "./Exercise.js";
import { colors, darkColors } from "./theme";
import AuthContext from "./AuthContext";

const TAB_LABELS = { Home: "Início", Workouts: "Treinos", Activity: "Atividade", Profile: "Perfil" };
const TAB_ICONS = { Home: "🏠", Workouts: "🏋️", Activity: "📊", Profile: "👤" };

// "Exercise" agora vive DENTRO da pilha da aba Início, em vez de ficar fora
// das abas — assim a barra de navegação de baixo continua visível e a
// pessoa pode sair para qualquer outra aba sem precisar salvar primeiro.
const HomeStack = createStackNavigator(
  {
    HomeScreen: { screen: Today },
    Exercise: { screen: Exercise },
  },
  {
    initialRouteName: "HomeScreen",
    defaultNavigationOptions: { header: null },
  }
);

// Bottom navigation — as 4 abas principais do app depois do login.
const MainTabs = createBottomTabNavigator(
  {
    Home: { screen: HomeStack },
    Workouts: { screen: Workouts },
    Activity: { screen: Activity },
    Profile: { screen: Profile },
  },
  {
    initialRouteName: "Home",
    defaultNavigationOptions: ({ navigation }) => {
      const { routeName } = navigation.state;
      return {
        tabBarLabel: TAB_LABELS[routeName],
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.45 }}>
            {TAB_ICONS[routeName]}
          </Text>
        ),
      };
    },
    tabBarOptions: {
      activeTintColor: colors.primary,
      inactiveTintColor: colors.gray,
      labelStyle: { fontSize: 11, fontWeight: "600" },
      style: {
        borderTopColor: colors.border,
        backgroundColor: colors.surface,
        height: 60,
        paddingBottom: 6,
        paddingTop: 6,
      },
    },
  }
);

// Pilha raiz: Login/Signup ficam fora das abas; "Main" são as abas em si.
const RootStack = createStackNavigator(
  {
    Login: { screen: Login },
    Signup: { screen: Signup },
    Main: { screen: MainTabs },
  },
  {
    initialRouteName: "Login",
    defaultNavigationOptions: { header: null },
  }
);

const AppContainer = createAppContainer(RootStack);

class AuthProvider extends React.Component {
  state = {
    username: null,
    token: null,
    avatarUri: null,
    isDark: false,
  };

  setAuth = (username, token) => {
    this.setState({ username, token });
  };

  clearAuth = () => {
    this.setState({ username: null, token: null });
  };

  setAvatar = (uri) => {
    this.setState({ avatarUri: uri });
  };

  toggleDark = () => {
    this.setState((prev) => ({ isDark: !prev.isDark }));
  };

  render() {
    const activeColors = this.state.isDark ? darkColors : colors;
    return (
      <AuthContext.Provider
        value={{
          username: this.state.username,
          token: this.state.token,
          setAuth: this.setAuth,
          clearAuth: this.clearAuth,
          avatarUri: this.state.avatarUri,
          setAvatar: this.setAvatar,
          isDark: this.state.isDark,
          toggleDark: this.toggleDark,
          colors: activeColors,
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

const FRAME_COLOR = "#1C1C1E";

function horarioAtual() {
  const agora = new Date();
  const h = String(agora.getHours()).padStart(2, "0");
  const m = String(agora.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

// Barras de sinal + bateria desenhadas com Views simples (preto sólido),
// sem depender de nenhuma biblioteca de ícones.
function StatusIcons() {
  return (
    <View style={styles.statusIconsRow}>
      <View style={styles.signalBars}>
        <View style={[styles.signalBar, { height: 4 }]} />
        <View style={[styles.signalBar, { height: 6 }]} />
        <View style={[styles.signalBar, { height: 8 }]} />
        <View style={[styles.signalBar, { height: 10 }]} />
      </View>
      <View style={styles.batteryOuter}>
        <View style={styles.batteryFill} />
      </View>
      <View style={styles.batteryNub} />
    </View>
  );
}

export default function App() {
  const [horario, setHorario] = React.useState(horarioAtual());

  React.useEffect(() => {
    const intervalo = setInterval(() => setHorario(horarioAtual()), 15000);
    return () => clearInterval(intervalo);
  }, []);

  const content = (
    <AuthProvider>
      <AppContainer />
    </AuthProvider>
  );

  if (Platform.OS === "web") {
    return (
      <View style={styles.webBackground}>
        <View style={styles.phoneFrame}>
          <View style={[styles.sideButton, styles.muteSwitch]} />
          <View style={[styles.sideButton, styles.volumeUp]} />
          <View style={[styles.sideButton, styles.volumeDown]} />
          <View style={[styles.sideButton, styles.powerButton]} />

          {/* Barra de status simulada (relógio + wifi + bateria) */}
          <View style={styles.statusBar} pointerEvents="none">
            <Text style={styles.statusTime}>{horario}</Text>
            <StatusIcons />
          </View>

          <View style={styles.dynamicIsland} />
          <View style={styles.screen}>{content}</View>
        </View>
      </View>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  webBackground: {
    flex: 1,
    minHeight: "100vh",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    paddingVertical: 24,
  },
  phoneFrame: {
    width: 390,
    height: 780,
    borderRadius: 60,
    backgroundColor: FRAME_COLOR,
    padding: 7,
    boxShadow: "0 24px 60px rgba(26,29,41,0.2)",
  },
  statusBar: {
    position: "absolute",
    top: 20,
    left: 28,
    right: 28,
    height: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 11,
  },
  statusTime: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
  statusIconsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  signalBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginRight: 6,
  },
  signalBar: {
    width: 2.5,
    backgroundColor: colors.textPrimary,
    borderRadius: 1,
    marginLeft: 1.5,
  },
  batteryOuter: {
    width: 20,
    height: 10,
    borderWidth: 1,
    borderColor: colors.textPrimary,
    borderRadius: 2.5,
    padding: 1,
    justifyContent: "center",
  },
  batteryFill: {
    width: "75%",
    height: "100%",
    backgroundColor: colors.textPrimary,
    borderRadius: 1,
  },
  batteryNub: {
    width: 1.5,
    height: 4,
    backgroundColor: colors.textPrimary,
    marginLeft: 1,
    borderRadius: 1,
  },
  dynamicIsland: {
    position: "absolute",
    top: 20,
    left: "50%",
    marginLeft: -45,
    width: 90,
    height: 24,
    backgroundColor: "#000000",
    borderRadius: 14,
    zIndex: 10,
  },
  screen: {
    flex: 1,
    borderRadius: 53,
    overflow: "hidden",
    backgroundColor: colors.surface,
  },
  sideButton: {
    position: "absolute",
    backgroundColor: FRAME_COLOR,
  },
  muteSwitch: {
    left: -2.5,
    top: 118,
    width: 2.5,
    height: 24,
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  volumeUp: {
    left: -2.5,
    top: 162,
    width: 2.5,
    height: 46,
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  volumeDown: {
    left: -2.5,
    top: 216,
    width: 2.5,
    height: 46,
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  powerButton: {
    right: -2.5,
    top: 170,
    width: 2.5,
    height: 74,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
});
