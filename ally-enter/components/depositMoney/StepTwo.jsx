"use client";
import { PaylioContext } from "@/context/context";
import { useAuth } from "@/hooks/useAuth";
import axios from "@/lib/axios";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useMemo, useState } from "react";
import support_icon from "/public/images/icon/support-icon.png";

const StepTwo = () => {
  const { activeLefMenu, depositData, setDepositData } = useContext(PaylioContext);
  const { user } = useAuth();
  const [balance, setBalance] = useState(null);

  const [amount, setAmount] = useState(depositData?.amount ?? '');
  const [currency, setCurrency] = useState(depositData?.currency ?? 'USD');


  useEffect(() => {
    // Prefer backend-provided user from useAuth; otherwise fetch dedicated balance endpoint.
    const fetchBalance = async () => {
      try {
        if (typeof user?.balance !== "number") {
          // Endpoint may not exist yet; if it fails, we'll fall back to /api/user.
          try {
            const res = await axios.get("/api/deposit-balance");
            setBalance(res.data?.balance ?? null);
            return;
          } catch (_) {
            const res = await axios.get("/api/user");
            setBalance(res.data?.balance ?? null);
            return;
          }
        }
        setBalance(user.balance);
      } catch (e) {
        console.error("Error fetching deposit balance:", e);
      }
    };

    fetchBalance();
  }, [user]);

  useEffect(() => {
    setDepositData((prev) => ({
      ...prev,
      amount,
      currency,
      method: prev?.method || 'Paystack',
    }));
  }, [amount, currency, setDepositData]);


  const formattedBalance = useMemo(() => {
    const amount = typeof balance === "number" ? balance : 0;
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 2,
    }).format(amount);
  }, [balance]);

  return (
    <section
      className={`dashboard-section ${
        activeLefMenu ? "body-collapse" : ""
      } pay step crypto deposit-money`}>
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
              <div className="col-xl-3 col-lg-4 col-md-5">
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
                        className="single-link last">
                        Confirm Order
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xl-8 col-lg-8 col-md-7">
                <div className="table-area">
                  <form action="#">
                    <div className="send-banance">
                      <span className="mdr">How much you want to add?</span>
                      <div className="input-area">
                        <input
                          className="xxlr"
                          placeholder="400.00"
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                        <select
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                        >
                          <option value="USD">USD</option>
                          <option value="GBP">GBP</option>
                          <option value="BDT">BDT</option>
                        </select>

                      </div>
                      <p>
                        Available Balance<b>{formattedBalance}</b>
                      </p>
                      <p>
                        Selected deposit: <b>{amount || 0} {currency}</b>
                      </p>
                    </div>
                  </form>
                </div>
                <div className="footer-area mt-40">
                  <Link href="/deposit-money/step-1">Previous Step</Link>
                  <Link href="/deposit-money/step-3" className="active">
                    Next
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StepTwo;

