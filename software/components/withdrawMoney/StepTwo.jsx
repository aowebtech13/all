"use client";
import { PaylioContext } from "@/context/context";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import support_icon from "/public/images/icon/support-icon.png";

const bankNames = {
  credem: "Credito Emiliano (Credem)",
  "banca-popolare-sondrio": "Banca Popolare di Sondrio",
  "banca-sella": "Banca Sella",
  "banco-desio-brianza": "Banco di Desio e della Brianza",
  illimity: "Illimity Bank",
  unicredit: "UniCredit",
  "ing-italia": "ING Italia",
};

const StepTwo = () => {
  const { activeLefMenu, withdrawData } = useContext(PaylioContext);

  const selectedBank = bankNames[withdrawData.bank] || "No bank selected";
  const amount = withdrawData.amount || "0.00";
  const currency = withdrawData.currency || "USD";
  const account = withdrawData.account || "—";

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
                <h5>Review Withdrawal</h5>
              </div>
            </div>
            <div className="row pb-120">
              <div className="col-md-7">
                <div className="table-area">
                  <form action="#">
                    <div className="payment-details">
                      <ul className="details-list">
                        <li>
                          <span>Bank---- </span>
                          <b>{selectedBank}</b>
                        </li>
                        <li>
                          <span>Account--- </span>
                          <b>{account}</b>
                        </li>
                        <li>
                          <span>Amount---- </span>
                          <b>
                            {amount} {currency}
                          </b>
                        </li>
                      </ul>
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
