import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cartService } from "@/services/cartService";
import type { CartState } from "@/types/store";

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      loading: false,

      getCart: async () => {
        try {
          set({ loading: true });
          const response = await cartService.getCart();
          set({ cart: response.cart, loading: false });
        } catch (error) {
          console.error("Error fetching cart:", error);
          throw error;
        }
      },

      addToCart: async (productId: string, quantity: number) => {
        try {
          set({ loading: true });
          const response = await cartService.addToCart(productId, quantity);
          set({ cart: response.cart, loading: false });
        } catch (error) {
          console.error("Error adding to cart:", error);
          throw error;
        }
      },

      updateQuantity: async (productId: string, quantity: number) => {
        try {
          set({ loading: true });
          const response = await cartService.updateQuantity(
            productId,
            quantity,
          );
          set({ cart: response.cart, loading: false });
        } catch (error) {
          console.error("Error updating quantity:", error);
          throw error;
        }
      },

      removeFromCart: async (productId: string) => {
        try {
          set({ loading: true });
          const response = await cartService.removeFromCart(productId);
          set({ cart: response.cart, loading: false });
        } catch (error) {
          console.error("Error removing from cart:", error);
          throw error;
        }
      },

      clearCart: () => {
        set({ cart: null });
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ cart: state.cart }),
    },
  ),
);
