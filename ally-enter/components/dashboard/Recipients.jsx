import Image from "next/image";
import Link from "next/link";
import right_arrow from "/public/images/icon/right-arrow.png";
import { useContext } from "react";
import { PaylioContext } from "@/context/context";

const Recipients = () => {
  const { recipients } = useContext(PaylioContext);
  return (
    <div className="single-item">

      <div className="section-text d-flex align-items-center justify-content-between">
        <h6>Recipients</h6>
        <div className="view-all d-flex align-items-center">
          <Link href="/recipients">View All</Link>
          <Image src={right_arrow} alt="icon" />
        </div>
      </div>
      <ul className="recipients-item">
        {(recipients || []).slice(0, 4).map((recipient) => (

          <li key={recipient.id}>
            <p className="left d-flex align-items-center">
              <Image
                src={recipient.image}
                alt={recipient.name}
                width={40}
                height={40}
              />
              <span className="info">
                <span>{recipient.name}</span>
                <span>
                  {recipient.lastTransferTime || ""} — {recipient.lastTransferDate || ""}

                </span>
              </span>
            </p>
            <p className="right">
              <span className={recipient.amount.startsWith("-") ? "loss" : ""}>
                {recipient.amount}
              </span>
              <span>{recipient.type}</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Recipients;
