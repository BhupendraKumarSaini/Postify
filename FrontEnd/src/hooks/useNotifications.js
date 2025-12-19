import { useEffect, useState } from "react";
import { getNotifications } from "../services/notification";

const useNotifications = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  const load = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUnreadCount(0);
        return;
      }

      const data = await getNotifications();
      const unread = Array.isArray(data)
        ? data.filter((n) => !n.read).length
        : 0;

      setUnreadCount(unread);
    } catch {
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    load();

    // 🔁 listen for updates
    const handler = () => load();
    window.addEventListener("notifications:update", handler);

    return () => window.removeEventListener("notifications:update", handler);
  }, []);

  return unreadCount;
};

export default useNotifications;
