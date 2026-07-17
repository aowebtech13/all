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

    <div className="add-recipients">
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
                      aria-label="Close"
                    >
                      <i>
                        <FaTimes />
                      </i>
                    </button>
                  </div>
                  <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link active"
                        id="company-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#company1"
                        type="button"
                        role="tab"
                        aria-controls="company1"
                        aria-selected="true"
                        onClick={() => setType("company")}
                      >
                        <span className="icon-area">
                          <Image src={company_icon} alt="icon" />
                        </span>
                        Company
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="individual-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#individual"
                        type="button"
                        role="tab"
                        aria-controls="individual"
                        aria-selected="false"
                        onClick={() => setType("individual")}
                      >
                        <span className="icon-area">
                          <Image src={individual_icon} alt="icon" />
                        </span>
                        Individual
                      </button>
                    </li>
                  </ul>
                  <div className="tab-content">
                    <div
                      className="tab-pane fade show active"
                      id="company1"
                      role="tabpanel"
                      aria-labelledby="company-tab"
                    >
                      <div className="image-area mt-30 text-center">
                        <Image src={add_recipients} alt="icon" />
                      </div>
                      <form action="#" onSubmit={onSubmit}>
                        <div className="row justify-content-center">

                          <div className="col-md-12">
                            <div className="single-input">
                              <label htmlFor="companyName">Company Name</label>
                              <input
                                type="text"
                                id="companyName"
                                placeholder="xtechlab"
                                value={form.companyName}
                                onChange={onChange("companyName")}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="single-input">
                              <label htmlFor="companyfname">First Name</label>
                              <input
                                type="text"
                                id="companyfname"
                                placeholder="Dana"
                                value={form.firstName}
                                onChange={onChange("firstName")}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="single-input">
                              <label htmlFor="companylname">Last Name</label>
                              <input
                                type="text"
                                id="companylname"
                                placeholder="Patton"
                                value={form.lastName}
                                onChange={onChange("lastName")}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="single-input">
                              <label htmlFor="companyemail">Email</label>
                              <input
                                type="text"
                                id="companyemail"
                                placeholder="danap24@gmail.com"
                                value={form.email}
                                onChange={onChange("email")}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="single-input">
                              <label htmlFor="companyphone">Phone</label>
                              <div className="select-area d-flex align-items-center overflow-hidden">
                                <select
                                  className="rounded-0 border-0"
                                  value="+1"
                                  onChange={() => {}}
                                  aria-label="Country code"
                                >
                                  <option value="+1">+1</option>
                                  <option value="+2">+2</option>
                                  <option value="+3">+3</option>
                                </select>
                                <input
                                  type="text"
                                  id="companyphone"
                                  placeholder="(070) 4567-8800"
                                  value={form.phone}
                                  onChange={onChange("phone")}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="single-input">
                              <label>Select Country</label>
                              <select className="d-flex border rounded-3 w-100">
                                <option value="1">Canada</option>
                                <option value="2">Japan</option>
                                <option value="3">Germany</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="btn-border w-100">
                              <button className="cmn-btn w-100">
                                Add Recipients
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="individual"
                      role="tabpanel"
                      aria-labelledby="individual-tab"
                    >
                      <div className="image-area mt-30 text-center">
                        <Image src={add_recipients} alt="icon" />
                      </div>
                          <form action="#" onSubmit={onSubmit}>

                        <div className="row justify-content-center">
                          <div className="col-md-12">
                            <div className="single-input">
                              <label htmlFor="individualName">
                                Individual Name
                              </label>
                              <input
                                type="text"
                                id="individualName"
                                placeholder="xtechlab"
                                value={form.firstName}
                                onChange={onChange("firstName")}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="single-input">
                              <label htmlFor="fname">First Name</label>
                              <input
                                type="text"
                                id="fname"
                                placeholder="Dana"
                                value={form.firstName}
                                onChange={onChange("firstName")}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="single-input">
                              <label htmlFor="lname">Last Name</label>
                              <input
                                type="text"
                                id="lname"
                                placeholder="Patton"
                                value={form.lastName}
                                onChange={onChange("lastName")}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="single-input">
                              <label htmlFor="email">Email</label>
                              <input
                                type="text"
                                id="email"
                                placeholder="danap24@gmail.com"
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="single-input">
                              <label htmlFor="phone">Phone</label>
                              <div className="select-area d-flex align-items-center overflow-hidden">
                                <select className="rounded-0">
                                  <option value="1">+1</option>
                                  <option value="2">+2</option>
                                  <option value="3">+3</option>
                                </select>
                                <input
                                  type="text"
                                  id="phone"
                                  placeholder="(070) 4567-8800"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="single-input">
                              <label>Select Country</label>
                              <select className="d-flex border rounded-3 w-100">
                                <option value="1">Canada</option>
                                <option value="2">Japan</option>
                                <option value="3">Germany</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="btn-border w-100">
                              <button className="cmn-btn w-100">
                                Add Recipients
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
      </div>
    </div>
  );
};

export default AddRecipientsModal;
