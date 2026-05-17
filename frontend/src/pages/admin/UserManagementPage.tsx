import { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { adminService } from "@/services/adminService";
import { toast } from "sonner";

interface UserItem {
  _id: string;
  displayName: string;
  phone: string;
  email: string;
  status: "active" | "inactive";
  roleId?: { _id: string; title: string } | null;
  createdAt: string;
}

const UserManagementPage = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getUsers(currentPage, 10, keyword);
      setUsers(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch {
      toast.error("Loi khi tai danh sach nguoi dung");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers();
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await adminService.updateUser(userId, { status: newStatus });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, status: newStatus as "active" | "inactive" } : u))
      );
      toast.success(`Da ${newStatus === "active" ? "kich hoat" : "vo hieu hoa"} tai khoan`);
    } catch {
      toast.error("Loi khi cap nhat trang thai");
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Ban co chac chan muon xoa nguoi dung nay?")) return;
    try {
      setDeletingId(userId);
      await adminService.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      toast.success("Da xoa nguoi dung");
    } catch {
      toast.error("Loi khi xoa nguoi dung");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <header className="flex items-center h-16 gap-2 px-4 border-b">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/dashboard">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Quan ly nguoi dung</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Quan ly nguoi dung</h1>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">
                search
              </span>
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tim kiem ten, SBT, email..."
                className="pl-10 pr-4 h-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#b51c00]/30 text-sm w-64"
              />
            </div>
            <button
              type="submit"
              className="px-4 h-10 bg-[#b51c00] text-white rounded-lg text-sm font-medium hover:bg-[#8e1400] transition"
            >
              Tim kiem
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="py-20 text-center">
              <span className="material-symbols-outlined text-[48px] text-gray-300">group</span>
              <p className="text-gray-500 mt-2">Khong tim thay nguoi dung nao</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-3">
                      Nguoi dung
                    </th>
                    <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-3 hidden md:table-cell">
                      Lien he
                    </th>
                    <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-3 hidden lg:table-cell">
                      Vai tro
                    </th>
                    <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-3">
                      Trang thai
                    </th>
                    <th className="text-right text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-3">
                      Hanh dong
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{user.displayName}</p>
                          <p className="text-xs text-gray-400 font-mono mt-0.5">
                            #{user._id.slice(-6).toUpperCase()}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <p className="text-sm text-gray-700">{user.phone}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          user.roleId ? "bg-blue-50 text-blue-700" : "bg-gray-50 text-gray-500"
                        }`}>
                          {user.roleId?.title || "Khach hang"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(user._id, user.status)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                            user.status === "active"
                              ? "bg-green-50 text-green-700 hover:bg-green-100"
                              : "bg-red-50 text-red-700 hover:bg-red-100"
                          }`}
                        >
                          {user.status === "active" ? "Hoat dong" : "Bi khoa"}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(user._id)}
                          disabled={deletingId === user._id}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                          title="Xoa nguoi dung"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {deletingId === user._id ? "hourglass_empty" : "delete"}
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg font-medium transition text-sm ${
                  currentPage === page
                    ? "bg-[#b51c00] text-white"
                    : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default UserManagementPage;
