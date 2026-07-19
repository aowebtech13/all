"use client";

import { useMemo, useState } from "react";
import { PaylioContext } from "@/context/context";
import { useContext } from "react";
import Image from "next/image";
import axiosInstance from "@/lib/axios";
import Link from "next/link";
import support_icon from "/public/images/icon/support-icon.png";
import send_funds from "/public/images/icon/send-funds.png";
import { calcProjectedPayout } from "./investUtils";

const InvestLevel1 = () => {
  const { activeLefMenu } = useContext(PaylioContext);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const { profit, payout } = useMemo(() => calcProjectedPayout(amount), [amount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post("/invest/level-1", {
        amount: Number(amount),
        level: 1,
        return_percent: 20,
      });

      alert(res?.data?.message || "Investment placed successfully!");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to place investment");
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
              <h4>Investment Plans</h4>
              <div className="icon-area">
                <Image src={support_icon} alt="icon" />
              </div>
            </div>

            <div className="choose-recipient">
             
            </div>

            <div className="row pb-120">
              <div className="col-lg-7 col-md-8">
                <div className="table-area">
                  <div className="invest-card">
                    <div className="invest-card-header">
                      <div className="invest-icon">
                        <Image src={send_funds} alt="invest" width={48} height={48} />
                      </div>
                      <div className="invest-info">
                        <h6>Level 1 Plan</h6>
                        <p>20% guaranteed return on your investment</p>
                      </div>
                    </div>
                    <form action="#" onSubmit={handleSubmit}>
                      <div className="send-banance">
                        <span className="mdr">Investment amount</span>
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
                        <div className="profit-summary">
                          <div className="profit-item">
                            <span className="profit-label">Profit (20%)</span>
                            <span className="profit-value">${profit.toFixed(2)}</span>
                          </div>
                          <div className="profit-item">
                            <span className="profit-label">Projected payout</span>
                            <span className="profit-value highlight">${payout.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="footer-area mt-40">
                        <Link href="/invest/withdraw" className="cmn-btn outline">
                          Withdraw
                        </Link>
                        <button
                          type="submit"
                          className={`cmn-btn ${loading ? "opacity-50" : ""}`}
                          disabled={loading || !(Number(amount) > 0)}>
                          {loading ? "Placing..." : "Invest Now"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div className="col-lg-5 col-md-4">
                <div className="side-area">
                  <div className="side-area-header">
                    <h6>Level 1 Rules</h6>
                  </div>
                  <ul className="deposit-details">
                    <li>
                      <span>Return</span>
                      <b className="text-success">+20%</b>
                    </li>
                    <li>
                      <span>Projected payout</span>
                      <b>${payout.toFixed(2)}</b>
                    </li>
                    <li>
                      <span>Status</span>
                      <b className="text-warning">Pending</b>
                    </li>
                    <li>
                      <span>Min. Investment</span>
                      <b>$500</b>
                    </li>
                  </ul>
                  <div className="side-area-footer">
                    <p>Investments are processed within 24 hours. Returns are credited to your account upon maturity.</p>
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

export default InvestLevel1;
