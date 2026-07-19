"use client";

import { usePathname } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import { useState, useEffect, createContext } from "react";
import { useAuth } from "@/hooks/useAuth";

const PaylioContext = createContext();

const PaylioProvider = ({ children }) => {
  const { user } = useAuth();
  const path = usePathname();

  const [activeLefMenu, setActiveLefMenu] = useState(true);
  const [getPath, setGetPath] = useState("/");

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [recipients, setRecipients] = useState([]);

  // Dynamic menu/capabilities state (backend-secured)
  // enabled.pay === true means the user is NOT email-verified (show Pay/verify card)
  const [menuState, setMenuState] = useState({
    allowed: true,
    enabled: {
      dashboard: true,
      transactions: true,
      pay: true,
      receive: true,
      loans: true,
      recipients: true,
      depositMoney: true,
      withdrawMoney: true,
    },
  });

  // Recipients (user-specific)
  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        if (!user?.email_verified_at) return;

        const axios = (await import("@/lib/axios")).default;
        const response = await axios.get("/api/recipients");
        setRecipients(response.data?.recipients || []);
      } catch (error) {
        // Avoid noisy console spam when the only reason is “deposit required” (HTTP 402)
        if (error?.response?.status === 402) {
          setRecipients([]);
          return;
        }
        console.error("Error fetching recipients:", error);
        setRecipients([]);
      }
    };

    fetchRecipients();
  }, [user]);




  const [exchangeData, setExchangeData] = useState({


    fromCurrency: "USD",
    toCurrency: "BDT",
    fromAmount: 0,
    toAmount: 0,
    rate: 0,
    fee: 0,
    totalToPay: 0,
    recipient: null,
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postcode: "",
    phone: "",
    bankName: "",
    accountNumber: "",
    loanReason: "",
    email: "",
  });

  const [depositData, setDepositData] = useState({
    amount: "",
    currency: "USD",
    method: "Paystack",
  });

  const [withdrawData, setWithdrawData] = useState({
    bank: "",
    amount: "",
    currency: "USD",
    account: "",
  });

  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const isDesktopOrLaptop = useMediaQuery({ query: "(max-width: 1399px)" });

  const fetchNotifications = async () => {
    try {
      const axios = (await import("@/lib/axios")).default;
      const response = await axios.get("/api/notifications");

      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unread_count || 0);
    } catch (error) {
      // 402 is expected when user hasn't confirmed deposit
      if (error?.response?.status === 402) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }
      console.error("Error fetching notifications:", error);
    }
  };

  // Dynamic sidebar state based on backend-authenticated user state.
  // Only uses GET /api/user semantics from backend: ensure.email.verified is required for most actions.
  useEffect(() => {
    if (!user) return;

    const verified = Boolean(user?.email_verified_at);

    if (!verified) {
      setMenuState({
        allowed: true,
        enabled: {
          dashboard: true,
          transactions: false,
          pay: true, // show verification card
          receive: false,
          loans: false,
          recipients: false,
          depositMoney: false,
          withdrawMoney: false,
        },
      });
      return;
    }

    setMenuState({
      allowed: true,
      enabled: {
          dashboard: true,
          transactions: true,
          pay: false, // hide verification card
          receive: true,
          loans: true,
          recipients: true,
          depositMoney: true,
          withdrawMoney: true,
          invest: true,
        },
      });
  }, [user]);


  // Notifications for dashboard (guarded)
  useEffect(() => {
    const isDashboard = path === "/dashboard" || path?.startsWith("/dashboard/");
    const isLoggedIn = !!user && !!user.email_verified_at;

    if (isLoggedIn && isDashboard) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user, path]);

  // Sidebar responsiveness
  useEffect(() => {
    setActiveLefMenu(!isDesktopOrLaptop);
  }, [isDesktopOrLaptop]);

  // Sync breadcrumb/active route tracker path string
  useEffect(() => {
    if (path === "/") {
      setGetPath("/");
    } else {
      setGetPath(path?.split("/")[1]);
    }
  }, [path]);

  return (
  <PaylioContext.Provider
    value={{
      activeLefMenu,
      setActiveLefMenu,
      getPath,
      notifications,
      setNotifications,
      unreadCount,
      setUnreadCount,
      fetchNotifications,
      exchangeData,
      setExchangeData,
      depositData,
      setDepositData,
      withdrawData,
      setWithdrawData,
      recipients,
      setRecipients,
      menuState,
      setMenuState,
      selectedTransaction,
      setSelectedTransaction,
    }}
  >
      {children}
    </PaylioContext.Provider>
  );
};

export { PaylioContext, PaylioProvider };

