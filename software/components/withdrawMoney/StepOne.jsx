"use client";

import { PaylioContext } from "@/context/context";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";
import add_new from "/public/images/add-new.png";
import blockchain_card from "/public/images/blockchain-card.png";
import support_icon from "/public/images/icon/support-icon.png";
import paylio_card from "/public/images/paylio-card.png";
import paypal_card from "/public/images/paypal-card.png";
import visa_card from "/public/images/visa-card.png";

const StepOne = () => {
  const [cardActive, setCardActive] = useState("visa");
  const { activeLefMenu } = useContext(PaylioContext);
  const onchangeHandler = (e) => {
    setCardActive(e.target.name);
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
                <h5>Choose Recipient</h5>
              </div>
              <div className="recipient-list">
                <button className="my-recipients">
                  <span className="icon-area">
                    <i className="icon-f-user"></i>
                  </span>
                  <span>My Recipients</span>
                </button>
                <button data-bs-toggle="modal" data-bs-target="#recipientsMod">
                  <span className="icon-area">
                    <i className="icon-e-plus"></i>
                  </span>
                  <span>New Recipients</span>
                </button>
                <button className="active">
                  <span className="icon-area">
                    <i className="icon-f-user"></i>
                  </span>
                  <span>Send to myself</span>
                </button>
              </div>
            </div>
            <div className="row pb-120">
              <div className="col-md-8">
                <div className="table-area">
                  <div className="head-item">
                    <h6>Linked Payment system</h6>
                  </div>
                  <div className="card-area d-flex flex-wrap">
                    <div className="single-card">
                      <input
                        type="radio"
                        name="visa"
                        id="visa"
                        checked={cardActive === "visa" && true}
                        onChange={onchangeHandler}
                      />
                      <label htmlFor="visa">
                        <span className="wrapper"></span>
                        <Image src={visa_card} alt="image" />
                      </label>
                    </div>
                    <div className="single-card">
                      <input
                        type="radio"
                        name="paypal"
                        id="paypal"
                        checked={cardActive === "paypal" && true}
                        onChange={onchangeHandler}
                      />
                      <label htmlFor="paypal">
                        <span className="wrapper"></span>
                        <Image src={paypal_card} alt="image" />
                      </label>
                    </div>
                    
               
                    <div className="single-card">
                      <button
                        type="button"
                        className="reg w-100 p-0"
                        data-bs-toggle="modal"
                        data-bs-target="#addcardMod">
                        <Image src={add_new} alt="image" className="w-100" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="footer-area mt-40">
                  <Link href="#">Previous Step</Link>
                  <Link href="/withdraw-money/step-2" className="active">
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
