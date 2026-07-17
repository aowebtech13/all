"use client";
import { PaylioContext } from "@/context/context";
import Image from "next/image";
import { useContext } from "react";
import Pagination from "../pagination/Pagination";
import Select from "../select/Select";
import RecipientsTable from "./RecipientsTable";
import search from "/public/images/icon/search.png";

const sortBy = [
  { id: 1, name: "Sort by: A-Z" },
  { id: 2, name: "Sort by: Z-A" },
  { id: 3, name: "Sort by: Date" },
];

const status = [
  { id: 1, name: "All Status" },
  { id: 2, name: "Status 1" },
  { id: 3, name: "Status 2" },
  { id: 4, name: "Status 3" },
];

const RecipientsMain = () => {
  const { activeLefMenu } = useContext(PaylioContext);
  return (
    <section
      className={`dashboard-section ${
        activeLefMenu ? "body-collapse" : ""
      } transactions recipients`}>
      <div className="overlay pt-120">
        <div className="container-fruid">
          <div className="row">
            <div className="col-xl-12">
              <div className="transactions-main">
                <div className="filters-item d-flex justify-content-lg-between">
                  <div className="single-item search-area">
                    <form action="#" className="flex-fill">
                      <div className="form-group d-flex align-items-center">
                        <Image src={search} alt="icon" />
                        <input type="text" placeholder="Type to search..." />
                      </div>
                    </form>
                  </div>
                  <div className="right-area w-100 d-flex align-items-center">
                    <div className="single-item">
                      {/* Select */}
                      <Select data={sortBy} btn="py-0" btnText="text-white" />
                    </div>
                    <div className="single-item">
                      {/* Select */}
                      <Select data={status} btn="py-0" btnText="text-white" />
                    </div>
                    <div className="single-item">
                      <button
                        data-bs-toggle="modal"
                        data-bs-target="#recipientsMod">
                        <i className="icon-e-plus"></i>
                        New Recipients
                      </button>
                    </div>
                  </div>
                </div>
                <div className="table-responsive">
                  {/* Recipients Table */}
                  <RecipientsTable />
                </div>
                {/* Pagination */}
                <Pagination />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecipientsMain;
