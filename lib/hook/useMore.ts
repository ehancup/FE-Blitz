import { create } from "zustand";
import { Product } from "../product/interface";


interface MoreState {
    products: Product[];
    setData: (data: Product[]) => void;
    addMore: (data: Product[]) => void;
}

const useMore = create<MoreState>() (set => ({
    products: [],
    setData: (data: Product[]) => set((state) => ({products: data})),
    addMore: (data: Product[]) => set((state) => ({products: [...state.products, ...data]}))
}))

export default useMore