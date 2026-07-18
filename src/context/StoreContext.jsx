// src/context/StoreContext.jsx
import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { INITIAL_PRODUCTS, INITIAL_BRANDS, INITIAL_CATEGORIES } from "../data/products.js";
import { LOCALES } from "../utils/translations.js";
import { formatPrice } from "../utils/currency.js";
import { supabase, isSupabaseConfigured } from "../config/supabaseClient.js";
import { mapSupabaseUser } from "../utils/auth.js";
import { readStoredToken, storeToken, clearStoredToken, isTokenValid } from "../utils/adminSession.js";
import { buildPath, parsePath } from "../utils/routes.js";

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
  // Las categorías (con sus subcategorías) todavía no tienen tabla propia en
  // Supabase — viven en estado local, editable desde el panel admin, igual
  // que marcas cuando Supabase no está configurado.
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [loading, setLoading] = useState(true);

  // ---------- Sesión / admin ----------
  const [gateOpen, setGateOpen] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [authReason, setAuthReason] = useState(null);
  const [user, setUser] = useState(null);
  const [authInitializing, setAuthInitializing] = useState(isSupabaseConfigured);
  const [adminAuth, setAdminAuth] = useState(() => isTokenValid(readStoredToken()));
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState(null);
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ---------- Navegación (con deep-link inicial desde la URL) ----------
  const initialRoute = useMemo(() => parsePath(window.location.pathname), []);
  const initialAdminOk = initialRoute.view !== "admin" || isTokenValid(readStoredToken());

  const [view, setView] = useState(initialAdminOk ? initialRoute.view : "catalog");
  const [selectedProductId, setSelectedProductId] = useState(initialRoute.productId || null);

  // ---------- Sidebar: navegación por categoría / subcategoría / marca ----------
  const [categoryFilter, setCategoryFilter] = useState(initialRoute.category || "Todo");
  const [subcategoryFilter, setSubcategoryFilter] = useState(initialRoute.subcategory || null);
  const [brandFilter, setBrandFilter] = useState(() => new Set(initialRoute.brand ? [initialRoute.brand] : []));

  function goToCategory(category, subcategory = null) {
    setCategoryFilter(category);
    setSubcategoryFilter(subcategory);
    setBrandFilter(new Set());
    navigate("catalog");
    setSidebarOpen(false);
  }

  function goToBrand(brand) {
    setBrandFilter(new Set([brand]));
    setCategoryFilter("Todo");
    setSubcategoryFilter(null);
    navigate("catalog");
    setSidebarOpen(false);
  }

  // ---------- Sincronización con la URL (botones atrás/adelante) ----------
  useEffect(() => {
    const path = buildPath({ view, productId: selectedProductId, category: categoryFilter, subcategory: subcategoryFilter, brand: brandFilter });
    if (path !== window.location.pathname) {
      window.history.pushState(null, "", path);
    }
  }, [view, selectedProductId, categoryFilter, subcategoryFilter, brandFilter]);

  useEffect(() => {
    function handlePopState() {
      const route = parsePath(window.location.pathname);
      if (route.view === "admin" && !adminAuth) {
        setView("catalog");
        return;
      }
      setView(route.view);
      setSelectedProductId(route.productId || null);
      setCategoryFilter(route.category || "Todo");
      setSubcategoryFilter(route.subcategory || null);
      setBrandFilter(new Set(route.brand ? [route.brand] : []));
    }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [adminAuth]);

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

  // ---------- Admin: productos y marcas ----------
  // El estado local es la fuente de verdad para la UI — se actualiza siempre,
  // de inmediato. Supabase (cuando está configurado) es un sync best-effort
  // en segundo plano: si falla (tabla inexistente, RLS, etc.) se avisa por
  // consola pero NUNCA se revierte ni se bloquea el cambio que ya ve el admin.
  // Antes, la escritura local dependía de que la llamada a Supabase tuviera
  // éxito primero — si fallaba, el cambio se perdía sin dejar rastro en la UI.
  function saveProduct(product) {
    setProducts((prev) => {
      const exists = prev.find((x) => x.id === product.id);
      return exists ? prev.map((x) => (x.id === product.id ? { ...x, ...product } : x)) : [...prev, { visible: true, ...product }];
    });
    showToast("✔ Producto guardado");

    if (isSupabaseConfigured) {
      const exists = products.find((x) => x.id === product.id);
      const query = exists ? supabase.from("products").update(product).eq("id", product.id) : supabase.from("products").insert([product]);
      query.then(({ error }) => {
        if (error) console.warn("No se pudo sincronizar el producto con Supabase:", error.message);
      });
    }
  }

  function deleteProduct(id) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((i) => i.id !== id));
    setFavorites((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    showToast("✔ Producto eliminado");

    if (isSupabaseConfigured) {
      supabase
        .from("products")
        .delete()
        .eq("id", id)
        .then(({ error }) => {
          if (error) console.warn("No se pudo eliminar el producto en Supabase:", error.message);
        });
    }
  }

  function duplicateProduct(id) {
    const source = products.find((p) => p.id === id);
    if (!source) return;
    const copy = { ...source, id: nextId(products), name: `${source.name} (copia)`, visible: false, reviews: [] };
    setProducts((prev) => [...prev, copy]);
    showToast("✔ Producto duplicado");
  }

  function toggleProductVisible(id) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, visible: p.visible === false } : p)));
  }

  function addBrand(name) {
    const clean = name.trim();
    if (!clean || brands.includes(clean)) return;
    setBrands((prev) => [...prev, clean]);
    showToast("✔ Marca agregada");

    if (isSupabaseConfigured) {
      supabase
        .from("brands")
        .insert([{ name: clean }])
        .then(({ error }) => {
          if (error && error.code !== "23505") console.warn("No se pudo sincronizar la marca con Supabase:", error.message);
        });
    }
  }

  function removeBrand(name) {
    setBrands((prev) => prev.filter((b) => b !== name));
    showToast("✔ Marca eliminada");

    if (isSupabaseConfigured) {
      supabase
        .from("brands")
        .delete()
        .eq("name", name)
        .then(({ error }) => {
          if (error) console.warn("No se pudo eliminar la marca en Supabase:", error.message);
        });
    }
  }

  // ---------- Admin: categorías y subcategorías ----------
  function addCategory(label) {
    const clean = label.trim();
    if (!clean || categories.some((c) => c.id === clean)) return;
    setCategories((prev) => [...prev, { id: clean, label: clean, subcategories: [] }]);
    showToast("✔ Categoría agregada");
  }

  function removeCategory(id) {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    if (categoryFilter === id) {
      setCategoryFilter("Todo");
      setSubcategoryFilter(null);
    }
    showToast("✔ Categoría eliminada");
  }

  function addSubcategory(categoryId, subcategory) {
    const clean = subcategory.trim();
    if (!clean) return;
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId && !c.subcategories.includes(clean) ? { ...c, subcategories: [...c.subcategories, clean] } : c))
    );
  }

  function removeSubcategory(categoryId, subcategory) {
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, subcategories: c.subcategories.filter((s) => s !== subcategory) } : c))
    );
    if (subcategoryFilter === subcategory) setSubcategoryFilter(null);
  }

  // La contraseña se verifica en el servidor (api/admin-login.js) contra
  // variables de entorno — nunca viaja embebida en el bundle del cliente,
  // a diferencia del hardcode anterior.
  async function loginAdmin(password) {
    setAdminLoginLoading(true);
    setAdminLoginError(null);
    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: "admin", pass: password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.token) {
        setAdminLoginError(data.error || "Contraseña incorrecta.");
        return false;
      }
      storeToken(data.token);
      setAdminAuth(true);
      setAdminModalOpen(false);
      navigate("admin");
      return true;
    } catch (error) {
      setAdminLoginError("No pudimos conectar con el servidor. Intentá de nuevo.");
      return false;
    } finally {
      setAdminLoginLoading(false);
    }
  }

  function logoutAdmin() {
    clearStoredToken();
    setAdminAuth(false);
    navigate("catalog");
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
    adminLoginError,
    adminLoginLoading,
    view,
    navigate,
    categoryFilter,
    setCategoryFilter,
    subcategoryFilter,
    setSubcategoryFilter,
    brandFilter,
    setBrandFilter,
    goToCategory,
    goToBrand,
    categories,
    addCategory,
    removeCategory,
    addSubcategory,
    removeSubcategory,
    sidebarOpen,
    setSidebarOpen,
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
    duplicateProduct,
    toggleProductVisible,
    addBrand,
    removeBrand,
    loginAdmin,
    logoutAdmin,
    nextId: () => nextId(products),
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore debe usarse dentro de <StoreProvider>");
  return ctx;
}
