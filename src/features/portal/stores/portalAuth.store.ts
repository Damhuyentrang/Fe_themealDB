import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PortalMember {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  referralCode: string;
  commissionRate: number;
  status: 'active' | 'pending';
}

interface PortalAuthState {
  member: PortalMember | null;
  login: (member: PortalMember) => void;
  logout: () => void;
}

export const usePortalAuthStore = create<PortalAuthState>()(
  persist(
    (set) => ({
      member: null,
      login: (member) => set({ member }),
      logout: () => set({ member: null }),
    }),
    { name: 'portal-auth' },
  ),
);
