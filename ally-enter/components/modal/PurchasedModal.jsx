import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import success from "/public/images/icon/success.png";

const PurchasedModal = () => {
  return (
    <div className="purchased-popup">
      <div className="container-fruid">
        <div className="row">
          <div className="col-lg-6">
            <div className="modal fade" id="purchasedMod" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
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
                  <div className="main-content text-center pt-120 pb-120">
                    <Image className="mb-60" src={success} alt="icon" />
                    <h5>
                      You successfully purchased <span>0.010 BTC</span> from
                      Paylio
                    </h5>
                    <ul>
                      <li>
                        <span>Status</span>
                        <span>Transaction</span>
                      </li>
                      <li>
                        <span>Completed</span>
                        <span>0pkx836930...87r398</span>
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
  );
};

export default PurchasedModal;
