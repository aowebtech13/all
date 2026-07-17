import Image from "next/image";
import Link from "next/link";
import { FaTimes } from "react-icons/fa";
import success from "/public/images/icon/success.png";

const TransferModal = () => {
  return (
    <div className="transfer-popup">
      <div className="container-fruid">
        <div className="row">
          <div className="col-lg-6">
            <div className="modal fade" id="transferMod" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered">
                <ul className="nav nav-tabs d-none" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="transfer-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#transfer"
                      type="button"
                      role="tab"
                      aria-controls="transfer"
                      aria-selected="true"
                    >
                      transfer
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="success-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#success"
                      type="button"
                      role="tab"
                      aria-controls="success"
                      aria-selected="false"
                    >
                      Confirm
                    </button>
                  </li>
                </ul>
                <div className="tab-content">
                  <div
                    className="tab-pane fade show active"
                    id="transfer"
                    role="tabpanel"
                    aria-labelledby="transfer-tab"
                  >
                    <div className="modal-content">
                      <div className="modal-header mb-60 justify-content-between">
                        <Link href="#">
                          <i className="icon-a-left-arrow"></i>
                          Back
                        </Link>
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
                      <div className="main-content">
                        <h4>Confirm Transfer!</h4>
                        <p>
                          We have sent a verification code on your phone +
                          Number +44831***932. Please enter verification code
                          below
                        </p>
                        <form action="#">
                          <div className="userInput">
                            <input type="text" />
                            <input type="text" />
                            <input type="text" />
                            <input type="text" />
                          </div>
                          <Link href="#">Don’t receive a code?</Link>
                          <button className="mt-60 confirm">Confirm</button>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="success"
                    role="tabpanel"
                    aria-labelledby="success-tab"
                  >
                    <div className="modal-content">
                      <div className="modal-header">
                        <button
                          type="button"
                          className="btn-close d-md-none d-block"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </div>
                      <div className="main-content text-center pt-120 pb-120">
                        <Image src={success} alt="icon" />
                        <h3>Success</h3>
                        <p>Transfer was completed.</p>
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

export default TransferModal;
