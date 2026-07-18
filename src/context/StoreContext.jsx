// src/context/StoreContext.jsx
import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { INITIAL_PRODUCTS, INITIAL_BRANDS, ADMIN_PASSWORD } from "../data/products.js";
import { LOCALES } from "../utils/translations.js";
import { formatPrice } from "../utils/currency.js";
import { supabase, isSupabaseConfigured } from "../config/supabaseClient.js";
import { mapSupabaseUser } from "../utils/auth.js";

const StoreContext = createContext(null);

function nextId(products) {
  const max = products.reduce((m, p) => Math.max(m, parseInt(p.id, 10) || 0), 0);
  return String(max + 1).padStart(3, "0");
}

export function StoreProvider({ children }) {
  // ---------- Preferencias ----------
  const [theme, setTheme] = useState("light");
  const [lang, setLang] = useState("es");

  // ---------- Catálogo (desde Supabase o estado local) ----------
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [brands, setBrands] = useState(INITIAL_BRANDS);
  const [loading, setLoading] = useState(true);

  // ---------- Sesión / admin ----------
  const [gateOpen, setGateOpen] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [authReason, setAuthReason] = useState(null);
  const [user, setUser] = useState(null);
  const [authInitializing, setAuthInitializing] = useState(isSupabaseConfigured);
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  // ---------- Navegación ----------
  const [view, setView] = useState("catalog");
  const [selectedProductId, setSelectedProductId] = useState(null);

  // ---------- Carrito / favoritos / compras / reseñas ----------
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [purchased, setPurchased] = useState(new Set());
  const [reviewsExtra, setReviewsExtra] = useState({});
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const t = (key) => LOCALES[lang].strings[key] || key;
  const fmt = (usdAmount) => formatPrice(usdAmount, LOCALES[lang].currency);

  // ---------- Sesión de Supabase (Google OAuth) ----------
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(mapSupabaseUser(session.user));
        setGateOpen(false);
      }
      setAuthInitializing(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(mapSupabaseUser(session.user));
        setGateOpen(false);
        setAuthOpen(false);
      } else if (_event === "SIGNED_OUT") {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ---------- Cargar datos de Supabase al iniciar ----------
  useEffect(() => {
    loadProductsAndBrands();
  }, []);

  async function loadProductsAndBrands() {
    try {
      setLoading(true);
      
      // Intentar cargar de Supabase
      if (isSupabaseConfigured) {
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*");

        const { data: brandsData, error: brandsError } = await supabase
          .from("brands")
          .select("name");

        if (!productsError && productsData?.length) {
          setProducts(productsData);
        }

        if (!brandsError && brandsData?.length) {
          setBrands(brandsData.map(b => b.name));
        }
      }
    } catch (error) {
      console.warn("Error cargando datos de Supabase:", error);
      // Mantiene los datos iniciales en caso de error
    } finally {
      setLoading(false);
    }
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  }

  function navigate(nextView, productId = null) {
    setSelectedProductId(productId);
    setView(nextView);
    window.scrollTo?.({ top: 0 });
  }

  const selectedProduct = products.find((p) => p.id === selectedProductId) || null;
  const cartTotal = cart.reduce((s, i) => s + i.price, 0);
  const favProducts = products.filter((p) => favorites.has(p.id));

  function addToCart(product, selectedVariants = {}) {
    const cartKey = `${product.id}-${Object.values(selectedVariants).join("-")}`;
    if (cart.find((i) => i.cartKey === cartKey)) {
      showToast(`${product.name} ya está en tu selección`);
    } else {
      setCart((prev) => [...prev, { ...product, cartKey, selectedVariants }]);
      showToast(`✔ ${product.name} ${t("addedToCart")}`);
    }
  }

  function removeFromCart(cartKey) {
    setCart((prev) => prev.filter((i) => i.cartKey !== cartKey));
  }

  function toggleFavorite(id) {
    if (!user) {
      setAuthReason("favorite");
      setAuthOpen(true);
      return;
    }
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function addReview(productId, review) {
    setReviewsExtra((prev) => ({ ...prev, [productId]: [...(prev[productId] || []), review] }));
  }

  function confirmOrder() {
    setPurchased((prev) => {
      const next = new Set(prev);
      cart.forEach((i) => next.add(i.id));
      return next;
    });
    setCart([]);
    navigate("confirmed");
  }

  function handleLogin(u) {
    setUser(u);
    setAuthOpen(false);
    setGateOpen(false);
    showToast(`Bienvenido/a, ${u.name.split(" ")[0]}`);
  }

  async function logout() {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    showToast("Sesión cerrada");
  }

  // ---------- Admin: productos y marcas (con Supabase) ----------
  async function saveProduct(product) {
    try {
      if (!isSupabaseConfigured) {
        // Modo local si Supabase no está configurado
        setProducts((prev) => {
          const exists = prev.find((x) => x.id === product.id);
          return exists ? prev.map((x) => (x.id === product.id ? product : x)) : [...prev, product];
        });
        showToast("Producto guardado (modo local)");
        return;
      }

      const exists = products.find((x) => x.id === product.id);

      if (exists) {
        // Actualizar
        const { error } = await supabase
          .from("products")
          .update(product)
          .eq("id", product.id);

        if (error) throw error;
      } else {
        // Crear
        const { error } = await supabase
          .from("products")
          .insert([product]);

        if (error) throw error;
      }

      // Actualizar estado local
      setProducts((prev) => {
        return exists 
          ? prev.map((x) => (x.id === product.id ? product : x)) 
          : [...prev, product];
      });

      showToast("✔ Producto guardado");
    } catch (error) {
      console.error("Error guardando producto:", error);
      showToast("❌ Error guardando producto");
    }
  }

  async function deleteProduct(id) {
    try {
      if (!isSupabaseConfigured) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        return;
      }

      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setProducts((prev) => prev.filter((p) => p.id !== id));
      setCart((prev) => prev.filter((i) => i.id !== id));
      setFavorites((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });

      showToast("✔ Producto eliminado");
    } catch (error) {
      console.error("Error eliminando producto:", error);
      showToast("❌ Error eliminando producto");
    }
  }

  async function addBrand(name) {
    try {
      const clean = name.trim();
      if (!clean || brands.includes(clean)) return;

      if (!isSupabaseConfigured) {
        setBrands((prev) => [...prev, clean]);
        return;
      }

      const { error } = await supabase
        .from("brands")
        .insert([{ name: clean }]);

      if (error && error.code !== "23505") throw error; // 23505 = unique constraint

      setBrands((prev) => [...prev, clean]);
      showToast("✔ Marca agregada");
    } catch (error) {
      console.error("Error agregando marca:", error);
      showToast("❌ Error agregando marca");
    }
  }

  async function removeBrand(name) {
    try {
      if (!isSupabaseConfigured) {
        setBrands((prev) => prev.filter((b) => b !== name));
        return;
      }

      const { error } = await supabase
        .from("brands")
        .delete()
        .eq("name", name);

      if (error) throw error;

      setBrands((prev) => prev.filter((b) => b !== name));
      showToast("✔ Marca eliminada");
    } catch (error) {
      console.error("Error eliminando marca:", error);
      showToast("❌ Error eliminando marca");
    }
  }

  function loginAdmin(password) {
    if (password === ADMIN_PASSWORD) {
      setAdminAuth(true);
      setAdminModalOpen(false);
      navigate("admin");
      return true;
    }
    return false;
  }

  const value = {
    theme,
    setTheme,
    lang,
    setLang,
    t,
    fmt,
    products,
    brands,
    loading,
    gateOpen,
    setGateOpen,
    authOpen,
    setAuthOpen,
    authReason,
    setAuthReason,
    user,
    authInitializing,
    logout,
    adminAuth,
    adminModalOpen,
    setAdminModalOpen,
    view,
    navigate,
    selectedProduct,
    cart,
    cartTotal,
    favorites,
    favProducts,
    purchased,
    reviewsExtra,
    toast,
    searchTerm,
    setSearchTerm,
    addToCart,
    removeFromCart,
    toggleFavorite,
    addReview,
    confirmOrder,
    handleLogin,
    saveProduct,
    deleteProduct,
    addBrand,
    removeBrand,
    loginAdmin,
    nextId: () => nextId(products),
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore debe usarse dentro de <StoreProvider>");
  return ctx;
}
