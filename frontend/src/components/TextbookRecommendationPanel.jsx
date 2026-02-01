import React, { useState } from "react";

export default function TextbookRecommendationPanel({
  editableQuestion,
  setEditableQuestion,
  handleRetry,
  switchTab,
  textbookPdfList = [],
  selectedMarks,
  setSelectedMarks,
}) {
  const [editMode, setEditMode] = useState(false);

  const currentPdf = textbookPdfList.at(-1);

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
        ⚠ No content found to structure answer
      </div>

      <div style={{ fontSize: 12, color: "#9CA3AF" }}>
        Edit the question or source and try again
      </div>

      {/* ===== EDIT MODE ===== */}
      {editMode && (
        <>
          {/* QUESTION */}
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

          {/* TEXTBOOK PDF — SAME STYLE AS PDF PANEL */}
          <div>
            <p style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 6 }}>
              TEXTBOOK PDF USED
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
                {currentPdf || "Textbook PDF selected automatically"}
              </p>

              {/* Placeholder change */}
              <span
                onClick={() =>
                  alert(
                    "Textbook PDF change/upload will be enabled after backend integration"
                  )
                }
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

          {/* ✅ MARKS SELECTOR (UNCHANGED) */}
          <select
            value={selectedMarks || ""}
            onChange={(e) => setSelectedMarks(Number(e.target.value))}
            style={{
              padding: 8,
              borderRadius: 8,
              border: "1px solid #3b82f6",
              color: "#111827",
            }}
          >
            <option value="">Marks (Optional)</option>
            <option value={2}>2 Marks</option>
            <option value={5}>5 Marks</option>
            <option value={10}>10 Marks</option>
          </select>
        </>
      )}

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
            border: "none",
            cursor: "pointer",
            color: "#fff",
          }}
        >
          {editMode ? "Close Edit" : "Edit"}
        </button>

        <button
          onClick={handleRetry}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 14,
            background: "#3b82f6",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            color: "#fff",
          }}
        >
          Retry
        </button>
      </div>

      {/* Suggestions — UNCHANGED */}
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <div
          onClick={() => switchTab("PDF")}
          style={{
            flex: 1,
            background: "#111827",
            padding: 16,
            borderRadius: 14,
            cursor: "pointer",
          }}
        >
          <p style={{ fontWeight: 600 }}>Try PDF Tab</p>
          <p style={{ fontSize: 12, color: "#9CA3AF" }}>
            Get exact answers from your uploaded answers PDF
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
            Get extra help or AI explanation
          </p>
        </div>
      </div>
    </div>
  );
}