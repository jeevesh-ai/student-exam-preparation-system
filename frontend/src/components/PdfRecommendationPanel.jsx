import React, { useState } from "react";

export default function PdfRecommendationPanel({
  editableQuestion,
  setEditableQuestion,
  handleRetry,
  switchTab,
  pdfList = [],
  handleAddPdf,
}) {
  const [editMode, setEditMode] = useState(false);

  // PDF used for the failed search
  const currentPdf = pdfList.at(-1)?.name;

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        background: "rgba(31,41,55,0.95)",
        color: "#fff",
        padding: 28,
        borderRadius: 20,
        display: "flex",
        flexDirection: "column",
        gap: 20,
        zIndex: 50,
        width: 620,
      }}
    >
      {/* Title */}
      <div style={{ fontWeight: 600, fontSize: 18 }}>
        ⚠ No exact match found
      </div>

      <div style={{ fontSize: 12, color: "#9CA3AF" }}>
        Check spelling, improve clarity of your question, and try again
      </div>

      {/* Editable Question */}
      {editMode && (
        <div>
          <p style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 6 }}>
            QUESTION
          </p>
          <input
            value={editableQuestion}
            onChange={(e) => setEditableQuestion(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 10,
              border: "none",
              outline: "none",
              fontSize: 16,
              fontWeight: 500,
              color: "#111827",
            }}
          />
        </div>
      )}

      {/* PDF DISPLAY — SAME STYLE AS QUESTION */}
      <div>
        <p style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 6 }}>
          PDF USED FOR SEARCH
        </p>

        <div
          style={{
            background: "#ffffff",
            color: "#111827",
            padding: 14,
            borderRadius: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontSize: 18, fontWeight: 500 }}>
            {currentPdf || "No PDF selected"}
          </p>

          {/* Change PDF — placeholder */}
          <span
            onClick={handleAddPdf}
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#2563eb",
              cursor: "pointer",
              marginLeft: 16,
              whiteSpace: "nowrap",
            }}
          >
            Change
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={() => setEditMode(!editMode)}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 14,
            background: "#2563eb",
            fontWeight: 600,
            cursor: "pointer",
            border: "none",
            color: "#fff",
          }}
        >
          {editMode ? "Close Edit" : "Edit Question"}
        </button>

        <button
          onClick={handleRetry}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 14,
            background: "#3b82f6",
            fontWeight: 600,
            cursor: "pointer",
            border: "none",
            color: "#fff",
          }}
        >
          Retry
        </button>
      </div>

      {/* Suggestions */}
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <div
          onClick={() => switchTab("Textbook")}
          style={{
            flex: 1,
            background: "#111827",
            padding: 16,
            borderRadius: 14,
            cursor: "pointer",
          }}
        >
          <p style={{ fontWeight: 600 }}>Try Textbook Tab</p>
          <p style={{ fontSize: 12, color: "#9CA3AF" }}>
            Structured answers from textbook content
          </p>
        </div>

        <div
          onClick={() => switchTab("AI")}
          style={{
            flex: 1,
            background: "#111827",
            padding: 16,
            borderRadius: 14,
            cursor: "pointer",
          }}
        >
          <p style={{ fontWeight: 600 }}>Try AI Tab</p>
          <p style={{ fontSize: 12, color: "#9CA3AF" }}>
            AI explanation for extra clarity
          </p>
        </div>
      </div>
    </div>
  );
}