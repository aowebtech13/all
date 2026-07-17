import Image from "next/image";
import Link from "next/link";
import Select from "../select/Select";
import option from "/public/images/icon/option.png";
import { useAuth } from "@/hooks/useAuth";

const currency = [
  { id: 1, name: "Dollar" },
];

const AccountDetails = ({ dashboardData, loading }) => {
  const { user } = useAuth();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="top-area">
        <div className="left-side">
          <h5>Hi, {user?.name || 'Guest'}!</h5>
          <h2>{formatCurrency(dashboardData?.stats?.balance)}</h2>
          <h5 className="receive">
            Balance <span>{formatCurrency(dashboardData?.stats?.balance)}</span>
          </h5>
        </div>
        <div className="right-side">
          <div className="right-top">
            {/* Select */}
            <Select
              data={currency}
              btn="bg-transparent"
              btnText="fw-semibold text-white"
            />
            <div className="dropdown-area">
              <button
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <Image src={option} alt="icon" />
              </button>
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton1"
              >
                <li>
                  <Link className="dropdown-item" href="#">
                    Fiat Currency
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" href="#">
                    crypto Currency
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="right-bottom">
            <h4>{formatCurrency(dashboardData?.stats?.total_invested)}</h4>
            <h5>Total Invested</h5>
          </div>
        </div>
      </div>
      <div className="bottom-area">
        <div className="left-side">
          <Link href="/pay/step-1" className="cmn-btn">
            Send Money
          </Link>
          <Link href="/receive/step-1" className="cmn-btn">
            Receive Money
          </Link>
          
          <Link href="/withdraw-money/step-1" className="cmn-btn">
            Withdraw
          </Link>
        </div>
        <div className="right-side">
          <div className="dropdown-area">
            <button
              type="button"
              id="dropdownMenuButton2"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <Image src={option} alt="icon" />
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton2">
              <li>
                <Link className="dropdown-item" href="/recipients">
                  Recipients
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" href="/receive/step-1">
                  Request Money
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" href="/pay/step-1">
                  Send Money
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" href="/pay/step-1">
                  Bill Pay
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountDetails;
