"use client";

import { useMemo, useState, useContext } from "react";
import Image from "next/image";
import axiosInstance from "@/lib/axios";
import Link from "next/link";
import support_icon from "/public/images/icon/support-icon.png";
import { PaylioContext } from "@/context/context";
import { calcProjectedPayout } from "./investUtils";

const InvestLevel2 = () => {
  const { activeLefMenu } = useContext(PaylioContext);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const { profit, payout } = useMemo(() => calcProjectedPayout(amount), [amount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post("/invest/level-2", {
        amount: Number(amount),
        level: 2,
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
       
              <div className="icon-area">
                <Image src={support_icon} alt="icon" />
              </div>
            </div>

            <div className="choose-recipient">
              <div className="step-area">
                <span className="mdr">20% Returns</span>
                <h5>Choose amount to invest</h5>
              </div>
            </div>

            <div className="row pb-120">
              <div className="col-lg-7 col-md-8">
                <div className="table-area">
                  <form action="#" onSubmit={handleSubmit}>
                    <div className="send-banance">
                      <span className="mdr">Investment amount</span>
                      <div className="input-area">
                        <input
                          className="xxlr"
                          placeholder="1000.00"
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
                      <p>
                        Profit (20%): <b>{profit.toFixed(2)}</b>
                      </p>
                      <p>
                        Projected payout: <b>{payout.toFixed(2)}</b>
                      </p>
                    </div>

                    <div className="footer-area mt-40">
                      <Link href="/invest/withdraw" className="text-center">
                        Withdraw
                      </Link>
                      <button
                        type="submit"
                        className={`active ${loading ? "opacity-50" : ""}`}
                        disabled={loading || !(Number(amount) > 0)}>
                        {loading ? "Placing..." : "Invest Level 2"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="col-lg-5 col-md-4">
                <div className="side-area">
                  <p>Level 2 rules</p>
                  <ul className="deposit-details">
                    <li>
                      <span>Return</span>
                      <b>+20%</b>
                    </li>
                    <li>
                      <span>Projected payout</span>
                      <b>{payout.toFixed(2)}</b>
                    </li>
                    <li>
                      <span>Status</span>
                      <b>Pending</b>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestLevel2;

