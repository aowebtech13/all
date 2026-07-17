import { PaylioContext } from "@/context/context";
import Image from "next/image";
import { useContext } from "react";
import flag_bd from "/public/images/icon/flag-bd.png";
import flag_usa from "/public/images/icon/flag-usa.png";

const DepositCard = () => {
  const { exchangeData } = useContext(PaylioContext);
  const {
    fromAmount = 0,
    fromCurrency = "USD",
    toAmount = 0,
    toCurrency = "GBP",
    rate = 0,
    fee = 0,
    totalToPay = 0,
  } = exchangeData || {};

  return (
    <div className="side-area">
      <p>Recipient gets</p>
      <div className="title-area">
        <h5>Bank Deposit</h5>
        <ul className="flag-area">
          <li>
            <span className="icon-area">
              <Image src={flag_usa} alt="icon" />
            </span>
          </li>
          <li>
            <span className="icon-area">
              <Image src={flag_bd} alt="icon" />
            </span>
          </li>
        </ul>
      </div>
      <ul className="deposit-details">
        <li>
          <span>You Send</span>
          <b>{fromAmount} {fromCurrency}</b>
        </li>
        <li>
          <span>They get</span>
          <b>{toAmount} {toCurrency}</b>
        </li>
        <li>
          <span>Exchange rate</span>
          <b>1 {fromCurrency} = {rate} {toCurrency}</b>
        </li>
        <li>
          <span>Our fee</span>
          <b>+{fee} {fromCurrency}</b>
        </li>
      </ul>
      <ul className="deposit-details">
        <li>
          <span>Total to pay</span>
          <b>{totalToPay} {fromCurrency}</b>
        </li>
        <li>
          <span>They receive</span>
          <b>{toAmount} {toCurrency}</b>
        </li>
      </ul>
    </div>
  );
};

export default DepositCard;
