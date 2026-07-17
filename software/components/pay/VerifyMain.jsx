"use client";
import axios from "@/lib/axios";
import { PaylioContext } from "@/context/context";
import Image from "next/image";
import { useContext, useState } from "react";
import support_icon from "../../public/images/icon/support-icon.png";
import PayProofUpload from "./PayProofUpload";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const VerifyMain = () => {
  const { activeLefMenu } = useContext(PaylioContext);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please upload your payment screenshot");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("amount", "5000");
      formData.append("method", "Bank Transfer (ECOBANK)");
      formData.append("receipt", file);
      formData.append("description", "Account Membership Payment");

      const response = await axios.post("/api/deposit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Verification payment submitted successfully! Admin will review it shortly.");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Submission error:", error);
      const message = error.response?.data?.message || "Failed to submit membership payment";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className={`dashboard-section ${
        activeLefMenu ? "body-collapse" : ""
      } pay`}
    >
      <div className="overlay pt-120">
        <div className="container-fruid">
          <div className="main-content">
            <div className="head-area d-flex align-items-center justify-content-between">
              <h4>Membership Verification</h4>
              <div className="icon-area">
                <Image src={support_icon} alt="icon" />
              </div>
            </div>
            <div className="row pb-120">
              <div className="col-xxl-6 col-xl-8 col-md-10">
                <div className="card custom-card p-4">
                  <div className="verification-details mb-4">
                    <h5>Payment Instructions</h5>
                    <p className="mt-3">
                      All users must make a payment of <strong>₦5000</strong> for account to get verified.
                    </p>
                    <div className="bank-details mt-4 p-3 bg-light rounded" style={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6' }}>
                      <p className="mb-2"><strong>Bank:</strong> ECOBANK</p>
                      <p className="mb-2"><strong>Account Name:</strong> Ally-b Entrepreneurial Network</p>
                      <p className="mb-0"><strong>Account Number:</strong> 2080100211</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <PayProofUpload value={file} onChange={setFile} />
                    
                    <button 
                      type="submit" 
                      className="btn btn-primary mt-4 w-100" 
                      style={{ 
                        backgroundColor: '#5d3cf0', 
                        borderColor: '#5d3cf0',
                        padding: '12px',
                        borderRadius: '8px',
                        fontWeight: '600'
                      }}
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "Submit Membership Proof"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerifyMain;
