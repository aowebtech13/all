import Image from "next/image";
import Link from "next/link";
import { FaTimes } from "react-icons/fa";
import { useContext, useMemo } from "react";
import { PaylioContext } from "@/context/context";
import success from "/public/images/icon/success.png";

const CongratulationsModal = () => {
  const { depositData } = useContext(PaylioContext);

  const { amountText, currency } = useMemo(() => {
    const amount = Number(depositData?.amount);
    const cur = depositData?.currency || "USD";
    const value = Number.isFinite(amount) && amount > 0 ? amount : 0;
    let formatted;
    try {
      formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: cur,
        maximumFractionDigits: 2,
      }).format(value);
    } catch {
      formatted = `${value.toFixed(2)} ${cur}`;
    }
    return { amountText: formatted, currency: cur };
  }, [depositData?.amount, depositData?.currency]);

  return (
    <div className="congratulations-popup purchased-popup">
      <div className="container-fruid">
        <div className="row">
          <div className="col-lg-6">
            <div
              className="modal fade"
              id="congratulationsMod"
              aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close">
                      <i>
                        <FaTimes />
                      </i>
                    </button>
                  </div>
                  <div className="main-content text-center pt-120 pb-120">
                    <Image className="mb-60" src={success} alt="icon" />
                    <h4 className="mb-30">Congratulations</h4>
                    <p>
                      You have made a deposit{" "}
                      {amountText} to your account. please wait for approval
                    </p>
                    <Link href="/dashboard" className="mt-40">
                      <span data-bs-dismiss="modal" className="text-white">
                        Back to Dashboard
                      </span>
                    </Link>
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

export default CongratulationsModal;
