import { useState } from "react";
import { create } from "zustand";
import toast from "react-hot-toast";

interface PopState {
  isOpen: boolean;
  popToggle: () => void;
  popOpen: () => void;
  popCls: () => void;
}

const usePop = create<PopState>()((set) => ({
  isOpen: false,
  popToggle: () => set((state) => ({ isOpen: !state.isOpen })),
  popOpen: () => set((state) => ({ isOpen: true })),
  popCls: () =>
    set((state) => {
      return { isOpen: false };
    }),
}));

export default usePop;
