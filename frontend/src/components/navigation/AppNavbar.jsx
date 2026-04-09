import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  DocumentPlusIcon,
  HomeIcon,
  InformationCircleIcon,
  RectangleStackIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const ICON_CLASS = "size-4";

const NAVBAR_CONTAINER_CLASS =
  "relative z-20 flex w-full items-center justify-between gap-4 bg-transparent px-6 py-3";
const NAVIGATION_MENU_CLASS = "min-w-0 flex-none justify-center";
const NAVIGATION_MENU_LIST_CLASS =
  "relative max-w-full flex-nowrap gap-1 overflow-x-auto rounded-full border border-slate-300 bg-slate-100 px-5 py-1 shadow-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";
const ACTIONS_CONTAINER_CLASS = "flex items-center gap-2";

// Estilo base dos botões circulares — sem hover aqui, controlado via state
const SIDE_BUTTON_BASE =
  "size-11 cursor-pointer rounded-full shadow-sm transition-colors duration-200";
const SIDE_BUTTON_IDLE =
  "bg-white text-teal-700";
const SIDE_BUTTON_HOVER =
  "!bg-teal-700 !text-white";
const SIDE_BUTTON_ACTIVE =
  "!bg-teal-700 !text-white";

const MENU_ITEM_BASE_CLASS =
  "relative z-10 flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-2 text-sm font-black uppercase tracking-[0.02em] whitespace-nowrap hover:bg-transparent focus:bg-transparent [&_svg]:text-teal-700 [&_span]:text-[#0b2437]";
const MENU_ITEM_ACTIVE_CLASS =
  "!bg-teal-700 !text-white shadow-sm [&_svg]:!text-white [&_span]:!text-white";
const MENU_ITEM_IDLE_CLASS = "text-black";

const NAV_ITEMS = [
  { id: "campaigns", label: "Criar Campanha", path: "/create", icon: DocumentPlusIcon },
  { id: "models", label: "Modelos", path: "/models", icon: RectangleStackIcon },
  { id: "graphics", label: "Gráficos", path: "/graphics", icon: ChartBarIcon },
  { id: "users", label: "Usuários", path: "/users", icon: UsersIcon },
  { id: "about", label: "Sobre", path: "/about", icon: InformationCircleIcon },
];

const PATH_TO_ID = {
  "/create": "campaigns",
  "/models": "models",
  "/graphics": "graphics",
  "/users": "users",
  "/about": "about",
  "/settings": "settings",
};

export default function AppNavbar({ activePage, onNavigate }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isSettingsRoute = location.pathname === "/settings";
  const isHomeRoute = location.pathname === "/home";

  const currentPage = useMemo(() => {
    if (activePage) return activePage;
    return PATH_TO_ID[location.pathname] ?? null;
  }, [activePage, location.pathname]);

  const handleNavigate = (item) => {
    onNavigate?.(item.id);
    if (!onNavigate) navigate(item.path);
  };

  // ── Hover dos botões circulares ──
  const [hoveredBtn, setHoveredBtn] = useState(null);

  const circleBtnClass = (id, isActive = false) =>
    cn(
      SIDE_BUTTON_BASE,
      isActive ? SIDE_BUTTON_ACTIVE : hoveredBtn === id ? SIDE_BUTTON_HOVER : SIDE_BUTTON_IDLE
    );

  // ── Efeito slide hover da pill ──
  const [highlight, setHighlight] = useState({ visible: false, left: 0, width: 0 });

  const handleMouseEnter = (e) => {
    const item = e.currentTarget;
    const list = item.closest("ul");
    if (!list) return;
    const itemRect = item.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();
    setHighlight({
      visible: true,
      left: itemRect.left - listRect.left,
      width: itemRect.width,
    });
  };

  const handleMouseLeave = () => {
    setHighlight(prev => ({ ...prev, visible: false }));
  };

  return (
    <div className={NAVBAR_CONTAINER_CLASS}>

      {/* Logo — esquerda */}
      <div
        className="shrink-0 cursor-pointer transition-opacity hover:opacity-80"
        onClick={() => navigate("/admin")}
        title="Ir para o Início"
      >
        <img
          src="/src/assets/logo-horizontal-dark.svg"
          alt="Logo"
          className="h-20 -ml-3 mt-7 w-auto"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      </div>

      {/* Nav + ações — direita */}
      <div className="flex items-center gap-2">

        {/* Botão Home */}
        <Button
          type="button"
          variant="secondary"
          size="icon-sm"
          className={circleBtnClass("home", isHomeRoute)}
          onMouseEnter={() => setHoveredBtn("home")}
          onMouseLeave={() => setHoveredBtn(null)}
          onClick={() => navigate("/admin")}
          title="Inicio"
        >
          <HomeIcon className={ICON_CLASS} />
        </Button>

        {/* Pill de navegação */}
        <NavigationMenu className={NAVIGATION_MENU_CLASS}>
          <NavigationMenuList
            className={NAVIGATION_MENU_LIST_CLASS}
            onMouseLeave={handleMouseLeave}
          >
            {/* Highlight deslizante */}
            <div
              aria-hidden
              className="pointer-events-none absolute rounded-full bg-teal-700/10"
              style={{
                top: "50%",
                transform: "translateY(-50%)",
                left: highlight.left,
                width: highlight.width,
                height: "32px",
                opacity: highlight.visible ? 1 : 0,
                transition: "left 0.25s cubic-bezier(0.4,0,0.2,1), width 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.15s ease",
              }}
            />

            {NAV_ITEMS.map((item) => {
              const isActive = currentPage === item.id;
              const ItemIcon = item.icon;
              return (
                <NavigationMenuItem key={item.id}>
                  <NavigationMenuLink
                    href={item.path}
                    onMouseEnter={handleMouseEnter}
                    onClick={(event) => {
                      event.preventDefault();
                      handleNavigate(item);
                    }}
                    className={cn(
                      MENU_ITEM_BASE_CLASS,
                      isActive ? MENU_ITEM_ACTIVE_CLASS : MENU_ITEM_IDLE_CLASS
                    )}
                  >
                    <ItemIcon className={ICON_CLASS} />
                    <span>{item.label}</span>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        <div className={ACTIONS_CONTAINER_CLASS}>
          {/* Botão Configurações */}
          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            className={circleBtnClass("settings", isSettingsRoute)}
            onMouseEnter={() => setHoveredBtn("settings")}
            onMouseLeave={() => setHoveredBtn(null)}
            onClick={() => navigate("/settings")}
            title="Configuracoes"
          >
            <Cog6ToothIcon className={ICON_CLASS} />
          </Button>

          {/* Botão Sair */}
          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            className={circleBtnClass("logout")}
            onMouseEnter={() => setHoveredBtn("logout")}
            onMouseLeave={() => setHoveredBtn(null)}
            onClick={() => navigate("/")}
            title="Sair"
          >
            <ArrowRightOnRectangleIcon className={ICON_CLASS} />
          </Button>
        </div>
      </div>

    </div>
  );
}