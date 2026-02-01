import React, { useState } from "react";
import PageFlip from "./PageFlip";
import "./reader.css";

function ReaderPage({ question, source, onBack, onAiClick, readerAnswer }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
    setShowQuestion(false);
  };

  const savePage = () => {
    alert(`Page ${currentPage + 1} saved!`);
  };

  // 🔥 Only show reader if readerAnswer exists
  if (!readerAnswer) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          fontSize: 18,
          color: "#6b7280",
        }}
      >
        Answer not found. Please try another PDF or check recommendations.
      </div>
    );
  }

  // Convert backend answer string to pages with continuous text flow
  const createPages = (answerText) => {
    if (!answerText) return [];

    // Split by lines (keep all formatting)
    const lines = answerText.split('\n');

    const pages = [];
    let currentPage = [];
    let currentLineCount = 0;
    const MAX_LINES_PER_PAGE = 25; // Increased to fill pages better

    lines.forEach((line) => {
      const trimmed = line.trim();

      // Estimate visual lines based on content type
      let estimatedLines = 1;

      if (trimmed.startsWith('## ')) {
        estimatedLines = 2.5; // Heading takes more space with border
      } else if (trimmed.startsWith('### ')) {
        estimatedLines = 2; // Subheading
      } else if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || /^\d+\.\s/.test(trimmed)) {
        estimatedLines = 1.5; // Bullet/numbered items with spacing
      } else if (trimmed.length > 80) {
        estimatedLines = Math.ceil(trimmed.length / 70); // Long paragraphs
      } else if (trimmed === '') {
        estimatedLines = 0.5; // Empty lines for spacing
      }

      if (currentLineCount + estimatedLines > MAX_LINES_PER_PAGE && currentPage.length > 2) {
        // Start new page
        pages.push({ text: currentPage });
        currentPage = [line];
        currentLineCount = estimatedLines;
      } else {
        currentPage.push(line);
        currentLineCount += estimatedLines;
      }
    });

    // Add remaining content as last page
    if (currentPage.length > 0) {
      pages.push({ text: currentPage });
    }

    return pages;
  };

  const pages = createPages(readerAnswer);

  return (
    <div className={`reader-root ${fullscreen ? "fullscreen-mode" : ""}`}>
      {/* NORMAL MODE TOP BAR */}
      {!fullscreen && (
        <div className="reader-topbar">
          <div className="top-left">
            <div onClick={onBack}>Back</div>
          </div>

          <div className="top-center">
            <div className="question-box">{question || "Question not available"}</div>
          </div>

          <div className="top-right">
            <span className="page-count">
              Page {currentPage + 1} / {pages.length}
            </span>

            {/* SAVE + AI STACK */}
            <div style={{ position: "relative", display: "inline-block" }}>
              <span className="icon-btn save-btn" onClick={savePage} title="Save">
                🔖
              </span>

              {/* AI HINT BELOW SAVE */}
              <div
                className="ai-hint"
                onClick={() => {
                  if (!onAiClick) return;
                  onAiClick({
                    question,
                    answer: readerAnswer,
                    source: source,
                  });
                }}
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  marginTop: 6,
                  cursor: "pointer",
                }}
              >
                💡
              </div>
            </div>

            {/* FULLSCREEN BUTTON */}
            <span className="icon-btn fullscreen-btn" onClick={toggleFullscreen} title="Fullscreen">
              ⛶
            </span>
          </div>
        </div>
      )}

      {/* FULLSCREEN MODE */}
      {fullscreen && (
        <>
          <div className="fullscreen-top">
            <div className="exit-btn" onClick={toggleFullscreen}>
              ← Exit
            </div>
            <div className="question-tab" onClick={() => setShowQuestion((v) => !v)}>
              Question
            </div>
          </div>

          {showQuestion && <div className="fullscreen-question-box">{question}</div>}
        </>
      )}

      {/* BOOK */}
      <div className="book-stage">
        <PageFlip pages={pages} onPageChange={setCurrentPage} />
      </div>

      {/* PAGE COUNT IN FULLSCREEN */}
      {fullscreen && (
        <div className="fullscreen-page-count">
          Page {currentPage + 1} / {pages.length}
        </div>
      )}
    </div>
  );
}

export default ReaderPage;