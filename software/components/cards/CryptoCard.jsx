import Image from "next/image";
import Link from "next/link";

const CryptoCard = ({ data }) => {
  return (
    <Link href={data.link} className="single-item">
      <div className="icon-area">
        <Image src={data.icon} alt="icon" />
      </div>
      <span>{data.title}</span>
    </Link>
  );
};

export default CryptoCard;
