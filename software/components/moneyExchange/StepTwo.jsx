"use client";
import { PaylioContext } from "@/context/context";
import Image from "next/image";
import { useContext } from "react";
import DepositCard from "../cards/DepositCard";
import RecentTab from "./RecentTab";
import RecipientsTab from "./RecipientsTab";
import support_icon from "/public/images/icon/support-icon.png";

const StepTwo = () => {
  const { activeLefMenu } = useContext(PaylioContext);
  return (
    <section
      className={`dashboard-section ${
        activeLefMenu ? "body-collapse" : ""
      } pay step exchange`}>
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
                    <span className="mdr">Step 2 of 3</span>
                    <h5>Disbursement Details</h5>
                  </div>
                  <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item recipient-list" role="presentation">
                      <button
                        className="nav-link my-recipients active"
                        id="recipients-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#recipients"
                        type="button"
                        role="tab"
                        aria-controls="recipients"
                        aria-selected="true">
                        <span className="icon-area">
                          <i className="icon-e-plus"></i>
                        </span>
                        <span>My Recipients</span>
                      </button>
                    </li>
                    <li className="nav-item recipient-list" role="presentation">
                      <button
                        className="nav-link my-recipients"
                        id="recent-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#recent"
                        type="button"
                        role="tab"
                        aria-controls="recent"
                        aria-selected="false">
                        <span className="icon-area">
                          <i className="icon-f-user"></i>
                        </span>
                        <span>Most Recent</span>
                      </button>
                    </li>
                  </ul>
                  <div className="tab-content">
                    {/* Recipients Tab */}
                    <RecipientsTab />

                    {/* Recent Tab */}
                    <RecentTab />
                  </div>
                </div>
              </div>
              <div className="col-xl-5 col-lg-6">
                {/* Deposit Card */}
                <DepositCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StepTwo;
