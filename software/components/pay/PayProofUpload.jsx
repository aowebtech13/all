"use client";
import React, { useId } from "react";

const PayProofUpload = ({ value, onChange, error }) => {
  const inputId = useId();

  return (
    <div className="file-upload" style={{ marginTop: 18 }}>
      <div className="right-area">
        <label
          htmlFor={inputId}
          style={{
            display: "block",
            border: "1px dashed #c4bee4",
            borderRadius: 12,
            padding: 16,
            backgroundImage: "url(/images/icon/upload-icons.png)",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 18px center",
            cursor: "pointer",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 6 }}>
            Upload Payment Proof (Screenshot)
          </div>
          <div style={{ fontSize: 13, opacity: 0.9 }}>
            PNG/JPG/GIF, max 2MB

          </div>
        </label>

        <input
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/gif"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            onChange?.(file);
          }}
        />

        {value ? (
          <div style={{ marginTop: 10, fontSize: 13 }}>
            Selected: <b>{value.name}</b>
          </div>
        ) : null}

        {error ? (
          <div style={{ marginTop: 10, color: "#b42318", fontSize: 13 }}>
            {error}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PayProofUpload;

