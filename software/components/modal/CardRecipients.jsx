import Image from "next/image";
import Link from "next/link";
import { FaTimes } from "react-icons/fa";
import deleteIcon from "/public/images/icon/delete.png";
import request_funds from "/public/images/icon/request-funds.png";
import send_funds from "/public/images/icon/send-funds.png";
import transfer_limit from "/public/images/icon/transfer-limit.png";
import recipients_user from "/public/images/owner-profile.png";


const CardRecipients = () => {
  return (
    <div className="card-popup recipients">
      <div className="container-fruid">
        <div className="row">
          <div className="col-lg-6">
            <div className="modal fade" id="cardMod1" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header justify-content-center">
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close">
                      <FaTimes />
                    </button>
                  </div>
                  <div className="main-content">
                    <div className="top-area mb-40 mt-40 text-center">
                      <div className="card-area mb-30">
                        <Image src={recipients_user} alt="image" />
                      </div>
                      <div className="text-area">
                        <h5>Eleanor Pena</h5>
                        <p>michelle.rivera@example.com</p>
                      </div>
                    </div>
                    <div className="tab-area d-flex align-items-center justify-content-between">
                      <ul className="nav nav-tabs mb-30" role="tablist">
                        <li>
                          <button>
                            <Image src={send_funds} alt="icon" />
                            Send Funds
                          </button>
                        </li>
                        <li>
                          <button>
                            <Image src={request_funds} alt="icon" />
                            Request Funds
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                          // id="cancel-tab"
                          // data-bs-toggle="tab"
                          // data-bs-target="#cancel1"
                          // type="button"
                          // role="tab"
                          // aria-controls="cancel1"
                          // aria-selected="false"
                          >
                            <Image src={transfer_limit} alt="icon" />
                            Set a transfer limit
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            id="limit-tab1"
                            data-bs-toggle="tab"
                            data-bs-target="#limit"
                            type="button"
                            role="tab"
                            aria-controls="limit"
                            aria-selected="true">
                            <Image src={deleteIcon} alt="icon" />
                            Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                    <div className="tab-content mt-30">
                      <div
                        className="tab-pane fade show active"
                        // id="limit"
                        // role="tabpanel"
                        // aria-labelledby="limit-tab1"
                      >
                        <div className="bottom-area">
                          <p className="history">
                            Transfer with Eleanor Pena : <span>20</span>
                          </p>
                          <ul>
                            <li>
                              <p className="left">
                                <span>03:00 PM</span>
                                <span>17 Oct, 2020</span>
                              </p>
                              <p className="right">
                                <span>$160.48</span>
                                <span>Withdraw</span>
                              </p>
                            </li>
                            <li>
                              <p className="left">
                                <span>01:09 PM</span>
                                <span>15 Oct, 2021</span>
                              </p>
                              <p className="right">
                                <span>$106.58</span>
                                <span>Withdraw</span>
                              </p>
                            </li>
                            <li>
                              <p className="left">
                                <span>04:00 PM</span>
                                <span>12 Oct, 2020</span>
                              </p>
                              <p className="right">
                                <span>$176.58</span>
                                <span>Withdraw</span>
                              </p>
                            </li>
                            <li>
                              <p className="left">
                                <span>06:00 PM</span>
                                <span>25 Oct, 2020</span>
                              </p>
                              <p className="right">
                                <span>$167.85</span>
                                <span>Withdraw</span>
                              </p>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="cancel1"
                        role="tabpanel"
                        aria-labelledby="cancel-tab">
                        <div className="main-area">
                          <div className="transfer-area">
                            <p>Set a transfer limit for paylio payment Card</p>
                            <p className="mdr">Transfer Limit</p>
                          </div>
                          <form action="#">
                            <div className="input-area">
                              <input
                                className="xxlr"
                                placeholder="400.00"
                                type="number"
                              />
                              <select>
                                <option value="1">USD</option>
                                <option value="2">GBP</option>
                                <option value="3">BDT</option>
                              </select>
                            </div>
                            <div className="bottom-area d-flex align-items-center justify-content-between">
                              <Link href="j#" className="cmn-btn cancel">
                                Cancel and Back
                              </Link>
                              <Link href="j#" className="cmn-btn">
                                Confirm Transfer Limit
                              </Link>
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
      </div>
    </div>
  );
};

export default CardRecipients;
