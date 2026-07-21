"use client";
import { PaylioContext } from "@/context/context";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";
import add_card from "/public/images/add-new.png";
import support_icon from "/public/images/icon/support-icon.png";
import bank_icon from "/public/images/icon/bank-account-icon.png";

const banks = [
  { id: "credem", name: "Credito Emiliano" },
  { id: "Fineco", name: "Fineco" },
  { id: "Intesa Sanpaolo", name: "Intesa" },
  { id: "banco-desio-brianza", name: "Banco " },
  { id: "illimity", name: "Illimity Bank" },
  { id: "unicredit", name: "UniCredit" },
  { id: "ing-italia", name: "ING Italia" },
];

const StepOne = () => {
  const { activeLefMenu, depositData, setDepositData } = useContext(PaylioContext);
  const [checked, setChecked] = useState(depositData?.bank || "visa");
  const handleChecked = (e) => {
    setChecked(e.target.name);
    setDepositData((prev) => ({ ...prev, bank: e.target.name }));
  };

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
                      <Link href="#" className="single-link active">
                        Choose Payment Method
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/deposit-money/step-2"
                        className="single-link two">
                        Enter amount
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="single-link last">
                        Confirm Order
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xl-9 col-lg-8 col-md-7">
                <div className="table-area">
                  <div className="head-area">
                    <h4>Select An Option</h4>
                  </div>
                  <div className="card-area d-flex flex-wrap">
                    <div className={`bank-card ${checked === "visa" ? "selected" : ""}`}>
                      <input
                        type="radio"
                        checked={checked === "visa" && true}
                        name="visa"
                        id="visa"
                        onChange={(e) => handleChecked(e)}
                      />
                      <label htmlFor="visa">
                        <span className="bank-card-inner">
                          <span className="bank-icon">
                            <Image src="/public/images/visa-card.png" alt="Visa" width={48} height={32} />
                          </span>
                          <span className="bank-name">Visa</span>
                        </span>
                      </label>
                    </div>

                    {banks.map((bank) => (
                      <div className={`bank-card ${checked === bank.id ? "selected" : ""}`} key={bank.id}>
                        <input
                          type="radio"
                          name={bank.id}
                          id={bank.id}
                          checked={checked === bank.id && true}
                          onChange={(e) => handleChecked(e)}
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

                    <div className="bank-card add-bank-card">
                      <button
                        type="button"
                        className="reg w-100 p-0"
                        data-bs-toggle="modal"
                        data-bs-target="#addcardMod">
                        <span className="bank-card-inner">
                          <span className="bank-icon add-icon">
                            <Image src={add_card} alt="add" width={32} height={32} />
                          </span>
                          <span className="bank-name">Add New</span>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="footer-area mt-40">
                  <Link href="#" className="d-none">
                    Previous Step
                  </Link>
                  <Link href="/deposit-money/step-2" className="active">
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
