"use client";
import { PaylioContext } from "@/context/context";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import Select from "../select/Select";
import support_icon from "/public/images/icon/support-icon.png";
import axiosInstance from "@/lib/axios";

const currencySend = [
  { id: 1, name: "USD" },
  { id: 2, name: "GBP" },
];

const currencyGet = [
  { id: 1, name: "USD" },
  { id: 2, name: "GBP" },
];

const deliveryMethod = [
  { id: 1, name: "Bank Transfer" },
  { id: 2, name: "Mobile Wallet" },
  { id: 3, name: "Card Payment" },
];

const bankTransfer = [
  { id: 1, name: "Dutch bangla bank" },
  { id: 2, name: "Brac bank Ltd" },
  { id: 3, name: "National bank" },
];

const StepOne = () => {
  const { activeLefMenu, exchangeData, setExchangeData } = useContext(PaylioContext);
  const [rates, setRates] = useState({
    USD: { NGN: 1400, USD: 1 },
    NGN: { USD: 1 / 1400, NGN: 1 }
  });
  const [feePercentage, setFeePercentage] = useState(2.5);
  const [fromAmount, setFromAmount] = useState(400);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("GBP");
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchRatesAndBalance = async () => {
      try {
          const [ratesRes, userRes] = await Promise.all([
          		axiosInstance.get("/loans/rates"),
          		axiosInstance.get("/user"),
        ]);
        setRates(prev => ({ ...prev, ...ratesRes.data.rates }));
        // setFeePercentage(ratesRes.data.fee_percentage);
        setBalance(userRes.data.balance);
      } catch (error) {
        console.error("Error fetching rates or balance:", error);
      }
    };
    fetchRatesAndBalance();
  }, []);

  const currentRate = rates[fromCurrency]?.[toCurrency] || 0;
  const fee = ((parseFloat(fromAmount || 0) * feePercentage) / 100).toFixed(2);
  const toAmount = ((parseFloat(fromAmount || 0) - parseFloat(fee)) * currentRate).toFixed(2);
  const totalToPay = parseFloat(fromAmount || 0).toFixed(2);

  const handleToAmountChange = (e) => {
    const val = e.target.value;
    if (currentRate > 0) {
      const amountBeforeRate = parseFloat(val || 0) / currentRate;
      setFromAmount((amountBeforeRate / (1 - feePercentage / 100)).toFixed(2));
    }
  };

  const handleContinue = () => {
    setExchangeData({
      ...exchangeData,
      fromAmount,
      fromCurrency,
      toAmount,
      toCurrency,
      rate: currentRate,
      fee,
      totalToPay,
    });
  };

  return (
    <section
      className={`dashboard-section ${
        activeLefMenu ? "body-collapse" : ""
      } pay step step-2`}>
      <div className="overlay pt-120">
        <div className="container-fruid">
          <div className="main-content">
            <div className="head-area d-flex align-items-center justify-content-between">
              <h4>Loan Application</h4>
              <div className="icon-area">
                <Image src={support_icon} alt="icon" />
              </div>
            </div>
            <form action="#">
              <div className="exchange-content">
                <div className="send-banance">
                  <span className="mdr">Loan Amount</span>
                  <div className="input-area">
                    <input
                      className="xxlr"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      placeholder="400.00"
                      type="number"
                    />
                    {/* Select  */}
                    <Select
                      data={currencySend}
                      btn="bg-transparent"
                      btnText="fw-semibold"
                      value={currencySend.find(c => c.name === fromCurrency)}
                      onChange={(val) => {
                        setFromCurrency(val.name);
                        if (val.name === toCurrency) {
                          setToCurrency(val.name === "USD" ? "NGN" : "USD");
                        }
                      }}
                    />
                  </div>
                 
                </div>
                <div className="send-banance recipient">
                  <span className="mdr">Amount to be Credited</span>
                  <div className="input-area">
                    <input
                      className="xxlr"
                      value={toAmount}
                      onChange={handleToAmountChange}
                      placeholder="0.00"
                      type="number"
                    />
                    {/* Select  */}
                    <Select
                      data={currencyGet}
                      btn="bg-transparent"
                      btnText="fw-semibold"
                      value={currencyGet.find(c => c.name === toCurrency)}
                      onChange={(val) => {
                        setToCurrency(val.name);
                        if (val.name === fromCurrency) {
                          setFromCurrency(val.name === "USD" ? "NGN" : "USD");
                        }
                      }}
                    />
                  </div>
                  <p>
                    Today’s rate: <b>1 {fromCurrency} = {currentRate} {toCurrency}</b>
                  </p>
                </div>
              </div>
             
              <div className="pay-details">
                <ul>
                  <li>
                    <p>processing fee ({feePercentage}%)</p>
                    <p>-{fee} {fromCurrency}</p>
                  </li>
                  <li>
                    <p>processing Time</p>
                    <p>3 Days</p>
                  </li>
                </ul>
                <div className="tatal-pay">
                  <div className="single">
                    <h5>Total Repayment</h5>
                    <h5>{totalToPay} {fromCurrency}</h5>
                  </div>
                  <div className="single">
                    <p>Amount to be Credited</p>
                    <h5>{toAmount} {toCurrency}</h5>
                  </div>
                </div>
              </div>
              <div className="footer-area mt-40">
                <Link
                  href="/loans/step-2"
                  onClick={handleContinue}
                  className="w-100 active text-center">
                  Continue
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StepOne;

