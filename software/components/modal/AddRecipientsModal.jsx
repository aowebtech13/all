"use client";

import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { useContext, useMemo, useState } from "react";
import add_recipients from "/public/images/icon/add-recipients.png";
import company_icon from "/public/images/icon/company-icon.png";
import individual_icon from "/public/images/icon/individual-icon.png";
import { PaylioContext } from "@/context/context";

import axiosInstance from "@/lib/axios";

const AddRecipientsModal = () => {
  const { setRecipients } = useContext(PaylioContext);

  const [form, setForm] = useState({
    type: "company", // company | individual
    companyName: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const setType = (type) => {
    setForm((prev) => ({ ...prev, type }));
  };

  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setForm({
      type: "company",
      companyName: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    });
  };

  const closeModal = () => {
    const el = document.getElementById("recipientsMod");
    if (!el) return;
    // Bootstrap 5 modal instance
    // eslint-disable-next-line no-undef
    const modal = window.bootstrap?.Modal?.getInstance?.(el) || new window.bootstrap.Modal(el);
    modal.hide();
  };

  const payload = useMemo(() => {
    const company_name = form.companyName.trim() || null;
    const first_name = form.firstName.trim() || null;
    const last_name = form.lastName.trim() || null;

    const fullName = `${first_name || ""} ${last_name || ""}`.trim();

    return {
      type: form.type,
      company_name,
      first_name,
      last_name,
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      // optionally store image later
      image: null,
      // status fields handled by backend
      // name is derived backend
      _derived_fullName: fullName,
    };
  }, [form]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const hasRequired = Boolean((form.type === "company" ? form.companyName : form.firstName) && form.phone);
    if (!hasRequired) {
      return;
    }

    setLoading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        console.error("Add recipient: missing localStorage token. /recipients requires auth:sanctum.");
        return;
      }

      const res = await axiosInstance.post("/recipients", payload);
      // NOTE: NEXT_PUBLIC_BACKEND_URL should already include /api (configured to /api/recipients endpoints).

      const recipient = res?.data?.recipient;


      if (recipient) {
        setRecipients((prev) => [
          {
            ...recipient,
          },
          ...(prev || []),
        ]);
      }

      resetForm();
      closeModal();
    } catch (error) {
      console.error("Add recipient error:", error);
    } finally {
      setLoading(false);
    }
  };

  const onChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  return (
    <div className="add-recipients-popup">
      <div className="container-fruid">
        <div className="row">
          <div className="col-lg-6">
            <div className="modal fade" id="recipientsMod" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header justify-content-between">
                    <h6>Add Recipients</h6>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close">
                      <i>
                        <FaTimes />
                      </i>
                    </button>
                  </div>
                  <form onSubmit={onSubmit}>
                    <div className="type-selector d-flex align-items-center justify-content-center gap-3 mb-30">
                      <button
                        type="button"
                        className={`type-btn ${form.type === "company" ? "active" : ""}`}
                        onClick={() => setType("company")}>
                        <Image src={company_icon} alt="company" width={40} height={40} />
                        <span>Company</span>
                      </button>
                      <button
                        type="button"
                        className={`type-btn ${form.type === "individual" ? "active" : ""}`}
                        onClick={() => setType("individual")}>
                        <Image src={individual_icon} alt="individual" width={40} height={40} />
                        <span>Individual</span>
                      </button>
                    </div>

                    <div className="row justify-content-center">
                      {form.type === "company" && (
                        <div className="col-md-12">
                          <div className="single-input">
                            <label htmlFor="companyName">Company Name</label>
                            <input
                              type="text"
                              id="companyName"
                              placeholder="Enter company name"
                              value={form.companyName}
                              onChange={onChange("companyName")}
                            />
                          </div>
                        </div>
                      )}

                      {form.type === "individual" && (
                        <>
                          <div className="col-md-6">
                            <div className="single-input">
                              <label htmlFor="firstName">First Name</label>
                              <input
                                type="text"
                                id="firstName"
                                placeholder="Enter first name"
                                value={form.firstName}
                                onChange={onChange("firstName")}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="single-input">
                              <label htmlFor="lastName">Last Name</label>
                              <input
                                type="text"
                                id="lastName"
                                placeholder="Enter last name"
                                value={form.lastName}
                                onChange={onChange("lastName")}
                              />
                            </div>
                          </div>
                        </>
                      )}

                      <div className="col-md-12">
                        <div className="single-input">
                          <label htmlFor="email">Email</label>
                          <input
                            type="email"
                            id="email"
                            placeholder="Enter email address"
                            value={form.email}
                            onChange={onChange("email")}
                          />
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="single-input">
                          <label htmlFor="phone">Phone</label>
                          <input
                            type="tel"
                            id="phone"
                            placeholder="Enter phone number"
                            value={form.phone}
                            onChange={onChange("phone")}
                          />
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="btn-border w-100">
                          <button type="submit" className="cmn-btn w-100" disabled={loading}>
                            {loading ? "Adding..." : "Add Recipient"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRecipientsModal;
