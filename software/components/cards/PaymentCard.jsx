import Image from "next/image";
import Link from "next/link";

const PaymentCard = ({ data }) => {
  const { id, icon, title, pay, link } = data;
  return (
    <Link href={link} className="single-item">
      <div className="icon-area">
        <Image src={icon} alt="icon" />
      </div>
      <p className="mdr">{title}</p>
      <span className="mdr">{pay}</span>
    </Link>
  );
};

export default PaymentCard;
