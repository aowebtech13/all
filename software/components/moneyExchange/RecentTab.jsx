import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { PaylioContext } from "@/context/context";

const RecentTab = () => {
  const { recipients } = useContext(PaylioContext);
  return (

    <div
      className="tab-pane fade"
      id="recent"
      role="tabpanel"
      aria-labelledby="recent-tab"
    >
      <div className="user-select">
        {(recipients || []).slice(0, 3).map((recipient) => (

          <div className="single-user" key={recipient.id}>
            <div className="left d-flex align-items-center">
              <div className="img-area">
                <Image
                  src={recipient.image}
                  alt={recipient.name}
                  width={40}
                  height={40}
                />
              </div>
              <div className="text-area">
                <p>{recipient.name}</p>
                <span className="mdr">{recipient.email}</span>
              </div>
            </div>
            <div className="right">
              <Link href="#">Choose</Link>
            </div>
          </div>
        ))}
      </div>
      <div className="col-12">
        <div className="footer-area mt-40">
          <Link href="/loans/step-1">Previous Step</Link>
          <Link href="/loans/step-3" className="active">
            Next
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecentTab;
