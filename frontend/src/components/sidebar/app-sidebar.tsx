import * as React from "react";
import {
  FileText,
  Frame,
  Home,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Users,
  Utensils,
} from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Quản Lý Món Ăn",
      url: "#",
      icon: Utensils,
      items: [
        {
          title: "Danh mục sản phẩm",
          url: "#",
        },
        {
          title: "Sản phẩm",
          url: "#",
        },
      ],
    },
    {
      title: "Quản Lý Bài Viết",
      url: "#",
      icon: FileText,
      items: [
        {
          title: "Danh mục bài viết",
          url: "#",
        },
        {
          title: "Bài viết",
          url: "#",
        },
      ],
    },
    {
      title: "Quản lý khác",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "Quản lý khuyến mãi",
          url: "#",
        },
      ],
    },
    {
      title: "Quản Lý Tài Khoản",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Tài khoản",
          url: "#",
        },
      ],
    },
    {
      title: "Quản Lý Đơn Hàng",
      url: "#",
      icon: ShoppingCart,
      items: [
        {
          title: "Đơn hàng",
          url: "#",
        },
      ],
    },
    {
      title: "Quản Lý Vai Trò",
      url: "#",
      icon: ShieldCheck,
      items: [
        {
          title: "Phân quyền",
          url: "#",
        },
        {
          title: "Vai trò",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <a href="/admin/dashboard">
              <div className="flex justify-center items-center">
                <img
                  className="w-[80px] h-[80px] object-cover"
                  src="/logo.png"
                  alt="Đặc Sản Ba Miền"
                />
              </div>
            </a>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="pb-0">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard" isActive={true}>
                <a href="/admin/dashboard">
                  <Home />
                  <span>Dashboard</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
