import React from "react";

const BankInstruction = () => {
  return (
    <div className="bank-instruction" style={{ marginTop: 20 }}>
      <h6 style={{ marginBottom: 10 }}>Bank Transfer Instructions</h6>
      <div
        style={{
          border: "1px solid rgba(196, 190, 228, 1)",
          borderRadius: 12,
          padding: 16,
          background: "rgba(196, 190, 228, 0.08)",
        }}
      >
        <p style={{ margin: 0, fontWeight: 700 }}>ECOBANK</p>
        <p style={{ margin: "6px 0 0" }}>Leacent Entrepreneurial Network</p>
        <p style={{ margin: "6px 0 0" }}>Acct Nr: <b>2080100211</b></p>
      </div>
    </div>
  );
};

export default BankInstruction;

