"use client";

import { useContext, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import { PaylioContext } from "@/context/context";
import support_icon from "/public/images/icon/support-icon.png";
import request_funds from "/public/images/icon/request-funds.png";

const InvestWithdraw = () => {
  const { activeLefMenu } = useContext(PaylioContext);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post("/invest/withdraw", {
        amount: Number(amount),
      });

      alert(res?.data?.message || "Withdrawal request submitted!");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to submit withdrawal");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className={`dashboard-section ${activeLefMenu ? "body-collapse" : ""} invest`}>
      <div className="overlay pt-120">
        <div className="container-fruid">
          <div className="main-content">
            <div className="head-area d-flex align-items-center justify-content-between">
              <h4>Withdraw Investment</h4>
              <div className="icon-area">
                <Image src={support_icon} alt="icon" />
              </div>
            </div>

            <div className="choose-recipient">
            
            </div>

            <div className="row pb-120">
              <div className="col-lg-8 col-md-10">
                <div className="table-area">
                  <div className="invest-card">
                    <div className="invest-card-header">
                      <div className="invest-icon">
                        <Image src={request_funds} alt="withdraw" width={48} height={48} />
                      </div>
                      <div className="invest-info">
                        <h6>Withdraw Funds</h6>
                        <p>Request a withdrawal from your investment portfolio</p>
                      </div>
                    </div>
                    <form action="#" onSubmit={handleSubmit}>
                      <div className="send-banance">
                        <span className="mdr">Withdrawal amount</span>
                        <div className="input-area">
                          <input
                            className="xxlr"
                            placeholder="500.00"
                            type="number"
                            min={0}
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                          />
                          <select disabled>
                            <option value="USD">USD</option>
                          </select>
                        </div>
                        <p className="withdraw-note">
                          <i className="icon-info"></i>
                          Note: Final payout depends on backend processing.
                        </p>
                      </div>

                      <div className="footer-area mt-40">
                        <Link href="/invest/level-1" className="cmn-btn outline">
                          Back to Invest
                        </Link>
                        <button
                          type="submit"
                          className={`cmn-btn ${loading ? "opacity-50" : ""}`}
                          disabled={loading || !(Number(amount) > 0)}>
                          {loading ? "Processing..." : "Submit Withdrawal"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestWithdraw;
