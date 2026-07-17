"use client";
import Image from "next/image";
import Link from "next/link";
import right_arrow from "/public/images/icon/right-arrow.png";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";

const TransactionTabel = ({ transactions = [], loading, refreshData }) => {
  useEffect(() => {
    // Refresh every 5 minutes (300,000 ms)
    const intervalId = setInterval(() => {
      refreshData?.();
    }, 300000);

    return () => clearInterval(intervalId);
  }, [refreshData]);


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

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'completed';
      case 'pending': return 'pending';
      case 'inprogress': return 'inprogress';
      case 'failed':
      case 'cancelled': return 'cancelled';
      default: return '';
    }
  };

  return (
    <>
      <div className="section-text">
        <h5>Transactions</h5>
        <p>Updated every several minutes</p>
      </div>
      <div className="top-area d-flex align-items-center justify-content-between">
        <ul className="nav nav-tabs" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className="nav-link active"
              id="latest-tab"
              data-bs-toggle="tab"
              data-bs-target="#latest"
              type="button"
              role="tab"
              aria-controls="latest"
              aria-selected="true">
              Latest
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="upcoming-tab"
              data-bs-toggle="tab"
              data-bs-target="#upcoming"
              type="button"
              role="tab"
              aria-controls="upcoming"
              aria-selected="false">
              Upcoming
            </button>
          </li>
        </ul>
        <div className="view-all d-flex align-items-center">
          <Link href="/transactions">View All</Link>
          <Image src={right_arrow} alt="icon" />
        </div>
      </div>
      <div className="tab-content mt-40">
        <div
          className="tab-pane fade show active"
          id="latest"
          role="tabpanel"
          aria-labelledby="latest-tab">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Name/ Business</th>
                  <th scope="col">Date</th>
                  <th scope="col">Status</th>
                  <th scope="col">Amount</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center p-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center p-5">No transactions found</td>
                  </tr>
                ) : (
                  transactions.map((transaction) => {
                    const formattedDate = formatDate(transaction.created_at);
                    return (
                      <tr key={transaction.id} data-bs-toggle="modal" data-bs-target="#transactionsMod">
                        <th scope="row">
                          <p>{transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</p>
                          <p className="mdr">{transaction.description || (transaction.method ? `Via ${transaction.method}` : '')}</p>
                        </th>
                        <td>
                          <p>{formattedDate.time}</p>
                          <p className="mdr">{formattedDate.date}</p>
                        </td>
                        <td>
                          <p className={getStatusClass(transaction.status)}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </p>
                        </td>
                        <td>
                          <p>{formatCurrency(transaction.amount)}</p>
                          <p className="mdr">No Fees</p>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div
          className="tab-pane fade"
          id="upcoming"
          role="tabpanel"
          aria-labelledby="upcoming-tab">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Name/ Business</th>
                  <th scope="col">Date</th>
                  <th scope="col">Status</th>
                  <th scope="col">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="4" className="text-center p-5">No upcoming transactions</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionTabel;
