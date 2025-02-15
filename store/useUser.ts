import { create } from 'zustand'
import { userData } from '@/services/getUserData'


interface UserState {
  user: userData | null;
  setUser: (user: userData) => void;
  updateUser: (userData: Partial<userData>) => void;
}

export const useUser = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateUser: (userData) => 
    set((state) => ({
      user: state.user ? { ...state.user, ...userData } : null
    }))
}))