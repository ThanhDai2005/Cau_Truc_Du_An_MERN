import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const DashboardPage = () => {
  return (
    <>
      <header className="flex items-center h-16 gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Admin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-col gap-4 p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-40 rounded-xl bg-muted/50" />
          <div className="h-40 rounded-xl bg-muted/50" />
          <div className="h-40 rounded-xl bg-muted/50" />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
