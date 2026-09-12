import * as React from "react";
import { Platform, View, Text, StyleSheet, TouchableOpacity } from "react-native";
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

// Barra de navegação de baixo, escrita à mão (em vez de usar tabBarOptions,
// que é fixo e não consegue reagir ao modo escuro) — assim ela lê o
// contexto e troca de cor junto com o resto do app.
function CustomTabBar({ navigation }) {
  const { colors: contextColors } = React.useContext(AuthContext);
  const c = contextColors || colors;
  const { routes, index: activeIndex } = navigation.state;

  return (
    <View style={[styles.tabBar, { backgroundColor: c.surface, borderTopColor: c.border }]}>
      {routes.map((route, idx) => {
        const focused = idx === activeIndex;
        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tabItem}
            onPress={() => navigation.navigate(route.routeName)}
          >
            <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.45 }}>
              {TAB_ICONS[route.routeName]}
            </Text>
            <Text style={[styles.tabLabel, { color: focused ? c.primary : c.gray }]}>
              {TAB_LABELS[route.routeName]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

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

const MainTabs = createBottomTabNavigator(
  {
    Home: { screen: HomeStack },
    Workouts: { screen: Workouts },
    Activity: { screen: Activity },
    Profile: { screen: Profile },
  },
  {
    initialRouteName: "Home",
    tabBarComponent: CustomTabBar,
  }
);

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

// Barra de status (relógio + sinal + bateria) — também lê o contexto,
// para os ícones ficarem claros no modo escuro e escuros no modo claro.
function StatusBarRow() {
  const { colors: contextColors } = React.useContext(AuthContext);
  const c = contextColors || colors;
  const [horario, setHorario] = React.useState(horarioAtual());

  React.useEffect(() => {
    const intervalo = setInterval(() => setHorario(horarioAtual()), 15000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <View style={styles.statusBar} pointerEvents="none">
      <Text style={[styles.statusTime, { color: c.textPrimary }]}>{horario}</Text>
      <View style={styles.statusIconsRow}>
        <View style={styles.signalBars}>
          <View style={[styles.signalBar, { height: 4, backgroundColor: c.textPrimary }]} />
          <View style={[styles.signalBar, { height: 6, backgroundColor: c.textPrimary }]} />
          <View style={[styles.signalBar, { height: 8, backgroundColor: c.textPrimary }]} />
          <View style={[styles.signalBar, { height: 10, backgroundColor: c.textPrimary }]} />
        </View>
        <View style={[styles.batteryOuter, { borderColor: c.textPrimary }]}>
          <View style={[styles.batteryFill, { backgroundColor: c.textPrimary }]} />
        </View>
        <View style={[styles.batteryNub, { backgroundColor: c.textPrimary }]} />
      </View>
    </View>
  );
}

export default function App() {
  if (Platform.OS === "web") {
    return (
      <View style={styles.webBackground}>
        <View style={styles.phoneFrame}>
          <View style={[styles.sideButton, styles.muteSwitch]} />
          <View style={[styles.sideButton, styles.volumeUp]} />
          <View style={[styles.sideButton, styles.volumeDown]} />
          <View style={[styles.sideButton, styles.powerButton]} />

          <AuthProvider>
            <StatusBarRow />
            <View style={styles.dynamicIsland} />
            <View style={styles.screen}>
              <AppContainer />
            </View>
          </AuthProvider>
        </View>
      </View>
    );
  }

  return (
    <AuthProvider>
      <AppContainer />
    </AuthProvider>
  );
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
    borderRadius: 1,
    marginLeft: 1.5,
  },
  batteryOuter: {
    width: 20,
    height: 10,
    borderWidth: 1,
    borderRadius: 2.5,
    padding: 1,
    justifyContent: "center",
  },
  batteryFill: {
    width: "75%",
    height: "100%",
    borderRadius: 1,
  },
  batteryNub: {
    width: 1.5,
    height: 4,
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
  tabBar: {
    flexDirection: "row",
    height: 60,
    paddingBottom: 6,
    paddingTop: 6,
    borderTopWidth: 1,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
});
