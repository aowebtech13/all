"use client";
import { PaylioContext } from "@/context/context";
import Image from "next/image";
import Link from "next/link";
import { useContext, useMemo } from "react";
import search from "/public/images/icon/search.png";
import support_icon from "/public/images/icon/support-icon.png";

const StepOne = () => {
  const { activeLefMenu, recipients } = useContext(PaylioContext);

  const recentRecipients = useMemo(() => (recipients || []).slice(0, 3), [recipients]);
  return (

    <section
      className={`dashboard-section pay step ${
        activeLefMenu ? "body-collapse" : ""
      }`}>
      <div className="overlay pt-120">
        <div className="container-fruid">
          <div className="main-content">
            <div className="head-area d-flex align-items-center justify-content-between">
              <h4>Request a Payment</h4>
              <div className="icon-area">
                <Image src={support_icon} alt="icon" />
              </div>
            </div>
            <div className="choose-recipient">
              <div className="step-area">
                <span className="mdr">Step 1 of 4</span>
                <h5>Choose Recipient</h5>
              </div>
              <div className="recipient-list">
                <button className="my-recipients active">
                  <span className="icon-area">
                    <i className="icon-f-user"></i>
                  </span>
                  <span>Most Recent</span>
                </button>
                <button data-bs-toggle="modal" data-bs-target="#recipientsMod">
                  <span className="icon-area">
                    <i className="icon-e-plus"></i>
                  </span>
                  <span>New Recipients</span>
                </button>
              </div>
              <p className="recipients-item">50 Recipients</p>
            </div>
            <form action="#" className="flex-fill">
              <div className="form-group d-flex align-items-center">
                <Image src={search} alt="icon" />
                <input type="text" placeholder="Enter email, name or company" />
              </div>
            </form>
            <div className="user-select">
              {(recentRecipients || []).map((recipient) => (
                <div className="single-user" key={recipient.id}>
                  <div className="left d-flex">
                    <div className="img-area">
                      <Image
                        src={recipient.image || "/images/recipients-1.png"}
                        alt={recipient.name}
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className="text-area">
                      <p>{recipient.name || "Recipient"}</p>
                      <span className="mdr">{recipient.email || ""}</span>
                      <span className="last-payment">
                        {recipient.lastTransferTime || "Last Payment"} | {recipient.amount || ""}
                      </span>
                    </div>
                  </div>
                  <div className="right">
                    <Link href="#">Choose</Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="footer-area mt-40">
              <Link href="#">Previous Step</Link>
              <Link href="/receive/step-2" className="active">
                Next
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StepOne;
