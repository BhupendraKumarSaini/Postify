import React, { useEffect, useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../services/notification";

/* BUILD MESSAGE */
const buildMessage = (n) => {
  if (!n?.fromUser?.name) return "You have a new notification";

  if (n.type === "like") {
    return `${n.fromUser.name} liked your blog`;
  }

  if (n.type === "comment") {
    return `${n.fromUser.name} commented on your blog`;
  }

  return "You have a new notification";
};

const Notifications = () => {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  let token = null;
  try {
    token = localStorage.getItem("token");
  } catch {
    token = null;
  }

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  /* AUTH + LOAD */
  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const load = async () => {
      try {
        const data = await getNotifications();
        setNotifications(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, navigate]);

  /* CLICK SINGLE */
  const handleClick = async (n) => {
    try {
      if (!n.read) {
        await markNotificationRead(n._id);
        setNotifications((prev) =>
          prev.map((x) => (x._id === n._id ? { ...x, read: true } : x))
        );
      }

      if (n.blog?._id) {
        navigate(`/blogs/${n.blog._id}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* MARK ALL */
  const markAll = async () => {
    if (markingAll) return;

    try {
      setMarkingAll(true);
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    } finally {
      setMarkingAll(false);
    }
  };

  const hasUnread = notifications.some((n) => !n.read);

  return (
    <section className="min-h-[60vh] py-20 px-4 bg-white font-[Poppins]">
      <div className="max-w-3xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-[#064E3B]">
            Notifications
          </h1>

          {hasUnread && (
            <button
              onClick={markAll}
              disabled={markingAll}
              className="text-sm text-[#065F46] hover:underline"
            >
              {markingAll ? "Marking…" : "Mark all as read"}
            </button>
          )}
        </div>

        {/* STATES */}
        {loading && (
          <p className="text-center text-gray-500">Loading notifications...</p>
        )}

        {!loading && notifications.length === 0 && (
          <p className="text-center text-gray-500">No notifications yet.</p>
        )}

        {!loading && notifications.length > 0 && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={reduceMotion ? false : { opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => handleClick(n)}
                className={`
                  p-4 rounded-xl border cursor-pointer transition
                  ${
                    n.read
                      ? "bg-white border-gray-200"
                      : "bg-[#ECFDF5] border-[#065F46]"
                  }
                `}
              >
                <p className="text-sm text-[#064E3B]">{buildMessage(n)}</p>

                {n.blog?.title && (
                  <p className="text-xs text-gray-500 mt-1">{n.blog.title}</p>
                )}

                <p className="text-xs text-gray-400 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default memo(Notifications);
