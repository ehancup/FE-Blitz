import { useState } from "react";
import { create } from "zustand";
import toast from "react-hot-toast";



interface orderState {
  payload: string[];
  addPayload: (pyld :string) => void;
  addForce: (pyld :string[]) => void;
  addMany: (pyld :string[]) => void;
//   popOpen: () => void;
//   popCls: () => void;
}

const useOrderPayload = create<orderState>()((set) => ({
  payload: [],
  addPayload: (pyld: string) => set((state) => ({ payload: [...state.payload, pyld]})),
  addMany: (pyld: string[]) => set((state) => ({ payload: [...state.payload, ...pyld]})),
  addForce: (pyld: string[]) => set((state) => ({payload: pyld})),
 
}));

export default useOrderPayload;