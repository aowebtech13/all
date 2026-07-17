"use client";


import Image from "next/image";
import Link from "next/link";

import { useContext, useMemo, useState } from "react";
import search from "../../public/images/icon/search.png";
import support_icon from "../../public/images/icon/support-icon.png";
import default_profile from "../../public/images/profile-1.png";
import { PaylioContext } from "@/context/context";

const StepOne = () => {
  const { recipients, setExchangeData } = useContext(PaylioContext);
  const [query, setQuery] = useState("");

  const filteredRecipients = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = recipients ?? [];

    if (!q) return list;

    return list.filter((r) => {
      const name = (r?.name || r?.company_name || "").toLowerCase();
      const email = (r?.email || "").toLowerCase();
      const phone = (r?.phone || "").toLowerCase();
      return name.includes(q) || email.includes(q) || phone.includes(q);
    });
  }, [query, recipients]);

  const onChoose = (recipient) => {
    setExchangeData((prev) => ({
      ...prev,
      recipient,
    }));
  };

  return (
    <section className="dashboard-section body-collapse pay step">
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
                <span className="mdr">Step 1 of 3</span>
                <h5>Choose Recipient</h5>
              </div>

              <div className="recipient-list">
                <button className="my-recipients active">
                  <span className="icon-area">
                    <i className="icon-f-user"></i>
                  </span>
                  <span>My Recipients</span>
                </button>
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#recipients1Mod"
                >
                  <span className="icon-area">
                    <i className="icon-e-plus"></i>
                  </span>
                  <span>New Recipients</span>
                </button>
                <button>
                  <span className="icon-area">
                    <i className="icon-f-user"></i>
                  </span>
                  <span>Send to myself</span>
                </button>
              </div>

              <p className="recipients-item">
                {(recipients ?? []).length} Recipients
              </p>
            </div>

            <form action="#" className="flex-fill">
              <div className="form-group d-flex align-items-center">
                <Image src={search} alt="icon" />
                <input
                  type="text"
                  placeholder="Enter email, name or company"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </form>

            <div className="user-select">
              {filteredRecipients?.length ? (
                filteredRecipients.map((r) => {
                  const name = r?.name || r?.company_name || "Recipient";
                  const emailOrPhone = r?.email || r?.phone || "";
                  const imageSrc = r?.image || default_profile;

                  return (
                    <div className="single-user" key={r?.id || name}>
                      <div className="left d-flex align-items-center">
                        <div className="img-area">
                          <Image
                            src={imageSrc}
                            alt="image"
                            width={64}
                            height={64}
                          />
                        </div>
                        <div className="text-area">
                          <p>{name}</p>
                          {emailOrPhone ? (
                            <span className="mdr">{emailOrPhone}</span>
                          ) : null}
                        </div>
                      </div>

                      <div className="right">
                        <Link
                          href="/pay-step/step-2"
                          className="active"
                          onClick={() => onChoose(r)}
                        >
                          Choose
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="single-user" style={{ padding: 16 }}>
                  <div className="text-area">
                    <p style={{ margin: 0 }}>No recipients found.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="footer-area mt-40">
              <Link href="/pay-step/step-1">Previous Step</Link>
              <Link href="/pay-step/step-2" className="active">
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

