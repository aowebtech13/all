import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import user_profile from "/public/images/owner-profile.png";

// NOTE: next/image requires width/height or `fill` when using string src paths.
// We import the file so Next can infer metadata and avoid runtime width errors.


const RecipientsModal = () => {
  return (
    <div className="card-popup recipients">
      <div className="container-fruid">
        <div className="row">
          <div className="col-lg-6">
            <div className="modal fade" id="recipientsMod" aria-hidden="true">
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
                        <Image src={user_profile} alt="image" width={80} height={80} />
                      </div>
                      <div className="text-area">
                        <h5>Select Recipient</h5>
                        <p>Choose a recipient to send money</p>
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

export default RecipientsModal;
