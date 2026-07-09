import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

// Styled SweetAlert2 for delete confirmation
export const confirmDelete = (title: string, text: string) => {
  return MySwal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#b51c00",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Xác nhận",
    cancelButtonText: "Hủy",
    reverseButtons: true,
    customClass: {
      popup: "rounded-xl",
      confirmButton: "rounded-lg font-semibold px-6 py-2.5",
      cancelButton: "rounded-lg font-semibold px-6 py-2.5",
    },
  });
};

// Styled SweetAlert2 for restore confirmation
export const confirmRestore = (title: string, text: string) => {
  return MySwal.fire({
    title,
    text,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#ec4899",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Khôi phục",
    cancelButtonText: "Hủy",
    reverseButtons: true,
    customClass: {
      popup: "rounded-xl",
      confirmButton: "rounded-lg font-semibold px-6 py-2.5",
      cancelButton: "rounded-lg font-semibold px-6 py-2.5",
    },
  });
};

// Styled SweetAlert2 for permanent delete confirmation
export const confirmPermanentDelete = (title: string, text: string) => {
  return MySwal.fire({
    title,
    text,
    icon: "error",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Xóa vĩnh viễn",
    cancelButtonText: "Hủy",
    reverseButtons: true,
    customClass: {
      popup: "rounded-xl",
      confirmButton: "rounded-lg font-semibold px-6 py-2.5",
      cancelButton: "rounded-lg font-semibold px-6 py-2.5",
    },
  });
};
