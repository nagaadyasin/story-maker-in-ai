import { createContext, useContext, useState, useEffect } from "react";
import { dripStore } from "../../store/dripStore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(dripStore.getState().currentUser);

  useEffect(() => {
    // Subscribe to store changes to keep user in sync
    const handleStoreChange = () => {
      setUser(dripStore.getState().currentUser);
    };

    dripStore.addEventListener("change", handleStoreChange);
    return () => {
      dripStore.removeEventListener("change", handleStoreChange);
    };
  }, []);

  const login = (username, password) => {
    return dripStore.login(username, password);
  };

  const logout = () => {
    dripStore.logout();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
