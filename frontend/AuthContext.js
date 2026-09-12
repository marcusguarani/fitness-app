import * as React from "react";

// Contexto compartilhado: autenticação, foto de perfil e modo escuro.
// Fica tudo num contexto só porque componentes de classe só aceitam
// um único `static contextType` por vez.
const AuthContext = React.createContext({
  username: null,
  token: null,
  setAuth: () => {},
  clearAuth: () => {},
  avatarUri: null,
  setAvatar: () => {},
  isDark: false,
  toggleDark: () => {},
  colors: null,
});

export default AuthContext;
