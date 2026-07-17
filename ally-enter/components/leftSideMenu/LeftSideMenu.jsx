import { PaylioContext } from "@/context/context";
import leftSideMenuData from "@/data/leftSideMenuData";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { FaTimes } from "react-icons/fa";
import invite_now_illus from "/public/images/invite-now-illus.png";


const LeftSideMenu = () => {
  const { activeLefMenu, setActiveLefMenu, getPath } =
    useContext(PaylioContext);

  return (
    <div className={`sidebar-wrapper ${!activeLefMenu ? "active" : ""}`}>
      <div
        className="close-btn"
        onClick={() => setActiveLefMenu(!activeLefMenu)}>
        <i>
          <FaTimes />
        </i>
      </div>
    
      <ul>
        {leftSideMenuData.map((itm) => (
          <li key={itm.id} className={getPath === itm.path ? "active" : ""}>
            <Link href={itm.url}>
              {/* <Image src={itm.icon} alt={itm.name} /> */}
              {itm.icon}
              <span>{itm.name}</span>
            </Link>
          </li>
        ))}
      </ul>
      <ul className="bottom-item">
        <li className={getPath === "account" ? "active" : ""}>
          <Link href="/account">
            <i className="icon-account"></i> <span>Account</span>
          </Link>
        </li>
       
        <li>
          <button className="bg-transparent">
            <i className="icon-quit"></i> <span>Logout</span>
          </button>
        </li>
      </ul>
      <div className="pt-120">
        <div className="invite-now">
          <div className="img-area">
            <Image src={invite_now_illus} alt="Image" />
          </div>
          <p>Invite your friend and get $25</p>
          <Link href="#" className="cmn-btn">
            Invite Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LeftSideMenu;
