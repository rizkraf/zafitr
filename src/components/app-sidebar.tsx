import * as React from "react";
import {
  BookUser,
  Grip,
  HandCoins,
  HandHeart,
  HeartHandshake,
  History,
  House,
  Ruler,
  SmilePlus,
  UserRound,
} from "lucide-react";

import { NavMain } from "~/components/nav-main";
import { NavZakat } from "~/components/nav-zakat";
import { NavUser } from "~/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import Link from "next/link";
import { NavMasterData } from "./nav-master-data";

const data = {
  navMain: [
    {
      title: "Beranda",
      url: "/",
      icon: House,
    },
  ],
  navZakat: [
    {
      title: "Penerimaan Zakat",
      url: "#",
      icon: HeartHandshake,
    },
    {
      title: "Distribusi Zakat",
      url: "#",
      icon: HandCoins,
    },
    {
      title: "Muzakki",
      url: "/muzakki",
      icon: BookUser,
    },
    {
      title: "Mustahik",
      url: "/mustahik",
      icon: UserRound,
    },
  ],
  navMasterData: [
    {
      title: "Kategori Muzakki",
      url: "/muzakki-category",
      icon: HandHeart,
    },
    {
      title: "Kategori Mustahik",
      url: "#",
      icon: SmilePlus,
    },
    {
      title: "Periode Zakat",
      url: "#",
      icon: History,
    },
    {
      title: "Unit Zakat",
      url: "#",
      icon: Ruler,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Grip className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Zafitr</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavZakat zakats={data.navZakat} />
        <NavMasterData masterData={data.navMasterData} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}