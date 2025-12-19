import API from "./api";

/* GET NOTIFICATIONS */
export const getNotifications = async () => {
  const res = await API.get("/notifications");
  return res.data;
};

/* MARK SINGLE AS READ */
export const markNotificationRead = async (id) => {
  const res = await API.patch(`/notifications/${id}/read`);
  return res.data;
};

/* MARK ALL AS READ */
export const markAllNotificationsRead = async () => {
  const res = await API.put("/notifications/read");
  return res.data;
};
