import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";
import { Alert } from "react-native";

import { api } from "../services/api";

type UserTypes = {
  id: number;
  email: string;
};

type AuthContextData = {
  signed: boolean;
  user: UserTypes;
  signIn: ({ email, password }) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadingStoreData = async () => {
      const storageUser = await AsyncStorage.getItem("@storage:user");
      const storageToken = await AsyncStorage.getItem("@storage:token");
      const userParse = await JSON.parse(storageUser);

      if (userParse !== null && storageToken !== null) {
        api.defaults.headers.common["Authorization"] = `Bearer ${storageToken}`;
        setUser(userParse);
      }
    };
    loadingStoreData();
  }, []);

  async function signIn({ email, password }) {
    try {
      const response = await api.post("/authenticate", { email, password });
      const { user, token, error } = response.data;

      if (error) {
        console.log(error);
        Alert.alert(
          "Auntenticação",
          "Ops, Algo deu errado tente novamente por favor :-)"
        );
        return;
      }

      setUser(user);

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const userStringiFy = JSON.stringify(user);

      await AsyncStorage.setItem("@storage:token", token);
      await AsyncStorage.setItem("@storage:user", userStringiFy);
    } catch (error) {
      console.log(error);
    }
  }

  async function signOut() {
    try {
      setUser(null);
      AsyncStorage.clear();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <AuthContext.Provider value={{ user, signIn, signOut, signed: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}
