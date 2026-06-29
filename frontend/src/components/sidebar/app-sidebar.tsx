import * as React from "react";
import {
  FileText,
  Home,
  ShieldCheck,
  ShoppingCart,
  Tag,
  Users,
  Utensils,
} from "lucide-react";
import { useLocation } from "react-router-dom";

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
  navMain: [
    {
      title: "Quản Lý Món Ăn",
      url: "#",
      icon: Utensils,
      items: [
        {
          title: "Danh mục sản phẩm",
          url: "/admin/product-categories",
        },
        {
          title: "Sản phẩm",
          url: "/admin/products",
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
          url: "/admin/blog-categories",
        },
        {
          title: "Bài viết",
          url: "/admin/blogs",
        },
      ],
    },
    {
      title: "Quản Lý Khuyến Mãi",
      url: "#",
      icon: Tag,
      items: [
        {
          title: "Danh sách khuyến mãi",
          url: "/admin/promotions",
        },
      ],
    },
    {
      title: "Quản Lý Tài Khoản",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Danh sách tài khoản",
          url: "/admin/users",
        },
      ],
    },
    {
      title: "Quản Lý Đơn Hàng",
      url: "#",
      icon: ShoppingCart,
      items: [
        {
          title: "Danh sách đơn hàng",
          url: "/admin/orders",
        },
      ],
    },
    {
      title: "Phân Quyền & Vai Trò",
      url: "#",
      icon: ShieldCheck,
      items: [
        {
          title: "Quản lý phân quyền",
          url: "/admin/permissions",
        },
        {
          title: "Quản lý vai trò",
          url: "/admin/roles",
        },
      ],
    },
  ],
};

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const location = useLocation();
  const isDashboardActive = location.pathname === "/admin/dashboard";

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
              <SidebarMenuButton
                asChild
                tooltip="Dashboard"
                isActive={isDashboardActive}
                className={`cursor-pointer transition-all duration-200 hover:bg-sidebar-accent
                  ${
                    isDashboardActive &&
                    "bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-sm"
                  } `}
              >
                <a href="/admin/dashboard" className="flex items-center gap-2">
                  <Home className="shrink-0" />
                  <span>Dashboard</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
};
