"use client";
import { PaylioContext } from "@/context/context";
import Image from "next/image";
import { useContext } from "react";
import PaymentCard from "../cards/PaymentCard";

import paylio_account_icon from "../../public/images/icon/paylio-account-icon.png";
import support_icon from "../../public/images/icon/support-icon.png";

const paymentData = [
  {
    id: 1,
    icon: paylio_account_icon,
    title: "Account Verification",
    pay: "Pay $500 to verify",
    link: "/pay/verify",
  },
  {
    id: 2,
    icon: paylio_account_icon,
    title: "To a Another Account",
    pay: "for free",
    link: "/pay/step-1",
  },
];

const PayMain = () => {
  const { activeLefMenu, menuState } = useContext(PaylioContext);

  // menuState.pay is set to true when user is not email-verified (see context.js)
  const showVerifyCard = Boolean(menuState?.enabled?.pay);
  const showOtherPayCards = !showVerifyCard;

  return (
    <section
      className={`dashboard-section ${activeLefMenu ? "body-collapse" : ""} pay`}>
      <div className="overlay pt-120">
        <div className="container-fruid">
          <div className="main-content">
            <div className="head-area d-flex align-items-center justify-content-between">
              <h4>Make a Payment</h4>
              <div className="icon-area">
                <Image src={support_icon} alt="icon" />
              </div>
            </div>

            <div className="row pb-120">
              {paymentData
                .filter((itm) => {
                  if (itm.link === "/pay/verify") return showVerifyCard;
                  return showOtherPayCards;
                })
                .map((itm) => (
                  <div key={itm.id} className="col-xxl-3 col-xl-4 col-md-5">
                    <PaymentCard data={itm} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PayMain;

