"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import axios from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";


import option from "/public/images/icon/option.png";
import paylio_card from "/public/images/paylio-card.png";
import visa_card from "/public/images/visa-card.png";

const LinkedPaymentSystem = () => {
  const { user } = useAuth();
  const [selectedCardId, setSelectedCardId] = useState(null);


  const [cards, setCards] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const defaultCard = useMemo(() => {
    return cards?.find((c) => c?.is_default) || cards?.[0] || null;
  }, [cards]);

  const isLinked = Boolean(defaultCard);
  const transferLimit = Number(defaultCard?.transfer_limit || 0);

  useEffect(() => {
    // Backend blocks /api/my-cards with HTTP 402 until user confirms ₦5,000 deposit.
    // Skip the request entirely until the user is eligible.
    if (!user?.email_verified_at) {
      setCards([]);
      setError(null);
      setLoading(false);
      return;
    }

    let mounted = true;

    const run = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/my-cards");
        if (!mounted) return;
        setCards(res?.data?.cards || []);
        setError(null);
      } catch (e) {
        if (!mounted) return;

        // Treat expected “verification deposit required” as a normal empty state.
        const status = e?.response?.status;
        if (status === 402) {
          setCards([]);
          setError(null);
          return;
        }

        console.error("Failed to fetch my cards", e);
        setError("Unable to load linked cards.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [user]);


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  return (
    <>
      <div className="section-text d-flex align-items-center justify-content-between">
        <h6>Linked Payment system</h6>
        <div className="right-side">
          <div className="dropdown-area">
            <button
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <Image src={option} alt="icon" />
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <li>
                <Link className="dropdown-item" href="/account">
                  Update
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" href="#">
                  Virtual card
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : error ? (
        <div className="alert alert-danger mt-3" role="alert">
          {error}
        </div>
      ) : (
        <>
          <div className="d-flex flex-column gap-3">
            <div className="row">
              {(cards?.length ? cards : []).map((card) => {
                const isSelected =
                  (selectedCardId && selectedCardId === card.id) ||
                  (!selectedCardId && defaultCard?.id === card.id);

                const cardType = (card?.type || "").toLowerCase();
                const cardImageSrc =
                  cardType === "paylio" || cardType === "bank"
                    ? paylio_card
                    : visa_card;

                return (
                  <div className="col-6" key={card.id}>
                    <div className="single-card">
                      <button
                        type="button"
                        className={`reg w-100 ${isSelected ? "active" : ""}`}
                        onClick={() => setSelectedCardId(card.id)}
                        data-bs-toggle="modal"
                        data-bs-target="#cardMod"
                      >
                        <Image
                          src={cardImageSrc}
                          alt="linked card"
                          className="w-100"
                        />
                        {isSelected ? (
                          <div className="text-center mt-2">
                            <small className="text-muted">
                              Transfer limit: {formatCurrency(Number(card?.transfer_limit || 0))}
                            </small>
                          </div>
                        ) : null}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {!cards?.length ? (
              <div className="alert alert-info mt-2" role="alert">
                No linked cards found. Add a card to enable linked payments.
              </div>
            ) : null}

            {cards?.length ? (
              <div className="mt-1">
                <small className="text-muted">
                  Selected transfer limit: {formatCurrency(transferLimit)}
                </small>
              </div>
            ) : null}
          </div>
        </>
      )}
    </>
  );
};

export default LinkedPaymentSystem;
