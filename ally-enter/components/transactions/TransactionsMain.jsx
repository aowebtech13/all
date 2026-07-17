"use client";
import Pagination from "@/components/pagination/Pagination";
import Filter from "@/components/transactions/Filter";
import { PaylioContext } from "@/context/context";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import csv from "/public/images/icon/csv.png";
import excel from "/public/images/icon/excel.png";
import pdf from "/public/images/icon/pdf.png";
import printer from "/public/images/icon/printer.png";
import search from "/public/images/icon/search.png";
import axios from "@/lib/axios";

const TransactionsMain = () => {
  const { activeLefMenu } = useContext(PaylioContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationData, setPaginationData] = useState(null);
  const [page, setPage] = useState(1);

  const fetchTransactions = async (pageNum = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/transactions?page=${pageNum}`);
      setTransactions(response.data.data || []);
      setPaginationData(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(page);
  }, [page]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: date.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })
    };
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'completed';
      case 'pending': return 'pending';
      case 'inprogress': return 'inprogress';
      case 'failed':
      case 'cancelled': return 'cancelled';
      default: return '';
    }
  };

  return (
    <section
      className={`dashboard-section transactions ${
        activeLefMenu ? "body-collapse" : ""
      }`}>
      <div className="overlay pt-120">
        <div className="container-fruid">
          <div className="head-area">
            <div className="row">
              <div className="col-lg-5 col-md-4">
                <h4>Transactions</h4>
              </div>
              <div className="col-lg-7 col-md-8">
                <div className="transactions-right d-flex align-items-center">
                  <form action="#" className="flex-fill">
                    <div className="form-group d-flex align-items-center">
                      <Image src={search} alt="icon" />
                      <input type="text" placeholder="Type to search..." />
                    </div>
                  </form>
                  <Link href="#">Monthly Statement</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div className="transactions-main">
                <div className="top-items">
                  <h6>All Transactions</h6>
                  <div className="export-area">
                    <ul className="d-flex align-items-center">
                      <li>
                        <Link href="#">
                          <Image src={printer} alt="icon" />
                          Print
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <Image src={excel} alt="icon" />
                          Excel
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <Image src={pdf} alt="icon" />
                          PDF
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <Image src={csv} alt="icon" />
                          CSV
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                {/* Filter */}
                <Filter />
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Name/ Business</th>
                        <th scope="col">Date</th>
                        <th scope="col">Status</th>
                        <th scope="col">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="4" className="text-center p-5">
                            <div className="spinner-border text-primary" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          </td>
                        </tr>
                      ) : transactions.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center p-5">No transactions found</td>
                        </tr>
                      ) : (
                        transactions.map((transaction) => {
                          const formattedDate = formatDate(transaction.created_at);
                          return (
                            <tr key={transaction.id} data-bs-toggle="modal" data-bs-target="#transactionsMod">
                              <th scope="row">
                                <p>{transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</p>
                                <p className="mdr">{transaction.description || (transaction.method ? `Via ${transaction.method}` : '')}</p>
                              </th>
                              <td>
                                <p>{formattedDate.time}</p>
                                <p className="mdr">{formattedDate.date}</p>
                              </td>
                              <td>
                                <p className={getStatusClass(transaction.status)}>
                                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                </p>
                              </td>
                              <td>
                                <p>{formatCurrency(transaction.amount)}</p>
                                <p className="mdr">No Fees</p>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Pagination (Simplified for now) */}
                {paginationData && paginationData.last_page > 1 && (
                  <nav aria-label="Page navigation" className="d-flex justify-content-center mt-40">
                    <ul className="pagination justify-content-center align-items-center mb-40">
                      <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
                      </li>
                      {[...Array(paginationData.last_page)].map((_, i) => (
                        <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
                        </li>
                      ))}
                      <li className={`page-item ${page === paginationData.last_page ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setPage(page + 1)} disabled={page === paginationData.last_page}>Next</button>
                      </li>
                    </ul>
                  </nav>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransactionsMain;
