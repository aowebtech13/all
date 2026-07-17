import Image from "next/image";
import Link from "next/link";
import { FaTimes } from "react-icons/fa";
import mastercard from "/public/images/icon/mastercard.png";
import popup_card from "/public/images/popup-card.png";

const MyCardModal = () => {
  return (
    <div className="transactions-popup mycard">
      <div className="container-fruid">
        <div className="row">
          <div className="col-lg-6">
            <div className="modal fade" id="myCardModal" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header justify-content-between">
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
                    <div className="row">
                      <div className="col-sm-4">
                        <h5>My Account Details</h5>
                        <div className="icon-area">
                          <Image
                            src={popup_card}
                            alt="image"
                            className="w-100"
                          />
                        </div>
                      </div>
                      <div className="col-sm-8">
                        <div className="right-area">
                          <div className="top-area d-flex align-items-center justify-content-between">
                            <div className="card-details d-flex align-items-center">
                              <Image src={mastercard} alt="image" />
                              <span>Account NO</span>
                            </div>
                            <Link href="URL:void()">
                              <i className="icon-h-edit"></i>
                              Edit
                            </Link>
                          </div>
                          <ul className="payment-details">
                            <li>
                              <span>Account Name:</span>
                              <span>Visa</span>
                            </li>
                            <li>
                              <span>Bank Name:</span>
                              <span>Alfred Davis</span>
                            </li>
                          
                           
                          </ul>
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

export default MyCardModal;
