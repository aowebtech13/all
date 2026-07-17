"use client";
import { PaylioContext } from "@/context/context";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import Select from "../select/Select";
import support_icon from "/public/images/icon/support-icon.png";
const profile_2 = "/images/profile-1.png";

const currency = [
  { id: 1, name: "USD" },
  { id: 2, name: "GBP" },
  { id: 3, name: "BDT" },
];

const StepTwo = () => {
  const { activeLefMenu } = useContext(PaylioContext);
  return (
    <section
      className={`dashboard-section ${
        activeLefMenu ? "body-collapse" : ""
      } pay step step-2 receive-2`}>
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
                <span className="mdr">Step 2 of 4</span>
                <h5>Payment Details</h5>
              </div>
              <div className="user-select">
                <div className="single-user">
                  <div className="left d-flex align-items-center">
                    <div className="img-area">
                      <Image src={profile_2} alt="image" />
                    </div>
                    <div className="text-area">
                      <p>Herman Tran</p>
                      <span className="mdr">Herman35@gmail.com</span>
                    </div>
                  </div>
                  <div className="right">
                    <Link href="#">
                      <i className="icon-g-tick"></i>
                      Choose
                    </Link>
                    <Link href="#">
                      <i className="icon-h-edit"></i>
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <form action="#">
              <div className="send-banance">
                <span className="mdr">You Send</span>
                <div className="input-area">
                  <input className="xxlr" placeholder="400.00" type="number" />
                  {/* Select */}
                  <Select
                    data={currency}
                    btn="bg-transparent"
                    btnText="fw-semibold"
                  />
                </div>
              </div>
              <div className="input-field row">
                <div className="col-md-12">
                  <div className="single-input">
                    <label htmlFor="description">Description</label>
                    <input
                      type="text"
                      id="description"
                      placeholder="Cassave plantation"
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="single-input">
                    <label htmlFor="dueBy">Payment due by</label>
                    <input type="text" id="dueBy" placeholder="29/12/2022" />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="single-input">
                    <label htmlFor="request">Request Payment as</label>
                    <input
                      type="text"
                      id="request"
                      placeholder="Kevin Martin"
                    />
                  </div>
                </div>
              </div>
              <div className="footer-area mt-40">
                <Link href="/receive/step-2">Previous Step</Link>
                <Link href="/receive/step-3" className="active">
                  Next
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StepTwo;
