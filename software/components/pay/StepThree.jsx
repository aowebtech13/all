"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import support_icon from "../../public/images/icon/support-icon.png";
import profile_1 from "../../public/images/profile-1.png";
import axios from "@/lib/axios";
import PayProofUpload from "./PayProofUpload";
import BankInstruction from "./BankInstruction";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";


const REQUIRED_AMOUNT = 5000;

const StepThree = () => {
  const [proofFile, setProofFile] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);


  const amountLabel = `₦${REQUIRED_AMOUNT}`;

  const { user, loading } = useAuth({ middleware: "auth" });
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, user, router]);

  const submitProof = async () => {
    setError("");

    if (!proofFile) {
      setError("Upload your payment proof screenshot before submitting.");
      return;
    }

    const MAX_SIZE_BYTES = 2 * 1024 * 1024;

    // Backend DepositController currently accepts only images (max 2MB)
    if (!proofFile.type?.startsWith("image/")) {
      setError("Only image files are allowed (PNG/JPG/GIF)." );
      return;
    }

    if (proofFile.size > MAX_SIZE_BYTES) {
      setError("File too large. Max allowed is 2MB.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("amount", REQUIRED_AMOUNT);
      formData.append("method", "Bank Transfer");
      formData.append("receipt", proofFile);
      formData.append(
        "description",
        `Memebership Fee (${amountLabel}) via ECOBANK Ally-b Entrepreneurial Network (Acct 2080100211).`
      );

      const res = await axios.post("/api/deposit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res?.data) {
        setSubmitted(true);
        window.location.href = "/payment-submitted";
      }
    } catch (e) {
      console.error(e);
      const msg = e?.response?.data?.message || "Failed to submit payment proof.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="dashboard-section body-collapse pay step step-2 step-3">
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
                <span className="mdr">Step 3 of 3</span>
                <h5>Upload Proof & Submit</h5>
              </div>
              <div className="user-select">
                <div className="single-user">
                  <div className="left d-flex align-items-center">
                    <div className="img-area">
                      <Image src={profile_1} alt="image" />
                    </div>
                    <div className="text-area">
                      <p>Ally-b Entrepreneurial Network</p>
                      <span className="mdr">ECOBANK</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="payment-details">
              <div className="top-area">
                <h6>Memebership Fee</h6>
              </div>
              <div className="row">
                <div className="col-xl-6">
                  <ul className="details-list">
                    <li>
                      <span>You Send</span>
                      <b>{amountLabel}</b>
                    </li>
                    <li>
                      <span>Fee</span>
                      <b>Free</b>
                    </li>
                    <li>
                      <span>Purpose</span>
                      <b>Account Verification</b>
                    </li>
                  </ul>
                </div>
              </div>

              <BankInstruction />
            </div>

            <form action="#" onSubmit={(e) => e.preventDefault()}>
              <div style={{ marginTop: 16 }}>
                <PayProofUpload
                  value={proofFile}
                  onChange={setProofFile}
                  error={error}
                />
              </div>

              <div className="checkbox" style={{ marginTop: 18 }}>
                <input type="checkbox" id="confirm" /> {" "}
                <label htmlFor="confirm">I confirm the payment details are correct</label>
              </div>

              <div className="footer-area mt-40">
                <Link href="/pay-step/step-2">Previous Step</Link>
                <button
                  type="button"
                  className={`transferMod active`}
                  onClick={submitProof}
                  disabled={loading || submitted}
                  style={{ cursor: loading ? "not-allowed" : "pointer" }}
                >
                  {loading ? "Submitting..." : submitted ? "Submitted" : "Pay"}
                </button>
              </div>

              {error ? (
                <div style={{ marginTop: 12, color: "#b42318", fontSize: 13 }}>
                  {error}
                </div>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StepThree;

