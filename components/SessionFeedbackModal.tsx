"use client";

import { useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import confetti from "canvas-confetti";
import { createFeedback } from "@/lib/actions/feedback.actions";

type FaceFeedbackModalProps = {
  isOpen: boolean;
  onClose: () => void;
  companionId: string
};

export default function FaceFeedbackModal({
  isOpen,
  onClose,
  companionId
}: FaceFeedbackModalProps) {
  const [rating, setRating] = useState(2);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const states = [
    { hue: 0, text: "BAD", mouth: "M30,70 Q50,50 70,70" },
    { hue: 50, text: "NOT BAD", mouth: "M30,65 Q50,65 70,65" },
    { hue: 120, text: "GOOD", mouth: "M30,60 Q50,80 70,60" },
  ];

  const ratingMotion = useMotionValue(rating);

  useEffect(() => {
    ratingMotion.set(rating);
  }, [rating]);

  const rotation = useTransform(ratingMotion, [0, 1, 2], [-10, 0, 10]);
  const springRotation = useSpring(rotation, { stiffness: 120, damping: 10 });

  const scaleBounce = useSpring(1, { stiffness: 400, damping: 15 });
  useEffect(() => {
    scaleBounce.set(1.1);
    const timeout = setTimeout(() => scaleBounce.set(1), 200);
    return () => clearTimeout(timeout);
  }, [rating]);

  const hue = useTransform(ratingMotion, [0, 1, 2], [
    states[0].hue,
    states[1].hue,
    states[2].hue,
  ]);

  const boxGradient = useTransform(
    hue,
    (h) =>
      `linear-gradient(135deg, hsl(${h}, 80%, 50%), hsl(${h + 30}, 80%, 50%))`
  );

  const mouthD = states[rating].mouth;
  const faceText = states[rating].text;

  const [blink, setBlink] = useState(false);
  const eyeScale = useSpring(blink ? 0.1 : 1, {
    stiffness: 300,
    damping: 10,
  });
  useEffect(() => {
    setBlink(true);
    const timeout = setTimeout(() => setBlink(false), 150);
    return () => clearTimeout(timeout);
  }, [rating]);

  const handleSubmit = async () => {
    try {
      await createFeedback({ rating, note, companionId});
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.5 },
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setRating(2);
        setNote("");
        onClose();
      }, 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to submit feedback.");
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/80"
      onClick={onClose} // ✅ Click outside closes modal
    >
      <motion.div
        className="relative p-6 rounded-lg max-w-md w-full text-center"
        style={{ background: boxGradient }}
        onClick={(e) => e.stopPropagation()} // ✅ Prevent card clicks from closing modal
      >
        {/* ✅ Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-xl font-bold hover:text-gray-200"
          aria-label="Close"
        >
          &times;
        </button>

        {!submitted ? (
          <>
            <h2 className="text-xl font-bold mb-6 text-white">
              How was your session?
            </h2>

            <motion.svg
              viewBox="0 0 100 100"
              width="140"
              height="140"
              className="mx-auto mb-4"
            >
              <motion.g
                style={{ rotate: springRotation, scale: scaleBounce }}
              >
                <motion.circle
                  cx="35"
                  cy="45"
                  r="5"
                  fill="#000"
                  style={{ scaleY: eyeScale, transformOrigin: "center" }}
                />
                <motion.circle
                  cx="65"
                  cy="45"
                  r="5"
                  fill="#000"
                  style={{ scaleY: eyeScale, transformOrigin: "center" }}
                />
                {rating === 2 && (
                  <>
                    <motion.circle
                      cx="25"
                      cy="55"
                      r="4"
                      fill="pink"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 10,
                      }}
                    />
                    <motion.circle
                      cx="75"
                      cy="55"
                      r="4"
                      fill="pink"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 10,
                      }}
                    />
                  </>
                )}
                <motion.path
                  d={mouthD}
                  stroke="#000"
                  strokeWidth="3"
                  fill="transparent"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </motion.g>
            </motion.svg>

            <div className="text-4xl font-bold mb-6 text-white">
              {faceText}
            </div>

            <input
              type="range"
              min="0"
              max="2"
              step="1"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full appearance-none h-2 bg-white rounded-full outline-none mb-6"
              style={
                {
                  '--thumb-fill': `hsl(${states[rating].hue}, 80%, 50%)`,
                } as React.CSSProperties
              }
            />

            <div className="flex justify-between text-white text-sm mb-4">
              {["Bad", "Not Bad", "Good"].map((label, i) => (
                <button
                  key={label}
                  onClick={() => setRating(i)}
                  className="cursor-pointer focus:outline-none"
                >
                  {label}
                </button>
              ))}
            </div>

            <textarea
              placeholder="Add a note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-3 rounded mb-4"
            />

            <button
              onClick={handleSubmit}
              className="mt-4 px-6 py-2 bg-black text-white rounded-full"
            >
              Submit
            </button>
          </>
        ) : (
          <div className="text-white text-1xl font-bold">
                        You’re amazing.<br/> Thank you for sharing your experience!<br/>Your input makes a big difference. 🎉🎉
          </div>
        )}

        <style jsx global>{`
          input[type='range']::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            height: 24px;
            width: 24px;
            border-radius: 50%;
            background: var(--thumb-fill, #000);
            border: 2px solid black;
            cursor: pointer;
          }
          input[type='range']::-moz-range-thumb {
            height: 24px;
            width: 24px;
            border-radius: 50%;
            background: var(--thumb-fill, #000);
            border: 2px solid black;
            cursor: pointer;
          }
        `}</style>
      </motion.div>
    </motion.div>
  );
}
