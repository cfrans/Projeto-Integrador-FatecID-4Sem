import { useMemo } from "react";
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
  "relative z-20 flex w-full items-center justify-center gap-10 bg-transparent px-2 py-3";
const NAVIGATION_MENU_CLASS = "min-w-0 flex-none justify-center";
const NAVIGATION_MENU_LIST_CLASS =
  "max-w-full flex-nowrap gap-1 overflow-x-auto rounded-full border border-slate-300 bg-slate-100 px-5 py-1 shadow-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";
const ACTIONS_CONTAINER_CLASS = "flex items-center gap-2";
const SIDE_BUTTON_CLASS =
  "size-11 rounded-full bg-white text-teal-700 shadow-sm hover:bg-teal-700 hover:text-white";
const SIDE_BUTTON_ACTIVE_CLASS =
  "!bg-teal-700 !text-white shadow-sm data-[active=true]:!bg-teal-700 data-[active=true]:!text-white [&_svg]:text-white [&_span]:text-white";
const MENU_ITEM_BASE_CLASS =
  "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-black uppercase tracking-[0.02em] whitespace-nowrap transition-colors [&_svg]:text-teal-700 [&_span]:text-black data-[active=true]:!bg-transparent data-[active=true]:!text-black";
const MENU_ITEM_ACTIVE_CLASS =
  "!bg-teal-700 !text-white shadow-sm data-[active=true]:!bg-teal-700 data-[active=true]:!text-white [&_svg]:text-white [&_span]:text-white";
const MENU_ITEM_IDLE_CLASS = "text-black hover:bg-teal-700 hover:[&_svg]:text-white hover:[&_span]:text-white";

const NAV_ITEMS = [
  {
    id: "campaigns",
    label: "Criar Campanha",
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
    label: "Graficos",
    path: "/graphics",
    icon: ChartBarIcon,
  },
  {
    id: "users",
    label: "Usuarios",
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
  const isHomeRoute = location.pathname === "/home";
  const isSettingsRoute = location.pathname === "/settings";

  const currentPage = useMemo(() => {
    if (activePage) return activePage;
    return PATH_TO_ID[location.pathname] ?? null;
  }, [activePage, location.pathname]);

  const handleNavigate = (item) => {
    onNavigate?.(item.id);
    if (!onNavigate) {
      navigate(item.path);
    }
  };

  return (
    <div className={NAVBAR_CONTAINER_CLASS}>
      <Button
        type="button"
        variant="secondary"
        size="icon-sm"
        className={cn(SIDE_BUTTON_CLASS, isHomeRoute && SIDE_BUTTON_ACTIVE_CLASS)}
        onClick={() => navigate("/admin")}
        title="Inicio"
      >
        <HomeIcon className={ICON_CLASS} />
      </Button>

      <NavigationMenu className={NAVIGATION_MENU_CLASS}>
        <NavigationMenuList className={NAVIGATION_MENU_LIST_CLASS}>
          {NAV_ITEMS.map((item) => {
            const isActive = currentPage === item.id;
            const ItemIcon = item.icon;
            return (
              <NavigationMenuItem key={item.id}>
                <NavigationMenuLink
                  href={item.path}
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
        <Button
          type="button"
          variant="secondary"
          size="icon-sm"
          className={cn(SIDE_BUTTON_CLASS, isSettingsRoute && SIDE_BUTTON_ACTIVE_CLASS)}
          onClick={() => navigate("/settings")}
          title="Configuracoes"
        >
          <Cog6ToothIcon className={ICON_CLASS} />
        </Button>

        <Button
          type="button"
          variant="secondary"
          size="icon-sm"
          className={SIDE_BUTTON_CLASS}
          onClick={() => navigate("/")}
          title="Sair"
        >
          <ArrowRightOnRectangleIcon className={ICON_CLASS} />
        </Button>
      </div>
    </div>
  );
}