import toast from "react-hot-toast";

const normalizeMessage = (message) =>
  typeof message === "string" && message.trim()
    ? message
    : "Something went wrong";

/* SUCCESS */
export const toastSuccess = (message) =>
  toast.success(normalizeMessage(message), {
    icon: "✅",
  });

/* ERROR */
export const toastError = (message) =>
  toast.error(normalizeMessage(message), {
    icon: "❌",
  });

/* LOADING */
export const toastLoading = (message) =>
  toast.loading(normalizeMessage(message));
