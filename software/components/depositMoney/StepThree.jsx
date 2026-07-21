"use client";
import { PaylioContext } from "@/context/context";
import Image from "next/image";
import Link from "next/link";
import { useContext, useMemo, useState } from "react";
import support_icon from "/public/images/icon/support-icon.png";
import { useAuth } from "@/hooks/useAuth";
import axiosInstance from "@/lib/axios";
import DepositReceiptUpload from "./DepositReceiptUpload";


const bankNames = {
  credem: "Credito Emiliano (Credem)",
  "Fineco": "Fineco Popolare di Sondrio",
  "Intesa Sanpaolo": "Intesa",
  "banco-desio-brianza": "Banco di Desio e della Brianza",
  illimity: "Illimity Bank",
  unicredit: "UniCredit",
  "ing-italia": "ING Italia",
};

const StepThree = () => {
  const { activeLefMenu, depositData } = useContext(PaylioContext);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");

  const selectedBank = bankNames[depositData?.bank] || "No bank selected";

  const amountNumber = useMemo(() => {
    const n = Number(depositData?.amount);
    return Number.isFinite(n) ? n : 0;
  }, [depositData?.amount]);

  const currency = depositData?.currency || "USD";

  // Simple placeholder fee logic (can be replaced with backend source-of-truth)
  const feeNumber = useMemo(() => {
    if (!amountNumber) return 0;
    // Fee = 1 unit in selected currency, but never exceed amount.
    return Math.min(1, amountNumber);
  }, [amountNumber]);

  const receiveNumber = useMemo(() => {
    return Math.max(0, amountNumber - feeNumber);
  }, [amountNumber, feeNumber]);

  const formatMoney = (value) => {
    // Fallback formatting for currencies that may not be supported by Intl fully.
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
        maximumFractionDigits: 2,
      }).format(value);
    } catch {
      return `${value.toFixed(2)} ${currency}`;
    }
  };

  const email = user?.email || "-";
  const [proofFile, setProofFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accepted) {
      setError("Please accept the terms of use.");
      return;
    }
    if (!proofFile) {
      setError("Upload your deposit receipt screenshot before submitting.");
      return;
    }

    const MAX_SIZE_BYTES = 2 * 1024 * 1024;
    if (!proofFile.type?.startsWith("image/")) {
      setError("Only image files are allowed (PNG/JPG/GIF)." );
      return;
    }
    if (proofFile.size > MAX_SIZE_BYTES) {
      setError("File too large. Max allowed is 2MB.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("amount", Number(amountNumber));
      formData.append("method", selectedBank);
      formData.append(
        "description",
        `Deposit via ${selectedBank} | Currency: ${currency}`
      );
      formData.append("receipt", proofFile);

      const res = await axiosInstance.post("/api/deposit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });


      // Open the success modal — the deposit is now pending admin approval.
      const modalEl = document?.getElementById("congratulationsMod");
      if (modalEl && window?.bootstrap?.Modal) {
        const modal = new window.bootstrap.Modal(modalEl);
        modal.show();
      } else if (modalEl) {
        modalEl.classList.add("show");
        modalEl.style.display = "block";
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit deposit request");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className={`dashboard-section ${
        activeLefMenu ? "body-collapse" : ""
      } pay step step-3 crypto deposit-money`}>
      
      

      <div className="overlay pt-120">
        <div className="container-fruid">
          <div className="main-content">
            <div className="head-area d-flex align-items-center justify-content-between">
              <h4>Deposit Money</h4>
              <div className="icon-area">
                <Image src={support_icon} alt="icon" />
              </div>
            </div>
            <div className="row justify-content-between pb-120">
              <div className="col-xl-3 col-lg-4">
                <div className="left-area">
                  <ul>
                    <li>
                      <Link
                        href="/deposit-money/step-1"
                        className="single-link active">
                        Choose Payment Method
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/deposit-money/step-2"
                        className="single-link active">
                        Enter amount
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/deposit-money/step-3"
                        className="single-link active last">
                        Confirm Order
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xl-8 col-lg-8">
                <form action="#" onSubmit={handleSubmit}>
                  <div className="payment-details">
                    <div className="top-area">
                      <h6>Confirm account & amount</h6>
                      <div className="right">
                        <Link href="/deposit-money/step-2">
                          <i className="icon-h-edit"></i>
                          Edit
                        </Link>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-xxl-8 col-xl-9 col-lg-12">
                         <ul className="details-list">

                          <li>
                            <span>Bank</span>
                            <b>{selectedBank}</b>
                          </li>
                          <li>
                            <span>You will receive</span>
                            <b>{formatMoney(receiveNumber)}</b>
                          </li>
                          <li>
                            <span>Fee</span>
                            <b>{formatMoney(feeNumber)}</b>
                          </li>
                          <li>
                            <span>E-mail</span>
                            <b>{email}</b>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 18 }}>
                    <DepositReceiptUpload
                      value={proofFile}
                      onChange={setProofFile}
                      error={error}
                    />
                  </div>

                  <div className="checkbox-area mt-40 d-flex align-items-center justify-content-center">
                    <input
                      type="checkbox"
                      id="accept"
                      name="accept"
                      checked={accepted}
                      onChange={(e) => setAccepted(e.target.checked)}
                    />
                    <label htmlFor="accept">
                      I accept <Link href="#">terms of use</Link>
                    </label>
                  </div>

                  {error && (
                    <p className="text-danger text-center mt-3 mb-0">{error}</p>
                  )}

                  <div className="footer-area mt-40">
                    <Link href="/deposit-money/step-2">Previous Step</Link>
                    <button
                      type="submit"
                      className={`active ${loading ? "opacity-50" : ""}`}
                      disabled={loading || !accepted}>
                      {loading ? "Submitting..." : "Submit Deposit"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StepThree;
