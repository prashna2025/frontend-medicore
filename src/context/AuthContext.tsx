import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, Role } from '../types/user';
import { 
  getStoredToken, 
  setStoredToken, 
  removeStoredToken, 
  getStoredUser, 
  setStoredUser, 
  removeStoredUser 
} from '../utils/token';
import toast from 'react-hot-toast';

export interface JwtPayload {
  sub?: string;
  id?: string;
  email?: string;
  role?: Role;
  staffId?: string;
  exp?: number;
}

export function parseJwt(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: any) => void;
  logout: () => void;
  updateUser: (userData: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getStoredUser());
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = getStoredToken();
      const storedUser = getStoredUser();

      if (storedToken) {
        const decoded = parseJwt(storedToken);
        if (decoded && decoded.exp && Date.now() >= decoded.exp * 1000) {
          removeStoredToken();
          removeStoredUser();
          setToken(null);
          setUser(null);
          toast.error('Session expired. Please log in again.');
        } else if (decoded) {
          const mergedUser: User = {
            id: storedUser?.id || decoded.id || '',
            username: storedUser?.username || decoded.sub || '',
            email: storedUser?.email || decoded.email || '',
            name: storedUser?.name || '',
            role: decoded.role || storedUser?.role || 'PATIENT',
            phoneNumber: storedUser?.phoneNumber,
            gender: storedUser?.gender,
            staffId: decoded.staffId || storedUser?.staffId,
          };
          setUser(mergedUser);
          setStoredUser(mergedUser);
        } else if (storedUser) {
          setUser(storedUser);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (authToken: string, rawUserData: any) => {
    const decoded = parseJwt(authToken);
    const fullUser: User = {
      id: rawUserData?.userId || rawUserData?.id || decoded?.id || '',
      username: rawUserData?.username || decoded?.sub || '',
      email: rawUserData?.email || decoded?.email || '',
      name: rawUserData?.name || '',
      role: (decoded?.role || rawUserData?.role || 'PATIENT') as Role,
      phoneNumber: rawUserData?.phoneNumber,
      gender: rawUserData?.gender,
      staffId: decoded?.staffId || rawUserData?.staffId,
    };

    setToken(authToken);
    setUser(fullUser);
    setStoredToken(authToken);
    setStoredUser(fullUser);
    toast.success('Successfully logged in!');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    removeStoredToken();
    removeStoredUser();
    toast.success('Logged out');
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    setStoredUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

