"use client";

import { PaylioContext } from "@/context/context";
import dynamic from "next/dynamic";
import { useContext, useEffect, useState } from "react";
import axios from "@/lib/axios";
import Select from "../select/Select";
import AccountDetails from "./AccountDetails";
import LinkedPaymentSystem from "./LinkedPaymentSystem";
import Recipients from "./Recipients";
import TransactionTabel from "./TransactionTabel";
import { useAuth } from "@/hooks/useAuth";


const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const month = [
  { id: 1, name: "Jan" },
  { id: 2, name: "Feb" },
  { id: 3, name: "Mar" },
];

const DashboardMain = () => {
  const { activeLefMenu } = useContext(PaylioContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Query-gated loading: the "verified" redirect landing should feel fast.
  // We still load the dashboard data immediately after paint (see useEffect below).
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const isVerifiedLanding = searchParams?.get('verified') === '1';

  // Keep callback identity stable to avoid re-creating intervals in children.
  const { user } = useAuth();

  const fetchDashboardData = async ({ signal } = {}) => {
    try {
      const response = await axios.get('/api/dashboard-data', { signal });
      setDashboardData(response.data);
    } catch (error) {
      // Ignore abort/cancel errors (navigation / unmount)
      if (error?.name === 'CanceledError' || error?.name === 'AbortError') return;
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Hard gate to avoid calling protected dashboard endpoints during login redirect.
    if (!user?.email_verified_at) return;

    const controller = new AbortController();

    // Defer heavy fetch slightly on verified landing so the UI paints first.
    const t = setTimeout(() => {
      fetchDashboardData({ signal: controller.signal });
    }, isVerifiedLanding ? 50 : 0);

    return () => {
      clearTimeout(t);
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVerifiedLanding, user?.email_verified_at]);




  const options = {
    labels: ["Send", "Receive", "Payment", "Deposit", "Withdraw"],
    dataLabels: {
      enabled: false,
    },
  };
  const series = [44, 55, 13, 33, 22];

  return (
    <section
      className={`dashboard-section ${activeLefMenu ? "body-collapse" : ""}`}>
      <div className="overlay pt-120">
        <div className="container-fruid">
          <div className="row">
            <div className="col-xl-8 col-lg-7">
              <div className="section-content">
                <div className="acc-details">
                  {/* Account Details */}
                  <AccountDetails dashboardData={dashboardData} loading={loading} />
                </div>
                <div className="transactions-area mt-40">
                  {/* Transaction Tabel  */}
                  <TransactionTabel 
                    transactions={dashboardData?.recent_transactions} 
                    loading={loading} 
                    refreshData={fetchDashboardData}
                  />
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-5">
              <div className="side-items">
                <div className="single-item">
                  {/* Linked Payment System */}
                  <LinkedPaymentSystem />
                </div>
                <div className="single-item">
                  <div className="section-text d-flex align-items-center justify-content-between">
                    <h6>Payment Analytics</h6>
                    <div className="select-box">
                      <Select data={month} btn="bg-transparent border" />
                    </div>
                  </div>

                  {/* Chart */}
                  <Chart
                    options={options}
                    series={series}
                    type="donut"
                    width="100%"
                    height={380}
                  />
                </div>

                {/* Recipients */}
                <Recipients />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardMain;
