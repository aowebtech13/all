"use client";
import Image from "next/image";
import Link from "next/link";
import Select from "../select/Select";
import support_icon from "../../public/images/icon/support-icon.png";
import profile_1 from "../../public/images/profile-1.png";
import BankInstruction from "./BankInstruction";
import { useEffect, useMemo, useState } from "react";

const currency = [
  { id: 1, name: "NGN" },
  { id: 2, name: "USD" },
  { id: 3, name: "GBP" },
];

const StepTwo = () => {
  const [lockedAmount] = useState("");
  const amountLabel = useMemo(() => lockedAmount ? `₦${lockedAmount}` : "", [lockedAmount]);

  // Prevent users from navigating forward if they didn't confirm amount is locked.
  // (UI-only lock; backend validation happens on upload.)
  const [hasAcknowledged, setHasAcknowledged] = useState(false);

  useEffect(() => {
    setHasAcknowledged(false);
  }, []);

  return (
    <section className="dashboard-section body-collapse pay step step-2">
      <div className="overlay pt-120">
        <div className="container-fruid">
          <div className="main-content">
            <div className="head-area d-flex align-items-center justify-content-between">
              <h4>Make a Payment</h4>
              <div className="icon-area">
                <Image src={support_icon} alt="icon" />
              </div>
            </div>

            <div className="choose-recipient">
              <div className="step-area">
                <span className="mdr">Step 2 of 3</span>
                <h5>Verification Payment</h5>
              </div>
              <div className="user-select">
                <div className="single-user">
                  <div className="left d-flex align-items-center">
                    <div className="img-area">
                      <Image src={profile_1} alt="image" />
                    </div>
                    <div className="text-area">
                      <p>Enterprise Entrepreneurial Network</p>
                      <span className="mdr">ECOBANK</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <form action="#">
              <div className="send-banance">
                <span className="mdr">You Send</span>
                <div className="input-area">
                  <input className="xxlr" value={amountLabel} readOnly />
                  {/* Amount is no longer locked to a fixed verification deposit */}
                  <Select data={currency} btn="bg-transparent" btnText="fw-semibold" />
                </div>
                <p>
                  Deposit Amount<b> {amountLabel}</b>
                </p>
              </div>

              <BankInstruction />

              <ul className="total-fees">
                <li>Total Fees</li>
                <li>Free</li>
              </ul>

              <ul className="total-fees pay">
                <li>
                  <h5>Total To Pay</h5>
                </li>
                <li>
                  <h5>{amountLabel}</h5>
                </li>
              </ul>

              <div className="checkbox" style={{ marginTop: 18 }}>
                <input
                  type="checkbox"
                  id="ack-amount"
                  checked={hasAcknowledged}
                  onChange={(e) => setHasAcknowledged(e.target.checked)}
                />
                <label htmlFor="ack-amount" style={{ cursor: "pointer" }}>
                  I confirm the deposit details are correct
                </label>
              </div>

              <div className="footer-area mt-40">
                <Link href="/pay-step/step-1">Previous Step</Link>
                <Link
                  href="/pay-step/step-3"
                  className={`active ${hasAcknowledged ? "" : "disabled"}`}
                  onClick={(e) => {
                    if (!hasAcknowledged) {
                      e.preventDefault();
                    }
                  }}
                >
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

