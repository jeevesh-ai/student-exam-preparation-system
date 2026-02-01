import React, { useState, useEffect } from "react";

import backgroundImage from "./assets/backgroundimage2.jpg.jpeg";

import PdfSearchLoader from "./components/PdfSearchLoader";

import PdfRecommendationPanel from "./components/PdfRecommendationPanel";

import TextbookRecommendationPanel from "./components/TextbookRecommendationPanel";

import ReaderPage from "./Reader/ReaderPage";







function Answerviewer({ question, setQuestion, onBack, onAnswerFound }) {









  // ===== TEMPORARY BACKEND STUB =====

  const sendToBackend = (question, context) => {

    console.log("Question to send:", question);

    console.log("Context to send:", context);

  };



  const [entryLocked, setEntryLocked] = useState(false);

  const [lastActiveTab, setLastActiveTab] = useState(null);

  const [viewerPhase, setViewerPhase] = useState("ready");

  const [hoveredTab, setHoveredTab] = useState(null);

  const [activeTab, setActiveTab] = useState(null);

  const [pdfList, setPdfList] = useState([]);

  const [showPdfDropdown, setShowPdfDropdown] = useState(false);

  const [textbookPdfList, setTextbookPdfList] = useState([]);

  const [showTextbookDropdown, setShowTextbookDropdown] = useState(false);

  const [selectedMarks, setSelectedMarks] = useState(null);

  const [confirming, setConfirming] = useState(false);

  const [confirmed, setConfirmed] = useState(false);

  const [textbookConfirming, setTextbookConfirming] = useState(false);

  const [textbookConfirmed, setTextbookConfirmed] = useState(false);

  const [searching, setSearching] = useState(false);

  const [answerFound, setAnswerFound] = useState(null);

  const [editMode, setEditMode] = useState(false);

  const [editableQuestion, setEditableQuestion] = useState(question || "");

  const hasQuestion = Boolean(question);

  const hasAnswer = Boolean(answerFound);



  const entryType =

    hasQuestion && hasAnswer

      ? "QUESTION_AND_ANSWER"

      : "ONLY_QUESTION";



  const [aiQuestionExpanded, setAiQuestionExpanded] = useState(false);

  const [aiInstruction, setAiInstruction] = useState("");

  const [aiResult, setAiResult] = useState(null);

  const [showAIQuestion, setShowAIQuestion] = useState(false);

  const [promptChosen, setPromptChosen] = useState(false);

  const [readerAnswer, setReaderAnswer] = useState(null);

  const [aiReaderAnswer, setAiReaderAnswer] = useState(null);


  // ✅ Process AI: Handle both Direct Question Mode & Reader Enhancement Mode
  const processAI = async (question, aiInstruction, existingAnswer = null) => {
    try {
      const formData = new FormData();
      formData.append("question", question);
      formData.append("ai_instruction", aiInstruction);

      if (existingAnswer) {
        formData.append("mode", "enhance_answer");
        formData.append("existing_answer", existingAnswer);
      } else {
        formData.append("mode", "question_only");
      }

      const res = await fetch("https://empty-toes-type.loca.lt/process_ai/", {
        method: "POST",
        body: formData,
      });

      return await res.json();
    } catch (err) {
      console.error("Backend error:", err);
      return { status: "error", message: err.message };
    }
  };

  // ✅ NEW: Send PDF + Question to backend
  const sendPdfQuestionToBackend = async (question, pdfFile) => {
    try {
      const formData = new FormData();
      formData.append("question", question);
      formData.append("pdf", pdfFile);

      const res = await fetch("https://empty-toes-type.loca.lt/pdf/save", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      // ✅ Explicit success/failure handling
      if (data.status === "success") {
        return { status: "success", pdfName: data.pdfName };
      } else {
        return { status: "failure", message: data.message || "Upload failed" };
      }
    } catch (err) {
      console.error("Backend error:", err);
      return { status: "error", message: err.message };
    }
  };

  const fetchPdfAnswer = async (pdfName, question) => {
    const formData = new FormData();
    formData.append("question", question);
    formData.append("pdfName", pdfName);

    try {
      const res = await fetch("https://empty-toes-type.loca.lt/pdf/get-answer", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.status === "success" && data.answer?.trim()) {
        setReaderAnswer(data.answer); // ✅ only if real answer exists
        setAnswerFound(true);
        setViewerPhase("reader");     // ✅ open reader
      } else {
        setReaderAnswer(null);        // 🔥 clear previous
        setAnswerFound(false);        // show recommendations
        setViewerPhase("ready");      // stay in tab
      }
    } catch (err) {
      console.error("Error fetching answer:", err);
      setReaderAnswer("Error fetching answer from backend.");
      setAnswerFound(false);
      setViewerPhase("ready");
    }
  };
  const pdfInputRef = React.useRef(null);
  const textbookInputRef = React.useRef(null);



  const tabs = [

    {

      label: "PDF",

      sub: "Official source",

      hoverMsg: "Get exact structured answer from the uploaded answers PDF.",

    },

    {

      label: "Textbook",

      sub: "Structured answer",

      hoverMsg: "Structured textbook answers help you understand key concepts efficiently.",

    },

    {

      label: "AI",

      sub: "Extra help",

      hoverMsg: "Optional AI explanation for conceptual clarity and extra help.",

    },



  ];





  const onlyQuestionPrompts = [

    "Give a 2-mark exam answer",

    "Give a 5-mark exam answer",

    "Give a 10-mark detailed answer",

    "Write the answer exactly as expected in exams",

    "Explain step by step",

    "Give the definition with key points",

    "Answer using simple language",

    "Add one clear example",

    "Write answer in bullet points",

    "Explain like I’m new to this topic",

    "Focus on important exam keywords",

    "Give a short and precise answer",

    "Explain with a real-life analogy",

    "Highlight important points only",

    "Convert this question into an easy explanation",

  ];



  const questionAnswerPrompts = [

    "Explain this answer in simple words",

    "Break this answer into easy steps",

    "Convert this into revision notes",

    "Add a simple example",

    "Explain the logic behind this answer",

    "Make this easier to remember",

    "Summarize this for quick revision",

    "Explain this as if teaching a friend",

    "Clarify confusing parts only",

    "Shorten this without losing meaning",

    "Improve clarity for exam writing",

    "Highlight key points only",

    "Convert into question–answer format",

    "Explain using a diagram description",

    "Give a conceptual explanation",

  ];



  /* ---------------- PDF TAB ---------------- */


  // Programmatically open file selector
  const triggerPdfUpload = () => {
    pdfInputRef.current?.click();
  };


  // Triggered after user selects a PDF file
  const handleAddPdf = (file) => {
    if (!file) return;
    setPdfList([...pdfList, file]); // store File object
    setConfirmed(false);
    setViewerPhase("ready");
  };

  // Confirm PDF selection and "send to backend"
  const handleConfirmClick = async () => {
    if (!pdfList.length) return;

    const lastPdf = pdfList.at(-1);

    setSearching(true);
    setViewerPhase("searching");
    setConfirming(true);

    // ✅ Reuse processTextbook logic for PDF tab
    const result = await processTextbook(
      editableQuestion,
      lastPdf.file || lastPdf,
      null
    );

    setConfirming(false);
    setConfirmed(true);
    setSearching(false);

    if (result.status === "success") {
      setReaderAnswer(result.answer);
      setAnswerFound(true);
      setHoveredTab(null);
      setActiveTab("PDF");
      setLastActiveTab("PDF");
      setViewerPhase("reader");
      onAnswerFound?.({ pdfName: lastPdf.name });
    } else {
      setReaderAnswer(null);
      setAnswerFound(false);
      setViewerPhase("ready");
    }
  };


  /* ---------------- TEXTBOOK TAB ---------------- */



  // Trigger file picker
  const triggerTextbookUpload = () => {
    textbookInputRef.current?.click();
  };

  // Handle selected file
  const handleAddTextbookPdf = (file, marks = null) => {
    if (!file) return;

    const newPdf = {
      id: Date.now(),
      name: file.name,
      file: file,
      marks: marks, // optional
    };

    setTextbookPdfList((prev) => [...prev, newPdf]);
    setTextbookConfirmed(false);
    setViewerPhase("ready");
  };
  // ✅ Process Textbook: Upload PDF + Get Answer in one call
  const processTextbook = async (question, pdfFile, marks = null) => {
    try {
      const formData = new FormData();
      formData.append("file", pdfFile);
      formData.append("question", question);
      if (marks) {
        formData.append("marks", marks);
      }

      const res = await fetch("https://empty-toes-type.loca.lt/process_textbook/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.status === "success" && data.answer?.trim()) {
        return {
          status: "success",
          answer: data.answer,
          filename: data.filename
        };
      } else {
        return {
          status: "failure",
          message: data.message || "Could not structure answer from textbook"
        };
      }
    } catch (err) {
      console.error("Backend error:", err);
      return { status: "error", message: err.message };
    }
  };

  // ✅ Handle Prompt Selection (Mode 1 & Mode 2)
  const handlePromptClick = async (prompt) => {
    setPromptChosen(prompt);
    // Use searching state for loading UI
    setViewerPhase("searching");
    setSearching(true);

    // Prepare inputs based on mode
    // If aiReaderAnswer exists, we are in Mode 2 (Reader Enhancement)
    // Otherwise we are in Mode 1 (Direct Question)

    const existingAnswerText = aiReaderAnswer?.source?.answer || aiReaderAnswer?.source || aiReaderAnswer?.answer;

    const result = await processAI(
      editableQuestion,
      prompt,
      existingAnswerText
    );

    setSearching(false);

    if (result.status === "success") {
      setAiResult(result.ai_answer);
    } else {
      setAiResult("Sorry, I couldn't generate an answer. Please try again.");
    }
  };

  // ✅ Open AI result in Reader Mode
  const openAiInReader = () => {
    setReaderAnswer(aiResult);
    setViewerPhase("reader");
    setActiveTab("AI");
  };

  // Confirm Textbook PDF + question
  const handleTextbookConfirm = async () => {
    if (!textbookPdfList.length) return;
    const lastPdf = textbookPdfList.at(-1);

    // Show loading/searching state
    setTextbookConfirming(true);
    setViewerPhase("searching");
    setSearching(true);

    // Process textbook with backend
    const result = await processTextbook(
      editableQuestion,
      lastPdf.file || lastPdf,
      selectedMarks
    );

    setTextbookConfirming(false);
    setTextbookConfirmed(true);
    setSearching(false);

    if (result.status === "success") {
      // ✅ Answer found → open reader automatically
      setReaderAnswer(result.answer);
      setAnswerFound(true);
      setViewerPhase("reader");
      setHoveredTab(null);
      setActiveTab("Textbook");
      setLastActiveTab("Textbook");
    } else {
      // ❌ No answer → show recommendation panel
      setReaderAnswer(null);
      setAnswerFound(false);
      setViewerPhase("ready");
    }
  };

  // Retry button logic
  const handleRetry = () => {
    setEditMode(false);
    if (activeTab === "Textbook") handleTextbookConfirm();
    else handleConfirmClick();
  };

  // Switch tab logic
  const switchTab = (tab) => {
    setActiveTab(tab);
    setViewerPhase("ready");
    setAnswerFound(null);
    setSearching(false);
  };

  // Keep editable question synced
  useEffect(() => {
    if (editMode) {
      setEditableQuestion((prev) => prev || question || "");
    } else {
      setEditableQuestion(question || "");
    }
  }, [editMode, question]);



  //READER

  if (viewerPhase === "reader") {

    return (

      <ReaderPage

        question={editableQuestion}

        source={activeTab}
        readerAnswer={readerAnswer} // ✅ pass backend answer here

        onBack={() => {

          setViewerPhase("ready");

          setActiveTab(lastActiveTab);

          setHoveredTab(null);

          setEntryLocked(true);

        }}

        onAiClick={({ question, answer, source }) => {
          setViewerPhase("ready");
          setActiveTab("AI");
          setLastActiveTab("AI");
          setAiReaderAnswer({ answer, source }); // Set context for Mode 2 prompts
          setReaderAnswer(answer);
          setEditableQuestion(question);
          setAnswerFound(true);
          setPromptChosen(false);
          setAiResult(null);
          setAiInstruction("");
          setShowAIQuestion(true);
        }}

      />

    );

  }

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: "1200px",
        height: "900px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* ===== BACKGROUND IMAGE (BLUR) ===== */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: searching ? "blur(4px) brightness(0.6)" : "none",
          transition: "filter 0.3s ease",
          zIndex: 0,
        }}
      />

      {/* ===== FOREGROUND UI ===== */}
      <div style={{ position: "relative", zIndex: 2, height: "100%" }}>
        {/* Back Button */}
        <div
          onClick={() => {
            if (viewerPhase === "reader") {
              setViewerPhase("ready");
              setActiveTab(lastActiveTab);
              setHoveredTab(null);
            } else {
              onBack?.();
            }
          }}
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            width: 40,
            height: 40,
            background: "#60a5fa",
            borderRadius: "50%",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          ←
        </div>
        {/* ... ALL OTHER CONTENT ... */}
        {/* ===== Question Card + Tabs ===== */}

        {viewerPhase !== "reader" && (
          <>
            <div

              style={{

                position: "absolute",

                left: 80,

                right: 80,

                top: activeTab ? 40 : 80,

                transition: "top 0.5s ease",

              }}

            >

              {!activeTab && (

                <div

                  style={{

                    background: "#fff",

                    borderRadius: 20,

                    padding: 28,

                    marginBottom: 40,

                    zIndex: 2,

                    position: "relative",

                  }}

                >

                  <p style={{ fontSize: 12, color: "#9CA3AF" }}>QUESTION</p>

                  <p style={{ fontSize: 18, fontWeight: 500 }}>

                    {question || "Question will appear here"}

                  </p>

                </div>

              )}

              {/* Tabs */}

              <div

                style={{

                  position: "relative",

                  padding: 28,

                  borderRadius: 22,

                  background: "linear-gradient(160deg,#1f2933,#111827)",

                  zIndex: 2,

                }}

              >

                <style>{`
  
    @keyframes breathe {0%,100%{transform:scale(1)}50%{transform:scale(1.015)}}
  
    @keyframes fadeUp {from {opacity:0; transform:translate(-50%,10px)} to {opacity:1; transform:translate(-50%,0)}}
  
    @keyframes spin {to {transform:rotate(360deg)}}
  
  `}

                </style>

                <div style={{ display: "flex", gap: 18 }}>

                  {tabs.map((tab, i) => (

                    <div

                      key={i}

                      onMouseEnter={() => setHoveredTab(tab.label)}

                      onMouseLeave={() => setHoveredTab(null)}

                      onClick={() => {

                        setActiveTab(tab.label);

                        setEntryLocked(true);   // 🔒 LOCK ENTRY FOREVER

                        setViewerPhase("ready");

                      }}

                      style={{

                        flex: 1,

                        padding: "32px 0",

                        borderRadius: 18,

                        background:

                          activeTab === tab.label

                            ? "linear-gradient(#3b82f6,#2563eb)"

                            : "linear-gradient(rgba(255,255,255,.14),rgba(255,255,255,.06))",

                        color: "#fff",

                        textAlign: "center",

                        cursor: "pointer",

                        animation: "breathe 6s infinite",

                        position: "relative",

                      }}

                    >

                      <div style={{ fontSize: 20, fontWeight: 600 }}>

                        {tab.label}

                      </div>

                      <div style={{ fontSize: 12, opacity: 0.7 }}>{tab.sub}</div>

                      {!entryLocked && hoveredTab === tab.label && (

                        <>

                          <svg

                            width="260"

                            height="120"

                            style={{

                              position: "absolute",

                              top: "100%",

                              left: "50%",

                              transform: "translateX(-50%)",

                            }}

                          >

                            <path

                              d="M130 0 C 130 40, 40 40, 40 80 S 120 120, 220 100"

                              fill="none"

                              stroke="#60a5fa"

                              strokeDasharray="6 6"

                            >

                              <animate

                                attributeName="stroke-dashoffset"

                                from="0"

                                to="12"

                                dur="1.2s"

                                repeatCount="indefinite"

                              />

                            </path>

                          </svg>

                          <div

                            style={{

                              position: "absolute",

                              top: "calc(100% + 110px)",

                              left: "50%",

                              transform: "translateX(-50%)",

                              width: 340,

                              padding: 18,

                              background: "#1f2937",

                              borderRadius: 18,

                              animation: "fadeUp .4s",

                            }}

                          >

                            {tab.hoverMsg}

                          </div>

                        </>

                      )}

                    </div>

                  ))}

                </div>

              </div>

              {/* PDF / Textbook / AI Panels */}

// Hidden PDF input
              <input
                type="file"
                accept="application/pdf"
                style={{ display: "none" }}
                ref={pdfInputRef}
                onChange={(e) => handleAddPdf(e.target.files[0])}
              />
              <input
                type="file"
                accept="application/pdf"
                ref={textbookInputRef}
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    handleAddTextbookPdf(file);
                  }
                }}
              />

              {/* ===== PDF Panel ===== */}
              {activeTab === "PDF" && (
                <div
                  style={{
                    margin: "20px auto",
                    width: 480,
                    padding: 14,
                    borderRadius: 14,
                    background: "#e0f2fe",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {/* PDF Confirm */}
                  <div
                    onClick={handleConfirmClick}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      border: "2px solid #3b82f6",
                      marginRight: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    {confirming && (
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          border: "2px solid #3b82f6",
                          borderTopColor: "transparent",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                        }}
                      />
                    )}
                    {confirmed && "✔"}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12 }}>Answer Source</div>
                    <div style={{ fontSize: 16 }}>
                      {pdfList.at(-1)?.name || "Upload your answers PDF"}
                    </div>
                  </div>

                  {/* Dropdown button */}
                  <button
                    onClick={() => setShowPdfDropdown(!showPdfDropdown)}
                    style={{
                      background: "#3b82f6",
                      color: "#fff",
                      borderRadius: 8,
                      border: "none",
                      padding: "6px 12px",
                    }}
                  >
                    ⋮
                  </button>

                  {/* PDF Dropdown */}
                  {showPdfDropdown && (
                    <div
                      style={{
                        position: "absolute",
                        right: 0,
                        top: "110%",
                        background: "#fff",
                        padding: 12,
                        borderRadius: 12,
                      }}
                    >
                      {pdfList.map((p, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            setPdfList(pdfList.slice(0, i + 1));
                            setConfirmed(false);
                            setShowPdfDropdown(false);


                          }}
                          style={{ cursor: "pointer", marginBottom: 6 }}
                        >
                          {p.name}
                        </div>
                      ))}

                      <div
                        onClick={triggerPdfUpload}
                        style={{ cursor: "pointer", fontWeight: 600 }}
                      >
                        + Add PDF
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "Textbook" && (
                <div
                  style={{
                    margin: "20px auto",
                    width: 480,
                    padding: 14,
                    borderRadius: 14,
                    background: "#e0f2fe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    position: "relative",
                  }}
                >
                  {/* Confirm */}
                  <div
                    onClick={handleTextbookConfirm}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      border: "2px solid #3b82f6",
                      marginRight: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    {textbookConfirming && (
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          border: "2px solid #3b82f6",
                          borderTopColor: "transparent",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                        }}
                      />
                    )}
                    {textbookConfirmed && "✔"}
                  </div>

                  {/* Marks */}
                  <select
                    value={selectedMarks || ""}
                    onChange={(e) => setSelectedMarks(Number(e.target.value))}
                    style={{
                      marginRight: 12,
                      padding: 4,
                      borderRadius: 6,
                      border: "1px solid #3b82f6",
                    }}
                  >
                    <option value="">Marks (Optional)</option>
                    <option value={2}>2</option>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                  </select>

                  {/* PDF Name */}
                  <div style={{ flex: 1, fontSize: 16 }}>
                    {textbookPdfList.at(-1)?.name || "Upload Textbook PDF"}
                  </div>

                  {/* Menu */}
                  <button
                    onClick={() => setShowTextbookDropdown(!showTextbookDropdown)}
                    style={{
                      background: "#3b82f6",
                      color: "#fff",
                      borderRadius: 8,
                      border: "none",
                      padding: "6px 12px",
                    }}
                  >
                    ⋮
                  </button>

                  {showTextbookDropdown && (
                    <div
                      style={{
                        position: "absolute",
                        right: 0,
                        top: "110%",
                        background: "#fff",
                        padding: 12,
                        borderRadius: 12,
                        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                      }}
                    >
                      {textbookPdfList.map((p, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            setTextbookPdfList(textbookPdfList.slice(0, i + 1));
                            setTextbookConfirmed(false);
                            setShowTextbookDropdown(false);
                          }}
                          style={{ cursor: "pointer", marginBottom: 6 }}
                        >
                          {p.name}
                        </div>
                      ))}

                      <div
                        onClick={triggerTextbookUpload}
                        style={{ cursor: "pointer", fontWeight: 600 }}
                      >
                        + Add PDF
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ===== QUESTION CARD (PDF & TEXTBOOK) ===== */}



              {(activeTab === "PDF" || activeTab === "Textbook") && (



                <div



                  style={{



                    margin: "24px auto",



                    width: "85%",



                    background: editMode



                      ? "linear-gradient(180deg,#f8fafc,#eef2ff)"



                      : "#f9fafb",



                    borderRadius: 20,



                    padding: 22,



                    boxShadow: "0 14px 35px rgba(0,0,0,0.12)",



                    border: editMode ? "2px solid #3b82f6" : "1px solid #e5e7eb",



                    transition: "all 0.25s ease",



                  }}



                >



                  {/* Header */}



                  <div



                    style={{



                      display: "flex",



                      justifyContent: "space-between",



                      alignItems: "center",



                      marginBottom: 10,



                    }}



                  >



                    <div



                      style={{



                        fontSize: 12,



                        fontWeight: 700,



                        letterSpacing: 1,



                        color: "#6b7280",



                      }}



                    >



                      QUESTION



                    </div>







                    {editMode && (



                      <div



                        style={{



                          fontSize: 12,



                          padding: "4px 10px",



                          borderRadius: 999,



                          background: "#dbeafe",



                          color: "#1d4ed8",



                          fontWeight: 600,



                        }}



                      >



                        Editing…



                      </div>



                    )}



                  </div>







                  {/* VIEW MODE */}



                  {!editMode ? (



                    <>



                      <div



                        style={{



                          fontSize: 18,



                          color: "#111827",



                          lineHeight: 1.6,



                          whiteSpace: "pre-wrap",



                        }}



                      >



                        {editableQuestion || "Question will appear here"}



                      </div>







                      <div style={{ marginTop: 16 }}>



                        <button



                          onClick={() => setEditMode(true)}



                          style={{



                            padding: "7px 16px",



                            borderRadius: 12,



                            border: "none",



                            background: "#3b82f6",



                            color: "#fff",



                            fontSize: 14,



                            fontWeight: 600,



                            cursor: "pointer",



                          }}



                        >



                          ✏️ Edit Question



                        </button>



                      </div>



                    </>



                  ) : (



                    <>



                      {/* EDIT MODE */}



                      <textarea



                        value={editableQuestion}



                        autoFocus



                        onChange={(e) => setEditableQuestion(e.target.value)}



                        placeholder="Edit your question here…"



                        style={{



                          width: "100%",



                          minHeight: 120,



                          padding: 14,



                          borderRadius: 14,



                          border: "1px solid #c7d2fe",



                          fontSize: 16,



                          lineHeight: 1.6,



                          resize: "vertical",



                          outline: "none",



                          background: "#ffffff",



                        }}



                      />







                      {/* Footer actions */}



                      <div



                        style={{



                          marginTop: 14,



                          display: "flex",



                          justifyContent: "space-between",



                          alignItems: "center",



                        }}



                      >



                        <div style={{ fontSize: 12, color: "#6b7280" }}>



                          This question is used for PDF & Textbook answers



                        </div>







                        <div style={{ display: "flex", gap: 10 }}>



                          <button



                            onClick={() => {



                              setEditableQuestion(question || "");



                              setEditMode(false);



                            }}



                            style={{



                              padding: "7px 16px",



                              borderRadius: 12,



                              border: "1px solid #d1d5db",



                              background: "#fff",



                              cursor: "pointer",



                              fontWeight: 600,



                            }}



                          >



                            Cancel



                          </button>







                          <button



                            onClick={() => {



                              setQuestion(editableQuestion); // ✅ sync everywhere



                              setEditMode(false);



                            }}



                            style={{



                              padding: "7px 18px",



                              borderRadius: 12,



                              border: "none",



                              background: "#16a34a",



                              color: "#fff",



                              fontWeight: 700,



                              cursor: "pointer",



                            }}



                          >



                            ✔ Save



                          </button>



                        </div>



                      </div>



                    </>



                  )}



                </div>



              )}





              {activeTab === "AI" && (

                <div

                  style={{

                    margin: "30px auto",

                    width: "100%",

                    minHeight: 650,

                    background: "#fdfefe",

                    borderRadius: 24,

                    boxShadow: "0 20px 50px rgba(0,0,0,0.12)",

                    padding: 28,

                    display: "flex",

                    flexDirection: "column",

                    gap: 20,

                  }}

                >

                  {/* ===== QUESTION CHIP ===== */}

                  <div

                    onClick={() => setShowAIQuestion((v) => !v)}

                    style={{

                      alignSelf: "flex-start",

                      padding: "8px 16px",

                      borderRadius: 999,

                      background: "#e0e7ff",

                      color: "#1e3a8a",

                      fontWeight: 600,

                      fontSize: 14,

                      cursor: "pointer",

                      userSelect: "none",

                    }}

                  >

                    📘 Question

                  </div>



                  {showAIQuestion && (

                    <div

                      style={{

                        background: "#f8fafc",

                        borderRadius: 18,

                        padding: 22,

                        borderLeft: "4px solid #3b82f6",

                      }}

                    >

                      <div

                        style={{

                          fontSize: 18,

                          lineHeight: 1.6,

                          color: "#111827",

                          whiteSpace: "pre-wrap",

                        }}

                      >

                        {editableQuestion}

                      </div>

                    </div>


                  )}

                  {/* ===== PROMPTS AREA ===== */}
                  {!promptChosen && aiResult === null && (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                        gap: 18,
                        marginTop: 20,
                      }}
                    >
                      {/* Show Enhancement prompts if aiReaderAnswer exists (Mode 2), else Question prompts (Mode 1) */}
                      {(aiReaderAnswer ? questionAnswerPrompts : onlyQuestionPrompts).map(
                        (prompt, i) => (
                          <div
                            key={i}
                            onClick={() => handlePromptClick(prompt)}
                            style={{
                              padding: "16px 18px",
                              background: "#f9fafb",
                              borderRadius: 16,
                              border: "1px solid #e5e7eb",
                              transition: "all .25s ease",

                            }}

                            onMouseEnter={(e) => {

                              e.currentTarget.style.transform = "translateY(-2px)";

                              e.currentTarget.style.background = "#f3f4f6";

                            }}

                            onMouseLeave={(e) => {

                              e.currentTarget.style.transform = "none";

                              e.currentTarget.style.background = "#f9fafb";

                            }}

                          >

                            {prompt}

                          </div>

                        )

                      )}

                    </div>

                  )}



                  {/* ===== AI RESULT AREA ===== */}

                  {aiResult && (
                    <div style={{ marginTop: 20, animation: "fadeIn 0.5s ease-out" }}>
                      <div
                        style={{
                          background: "#eff6ff",
                          borderRadius: 16,
                          padding: 24,
                          border: "1px solid #bfdbfe",
                          marginBottom: 20
                        }}
                      >
                        <div style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1, color: "#2563eb", fontWeight: 700, marginBottom: 12 }}>
                          AI Response
                        </div>
                        <div style={{ fontSize: 16, lineHeight: 1.7, whiteSpace: "pre-wrap", color: "#1e293b" }}>
                          {aiResult}
                        </div>
                        <div style={{ marginTop: 14, fontSize: 13, color: "#64748b", fontStyle: "italic", borderTop: "1px solid #e2e8f0", paddingTop: 8 }}>
                          💡 Tip: You can open this explanation in Reader Mode for a better study experience.
                        </div>
                      </div>

                      {/* Open In Reader Button */}
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button
                          onClick={openAiInReader}
                          style={{
                            padding: "12px 24px",
                            background: "#2563eb",
                            color: "white",
                            border: "none",
                            borderRadius: 12,
                            fontSize: 15,
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)"
                          }}
                        >
                          <span>📖</span> Open in Reader Mode
                        </button>
                      </div>
                    </div>
                  )}



                  {/* ===== EMPTY CALM SPACE ===== */}

                  {!promptChosen && !aiResult && (

                    <div

                      style={{

                        height: 420,

                        display: "flex",

                        alignItems: "center",

                        justifyContent: "center",

                        color: "#9ca3af",

                        fontSize: 16,

                      }}

                    >

                    </div>

                  )}



                  {/* ===== AI INPUT BAR ===== */}
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "center",
                      paddingTop: 20,
                      marginTop: "auto",
                    }}
                  >
                    <input
                      value={aiInstruction}
                      onChange={(e) => {
                        setAiInstruction(e.target.value);
                        if (e.target.value) setPromptChosen(true);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && aiInstruction.trim()) {
                          handlePromptClick(aiInstruction);
                        }
                      }}
                      placeholder="Tell AI what you want to do…"
                      style={{
                        flex: 1,
                        padding: "14px 18px",
                        borderRadius: 999,
                        border: "1px solid #d1d5db",
                        fontSize: 15,
                        outline: "none",
                      }}
                    />

                    <button
                      onClick={() => {
                        if (!aiInstruction.trim()) return;
                        handlePromptClick(aiInstruction);
                      }}
                      style={{
                        padding: "12px 20px",
                        borderRadius: "50%",
                        border: "none",
                        background: "#3b82f6",
                        color: "#fff",
                        fontSize: 18,
                        cursor: "pointer",
                      }}
                    >
                      ➤
                    </button>
                  </div>

                </div>
              )}






              {/* ===== FAILURE RECOMMENDATION PANELS ===== */}







              {
                !searching && answerFound === false && (

                  <>

                    {activeTab === "PDF" && (

                      <PdfRecommendationPanel

                        editableQuestion={editableQuestion}

                        setEditableQuestion={setEditableQuestion}

                        handleRetry={handleRetry}

                        switchTab={switchTab}

                        pdfList={pdfList}

                        handleAddPdf={handleAddPdf}

                      />

                    )}

                    {activeTab === "Textbook" && (

                      <TextbookRecommendationPanel

                        editableQuestion={editableQuestion}

                        setEditableQuestion={setEditableQuestion}

                        handleRetry={handleRetry}

                        switchTab={switchTab}

                        textbookPdfList={textbookPdfList}

                        handleAddTextbookPdf={handleAddTextbookPdf}

                        selectedMarks={selectedMarks}

                        setSelectedMarks={setSelectedMarks}

                      />

                    )}

                  </>

                )
              }



              {/* ===== LOADER ===== */}
              <PdfSearchLoader
                isSearching={
                  searching &&
                  ((activeTab === "PDF" && pdfList.length > 0) ||
                    (activeTab === "Textbook" && textbookPdfList.length > 0) ||
                    (activeTab === "AI"))
                }
                pdfName={
                  activeTab === "PDF"
                    ? pdfList.at(-1)?.name || ""
                    : activeTab === "Textbook"
                      ? textbookPdfList.at(-1)?.name || ""
                      : "AI Generating..."
                }
                loaderMsg={
                  activeTab === "Textbook" && textbookPdfList.length
                    ? `Structuring answer from ${textbookPdfList.at(-1)?.name}… Almost ready!`
                    : activeTab === "AI" ? "AI is thinking... Just a moment!" : undefined
                }
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Answerviewer;