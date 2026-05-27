import { useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentPlusIcon,
  HomeIcon,
  InformationCircleIcon,
  PlayIcon,
  QuestionMarkCircleIcon,
  RectangleStackIcon,
  UsersIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

import { Button } from "@/components/ui/button";
import { LogoHorizontal } from "@/components/branding/LogoHorizontal";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const ICON_CLASS = "size-4";

const NAV_ITEMS_ADMIN = [
  { id: "campaigns", label: "Campanhas", path: "/create", icon: DocumentPlusIcon },
  { id: "models", label: "Modelos", path: "/models", icon: RectangleStackIcon },
  { id: "graphics", label: "Gráficos", path: "/graphics", icon: ChartBarIcon },
  { id: "users", label: "Usuários", path: "/users", icon: UsersIcon },
  { id: "about", label: "Sobre", path: "/about", icon: InformationCircleIcon },
];

const NAV_ITEMS_USER = [
  { id: "quiz", label: "Quiz", path: "/quiz", icon: QuestionMarkCircleIcon },
  { id: "conteudos", label: "Conteúdos", path: "/conteudos", icon: PlayIcon },
  { id: "meus-graficos", label: "Meu Desempenho", path: "/meus-graficos", icon: ChartPieIcon },
];

const PATH_TO_ID_ADMIN = {
  "/create": "campaigns", "/models": "models", "/graphics": "graphics",
  "/users": "users", "/about": "about", "/settings": "settings",
};
const PATH_TO_ID_USER = {
  "/quiz": "quiz", "/conteudos": "conteudos", "/meus-graficos": "meus-graficos", "/settings": "settings",
};

const SIDE_BUTTON_BASE = "size-11 cursor-pointer rounded-full shadow-sm transition-colors duration-200";
const SIDE_BUTTON_IDLE = "bg-white text-teal-700";
const SIDE_BUTTON_HOVER = "!bg-teal-700 !text-white";
const SIDE_BUTTON_ACTIVE = "!bg-teal-700 !text-white";

const MENU_ITEM_BASE_CLASS =
  "relative z-10 flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-2 text-sm font-black uppercase tracking-[0.02em] whitespace-nowrap hover:bg-transparent focus:bg-transparent [&_svg]:text-teal-700 [&_span]:text-[#0b2437]";
const MENU_ITEM_ACTIVE_CLASS =
  "!bg-teal-700 !text-white shadow-sm [&_svg]:!text-white [&_span]:!text-white";
const MENU_ITEM_IDLE_CLASS = "text-black";

export default function AppNavbar({ activePage, onNavigate }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = user?.role === "Admin";
  const navItems = isAdmin ? NAV_ITEMS_ADMIN : NAV_ITEMS_USER;
  const pathToId = isAdmin ? PATH_TO_ID_ADMIN : PATH_TO_ID_USER;
  const homeRoute = isAdmin ? "/admin" : "/home";

  const isSettingsRoute = location.pathname === "/settings";
  const isHomeRoute = location.pathname === homeRoute;

  const currentPage = useMemo(() => {
    if (activePage) return activePage;
    return pathToId[location.pathname] ?? null;
  }, [activePage, location.pathname, pathToId]);

  const handleNavigate = (item) => {
    onNavigate?.(item.id);
    if (!onNavigate) navigate(item.path);
    setMobileOpen(false);
  };

  const [hoveredBtn, setHoveredBtn] = useState(null);
  const circleBtnClass = (id, isActive = false) =>
    cn(SIDE_BUTTON_BASE, isActive ? SIDE_BUTTON_ACTIVE : hoveredBtn === id ? SIDE_BUTTON_HOVER : SIDE_BUTTON_IDLE);

  const [highlight, setHighlight] = useState({ visible: false, left: 0, width: 0 });
  const handleMouseEnter = (e) => {
    const item = e.currentTarget;
    const list = item.closest("ul");
    if (!list) return;
    const itemRect = item.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();
    setHighlight({ visible: true, left: itemRect.left - listRect.left, width: itemRect.width });
  };
  const handleMouseLeave = () => setHighlight((prev) => ({ ...prev, visible: false }));

  return (
    <div className="relative z-20 w-full">
      {/* Desktop Navbar */}
      <div className="hidden lg:flex w-full items-center justify-between gap-4 bg-transparent px-4 py-4">
        {/* Left */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="cursor-pointer transition-opacity hover:opacity-80 flex items-center" onClick={() => navigate(homeRoute)}>
            <LogoHorizontal className="h-14.5 -ml-3 w-auto" variant="dark" />
          </div>
          <Button type="button" variant="secondary" size="icon-sm"
            className={circleBtnClass("home", isHomeRoute)}
            onMouseEnter={() => setHoveredBtn("home")} onMouseLeave={() => setHoveredBtn(null)}
            onClick={() => navigate(homeRoute)} title="Início">
            <HomeIcon className={ICON_CLASS} />
          </Button>
        </div>

        {/* Center */}
        <div className="flex-1 flex justify-center min-w-0">
          <NavigationMenu className="w-auto flex justify-center">
            <NavigationMenuList
              className="relative flex max-w-full flex-nowrap gap-1 overflow-x-auto rounded-full border border-slate-300 bg-slate-100 px-3 py-1 shadow-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              onMouseLeave={handleMouseLeave}
            >
              <div aria-hidden className="pointer-events-none absolute rounded-full bg-teal-700/10"
                style={{ top: "50%", transform: "translateY(-50%)", left: highlight.left, width: highlight.width, height: "32px",
                  opacity: highlight.visible ? 1 : 0,
                  transition: "left 0.25s cubic-bezier(0.4,0,0.2,1), width 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.15s ease" }} />
              {navItems.map((item) => {
                const isActive = currentPage === item.id;
                const ItemIcon = item.icon;
                return (
                  <NavigationMenuItem key={item.id}>
                    <NavigationMenuLink href={item.path} onMouseEnter={handleMouseEnter}
                      onClick={(e) => { e.preventDefault(); handleNavigate(item); }}
                      className={cn(MENU_ITEM_BASE_CLASS, isActive ? MENU_ITEM_ACTIVE_CLASS : MENU_ITEM_IDLE_CLASS)}>
                      <ItemIcon className={ICON_CLASS} />
                      <span>{item.label}</span>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 shrink-0">
          <Button type="button" variant="secondary" size="icon-sm"
            className={circleBtnClass("settings", isSettingsRoute)}
            onMouseEnter={() => setHoveredBtn("settings")} onMouseLeave={() => setHoveredBtn(null)}
            onClick={() => navigate("/settings")} title="Configurações">
            <Cog6ToothIcon className={ICON_CLASS} />
          </Button>
          <Button type="button" variant="secondary" size="icon-sm"
            className={circleBtnClass("logout")}
            onMouseEnter={() => setHoveredBtn("logout")} onMouseLeave={() => setHoveredBtn(null)}
            onClick={() => { logout(); navigate("/"); }} title="Sair">
            <ArrowRightOnRectangleIcon className={ICON_CLASS} />
          </Button>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="flex lg:hidden w-full items-center justify-between px-4 py-3 bg-transparent">
        <div className="cursor-pointer transition-opacity hover:opacity-80" onClick={() => navigate(homeRoute)}>
          <LogoHorizontal className="h-10 -ml-2 w-auto" variant="dark" />
        </div>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="flex items-center justify-center size-10 rounded-full bg-white shadow-sm text-teal-700 hover:bg-teal-700 hover:text-white transition-colors"
          aria-label="Menu"
        >
          {mobileOpen ? <XMarkIcon className="size-5" /> : <Bars3Icon className="size-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 z-50 mx-3 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-sm shadow-xl p-4 flex flex-col gap-2">
          {/* Home */}
          <button onClick={() => { navigate(homeRoute); setMobileOpen(false); }}
            className={cn("flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-colors",
              isHomeRoute ? "bg-teal-700 text-white" : "text-slate-700 hover:bg-slate-100")}>
            <HomeIcon className="size-4" /> Início
          </button>

          {/* Nav items */}
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            const ItemIcon = item.icon;
            return (
              <button key={item.id} onClick={() => handleNavigate(item)}
                className={cn("flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-colors",
                  isActive ? "bg-teal-700 text-white" : "text-slate-700 hover:bg-slate-100")}>
                <ItemIcon className="size-4" />
                {item.label}
              </button>
            );
          })}

          <div className="border-t border-slate-100 mt-1 pt-2 flex gap-2">
            <button onClick={() => { navigate("/settings"); setMobileOpen(false); }}
              className={cn("flex flex-1 items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors",
                isSettingsRoute ? "bg-slate-800 text-white" : "text-slate-700 bg-slate-100 hover:bg-slate-200")}>
              <Cog6ToothIcon className="size-4" /> Configurações
            </button>
            <button onClick={() => { logout(); navigate("/"); setMobileOpen(false); }}
              className="flex flex-1 items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
              <ArrowRightOnRectangleIcon className="size-4" /> Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
