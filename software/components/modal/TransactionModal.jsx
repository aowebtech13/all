"use client";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { useContext } from "react";
import { PaylioContext } from "@/context/context";
import transaction_details_icon from "/public/images/icon/transaction-details-icon.png";

const TransactionModal = ({ transaction }) => {
  const { selectedTransaction } = useContext(PaylioContext);
  const data = transaction || selectedTransaction;

  const {
    name = "Transaction",
    date = "",
    amount = 0,
    status = "pending",
    description = "",
    type = "transaction",
    method = "",
    reference = "",
  } = data || {};

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const displayDate = formatDate(date);
  const displayName = name.charAt(0).toUpperCase() + name.slice(1);
  const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);
  const displayAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount || 0);

  // For the modal, we show the amount as total.
  // If there's a method, we can show it as payment description.
  const paymentDescription = description || (method ? `Via ${method}` : "");

  return (
    <div className="transactions-popup">
      <div className="container-fruid">
        <div className="row">
          <div className="col-lg-6">
            <div className="modal fade" id="transactionsMod" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header justify-content-between">
                    <h5>Transaction Details</h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    >
                      {/* <i className="fa-solid fa-xmark"></i> */}

                      <FaTimes className="fs-4" />
                    </button>
                  </div>
                  <div className="main-content">
                    <div className="row">
                      <div className="col-sm-5 text-center">
                        <div className="icon-area">
                          <Image src={transaction_details_icon} alt="icon" />
                        </div>
                        <div className="text-area">
                          <h6>{displayName}</h6>
                          <p>{displayDate}</p>
                          <h3>{displayAmount}</h3>
                          <p className="com">{displayStatus}</p>
                        </div>
                      </div>
                      <div className="col-sm-7">
                        <div className="right-area">
                          <h6>Transaction Details</h6>
                          <ul className="payment-details">
                            <li>
                              <span>Payment Amount</span>
                              <span>{displayAmount}</span>
                            </li>
                            <li>
                              <span>Fee</span>
                              <span>0.00 USD</span>
                            </li>
                            <li>
                              <span>Total Amount</span>
                              <span>{displayAmount}</span>
                            </li>
                          </ul>
                          <ul className="payment-info">
                            <li>
                              <p>Payment From</p>
                              <span className="mdr">{displayName}</span>
                            </li>
                            {paymentDescription && (
                              <li>
                                <p>Payment Description</p>
                                <span className="mdr">{paymentDescription}</span>
                              </li>
                            )}
                            <li>
                              <p>Transaction ID:</p>
                              <span className="mdr">
                                {reference || `#${data?.id || "N/A"}`}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
