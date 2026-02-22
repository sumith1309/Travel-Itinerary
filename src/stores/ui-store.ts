import { create } from 'zustand';

interface UIState {
  isSearchOpen: boolean;
  isMobileNavOpen: boolean;
  activeModal: string | null;
  toggleSearch: () => void;
  toggleMobileNav: () => void;
  setModal: (modal: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSearchOpen: false,
  isMobileNavOpen: false,
  activeModal: null,
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  toggleMobileNav: () => set((state) => ({ isMobileNavOpen: !state.isMobileNavOpen })),
  setModal: (modal) => set({ activeModal: modal }),
}));
