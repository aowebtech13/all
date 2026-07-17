"use client";
import { useContext, useMemo, useState } from "react";
import { PaylioContext } from "@/context/context";
import Image from "next/image";
import Link from "next/link";
import axios from "@/lib/axios";

import support_icon from "/public/images/icon/support-icon.png";
import profile_1 from "/public/images/profile-1.png";

const MAX_FILES = 5;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ACCEPTED_MIME = ["image/jpeg", "image/png", "image/gif", "application/pdf"];

export default function StepThree() {
  const { activeLefMenu } = useContext(PaylioContext);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const attachHint = useMemo(() => {
    return `Attach up to ${MAX_FILES} documents (pdf/images). Max ${
      MAX_FILE_SIZE_BYTES / (1024 * 1024)
    }MB each.`;
  }, []);

  const onFilesPicked = (files) => {
    setError("");

    const list = Array.from(files || []);
    if (!list.length) {
      setSelectedFiles([]);
      return;
    }

    if (list.length > MAX_FILES) {
      setError(`You can attach up to ${MAX_FILES} documents.`);
      return;
    }

    for (const f of list) {
      if (!ACCEPTED_MIME.includes(f.type)) {
        setError("Unsupported file type. Use PDF or images (jpg/png/gif)." );
        return;
      }
      if (f.size > MAX_FILE_SIZE_BYTES) {
        setError(`File too large: ${f.name}. Max allowed is 5MB.`);
        return;
      }
    }

    setSelectedFiles(list);
  };

  const requestPayment = async () => {
    setError("");

    if (submitted) return;

    if (selectedFiles.length === 0) {
      setError("Upload at least one document before submitting.");
      return;
    }

    setLoading(true);
    try {
      // These values are currently hard-coded on the UI in StepThree.
      // When StepTwo is wired to backend, replace them with real data.
      const amount = 400.0;
      const description = "Software Development";
      const requestedAs = "Kevin Martin";

      const formData = new FormData();
      formData.append("amount", amount);
      formData.append("description", description);
      formData.append("requested_as", requestedAs);

      // IMPORTANT: backend expects `documents` to be an array.
      selectedFiles.forEach((f) => formData.append("documents[]", f));

      // Our backend route is POST /payment-requests
      const res = await axios.post("/payment-requests", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res?.data) {
        setSubmitted(true);
        window.location.href = "/payment-submitted";
      }
    } catch (e) {
      const msg =
        e?.response?.data?.message || "Failed to submit payment request.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className={`dashboard-section ${
        activeLefMenu ? "body-collapse" : ""
      } pay step step-2 step-3 receive-3`}
    >
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
                <span className="mdr">Step 3 of 4</span>
                <h5>Attach Documents</h5>
              </div>

              <div className="user-select">
                <div className="single-user">
                  <div className="left d-flex align-items-center">
                    <div className="img-area">
                      <Image src={profile_1} alt="image" />
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

            <div className="payment-details">
              <div className="top-area">
                <h6>Payment Details</h6>
                <div className="right">
                  <Link href="#">
                    <i className="icon-h-edit"></i>
                    Edit
                  </Link>
                </div>
              </div>
              <div className="row">
                <div className="col-xl-5 col-lg-6 col-md-8">
                  <ul className="details-list">
                    <li>
                      <span>Amount</span>
                      <b>400.00 GBP</b>
                    </li>
                    <li>
                      <span>Description</span>
                      <b>Software Development</b>
                    </li>
                    <li>
                      <span>Requested as</span>
                      <b>Kevin Martin</b>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="attach-documents">
              <div className="top-area">
                <h6>Attach documents</h6>
                <p>{attachHint}</p>

                <div className="file-upload">
                  <div className="right-area">
                    <label className="file">
                      <input
                        type="file"
                        multiple
                        onChange={(e) => onFilesPicked(e.target.files)}
                      />
                      <span className="file-custom"></span>
                      <span className="file-custom2"></span>
                    </label>
                  </div>
                </div>

                {selectedFiles.length ? (
                  <div style={{ marginTop: 10, fontSize: 13, color: "#334155" }}>
                    {selectedFiles.map((f) => (
                      <div key={f.name}>
                        • {f.name} ({Math.round(f.size / 1024)} KB)
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            {error ? (
              <div style={{ marginTop: 12, color: "#b42318", fontSize: 13 }}>
                {error}
              </div>
            ) : null}

            <div className="footer-area mt-40">
              <Link href="/receive/step-2">Preview</Link>

              <button
                type="button"
                className={"transferMod active"}
                onClick={requestPayment}
                disabled={loading || submitted}
                style={{ cursor: loading ? "not-allowed" : "pointer" }}
              >
                {loading ? "Submitting..." : submitted ? "Submitted" : "Request Payment"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

