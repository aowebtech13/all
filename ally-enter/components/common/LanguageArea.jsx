"use client";
import Image from "next/image";
import { useState } from "react";
const languages = [
  "English",
  "Hindi",
  "English US",
  "Japanese",
  "Kannada",
  "Lithuanian",
];
const LanguageArea = () => {
  const [active, setActive] = useState(languages[0]);
  return (
    <div className="single-item language-area">
      <div
        className="language-btn dropdown"
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
        aria-expanded="false">
        <Image src="/images/icon/lang.png" width={20} height={20} alt="icon" />
      </div>
      <ul
        aria-labelledby="dropdownMenuButton"
        className={`main-area dropdown-menu language-content`}>
        {languages.map((item) => (
          <li
            className={active == item ? "active" : ""}
            onClick={() => setActive(item)}
            key={item}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LanguageArea;
