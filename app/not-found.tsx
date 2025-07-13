'use client';
import Link from "next/link";
import { useEffect, useState } from "react";

const messages = [
  "Oops! That page took a vacation.",
  "404? More like 4-oh-no-you-didn’t!",
  "You found a secret... or just a broken link.",
  "This page doesn't exist. But neither does my motivation on Mondays.",
  "Like your ex: gone and not coming back.",
  "Well, this is awkward...",
  "The page you want ran away. Fast.",
  "404: Reality not found. Try a different universe?",
  "You seem lost. Need a map?",
  "Nothing to see here — literally."
];

export default function NotFound() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    setMessage(messages[randomIndex]);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[90dvh] text-center px-4">
      <h1 className="text-5xl font-bold text-[#272A4C] mb-4">404 - Page Not Found</h1>
      <p className="text-xl text-gray-700 mb-6">{message}</p>
      <Link
        href="/"
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow transition duration-200"
      >
        Go back home
      </Link>
    </div>
  );
}
