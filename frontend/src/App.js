import React, { useState, useRef, useEffect } from "react";
import backgroundImg from "./assets/background.jpg.jpeg";
import { motion } from "framer-motion";
import AnswerViewer from "./answerviewer";

function App() {
  // ✅ MAIN QUESTION (single source of truth)
  const [text, setText] = useState("");

  const [focused, setFocused] = useState(false);
  const [showViewer, setShowViewer] = useState(false);

  const textareaRef = useRef(null);
  const hasText = text.trim().length > 0;

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 220) + "px";
    }
  }, [text]);

  // 🔁 Switch to viewer page
  if (showViewer) {
    return (
      <AnswerViewer
        question={text}          // ✅ pass question
        setQuestion={setText}    // ✅ allow editing from viewer
        onBack={() => setShowViewer(false)}
      />
    );
  }

  const valuePanels = [
    { icon: "⏳", title: "Time-Saver", desc: "Stop hunting across textbooks, PDFs & AI." },
    { icon: "📚", title: "Unified Source", desc: "Everything in one place, syllabus-aligned." },
    { icon: "✅", title: "Verified Answers", desc: "Accurate, exam-relevant, structured." },
    { icon: "😰", title: "Stress-Free Prep", desc: "Focus on learning, not searching." },

  ];

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
      <div className="absolute inset-0 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="relative z-10 flex flex-col px-6">
        {/* ===== Hero ===== */}
        <header className="pt-20 max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 animate-textGlow">
            Study Smarter, Not Harder
          </h1>
          <p className="text-white/80 text-lg md:text-xl mb-2">
            Make your exam prep simple, fast, and effective.
          </p>
          <p className="text-white/50 text-sm md:text-base">
            No more hunting, no more stress — focus on learning and exam prep.
          </p>
        </header>

        {/* ===== Search ===== */}
        <main className="flex-1 flex items-center justify-center mt-12 mb-24">
          <div className="w-full max-w-4xl">
            <div
              className={`relative rounded-[30px] p-7 bg-white/10 backdrop-blur-md transition-all duration-300 ${focused ? "bg-white/20 shadow-[0_0_45px_rgba(34,211,238,0.28)]" : ""
                }`}
            >
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)} // ✅ main state
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Paste or type your exam question…"
                className="w-full bg-transparent resize-none outline-none text-[1.7rem] leading-relaxed font-light placeholder-white/40 max-h-[220px] overflow-y-auto"
              />

              <div className="mt-6 flex items-center justify-between">
                <div className="flex gap-4">
                  <button className="px-4 py-2 rounded-xl bg-white/5 text-white/70 hover:bg-white/20 transition"></button>
                  <button className="px-4 py-2 rounded-xl bg-white/5 text-white/70 hover:bg-white/20 transition"></button>
                </div>

                <button
                  onClick={() => setShowViewer(true)}
                  className={`px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-medium transition-all duration-500 ${hasText
                      ? "opacity-100 translate-y-0 hover:scale-105 hover:shadow-[0_0_28px_rgba(34,211,238,0.6)]"
                      : "opacity-0 translate-y-4 pointer-events-none"
                    }`}
                >
                  Get Answer →
                </button>
              </div>
            </div>

            {/* Helper */}
            {hasText && (
              <div className="mt-8 flex justify-center">
                <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md shadow-[0_0_30px_rgba(34,211,238,0.3)] animate-helperGlow">
                  Click <b>Get Answer</b> to view content across <b>PDF · Textbook · AI</b>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* ===== Value Panels ===== */}
        <section className="max-w-6xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {valuePanels.map((panel, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="rounded-2xl bg-white/10 backdrop-blur-md p-6 shadow hover:scale-105 transition"
            >
              <span className="text-3xl">{panel.icon}</span>
              <h3 className="font-semibold mt-2">{panel.title}</h3>
              <p className="text-white/70 text-sm mt-1">{panel.desc}</p>
            </motion.div>
          ))}
        </section>
      </div>

      <style>{`
        .animate-textGlow {
          animation: glow 2.5s infinite alternate;
        }
        @keyframes glow {
          from { text-shadow: 0 0 6px rgba(0,255,255,.3); }
          to { text-shadow: 0 0 20px rgba(0,255,255,.6); }
        }
        .animate-helperGlow {
          animation: helper 1.5s ease-in-out infinite alternate;
        }
        @keyframes helper {
          from { box-shadow: 0 0 10px rgba(34,211,238,.3); }
          to { box-shadow: 0 0 30px rgba(34,211,238,.6); }
        }
      `}</style>
    </div>
  );
}

export default App;