"use client";

import Image from "next/image";
import Link from "next/link";
import deposit_icon from "/public/images/icon/deposit.png";
import withdraw_icon from "/public/images/icon/withdraw.png";
import right_arrow from "/public/images/icon/right-arrow.png";

const DepositWithdrawSummary = ({ dashboardData, loading }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: date.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })
    };
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="row mt-40">
      {/* Deposits Summary */}
      

      {/* Withdrawals Summary */}
     
    </div>
  );
};

export default DepositWithdrawSummary;
