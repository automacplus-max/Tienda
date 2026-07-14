# RAIDEN — Tienda completa (Vite + React)

Versión con paridad completa respecto al prototipo de un solo archivo: catálogo,
detalle de producto, favoritos, carrito, checkout, modo oscuro, idioma/moneda,
login simulado y panel de administradores.

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre la URL que te muestre la terminal (por defecto `http://localhost:5173`).

Para entrar al panel de administradores: botón **"Administradores"** — en esta
versión modular está integrado como parte del flujo normal (iniciá sesión como
admin desde el ícono correspondiente una vez logueado, o accedé escribiendo
la contraseña cuando se te pida). Contraseña: `teamokiara`.

## Estructura

```
src/
  App.jsx                    # layout raíz: Provider, gate, modales, router por vista
  main.jsx                   # punto de entrada de React

  context/
    StoreContext.jsx          # estado global: carrito, favoritos, admin, tema, idioma, navegación

  pages/
    Home.jsx                   # catálogo: búsqueda, categorías, precio, marca, orden
    ProductDetail.jsx           # detalle: imágenes, variantes, reseñas, compra
    Favorites.jsx                # grilla de favoritos
    Cart.jsx                      # carrito
    Checkout.jsx                   # formulario + resumen + confirmar
    Confirmed.jsx                   # confirmación de compra
    Admin.jsx                        # panel: productos + marcas

  components/
    Header.jsx                 # logo, buscador, tema, idioma, favoritos, carrito, admin/login
    SearchBar.jsx                # input de búsqueda
    Filters.jsx                   # precio mínimo/máximo
    CategoryTabs.jsx               # tabs de categoría
    Dropdown.jsx                    # dropdown genérico reutilizable
    BrandDropdown.jsx                # filtro de marca (usa Dropdown)
    SortDropdown.jsx                  # orden (usa Dropdown)
    ProductCard.jsx                    # card de catálogo/favoritos
    ProductForm.jsx                     # alta/edición de producto (admin)
    Gate.jsx                             # pantalla de entrada
    AuthModal.jsx                         # login simulado
    AdminPasswordModal.jsx                 # contraseña de admin
    Toast.jsx                               # notificación flotante
    icons/                                   # PieceIcon, HeartIcon, StarIcon, SunMoonIcon

  data/
    products.js               # productos, marcas, categorías (mock data)

  utils/
    currency.js                 # formatPrice() y getDiscountPercent()
    translations.js               # diccionario ES/EN

  styles/
    global.css                # reset, tokens de color claro/oscuro, botones, modal, gate, dropdown
    header.css                  # Header
    product.css                   # ProductCard
    detail.css                      # ProductDetail
    cart.css                          # Cart + Checkout + Confirmed
    admin.css                           # Admin + ProductForm
```

## Notas importantes (léelas antes de mostrarle esto a alguien)

- **No hay backend real.** Todo el estado (productos, carrito, favoritos, usuario,
  reseñas) vive en memoria de React (`StoreContext`). Si recargás la página,
  se resetea todo a los datos iniciales de `data/products.js`. Para que persista
  de verdad hace falta conectar Supabase (o el backend que elijas).
- **La contraseña de admin (`teamokiara`) está en el código del frontend**,
  visible para cualquiera que inspeccione el código fuente. Sirve para el
  prototipo; para producción real necesitás autenticación server-side con
  roles (por eso veníamos hablando de Supabase Auth + Row Level Security).
- **El login con Google es simulado** — no hay OAuth real configurado.
- **El tipo de cambio UYU es una tasa fija aproximada**, no una cotización en vivo.
- Las imágenes que subís desde la compu en el panel admin (`FileReader`) solo
  viven en la sesión del navegador — no se guardan en ningún servidor todavía.
