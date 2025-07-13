import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <main className="flex flex-col-reverse md:flex-row min-h-screen">
    
      <section className="flex flex-col-reverse justify-center px-8 py-16 rounded-lg bg-gradient-to-br from-blue-100 to-blue-300 md:w-1/2">
        <div className="max-w-xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Your Personal AI Tutors, Anytime.
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-6">
            Yooly brings you interactive, real-time speaking practice powered by AI vocal companions. Pick your learning style, practice naturally, and get instant feedback.
          </p>
          <ul className="space-y-4 text-gray-700 text-base md:text-lg mb-8">
            <li>✅ Multiple AI learning companions with unique personalities</li>
            <li>✅ Real conversational practice, not scripted drills</li>
            <li>✅ Immediate feedback to boost confidence</li>
            <li>✅ Learn on the go — mobile friendly</li>
          </ul>

          <div className="w-full  mt-8 justify-center items-center">
            <svg
              className="w-full max-w-[30%] mx-auto my-auto"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="100" cy="100" r="100" fill="#60A5FA" opacity="0.2" />
              <rect x="50" y="60" width="100" height="80" rx="20" fill="#3B82F6" />
              <circle cx="85" cy="100" r="5" fill="white" />
              <circle cx="100" cy="100" r="5" fill="white" />
              <circle cx="115" cy="100" r="5" fill="white" />
              <path d="M100 140 L120 160 L80 160 Z" fill="#3B82F6" />
            </svg>
            <p className="text-sm text-gray-600 text-center mt-4">
              Your friendly AI companion, always ready to talk.
            </p>
          </div>
        </div>
      </section>

      {/* Right Side: Sign In/Up */}
      <aside className="flex justify-center  md:w-1/2 px-8 py-16">
        <div className="w-full  items-center flex flex-col">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
            Get Started
          </h2>
          <SignIn />
        </div>
      </aside>

    </main>
  );
}
