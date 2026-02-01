import { motion, AnimatePresence } from "framer-motion";
import bookVideo from "../assets/book.mp4";

export default function PdfSearchLoader({ isSearching, pdfName, loaderMsg }) {
  if (!isSearching) return null;

  // Split PDF name into letters for floating animation
  const pdfLetters = pdfName ? pdfName.split("") : [];
  const isAi = pdfName === "AI Generating...";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Background Blur */}
        <div className="absolute inset-0 bg-white/60 backdrop-blur-md" />

        {/* Glowing halo behind book (#A8C0D8) */}
        <motion.div
          className="absolute w-[220px] h-[220px] rounded-full -z-10"
          style={{ backgroundColor: "rgba(168,192,216,0.4)" }}
          animate={{ scale: [1, 1.15, 1], rotate: [0, 15, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Loader Content */}
        <motion.div
          className="relative z-10 flex flex-col items-center gap-6"
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {/* Book Video */}
          <motion.video
            src={bookVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-[160px] h-auto"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Animated Info Text */}
          <motion.div className="flex text-lg font-semibold gap-1">
            {loaderMsg ? (
              <motion.span
                style={{ color: "#60a5fa" }}
                animate={{ y: [0, -4, 0], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                {loaderMsg}
              </motion.span>
            ) : (
              <>
                {/* "Searching in" text */}
                <motion.span
                  style={{ color: "#60a5fa" }} // base message color
                  animate={{ y: [0, -4, 0], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  {isAi ? "AI is thinking..." : "Searching in"}
                </motion.span>

                {/* PDF Name letters individually animated */}
                {!isAi && (
                  <motion.span className="flex gap-[1px]">
                    {pdfLetters.map((letter, i) => (
                      <motion.span
                        key={i}
                        style={{ color: "#FACC15" }} // highlight color for PDF
                        animate={{ y: [0, -5, 0], rotate: [0, 2, -2, 0] }}
                        transition={{
                          duration: 1.6,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.05,
                        }}
                      >
                        {letter}
                      </motion.span>
                    ))}
                  </motion.span>
                )}
              </>
            )}
          </motion.div>

          {/* Moving Gradient Dots Loader */}
          <div className="flex gap-2 mt-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full"
                style={{ background: "linear-gradient(90deg,#A8C0D8,#60a5fa)" }}
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  repeatType: "loop",
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}