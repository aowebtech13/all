"use client";

import { PaylioContext } from "@/context/context";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";
import add_new from "/public/images/add-new.png";
import bank_icon from "/public/images/icon/bank-account-icon.png";
import support_icon from "/public/images/icon/support-icon.png";

const banks = [
  { id: "credem", name: "Credito Emiliano (Credem)" },
  { id: "banca-popolare-sondrio", name: "Banca Popolare di Sondrio" },
  { id: "banca-sella", name: "Banca Sella" },
  { id: "banco-desio-brianza", name: "Banco di Desio e della Brianza" },
  { id: "illimity", name: "Illimity Bank" },
];

const StepOne = () => {
  const { activeLefMenu, withdrawData, setWithdrawData } = useContext(PaylioContext);
  const [cardActive, setCardActive] = useState(withdrawData.bank || banks[0].id);
  const onchangeHandler = (e) => {
    setCardActive(e.target.name);
    setWithdrawData((prev) => ({ ...prev, bank: e.target.name }));
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
                    {banks.map((bank) => (
                      <div className="single-card" key={bank.id}>
                        <input
                          type="radio"
                          name={bank.id}
                          id={bank.id}
                          checked={cardActive === bank.id && true}
                          onChange={onchangeHandler}
                        />
                        <label htmlFor={bank.id}>
                          <span className="wrapper"></span>
                          <span className="bank-option d-flex align-items-center gap-2">
                            <Image src={bank_icon} alt="bank" width={32} height={32} />
                            <span className="bank-name">{bank.name}</span>
                          </span>
                        </label>
                      </div>
                    ))}

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
