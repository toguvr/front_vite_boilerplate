import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { key } from '../config/key';
import { User } from '../dtos';
import api from '../services/api';
import mixpanel from 'mixpanel-browser';

interface AuthState {
  access_token: string;
  refresh_token: string;
  user: User;
}

interface SignInCredentials {
  email: string;
  password: string;
  page?: string;
}

interface SignInCredentialsSocial {
  email: string;
  password: string;
  name: string;
  celphone?: string;
  photoUrl?: string;
  gender?: string;
}

interface AuthContextData {
  user: User;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const [data, setData] = useState<AuthState>(() => {
    const refresh_token = localStorage.getItem(key.refreshToken);
    const access_token = localStorage.getItem(key.token);
    const user = localStorage.getItem(key.user);

    if (access_token && user && refresh_token) {
      api.defaults.headers.authorization = `Bearer ${access_token}`;

      return { access_token, user: JSON.parse(user), refresh_token };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(
    async ({ email, password, page }: SignInCredentials) => {
      const response = await api.post('authentications', {
        email,
        password,
      });

      const { access_token, user, refresh_token } = response.data;

      localStorage.setItem(key.refreshToken, refresh_token);
      localStorage.setItem(key.token, access_token);
      localStorage.setItem(key.user, JSON.stringify(user));

      mixpanel.identify(user.id); // ID do usuário
      mixpanel.people.set({
        $email: user.email,
        $name: user.name,
        Plan: 'Free',
      });

      api.defaults.headers.authorization = `Bearer ${access_token}`;

      setData({ access_token, user, refresh_token });
      navigate(page || '/criar-dieta');
    },
    []
  );

  const signOut = useCallback(() => {
    localStorage.removeItem(key.refreshToken);
    localStorage.removeItem(key.token);
    localStorage.removeItem(key.user);

    setData({} as AuthState);
  }, []);

  useEffect(() => {
    api.registerInterceptTokenManager(signOut);
  }, [signOut]);

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, isAuthenticated: !!data.user }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  return context;
}
