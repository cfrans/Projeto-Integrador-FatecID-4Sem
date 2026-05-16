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

const NAVBAR_CONTAINER_CLASS =
  "relative z-20 flex w-full flex-wrap items-center justify-between gap-4 bg-transparent px-4 py-4";

const NAVIGATION_MENU_CLASS =
  "order-3 w-full lg:order-none lg:w-auto flex justify-center";

const NAVIGATION_MENU_LIST_CLASS =
  "relative flex max-w-full flex-nowrap gap-1 overflow-x-auto rounded-full border border-slate-300 bg-slate-100 px-3 py-1 shadow-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

const ACTIONS_CONTAINER_CLASS = "flex items-center gap-2 shrink-0";

const SIDE_BUTTON_BASE =
  "size-11 cursor-pointer rounded-full shadow-sm transition-colors duration-200";

const SIDE_BUTTON_IDLE = "bg-white text-teal-700";
const SIDE_BUTTON_HOVER = "!bg-teal-700 !text-white";
const SIDE_BUTTON_ACTIVE = "!bg-teal-700 !text-white";

const MENU_ITEM_BASE_CLASS =
  "relative z-10 flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-2 text-sm font-black uppercase tracking-[0.02em] whitespace-nowrap hover:bg-transparent focus:bg-transparent [&_svg]:text-teal-700 [&_span]:text-[#0b2437]";

const MENU_ITEM_ACTIVE_CLASS =
  "!bg-teal-700 !text-white shadow-sm [&_svg]:!text-white [&_span]:!text-white";

const MENU_ITEM_IDLE_CLASS = "text-black";

// ── Itens de navegação por role ───────────────────────────────────────────────
const NAV_ITEMS_ADMIN = [
  {
    id: "campaigns",
    label: "Campanhas",
    path: "/create",
    icon: DocumentPlusIcon,
  },
  {
    id: "models",
    label: "Modelos",
    path: "/models",
    icon: RectangleStackIcon,
  },
  {
    id: "graphics",
    label: "Gráficos",
    path: "/graphics",
    icon: ChartBarIcon,
  },
  {
    id: "users",
    label: "Usuários",
    path: "/users",
    icon: UsersIcon,
  },
  {
    id: "about",
    label: "Sobre",
    path: "/about",
    icon: InformationCircleIcon,
  },
];

const NAV_ITEMS_USER = [
  {
    id: "quiz",
    label: "Quiz",
    path: "/quiz",
    icon: QuestionMarkCircleIcon,
  },
  {
    id: "conteudos",
    label: "Conteúdos",
    path: "/conteudos",
    icon: PlayIcon,
  },
  {
    id: "meus-graficos",
    label: "Meu Desempenho",
    path: "/meus-graficos",
    icon: ChartPieIcon,
  },
];

const PATH_TO_ID_ADMIN = {
  "/create": "campaigns",
  "/models": "models",
  "/graphics": "graphics",
  "/users": "users",
  "/about": "about",
  "/settings": "settings",
};

const PATH_TO_ID_USER = {
  "/quiz": "quiz",
  "/conteudos": "conteudos",
  "/meus-graficos": "meus-graficos",
  "/settings": "settings",
};

// ── Componente ────────────────────────────────────────────────────────────────
export default function AppNavbar({ activePage, onNavigate }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  // Determina se o usuário atual é admin
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

    if (!onNavigate) {
      navigate(item.path);
    }
  };

  // ── Hover dos botões circulares ────────────────────────────────────────────
  const [hoveredBtn, setHoveredBtn] = useState(null);

  const circleBtnClass = (id, isActive = false) =>
    cn(
      SIDE_BUTTON_BASE,
      isActive
        ? SIDE_BUTTON_ACTIVE
        : hoveredBtn === id
        ? SIDE_BUTTON_HOVER
        : SIDE_BUTTON_IDLE
    );

  // ── Efeito slide hover da pill ─────────────────────────────────────────────
  const [highlight, setHighlight] = useState({
    visible: false,
    left: 0,
    width: 0,
  });

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
    setHighlight((prev) => ({
      ...prev,
      visible: false,
    }));
  };

  return (
  <div className={NAVBAR_CONTAINER_CLASS}>
    {/* Esquerda: Logo + Home */}
    <div className="flex items-center gap-1.5 shrink-0">
      <div
        className="cursor-pointer transition-opacity hover:opacity-80 flex items-center"
        onClick={() => navigate(homeRoute)}
        title="Ir para o Início"
      >
        <LogoHorizontal className="h-14.5 -ml-3 w-auto" variant="dark" />
      </div>

      <Button
        type="button"
        variant="secondary"
        size="icon-sm"
        className={circleBtnClass("home", isHomeRoute)}
        onMouseEnter={() => setHoveredBtn("home")}
        onMouseLeave={() => setHoveredBtn(null)}
        onClick={() => navigate(homeRoute)}
        title="Início"
      >
        <HomeIcon className={ICON_CLASS} />
      </Button>
    </div>

    {/* Centro: Navbar */}
    <div className="flex-1 flex justify-center min-w-0 order-3 lg:order-none">
      <NavigationMenu className="w-full lg:w-auto flex justify-center">
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
              transition:
                "left 0.25s cubic-bezier(0.4,0,0.2,1), width 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.15s ease",
            }}
          />

          {navItems.map((item) => {
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
                    isActive
                      ? MENU_ITEM_ACTIVE_CLASS
                      : MENU_ITEM_IDLE_CLASS
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
    </div>

    {/* Direita: Config + Logout */}
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
        title="Configurações"
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
        onClick={() => {
          logout();
          navigate("/");
        }}
        title="Sair"
      >
        <ArrowRightOnRectangleIcon className={ICON_CLASS} />
      </Button>
    </div>
  </div>
);
}