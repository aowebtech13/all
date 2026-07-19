"use client";

import { PaylioContext } from "@/context/context";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

import support_icon from "/public/images/icon/support-icon.png";
import bank_icon from "/public/images/icon/bank-account-icon.png";

const banks = [
  { id: "credem", name: "Credito Emiliano" },
  { id: "banca-popolare-sondrio", name: "Banca" },
  { id: "banca-sella", name: "Banca Sella" },
  { id: "banco-desio-brianza", name: "Banco" },
  { id: "illimity", name: "Illimity Bank" },
  { id: "unicredit", name: "UniCredit" },
  { id: "ing-italia", name: "ING Italia" },
];

const StepOne = () => {
  const { activeLefMenu, withdrawData, setWithdrawData } = useContext(PaylioContext);
  const { user } = useAuth();
  const [cardActive, setCardActive] = useState(withdrawData.bank || banks[0].id);
  const [amount, setAmount] = useState(withdrawData.amount || "");
  const [currency, setCurrency] = useState(withdrawData.currency || "USD");
  const [account, setAccount] = useState(withdrawData.account || "");
  const [balance, setBalance] = useState(null);

  // Fetch the user's available balance to guard against over-withdrawal.
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        if (typeof user?.balance === "number") {
          setBalance(user.balance);
          return;
        }
        const axios = (await import("@/lib/axios")).default;
        try {
          const res = await axios.get("/api/deposit-balance");
          setBalance(res.data?.balance ?? null);
        } catch {
          const res = await axios.get("/api/user");
          setBalance(res.data?.balance ?? null);
        }
      } catch (e) {
        console.error("Error fetching balance:", e);
        setBalance(null);
      }
    };
    fetchBalance();
  }, [user]);

  const numericAmount = parseFloat(amount);
  const hasInsufficientBalance = useMemo(() => {
    if (balance === null || isNaN(numericAmount) || numericAmount <= 0) return false;
    return numericAmount > balance;
  }, [balance, numericAmount]);

  const isAccountMissing = account.trim().length === 0;
  const hasError = hasInsufficientBalance || isAccountMissing;

  const onchangeHandler = (e) => {
    setCardActive(e.target.name);
    setWithdrawData((prev) => ({ ...prev, bank: e.target.name }));
  };

  const onAmountChange = (e) => {
    setAmount(e.target.value);
    setWithdrawData((prev) => ({ ...prev, amount: e.target.value }));
  };

  const onCurrencyChange = (e) => {
    setCurrency(e.target.value);
    setWithdrawData((prev) => ({ ...prev, currency: e.target.value }));
  };

  const onAccountChange = (e) => {
    setAccount(e.target.value);
    setWithdrawData((prev) => ({ ...prev, account: e.target.value }));
  };

  const handleNext = (e) => {
    if (hasError) {
      e.preventDefault();
    }
  };

  return (
    <section
      className={`dashboard-section ${
        activeLefMenu ? "body-collapse" : ""
      } pay step deposit-money withdraw-money`}>
      <div className="overlay pt-120">
        <div className="container-fruid">
          <div className="main-content">
            <div className="head-area d-flex align-items-center justify-content-between">
              <h4>Withdraw Funds</h4>
              <div className="icon-area">
                <Image src={support_icon} alt="icon" />
              </div>
            </div>
            <div className="choose-recipient">
              <div className="step-area">
                <span className="mdr">Step 1 of 3</span>
                <h5>Withdrawal Details</h5>
              </div>
            </div>
            <div className="row pb-120">
              <div className="col-md-8">
                <div className="table-area">
                  <div className="head-item">
                    <h6>Select Bank</h6>
                  </div>
                  <div className="card-area d-flex flex-wrap">
                    {banks.map((bank) => (
                      <div className={`bank-card ${cardActive === bank.id ? "selected" : ""}`} key={bank.id}>
                        <input
                          type="radio"
                          name={bank.id}
                          id={bank.id}
                          checked={cardActive === bank.id && true}
                          onChange={onchangeHandler}
                        />
                        <label htmlFor={bank.id}>
                          <span className="bank-card-inner">
                            <span className="bank-icon">
                              <Image src={bank_icon} alt="bank" width={32} height={32} />
                            </span>
                            <span className="bank-name">{bank.name}</span>
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="head-item mt-40">
                    <h6>Account Details</h6>
                    <p className="mdr available-balance">
                      Available balance:{" "}
                      {balance === null
                        ? "—"
                        : `${new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: currency,
                          }).format(balance)} ${currency}`}
                    </p>
                  </div>
                  <form action="#">
                    <div className="single-input mb-3">
                      <label htmlFor="withdrawAccount">
                        Account Number / IBAN <span className="text-danger">*</span>
                      </label>
                      <input
                        id="withdrawAccount"
                        type="text"
                        required
                        className={isAccountMissing ? "is-invalid" : ""}
                        placeholder="Enter your account number or IBAN"
                        value={account}
                        onChange={onAccountChange}
                      />
                      {isAccountMissing && (
                        <p className="text-danger mdr mt-2">
                          Account Number / IBAN is required.
                        </p>
                      )}
                    </div>
                    <div className="send-banance">
                      <span className="mdr">Withdrawal amount</span>
                      <div className="input-area">
                        <input
                          className={`xxlr ${hasInsufficientBalance ? "is-invalid" : ""}`}
                          placeholder="40"
                          type="number"
                          value={amount}
                          onChange={onAmountChange}
                        />
                        <select value={currency} onChange={onCurrencyChange}>
                          
                          <option value="USD">USD</option>
                    
                        </select>
                      </div>
                      {hasInsufficientBalance && (
                        <p className="text-danger mdr mt-2">
                          Insufficient balance. You cannot withdraw more than your
                          available balance of{" "}
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: currency,
                          }).format(balance)}{" "}
                          {currency}.
                        </p>
                      )}
                    </div>
                  </form>
                </div>
                <div className="footer-area mt-40">
                  <Link href="#">Previous Step</Link>
                  <Link
                    href="/withdraw-money/step-2"
                    className={`active ${hasError ? "disabled" : ""}`}
                    onClick={handleNext}
                    aria-disabled={hasError}
                  >
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

export default StepOne;
