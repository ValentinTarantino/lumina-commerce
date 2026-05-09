"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { 
  ShoppingCart, Zap, ShieldCheck, Globe, ArrowRight, 
  Smartphone, Tv, Tablet, Search, Star, Menu, X, 
  ChevronRight, Heart, Bell, User, Plus, Minus, ChevronDown, Headset, Truck, CheckCircle2
} from "lucide-react";
import { useCart } from "@/store/useCart";
import { useLang } from "@/store/useLang";
import CartDrawer from "@/components/CartDrawer";
import { translations } from "@/constants/translations";

function ProductZoom({ image, alt }: { image: string, alt: string }) {
  return (
    <div className="relative aspect-video md:aspect-square overflow-hidden rounded-2xl md:rounded-3xl bg-white/[0.02] border border-white/10 group/zoom">
      <img 
        src={image} 
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/zoom:scale-125"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
    </div>
  );
}

import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const { addItem, totalItems } = useCart();
  const { lang, setLang, toggleLang } = useLang();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  
  const t = translations[lang];

  const [activeCategory, setActiveCategory] = useState("Todos");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const heroSlides = [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=1000"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingError, setTrackingError] = useState("");
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const fetchUserOrders = async () => {
    if (!session) return;
    try {
      const res = await fetch('/api/user/orders');
      const data = await res.json();
      if (res.ok) setUserOrders(data);
    } catch (e) {
      console.error("Error fetching history");
    }
  };

  useEffect(() => {
    if (session) fetchUserOrders();
  }, [session]);

  const handleTrack = async (codeToTrack?: string) => {
    const code = codeToTrack || trackingCode;
    if (!code) return;
    
    if (codeToTrack) setTrackingCode(codeToTrack);
    
    setIsTracking(true);
    setTrackingError("");
    try {
      const res = await fetch(`/api/orders/${code}`);
      const data = await res.json();
      if (res.ok) {
        setTrackingResult(data);
        setShowHistory(false);
      } else {
        setTrackingError(t.tracking.error);
        setTrackingResult(null);
      }
    } catch (e) {
      setTrackingError(lang === "es" ? "Error de conexión" : "Connection error");
    } finally {
      setIsTracking(false);
    }
  };

  useEffect(() => {
    setQuantity(1);
  }, [selectedProduct]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/py/products');
        const data = await response.json();
        setProducts(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ["Todos", "Celulares", "Televisores", "Tablets"];
  const filteredProducts = products.filter(p => 
    (activeCategory === "Todos" || p.category === activeCategory) && 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

    <main className="min-h-screen bg-[#020203] text-white selection:bg-indigo-500/30">
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onOrderSuccess={fetchUserOrders}
      />
      
      <AnimatePresence>
        {isTimelineOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTimelineOpen(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#0a0a0b] border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient-x"></div>
              
              <button 
                onClick={() => setIsTimelineOpen(false)}
                className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <h2 className="text-xl md:text-3xl font-black italic uppercase tracking-tighter mb-8 md:mb-10 pr-12">{t.calendar.title}</h2>
              
              <div className="space-y-10 relative">
                <div className="absolute left-4 top-2 bottom-2 w-px bg-white/5"></div>
                
                {[
                  { month: t.calendar.june, event: "Lumina Vision Pro X", desc: lang === "es" ? "Realidad espacial." : "Spatial reality." },
                  { month: t.calendar.sept, event: "Iphone 16 pro max", desc: lang === "es" ? "Tope de gama." : "High-end flagship." },
                  { month: t.calendar.dec, event: "Sony Playstation 5", desc: "Gaming Pro." }
                ].map((item, idx) => (
                  <div key={idx} className="relative pl-12">
                    <div className="absolute left-3 w-4 h-4 bg-indigo-600 rounded-full -translate-x-1/2 border-4 border-[#0a0a0b] shadow-[0_0_20px_rgba(79,70,229,0.8)]"></div>
                    <div className="text-indigo-400 text-[9px] font-black uppercase tracking-[0.3em] mb-1 italic">{item.month}</div>
                    <h4 className="text-lg font-black italic uppercase tracking-tight mb-1">{item.event}</h4>
                    <p className="text-white/20 text-[11px] italic">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, x: "-50%" }}
            className="fixed bottom-12 left-1/2 z-[200] bg-white text-black px-6 md:px-8 py-4 md:py-5 rounded-2xl md:rounded-[2rem] shadow-2xl flex items-center gap-4 border border-white/20 w-[90%] max-w-xs md:min-w-[320px]"
          >
            <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-0.5 italic">Notificación</p>
              <p className="text-sm font-black italic uppercase tracking-tight">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl bg-[#0a0a0b] border border-white/10 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 shadow-2xl overflow-hidden max-h-[95vh] md:max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 md:top-8 right-4 md:right-8 p-2 md:p-3 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/10 transition-all z-20"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <ProductZoom image={selectedProduct.image} alt={selectedProduct.name} />

                <div className="space-y-8">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-8 h-px bg-indigo-500"></span>
                      <span className="text-indigo-400 font-black text-[10px] tracking-[0.4em] uppercase italic">{selectedProduct.category}</span>
                    </div>
                    <h2 className="text-2xl xs:text-3xl md:text-6xl font-black italic uppercase tracking-tighter mb-4 leading-none">{selectedProduct.name}</h2>
                    <p className="text-white/40 text-lg leading-relaxed italic">
                      {lang === "en"
                        ? (selectedProduct.description_en || "A masterpiece of digital engineering designed to exceed all expectations.")
                        : (selectedProduct.description || "Una obra maestra de ingeniería digital diseñada para superar cualquier expectativa.")}
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest italic mb-1">{t.products.finalPrice}</span>
                        <span className="text-4xl font-black italic tracking-tight">${selectedProduct.price.toLocaleString()}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest italic mb-2">{t.cart.quantity}</span>
                        <div className="flex items-center gap-4 bg-black/40 p-2 rounded-xl border border-white/10">
                          <button 
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="p-1 hover:text-indigo-400 transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center font-black italic">{quantity}</span>
                          <button 
                            onClick={() => setQuantity(Math.min(selectedProduct.stock || 5, quantity + 1))}
                            className={`p-1 transition-colors ${quantity >= (selectedProduct.stock || 5) ? 'text-white/10 cursor-not-allowed' : 'hover:text-indigo-400'}`}
                            disabled={quantity >= (selectedProduct.stock || 5)}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        for(let i=0; i<quantity; i++) addItem(selectedProduct);
                        setSelectedProduct(null);
                        setToastMessage(lang === "es" ? "Añadido al ecosistema." : "Added to ecosystem.");
                        setShowToast(true);
                      }}
                      className="premium-btn w-full py-6 flex items-center justify-center gap-3 group"
                    >
                      <ShoppingCart className="w-5 h-5 transition-transform group-hover:scale-110" />
                      {lang === "es" ? "Añadir al Carrito" : "Add to Cart"}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                      <ShieldCheck className="w-5 h-5 text-indigo-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">{lang === "es" ? "Garantía Global" : "Global Warranty"}</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                      <Globe className="w-5 h-5 text-indigo-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">{lang === "es" ? "Envío Priority" : "Priority Shipping"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${mounted ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"} border-b border-white/[0.03] bg-black/40 backdrop-blur-2xl`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 md:h-24 flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-12">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-white/60 hover:text-white transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-xl md:text-2xl font-black tracking-tighter flex items-center gap-2 md:gap-3 cursor-pointer"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/40">
                <Zap className="w-5 h-5 md:w-6 md:h-6 fill-white" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40">LUMINA.</span>
            </motion.div>
            <div className="hidden lg:flex items-center gap-8 text-[13px] font-bold uppercase tracking-widest text-white/40">
              <button 
                onClick={() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })}
                className="hover:text-white transition-colors relative group"
              >
                {t.nav.explore}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-indigo-500 transition-all group-hover:w-full"></span>
              </button>
              <button 
                onClick={() => document.getElementById('novedades')?.scrollIntoView({ behavior: 'smooth' })}
                className="hover:text-white transition-colors relative group"
              >
                {t.nav.news}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-indigo-500 transition-all group-hover:w-full"></span>
              </button>
              <button 
                onClick={() => document.getElementById('tracking')?.scrollIntoView({ behavior: 'smooth' })}
                className="hover:text-white transition-colors relative group"
              >
                {t.nav.tracking}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-indigo-500 transition-all group-hover:w-full"></span>
              </button>
            </div>

            {/* Live Status Ticker */}
            <div className="hidden lg:flex items-center gap-3 px-6 py-1.5 bg-white/[0.03] border border-white/[0.05] rounded-full backdrop-blur-md mx-auto">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
              <div className="h-4 overflow-hidden min-w-[200px]">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={Math.floor(Date.now() / 4000)}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic flex items-center gap-2"
                  >
                    {lang === 'es' ? (
                      [
                        "Sincronización Global: Activa",
                        "iPhone 15 Pro: Stock Limitado",
                        "Envíos Prioritarios: Disponibles",
                        "Nuevos Ingresos: Mayo 2026"
                      ][Math.floor(Date.now() / 4000) % 4]
                    ) : (
                      [
                        "Global Sync: Active",
                        "iPhone 15 Pro: Low Stock",
                        "Priority Shipping: Available",
                        "New Arrivals: May 2026"
                      ][Math.floor(Date.now() / 4000) % 4]
                    )}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <button 
              onClick={() => toggleLang()}
              className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-3 md:px-4 py-2 rounded-xl hover:bg-white/10 transition-all group"
            >
              <Globe className="w-3.5 h-3.5 md:w-4 md:h-4 text-white/40 group-hover:text-indigo-400 transition-colors" />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/60">{lang === "es" ? "ES" : "EN"}</span>
            </button>

            <div className="flex items-center gap-2 md:gap-3">
              {session ? (
                  <div className="flex items-center gap-3 md:gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="relative group">
                      <button className="flex items-center gap-2 group">
                        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-white/20 overflow-hidden bg-white/5 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                          {session.user?.image ? (
                            <img 
                              src={session.user.image} 
                              alt={session.user.name || "Usuario"} 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/30 to-blue-500/30 text-[10px] font-bold">
                              {session.user?.name?.charAt(0).toUpperCase() || <User size={14} />}
                            </div>
                          )}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-[#0a0a0b] rounded-full shadow-sm"></div>
                      </button>
                      
                      <div className="absolute right-0 top-full mt-4 w-48 bg-[#0a0a0b] border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 backdrop-blur-xl z-50 overflow-hidden">
                        <div className="p-4 border-b border-white/5">
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/40 italic mb-1">Conectado como</p>
                          <p className="text-xs font-black italic truncate">{session.user?.name}</p>
                        </div>
                        <button 
                          onClick={() => signOut()}
                          className="w-full p-4 text-left text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-colors italic flex items-center gap-3"
                        >
                          <Zap className="w-3 h-3 fill-red-500" />
                          {t.nav.logout}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => signIn("google")}
                    className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-2.5 bg-white text-black rounded-lg md:rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-500 text-[9px] md:text-[11px] font-black uppercase tracking-widest shadow-xl shadow-white/5 active:scale-95 group"
                  >
                    <User size={12} className="md:w-3.5 md:h-3.5 group-hover:rotate-12 transition-transform" />
                    <span className="hidden xs:inline">{t.nav.login}</span>
                  </button>
                )}

              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-lg md:rounded-xl transition-all border border-white/5"
              >
                <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 text-white/80" />
                {mounted && totalItems() > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-indigo-600 text-[9px] md:text-[10px] font-black w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center shadow-lg shadow-indigo-600/50"
                  >
                    {totalItems()}
                  </motion.span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] lg:hidden"
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-[#0a0a0b] border-r border-white/5 z-[101] p-8 lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="text-xl font-black tracking-tighter flex items-center gap-2 italic">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 fill-white" />
                  </div>
                  LUMINA.
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-white/40 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Ticker */}
              <div className="mb-12 p-4 bg-white/[0.03] border border-white/[0.05] rounded-2xl flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
                <div className="h-4 overflow-hidden flex-1">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={Math.floor(Date.now() / 4000)}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic"
                    >
                      {lang === 'es' ? (
                        ["Sincronización Global: Activa", "iPhone 15 Pro: Stock Limitado", "Envíos Prioritarios: Disponibles", "Nuevos Ingresos: Mayo 2026"][Math.floor(Date.now() / 4000) % 4]
                      ) : (
                        ["Global Sync: Active", "iPhone 15 Pro: Low Stock", "Priority Shipping: Available", "New Arrivals: May 2026"][Math.floor(Date.now() / 4000) % 4]
                      )}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex flex-col gap-6 mb-auto">
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-2xl font-black uppercase tracking-tighter italic text-left hover:text-indigo-400 transition-colors"
                >
                  {t.nav.explore}
                </button>
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    document.getElementById('novedades')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-2xl font-black uppercase tracking-tighter italic text-left hover:text-indigo-400 transition-colors"
                >
                  {t.nav.news}
                </button>
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    document.getElementById('tracking')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-2xl font-black uppercase tracking-tighter italic text-left hover:text-indigo-400 transition-colors"
                >
                  {t.nav.tracking}
                </button>
              </div>

              <div className="mt-auto pt-8 border-t border-white/5 flex flex-col gap-6">
                <button 
                  onClick={() => toggleLang()}
                  className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl group"
                >
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-indigo-400" />
                    <span className="text-sm font-black uppercase tracking-widest">{lang === 'es' ? 'Idioma' : 'Language'}</span>
                  </div>
                  <span className="text-xs font-black text-indigo-400">{lang === "es" ? "ESPAÑOL" : "ENGLISH"}</span>
                </button>

                {session ? (
                  <button 
                    onClick={() => signOut()}
                    className="w-full p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-black uppercase tracking-[0.2em] italic flex items-center justify-center gap-3"
                  >
                    <Zap className="w-3 h-3 fill-red-400" />
                    {lang === 'es' ? 'Cerrar Sesión' : 'Sign Out'}
                  </button>
                ) : (
                  <button 
                    onClick={() => signIn('google')}
                    className="w-full p-4 bg-white text-black rounded-2xl text-xs font-black uppercase tracking-[0.2em] italic hover:bg-indigo-400 transition-colors"
                  >
                    {lang === 'es' ? 'Iniciar Sesión' : 'Sign In'}
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <section className="relative pt-44 pb-32 px-6 overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[-5%] w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[180px] animate-pulse-soft"></div>
          <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[160px] animate-pulse-soft delay-1000"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <h1 className="text-6xl xs:text-7xl md:text-8xl lg:text-9xl font-black mb-6 md:mb-10 leading-[0.85] md:leading-[0.8] tracking-tighter uppercase italic">
              {t.hero.defying} <br /> 
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/20">{t.hero.limits}</span>
            </h1>
            
            <p className="max-w-lg text-base md:text-lg text-white/40 mb-12 leading-relaxed font-medium italic border-l-0 lg:border-l-2 border-indigo-600/30 lg:pl-8">
              {t.hero.tagline}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 w-full sm:w-auto">
              <button 
                onClick={() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })}
                className="premium-btn w-full sm:w-auto px-12 group"
              >
                {t.hero.exploreBtn} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
              </button>
              <button 
                onClick={() => document.getElementById('lanzamientos')?.scrollIntoView({ behavior: 'smooth' })}
                className="premium-btn-outline w-full sm:w-auto px-12"
              >
                {t.hero.launchesBtn}
              </button>
            </div>
          </motion.div>

          <div className="relative w-full max-w-2xl mx-auto lg:mx-0">
            <div className="relative z-10 w-full aspect-[4/3] md:aspect-square bg-white/[0.02] border border-white/10 rounded-[2rem] md:rounded-[4rem] backdrop-blur-3xl overflow-hidden shadow-2xl shadow-indigo-600/5">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={currentSlide}
                  src={heroSlides[currentSlide]}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 0.5, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full h-full object-cover mix-blend-luminosity"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-[#020203] via-transparent to-transparent"></div>
              <div className="absolute bottom-6 md:bottom-10 right-6 md:right-10 flex gap-2">
                {heroSlides.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-1 transition-all duration-500 rounded-full ${
                      currentSlide === idx ? "w-8 bg-indigo-500" : "w-2 bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="absolute -inset-4 bg-indigo-600/5 blur-3xl -z-10 lg:hidden"></div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-[#020203] pointer-events-none z-20" />
      </section>

      <section id="productos" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between mb-16 gap-10 text-center lg:text-left">
          <div className="max-w-2xl flex flex-col items-center lg:items-start">
            <div className="text-indigo-500 font-black text-[10px] tracking-widest uppercase mb-4 italic opacity-60">{lang === "es" ? "Categorías Premium" : "Premium Categories"}</div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-8 uppercase italic leading-none">{t.products.title}</h2>
            
            <div className="relative z-40 w-full max-w-[280px]">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl flex items-center justify-between group hover:border-white/30 transition-all backdrop-blur-xl"
              >
                <div className="flex flex-col items-start text-left">
                  <span className="text-[9px] font-black text-white/20 uppercase tracking-widest italic">{t.products.filter}</span>
                  <span className="text-xs font-black uppercase tracking-widest italic">{(t.products.categories as any)[activeCategory] || activeCategory}</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform duration-500 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-3 bg-[#0a0a0b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
                  >
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setActiveCategory(cat);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest italic transition-all hover:bg-white hover:text-black ${
                          activeCategory === cat ? "text-indigo-400" : "text-white/40"
                        }`}
                      >
                        {(t.products.categories as any)[cat] || cat}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[400px] md:h-[500px] bg-white/[0.02] border border-white/[0.05] rounded-[2rem] md:rounded-[2.5rem] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 min-h-[600px]">
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => setSelectedProduct(product)}
                  className="group glass-card overflow-hidden flex flex-col cursor-pointer"
                >
                  <div className="relative aspect-[4/5] overflow-hidden m-4 rounded-[1.5rem]">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" 
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase italic">
                        {(t.products.categories as any)[product.category] || product.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-8 pt-2 flex flex-col flex-grow">
                    <h3 className="text-2xl font-black mb-6 tracking-tight group-hover:text-indigo-400 transition-colors uppercase italic">
                      {product.name}
                    </h3>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1 italic">{t.products.finalPrice}</span>
                        <span className="text-3xl font-black text-white italic">${product.price.toLocaleString()}</span>
                      </div>
                      <div 
                        className="bg-white text-black w-14 h-14 rounded-2xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-xl active:scale-90 group-hover:shadow-indigo-600/20"
                      >
                        <ArrowRight className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      <section id="novedades" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative flex flex-col lg:min-h-[600px] rounded-[2rem] md:rounded-[4rem] overflow-hidden group shadow-2xl shadow-indigo-600/10 bg-[#0a0a0b]"
          >
            <div className="absolute inset-0 lg:relative lg:h-full">
              <img 
                src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=2000" 
                alt="Lumina Tech Center" 
                className="w-full h-full object-cover opacity-40 md:opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#020203] via-[#020203]/95 md:via-[#020203]/70 to-transparent"></div>
            </div>
            
            <div className="relative p-8 md:p-24 flex flex-col justify-center max-w-3xl z-10 lg:absolute lg:inset-0">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 md:w-12 h-px bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
                <span className="text-indigo-400 font-black text-[10px] md:text-xs tracking-[0.3em] uppercase italic drop-shadow-lg">{t.news.expansion}</span>
              </div>
              
              <h2 className="text-3xl xs:text-4xl md:text-7xl font-black mb-6 md:mb-8 leading-[1] md:leading-[0.9] tracking-tighter italic uppercase text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                {t.news.title} <br /> <span className="text-white/60">{t.news.subtitle}</span>
              </h2>
              
              <p className="text-white/80 text-base md:text-lg mb-10 leading-relaxed italic drop-shadow-md">
                {t.news.desc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                <div className="flex flex-col bg-white/5 p-4 md:p-6 rounded-2xl border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1 italic">{t.news.hqSouth}</span>
                  <span className="text-xs md:text-sm font-black uppercase italic text-white tracking-wider">Buenos Aires</span>
                </div>
                <div className="flex flex-col bg-white/5 p-4 md:p-6 rounded-2xl border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1 italic">{t.news.hqCentral}</span>
                  <span className="text-xs md:text-sm font-black uppercase italic text-white tracking-wider">São Paulo</span>
                </div>
                <div className="flex flex-col bg-white/5 p-4 md:p-6 rounded-2xl border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1 italic">{t.news.hqNorth}</span>
                  <span className="text-xs md:text-sm font-black uppercase italic text-white tracking-wider">Miami & NYC</span>
                </div>
              </div>
            </div>

            <div className="absolute top-12 right-12 hidden xl:block">
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl text-right">
                <div className="text-4xl font-black italic mb-1 tracking-tighter">2026</div>
                <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest italic">{t.news.opening}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="lanzamientos" className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between mb-16 gap-8 text-center lg:text-left">
            <div className="max-w-xl">
              <div className="text-indigo-500 font-black text-xs tracking-widest uppercase mb-4 italic">{t.upcoming.subtitle}</div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 uppercase italic">{t.upcoming.title}</h2>
              <p className="text-white/70 text-lg md:text-xl italic leading-relaxed">
                {t.upcoming.desc}
              </p>
            </div>
            <div className="hidden lg:block h-px flex-1 bg-white/[0.05] mx-12 mb-6"></div>
            <button 
              onClick={() => setIsTimelineOpen(true)}
              className="premium-btn-outline whitespace-nowrap w-full sm:w-auto"
            >
              {t.upcoming.calendarBtn}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                title: "Lumina Vision Pro X",
                date: lang === "es" ? "Junio 2026" : "June 2026",
                image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&q=80&w=800",
                tag: t.upcoming.visionPro
              },
              {
                title: "Iphone 16 pro max",
                date: lang === "es" ? "Septiembre 2026" : "September 2026",
                image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=800",
                tag: t.upcoming.comingSoon
              },
              {
                title: "Sony Playstation 5",
                date: lang === "es" ? "Diciembre 2026" : "December 2026",
                image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=800",
                tag: t.upcoming.gaming
              }
            ].map((item, idx) => (
              <motion.div
                whileHover={{ y: -10 }}
                key={item.title}
                className="group relative h-[400px] md:h-[500px] rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/[0.05] bg-[#0a0a0b]"
              >
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all duration-1000 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020203] via-transparent to-transparent"></div>
                
                <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 right-6 md:right-10">
                  <span className="inline-block px-3 py-1 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-[8px] md:text-[9px] font-black tracking-widest uppercase italic text-indigo-400 mb-3 md:mb-4">
                    {item.tag}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter mb-2 group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-3 text-white/20 text-[9px] md:text-[10px] font-black uppercase tracking-widest italic">
                    <Bell className="w-3 h-3" />
                    {t.upcoming.available} {item.date}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="tracking" className="py-32 px-6 bg-[#020203] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="text-indigo-500 font-black text-[10px] tracking-[0.5em] uppercase mb-4 italic opacity-80">{t.tracking.tagline}</div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic mb-6">{t.tracking.title}</h2>
            <p className="text-white/40 max-w-lg mx-auto text-sm italic">{t.tracking.desc}</p>
          </div>

          <div className="glass-panel p-8 md:p-12 border-white/5 relative overflow-hidden group">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                <input 
                  type="text" 
                  value={trackingCode}
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase();
                    setTrackingCode(val);
                    if (!val) {
                      setTrackingResult(null);
                      setTrackingError("");
                    }
                  }}
                  placeholder={t.tracking.placeholder}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-6 pl-16 pr-6 text-lg font-black tracking-widest text-white outline-none focus:border-indigo-500/50 transition-all italic placeholder:text-white/10"
                />
              </div>
              <button 
                onClick={() => handleTrack()}
                disabled={isTracking}
                className="premium-btn px-12 h-[76px] disabled:opacity-50"
              >
                {isTracking ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : t.tracking.trackBtn}
              </button>
            </div>

            {session && (
              <div className="mt-6 flex justify-center">
                <button 
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-indigo-400 transition-colors flex items-center gap-2 italic"
                >
                  {showHistory ? t.tracking.hideHistory : t.tracking.forgotCode}
                  <ChevronDown className={`w-3 h-3 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
                </button>
              </div>
            )}

            <AnimatePresence>
              {showHistory && userOrders.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-8"
                >
                  <div className="flex items-center justify-between mb-4 px-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 italic">
                      {lang === 'es' ? 'Mostrando' : 'Showing'} {userOrders.length} {lang === 'es' ? 'pedidos' : 'orders'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
                    {userOrders.map((order) => (
                      <button
                        key={order.orderNumber}
                        onClick={() => handleTrack(order.orderNumber)}
                        className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/5 hover:border-indigo-500/30 transition-all text-left group"
                      >
                        <div>
                          <p className="text-[9px] font-black text-white/20 uppercase mb-1">{t.tracking.historyDate}: {new Date(order.createdAt).toLocaleDateString()}</p>
                          <p className="text-sm font-black text-white/80 italic tracking-wider">{order.orderNumber}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-indigo-400 transition-colors" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {trackingError && (
              <motion.p 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-red-500 text-xs font-black uppercase tracking-widest mt-6 ml-4 italic"
              >
                ⚠ {trackingError}
              </motion.p>
            )}

            <AnimatePresence>
              {trackingResult && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-12 pt-12 border-t border-white/5"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center">
                          <Truck className="w-8 h-8 text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1 italic">{t.tracking.status}</p>
                          <h4 className="text-2xl font-black italic uppercase text-indigo-400">
                            {t.tracking.orderStatuses[trackingResult.status as keyof typeof t.tracking.orderStatuses] || trackingResult.status}
                          </h4>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/30 italic">
                          <span>{t.tracking.progress}</span>
                          <span>75%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "75%" }}
                            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
                          ></motion.div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2 italic">{t.tracking.destination}</p>
                          <p className="text-sm font-black italic uppercase text-white/80 line-clamp-2">{trackingResult.address}</p>
                        </div>
                        <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2 italic">{t.tracking.delivery}</p>
                          <p className="text-sm font-black italic uppercase text-white/80">{new Date(trackingResult.deliveryDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] p-8">
                      <h5 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 mb-6 italic">{t.tracking.contents}</h5>
                      <div className="space-y-4">
                        {trackingResult.items.map((item: any) => (
                          <div key={item.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                            <span className="text-sm font-black italic text-white/80 uppercase">{item.name}</span>
                            <span className="text-[10px] font-black bg-white/5 px-3 py-1 rounded-full text-white/40">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-24 pb-12 border-t border-white/[0.04] bg-black/20 relative overflow-hidden">
        {/* Background Ambient Glow for Footer */}
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
            
            {/* Column 1: Brand */}
            <div className="flex flex-col items-center md:items-start gap-6">
              <div className="text-2xl font-black tracking-tighter flex items-center gap-3 italic">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
                  <Zap className="w-5 h-5 fill-white" />
                </div>
                LUMINA.
              </div>
              <p className="text-white/60 text-sm leading-relaxed italic max-w-xs text-center md:text-left">
                {t.footer.desc}
              </p>
              <div className="flex items-center gap-5 pt-2">
                <a href="#" className="p-2.5 bg-white/10 rounded-xl text-white/50 hover:text-white hover:bg-white/20 transition-all border border-white/10">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" className="p-2.5 bg-white/10 rounded-xl text-white/50 hover:text-white hover:bg-white/20 transition-all border border-white/10">
                  <span className="sr-only">X (Twitter)</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
                </a>
                <a href="#" className="p-2.5 bg-white/10 rounded-xl text-white/50 hover:text-white hover:bg-white/20 transition-all border border-white/10">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
              </div>
            </div>

            {/* Column 2: Navigation */}
            <div className="flex flex-col items-center gap-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 italic">{lang === "es" ? "Navegación" : "Navigation"}</h4>
              <div className="flex flex-col items-center gap-5 text-sm font-bold uppercase tracking-widest text-white/70">
                <button
                  onClick={() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-white transition-all hover:translate-x-1 duration-300 italic"
                >
                  {t.nav.explore}
                </button>
                <button
                  onClick={() => document.getElementById('novedades')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-white transition-all hover:translate-x-1 duration-300 italic"
                >
                  {t.nav.news}
                </button>
                <button
                  onClick={() => document.getElementById('tracking')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-white transition-all hover:translate-x-1 duration-300 italic"
                >
                  {t.nav.tracking}
                </button>
              </div>
            </div>

            {/* Column 3: Ecosystem Status */}
            <div className="flex flex-col items-center md:items-end gap-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 italic text-center md:text-right">
                {lang === "es" ? "Estado del Ecosistema" : "Ecosystem Status"}
              </h4>
              
              <div className="flex flex-col gap-4 w-full max-w-[200px]">
                {/* Status Items */}
                <div className="flex items-center justify-between group">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/50 italic group-hover:text-white transition-colors">Network</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-green-500 italic">Online</span>
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between group">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/50 italic group-hover:text-white transition-colors">Servers</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-green-500 italic">Optimal</span>
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse delay-75 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between group">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/50 italic group-hover:text-white transition-colors">Support</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 italic">24/7 Active</span>
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse delay-150 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 w-full max-w-[200px] text-center md:text-right">
                <p className="text-[9px] font-black uppercase tracking-widest text-white/30 italic">
                  {lang === "es" ? "Actualizado: Global Sync" : "Updated: Global Sync"}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright + Tech Stack */}
          <div className="pt-12 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">
              {t.footer.rights}
            </div>

            {/* Tech Stack Badges */}
            <div className="flex items-center gap-6 opacity-60 hover:opacity-100 transition-opacity duration-700">
              <div className="flex items-center gap-2 group/tech">
                <Zap className="w-2.5 h-2.5 text-white fill-white group-hover/tech:text-indigo-400 transition-colors" />
                <span className="text-[9px] font-black uppercase tracking-widest italic">Next.js 15</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                <span className="text-[9px] font-black uppercase tracking-widest italic">TypeScript</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-[9px] font-black uppercase tracking-widest italic">FastAPI</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-[9px] font-black uppercase tracking-widest italic">Prisma</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
