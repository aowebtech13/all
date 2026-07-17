"use client";
import { PaylioContext } from "@/context/context";
import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import LanguageArea from "../common/LanguageArea";
import NotificationsArea from "../common/NotificationsArea";
import UserArea from "../common/UserArea";
import LeftSideMenu from "../leftSideMenu/LeftSideMenu";
import menu from "/public/images/icon/menu.png";
import search from "/public/images/icon/search.png";

const NavBar = () => {
  const [windowHeight, setWindowHeight] = useState(0);
  const { activeLefMenu, setActiveLefMenu } = useContext(PaylioContext);
  const menus = useRef();

  const hidenMenu = () => {
    menus.current.classList.remove("show");
  };

  const navBarTop = () => {
    if (window !== undefined) {
      let height = window.scrollY;
      setWindowHeight(height);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", navBarTop);
    return () => {
      window.removeEventListener("scroll", navBarTop);
    };
  }, []);

  return (
    <header
      className={`header-section position-fixed ${
        activeLefMenu ? "body-collapse" : ""
      } `}>
      <div className="overlay">
        <div className="container-fruid">
          <div className="row d-flex header-area">
            <div className="navbar-area d-flex align-items-center justify-content-between">
              <div className="sidebar-icon">
                <Image
                  src={menu}
                  alt="icon"
                  onClick={() => setActiveLefMenu((prev) => !prev)}
                />
              </div>
              <form action="#" className="flex-fill">
                <div className="form-group d-flex align-items-center">
                  <Image src={search} alt="icon" />
                  <input type="text" placeholder="Type to search..." />
                </div>
              </form>
              <div className="dashboard-nav">
                {/* Language Area */}
                <LanguageArea />

                {/* Notifications Area */}
                <NotificationsArea />

                {/* User Area */}
                <UserArea />
              </div>
            </div>

            {/* Left Side Menu */}
            <LeftSideMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
