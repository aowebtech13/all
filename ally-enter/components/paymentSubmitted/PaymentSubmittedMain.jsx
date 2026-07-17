import Image from "next/image";
import Link from "next/link";
import copy_link from "/public/images/icon/copy-link.png";
import messenger from "/public/images/icon/messenger.png";
import skype from "/public/images/icon/skype.png";
import submitted_icon from "/public/images/icon/submitted-icon.png";
import support_icon from "/public/images/icon/support-icon.png";
import whatsapp from "/public/images/icon/whatsapp.png";

const PaymentSubmittedMain = () => {
  return (
    <section className="dashboard-section body-collapse pay step step-2 step-3 receive-3">
      <div className="overlay pt-120">
        <div className="container-fruid">
          <div className="main-content">
            <div className="head-area d-flex align-items-center justify-content-between">
              <h4>Request a Payment</h4>
              <div className="icon-area">
                <Image src={support_icon} alt="icon" />
              </div>
            </div>
            <div className="request-submitted pb-120 text-center">
              <div className="top-area">
                <div className="icon-area">
                  <Image src={submitted_icon} alt="icon" />
                </div>
                <h3>Submitted</h3>
                <p>Your Memebership Fee proof has been submitted. Await our admininstrators review.</p>
               

              </div>
              <div className="share-link">
                <p>Share direct link with your payer</p>
                <ul className="d-flex align-items-center justify-content-center">
                  <li>
                    <Link href="j#">
                      <Image src={whatsapp} alt="icon" />
                    </Link>
                  </li>
                  <li>
                    <Link href="j#">
                      <Image src={skype} alt="icon" />
                    </Link>
                  </li>
                  <li>
                    <Link href="j#">
                      <Image src={messenger} alt="icon" />
                    </Link>
                  </li>
                  <li>
                    <Link href="j#">
                      <Image src={copy_link} alt="icon" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentSubmittedMain;
