import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import company_icon from "/public/images/icon/company-icon.png";
import individual_icon from "/public/images/icon/individual-icon.png";
import user_profile from "/public/images/user-profile.png";

const RecipientsModal = () => {
  return (
    <div className="add-recipients">
      <div className="container-fruid">
        <div className="row">
          <div className="col-lg-6">
            <div className="modal fade" id="recipients1Mod" aria-hidden="true">
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
                      <FaTimes />
                    </button>
                  </div>
                  <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link active"
                        id="company-tab1"
                        data-bs-toggle="tab"
                        data-bs-target="#company"
                        type="button"
                        role="tab"
                        aria-controls="company"
                        aria-selected="true"
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
                        id="individual-tab1"
                        data-bs-toggle="tab"
                        data-bs-target="#individual1"
                        type="button"
                        role="tab"
                        aria-controls="individual1"
                        aria-selected="false"
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
                      id="company"
                      role="tabpanel"
                      aria-labelledby="company-tab1"
                    >
                      <div className="image-area mt-30 text-center">
                        <Image src={user_profile} alt="icon" />
                      </div>
                      <form action="#">
                        <div className="row justify-content-center">
                          <div className="col-md-6">
                            <div className="single-input">
                              <label htmlFor="companyfname1">First Name</label>
                              <input
                                type="text"
                                id="companyfname1"
                                placeholder="Dana"
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="single-input">
                              <label htmlFor="companylname1">Last Name</label>
                              <input
                                type="text"
                                id="companylname1"
                                placeholder="Patton"
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="single-input">
                              <label htmlFor="companyemail1">Email</label>
                              <input
                                type="text"
                                id="companyemail1"
                                placeholder="danap24@gmail.com"
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="single-input">
                              <label htmlFor="companyphone1">Phone</label>
                              <div className="select-area d-flex align-items-center">
                                <select className="bg-transparent border-0">
                                  <option value="1">+1</option>
                                  <option value="2">+2</option>
                                  <option value="3">+3</option>
                                </select>
                                <input
                                  type="text"
                                  id="companyphone1"
                                  placeholder="(070) 4567-8800"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="single-input">
                              <label>Select Country</label>
                              <select className="d-flex w-100">
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
                      id="individual1"
                      role="tabpanel"
                      aria-labelledby="individual-tab1"
                    >
                      <div className="image-area mt-30 text-center">
                        <Image src={user_profile} alt="icon" />
                      </div>
                      <form action="#">
                        <div className="row justify-content-center">
                          <div className="col-md-6">
                            <div className="single-input">
                              <label htmlFor="fname2">First Name</label>
                              <input
                                type="text"
                                id="fname2"
                                placeholder="Dana"
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="single-input">
                              <label htmlFor="lname2">Last Name</label>
                              <input
                                type="text"
                                id="lname2"
                                placeholder="Patton"
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="single-input">
                              <label htmlFor="email2">Email</label>
                              <input
                                type="text"
                                id="email2"
                                placeholder="danap24@gmail.com"
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="single-input">
                              <label htmlFor="phone2">Phone</label>
                              <div className="select-area d-flex align-items-center">
                                <select className="bg-transparent border-0">
                                  <option value="1">+1</option>
                                  <option value="2">+2</option>
                                  <option value="3">+3</option>
                                </select>
                                <input
                                  type="text"
                                  id="phone2"
                                  placeholder="(070) 4567-8800"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="single-input">
                              <label>Select Country</label>
                              <select className="d-flex w-100">
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

export default RecipientsModal;
