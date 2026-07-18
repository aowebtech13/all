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
};

const StepThree = () => {
  const { activeLefMenu, withdrawData } = useContext(PaylioContext);
  const selectedBank = bankNames[withdrawData.bank] || "No bank selected";
  const amount = withdrawData.amount || "0.00";
  const currency = withdrawData.currency || "EUR";
  return (
    <section
      className={`dashboard-section ${
        activeLefMenu ? "body-collapse" : ""
      } pay step step-3 deposit-money withdraw-money`}>
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
                <span className="mdr">Step 3 of 3</span>
                <h5>Set Amount of transfer</h5>
              </div>
            </div>
            <div className="row pb-120">
              <div className="col-lg-8 col-md-10">
                <form action="#">
                  <div className="payment-details">
                    <div className="top-area">
                      <h6>Confirm account & amount</h6>
                      <div className="right">
                        <Link href="#">
                          <i className="icon-h-edit"></i> Edit{" "}
                        </Link>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-xxl-8 col-xl-10 col-12">
                        <ul className="details-list">
                          <li>
                            <span>Bank</span>
                            <b>{selectedBank}</b>
                          </li>
                          <li>
                            <span>Account</span>
                            <b>**** **** **** 1182</b>
                          </li>
                          <li>
                            <span>You will receive</span>
                            <b>{amount} {currency}</b>
                          </li>
                          <li>
                            <span>Fee</span>
                            <b>1 {currency}</b>
                          </li>
                          <li>
                            <span>E-mail</span>
                            <b>felicia.reid@example.com</b>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="checkbox-area mt-40 d-flex align-items-center justify-content-center">
                    <input type="checkbox" id="accept" name="accept" />
                    <label htmlFor="accept">
                      I accept <Link href="#">terms of use</Link>
                    </label>
                  </div>
                  <div className="footer-area mt-40">
                    <Link href="/withdraw-money/step-2">Previous Step</Link>
                    <Link
                      href="#"
                      className="active"
                      data-bs-toggle="modal"
                      data-bs-target="#congratulationsMod">
                      Next
                    </Link>
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
