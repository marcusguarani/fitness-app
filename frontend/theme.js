// ============================================================
// DESIGN SYSTEM — fonte única de verdade para cores, tipografia,
// espaçamento e sombras do app. Toda tela deve importar daqui
// em vez de usar valores soltos, para manter consistência.
// ============================================================

export const colors = {
  // Cor principal — usada em CTAs, links, elementos de destaque
  primary: "#6C5CE7",
  primaryDark: "#5A4BD6",
  primarySoft: "#EFECFC", // fundo suave da cor principal (chips, ícones)

  // Sucesso / progresso / conclusão — nunca usada para ações comuns
  success: "#20C997",
  successSoft: "#E3F9F1",

  // Ação destrutiva — reservada exclusivamente para "Sair" e exclusões
  danger: "#EF4444",
  dangerSoft: "#FDEDED",

  // Ações secundárias (ex: "Atualizar") — neutras, não competem visualmente
  gray: "#8B92A6",
  graySoft: "#EEF0F4",

  // Superfícies
  background: "#F7F7FB", // fundo externo, cinza muito claro
  surface: "#FFFFFF", // cartões e o "celular" em si

  // Texto
  textPrimary: "#1A1D29",
  textSecondary: "#6B7280",
  textOnPrimary: "#FFFFFF",

  border: "#ECEDF2",
};

// Escala tipográfica única — cada tamanho tem um propósito definido
export const darkColors = {
  primary: "#8B7CFF",
  primaryDark: "#6C5CE7",
  primarySoft: "#2A2550",

  success: "#2FE0A0",
  successSoft: "#153B30",

  danger: "#FF6B6B",
  dangerSoft: "#3A1E1E",

  gray: "#9AA0AE",
  graySoft: "#2A2D36",

  background: "#121318",
  surface: "#1C1E26",

  textPrimary: "#F2F2F5",
  textSecondary: "#A0A4AE",
  textOnPrimary: "#FFFFFF",

  border: "#2E313B",
  inputBg: "#242730",
};

export const typography = {
  numberLarge: { fontSize: 30, fontWeight: "bold", color: colors.textPrimary }, // números importantes
  title: { fontSize: 22, fontWeight: "bold", color: colors.textPrimary }, // títulos de tela
  subtitle: { fontSize: 16, fontWeight: "600", color: colors.textPrimary }, // subtítulos
  body: { fontSize: 14, color: colors.textSecondary }, // informações secundárias
  label: { fontSize: 12, fontWeight: "600", color: colors.textSecondary, letterSpacing: 0.4 }, // labels
};

// Escala de espaçamento consistente — usar sempre um desses valores
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
};

export const cardShadow = {
  shadowColor: "#1A1D29",
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.06,
  shadowRadius: 18,
  elevation: 2,
};

// Estilo padrão do cabeçalho de navegação — usado em todas as telas
// (exceto Login, que não tem cabeçalho), garantindo o mesmo respiro
// no topo em todas elas, para não ficar coladas na Dynamic Island.
export const headerStyle = {
  backgroundColor: colors.background,
  elevation: 0,
  shadowOpacity: 0,
  borderBottomWidth: 1,
  borderBottomColor: colors.border,
  height: 84,
  paddingTop: 18,
};

export const headerTitleStyle = {
  color: colors.textPrimary,
  fontSize: 17,
  fontWeight: "700",
};
