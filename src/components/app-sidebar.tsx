import * as React from "react";
import {
  BookUser,
  Grip,
  HandCoins,
  HeartHandshake,
  House,
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
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
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
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
