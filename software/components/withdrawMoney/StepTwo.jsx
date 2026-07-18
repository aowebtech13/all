"use client";
import { PaylioContext } from "@/context/context";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";
import support_icon from "/public/images/icon/support-icon.png";

const bankNames = {
  credem: "Credito Emiliano (Credem)",
  "banca-popolare-sondrio": "Banca Popolare di Sondrio",
  "banca-sella": "Banca Sella",
  "banco-desio-brianza": "Banco di Desio e della Brianza",
  illimity: "Illimity Bank",
};

const StepTwo = () => {
  const { activeLefMenu, withdrawData, setWithdrawData } = useContext(PaylioContext);
  const [amount, setAmount] = useState(withdrawData.amount || "");
  const [currency, setCurrency] = useState(withdrawData.currency || "EUR");

  const selectedBank = bankNames[withdrawData.bank] || "No bank selected";

  const onAmountChange = (e) => {
    setAmount(e.target.value);
    setWithdrawData((prev) => ({ ...prev, amount: e.target.value }));
  };

  const onCurrencyChange = (e) => {
    setCurrency(e.target.value);
    setWithdrawData((prev) => ({ ...prev, currency: e.target.value }));
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
                <span className="mdr">Step 2 of 3</span>
                <h5>Set Amount of transfer</h5>
              </div>
            </div>
            <div className="row pb-120">
              <div className="col-md-7">
                <div className="table-area">
                  <form action="#">
                    <div className="send-banance">
                      <span className="mdr">Withdraw to: {selectedBank}</span>
                      <div className="input-area">
                        <input
                          className="xxlr"
                          placeholder="400.00"
                          type="number"
                          value={amount}
                          onChange={onAmountChange}
                        />
                        <select value={currency} onChange={onCurrencyChange}>
                          <option value="EUR">EUR</option>
                          <option value="USD">USD</option>
                          <option value="GBP">GBP</option>
                        </select>
                      </div>
                      <p>
                        Available Balance<b>$30,700.00</b>
                      </p>
                    </div>
                  </form>
                </div>
                <div className="footer-area mt-40">
                  <Link href="/withdraw-money/step-1">Previous Step</Link>
                  <Link href="/withdraw-money/step-3" className="active">
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
