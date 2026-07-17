import Image from "next/image";
import Link from "next/link";
import { FaCaretRight } from "react-icons/fa";
import { useContext } from "react";
import { PaylioContext } from "@/context/context";
import bell from "/public/images/icon/bell.png";
const user_1 = "/images/user-1.png";

const NotificationsArea = () => {
  const { notifications, unreadCount, setUnreadCount, fetchNotifications } = useContext(PaylioContext);

  const handleMarkAsRead = async () => {
    if (unreadCount === 0) return;
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || '';
      const response = await fetch(`${baseUrl}/api/notifications/mark-as-read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        }
      });
      if (response.ok) {
        setUnreadCount(0);
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  return (
    <div className="single-item notifications-area">
      <div
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
        className="notifications-btn dropdown"
        onClick={handleMarkAsRead}>
        <Image src={bell} className="bell-icon" alt="icon" />
        {unreadCount > 0 && (
            <span className="badge bg-danger position-absolute top-0 start-100 translate-middle badge-pill" style={{ fontSize: '0.6rem' }}>
                {unreadCount}
            </span>
        )}
      </div>
      <div
        aria-labelledby="dropdownMenuButton"
        onClick={(e) => e.nativeEvent.stopImmediatePropagation()}
        className={`main-area dropdown-menu notifications-content`}>
        <div className="head-area d-flex justify-content-between">
          <h5>Notifications</h5>
          <span className="mdr">{unreadCount}</span>
        </div>
        <ul>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <li key={notification.id} className={notification.read_at ? "" : "unread-notification"}>
                <Link href="#" className="d-flex">
                  <div className="img-area">
                    <Image src={user_1} className="max-un" alt="image" />
                  </div>
                  <div className="text-area">
                    <p className="mdr">
                      {notification.data?.message || notification.data?.title || "New notification"}
                    </p>
                    <p className="mdr time-area">
                      {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </Link>
                <FaCaretRight />
              </li>
            ))
          ) : (
            <li className="p-3 text-center">No notifications</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default NotificationsArea;
