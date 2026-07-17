"use client";

import AddCardModal from "@/components/modal/AddCardModal";
import AddRecipientsModal from "@/components/modal/AddRecipientsModal";
import CardModal from "@/components/modal/CardModal";
import CongratulationsModal from "@/components/modal/CongratulationsModal";
import PurchasedModal from "@/components/modal/PurchasedModal";
import RecipientsModal from "@/components/modal/RecipientsModal";
import TransactionModal from "@/components/modal/TransactionModal";
import TransferModal from "@/components/modal/TransferModal";
import NavBar from "@/components/navBar/NavBar";

import { PaylioProvider } from "@/context/context";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// main style
import Footer from "@/components/footer/Footer";
import "../styles/globals.scss";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min");
  }, []);

  return (
    <html lang="en">
      <head>
        <title>
          Enterprise Fund | Leacent
        </title>
        <meta name="description" content="Enterprise Fund  is your gateway to Agency Banking, Money Transfers, and Bill Payments!
" />
        <link rel="icon" href="favicon.ico" />
      </head>
      <body>
        <PaylioProvider>
          <AuthGuard>
          {/* Preloader */}
      

          {/* Common Modals - hide on auth pages */}
          {!pathname?.startsWith('/auth') && (
            <>
              <RecipientsModal />
              <TransferModal />
              <PurchasedModal />
              <CongratulationsModal />
              <AddCardModal />
              <CardModal />
              <TransactionModal />
              <AddRecipientsModal />
            </>
          )}

          {/* Dashboard UI - hide on auth pages */}
          {!pathname?.startsWith('/auth') && (
            <>
              <NavBar />
            </>
          )}

          {children}
          <ToastContainer />

          {/* Footer - hide on auth pages */}
          {!pathname?.startsWith('/auth') && <Footer />}
          </AuthGuard>
        </PaylioProvider>
      </body>
    </html>
  );
}
