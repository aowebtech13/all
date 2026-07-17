"use client";
import { PaylioContext } from "@/context/context";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import flag_bd from "/public/images/icon/flag-bd.png";
import flag_usa from "/public/images/icon/flag-usa.png";
import support_icon from "/public/images/icon/support-icon.png";
import profile_1 from "/public/images/profile-1.png";

const StepThree = () => {
  const { activeLefMenu, exchangeData } = useContext(PaylioContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    fromAmount = 0,
    fromCurrency = "USD",
    toAmount = 0,
    toCurrency = "NGN",
    rate = 0,
    fee = 0,
    totalToPay = 0,
    firstName = "",
    lastName = "",
    email = "",
    bankName = "",
    accountNumber = "",
    loanReason = "",
    address = "",
  } = exchangeData || {};

  const fullName = firstName || lastName ? `${firstName} ${lastName}`.trim() : "Recipient Name";

  const getFlag = (currency) => {
    switch (currency) {
      case "USD": return flag_usa;
      case "BDT": return flag_bd;
      default: return flag_bd; // Use BDT flag as default for now
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post("/loans", {
        from_currency: fromCurrency,
        to_currency: toCurrency,
        from_amount: fromAmount,
        to_amount: toAmount,
        rate: rate,
        fee: fee,
        recipient_name: fullName,
        recipient_email: email || "user@example.com",
        bank_name: bankName,
        account_number: accountNumber,
      });

      if (response.data) {
        alert("loans Application submitted successfully!");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert(error.response?.data?.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className={`dashboard-section ${
        activeLefMenu ? "body-collapse" : ""
      } pay step step-2 step-3 exchange`}>
      <div className="overlay pt-120">
        <div className="container-fruid">
          <div className="main-content">
            <div className="head-area d-flex align-items-center justify-content-between">
              <h4>Loan Application</h4>
              <div className="icon-area">
                <Image src={support_icon} alt="icon" />
              </div>
            </div>
            <div className="row">
              <div className="col-xl-7 col-lg-6">
                <div className="choose-recipient">
                  <div className="step-area">
                    <span className="mdr">Step 3 of 3</span>
                    <h5>Review Application</h5>
                  </div>
                  <div className="user-select">
                    <div className="single-user">
                      <div className="left d-flex align-items-center">
                        <div className="img-area">
                          <Image src={profile_1} alt="image" />
                        </div>
                        <div className="text-area">
                          <p>{fullName}</p>
                          <span className="mdr">{email || "Email address"}</span>
                        </div>
                      </div>
                      <div className="right">
                        <Link href="#" className="active">
                          <i className="icon-g-tick"></i>
                          Choose
                        </Link>
                        <Link href="/loans/step-2">
                          <i className="icon-h-edit"></i>
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <form action="#">
                  <div className="payment-details">
                    <div className="top-area">
                      <h6>Payment Details</h6>
                      <div className="right">
                        <Link href="/loans/step-2">
                          <i className="icon-h-edit"></i>
                          Edit
                        </Link>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-xl-8 col-lg-12">
                        <ul className="details-list">
                          <li>
                            <span>Bank Name</span>
                            <b>{bankName || "Not specified"}</b>
                          </li>
                          <li>
                            <span>Account number</span>
                            <b>{accountNumber || "Not specified"}</b>
                          </li>
                          <li>
                            <span>Home Address</span>
                            <b>{address || "Not specified"}</b>
                          </li>
                          <li>
                            <span>Reason for Loan</span>
                            <b>{loanReason || "Not specified"}</b>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="footer-area mt-40">
                    <Link href="/loans/step-2">Preview</Link>
                    <button 
                      type="submit" 
                      onClick={handleSubmit} 
                      className={`active ${loading ? 'opacity-50' : ''}`}
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "Submit Application"}
                    </button>
                  </div>
                </form>
              </div>
              <div className="col-xl-5 col-lg-6">
                <div className="side-area">
                  <p>Recipient gets</p>
                  <div className="title-area">
                    <h5>Bank Deposit</h5>
                    <ul className="flag-area">
                      <li>
                        <span className="icon-area">
                          <Image src={getFlag(fromCurrency)} alt="icon" />
                        </span>
                      </li>
                      <li>
                        <span className="icon-area">
                          <Image src={getFlag(toCurrency)} alt="icon" />
                        </span>
                      </li>
                    </ul>
                  </div>
                  <ul className="deposit-details">
                    <li>
                      <span>You Send</span>
                      <b>{fromAmount} {fromCurrency}</b>
                    </li>
                    <li>
                      <span>They get</span>
                      <b>{toAmount} {toCurrency}</b>
                    </li>
                    <li>
                      <span>Exchange rate</span>
                      <b>1 {fromCurrency} = {rate} {toCurrency}</b>
                    </li>
                    <li>
                      <span>Our fee</span>
                      <b>+{fee} {fromCurrency}</b>
                    </li>
                  </ul>
                  <ul className="deposit-details">
                    <li>
                      <span>Total to pay</span>
                      <b>{totalToPay} {fromCurrency}</b>
                    </li>
                    <li>
                      <span>They receive</span>
                      <b>{toAmount} {toCurrency}</b>
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

export default StepThree;
