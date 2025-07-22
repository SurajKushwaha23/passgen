import { useState, useEffect, useRef } from "react";
import {
  FaCopy,
  FaCheck,
  FaRandom,
  FaLock,
  FaShieldAlt,
  FaHistory,
  FaTrash,
  FaKey,
  FaUserLock,
  FaFingerprint,
} from "react-icons/fa";

function App() {
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [options, setOptions] = useState({
    word: "Advanture",
    numbers: "123",
    specialChars: "$@#",
    caseType: "normal", // 'normal', 'upper', 'lower', 'title', 'alternate'
    addNumbers: true,
    addSpecialChars: true,
  });
  const [passwordHistory, setPasswordHistory] = useState([]);

  const timeoutRef = useRef(null);

  const shuffleString = (str) => {
    const array = str.split("");
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join("");
  };

  const calculatePasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return score;

    // Length check
    if (pass.length >= 8) score += 20;
    if (pass.length >= 12) score += 10;

    // Character variety checks
    if (/[A-Z]/.test(pass)) score += 20;
    if (/[a-z]/.test(pass)) score += 20;
    if (/[0-9]/.test(pass)) score += 15;
    if (/[^A-Za-z0-9]/.test(pass)) score += 15;

    return Math.min(100, score);
  };

  const getStrengthLabel = (strength) => {
    if (strength >= 80) return ["Strong", "bg-green-500", "text-green-700"];
    if (strength >= 60) return ["Good", "bg-yellow-500", "text-yellow-700"];
    if (strength >= 30) return ["Weak", "bg-orange-500", "text-orange-700"];
    return ["Very Weak", "bg-red-500", "text-red-700"];
  };

  const transformCase = (text, type) => {
    switch (type) {
      case "upper":
        return text.toUpperCase();
      case "lower":
        return text.toLowerCase();
      case "title":
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      case "alternate":
        return text
          .split("")
          .map((char, i) =>
            i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
          )
          .join("");
      default:
        return text;
    }
  };

  const generatePassword = () => {
    let parts = [];

    // Transform the base word according to selected case type
    if (options.word) {
      parts.push(transformCase(options.word, options.caseType));
    }

    // Add numbers at random position
    if (options.addNumbers && options.numbers) {
      parts.push(options.numbers);
    }

    // Add special characters at random position
    if (options.addSpecialChars && options.specialChars) {
      parts.push(options.specialChars);
    }

    // Shuffle all parts together
    const shuffledPassword = shuffleString(parts.join(""));
    setPassword(shuffledPassword);
    setPasswordStrength(calculatePasswordStrength(shuffledPassword));

    // Add to history after generating
    setPasswordHistory((prev) => {
      const newHistory = [shuffledPassword, ...prev.slice(0, 4)]; // Keep last 5 passwords
      return [...new Set(newHistory)]; // Remove duplicates
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const toggleOption = (option) => {
    setOptions((prev) => ({ ...prev, [option]: !prev[option] }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOptions((prev) => ({ ...prev, [name]: value }));
  };

  const clearHistory = () => setPasswordHistory([]);

  // Generate password on initial load and when options change
  useEffect(() => {
    generatePassword();
  }, [options]);

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const CaseOptions = () => (
    <div className="space-y-2">
      <label className="text-gray-700 font-medium flex items-center gap-2">
        <FaLock className="text-teal-500" />
        Text Case Style
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { type: "normal", label: "Normal", example: "Normal" },
          { type: "upper", label: "UPPER", example: "UPPER" },
          { type: "lower", label: "lower", example: "lower" },
          { type: "title", label: "Title", example: "Title" },
          { type: "alternate", label: "aLtErNaTe", example: "aLtErNaTe" },
        ].map(({ type, label, example }) => (
          <button
            key={type}
            onClick={() => setOptions((prev) => ({ ...prev, caseType: type }))}
            className={`p-3 rounded-lg transition-all ${
              options.caseType === type
                ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg transform scale-105"
                : "bg-white hover:bg-gray-50 text-gray-700 shadow-sm hover:scale-102"
            }`}
          >
            <div className="text-sm font-medium">{label}</div>
            <div className="text-xs opacity-75 mt-1">{example}</div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Section */}
          <div className="flex flex-col">
            <div className="">
              <div className="bg-teal-50 border-l-4 border-teal-400 p-4 mb-8 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-teal-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-teal-700">
                      Your security is our priority. All passwords are generated
                      locally in your browser. We never store, transmit, or
                      track your passwords.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-4 mb-8">
                <span className="px-4 py-2 bg-teal-50 text-teal-600 rounded-full text-sm font-medium">
                  100% Secure
                </span>
                <span className="px-4 py-2 bg-teal-50 text-teal-600 rounded-full text-sm font-medium">
                  Instant Generation
                </span>
                <span className="px-4 py-2 bg-teal-50 text-teal-600 rounded-full text-sm font-medium">
                  Customizable
                </span>
                <span className="px-4 py-2 bg-teal-50 text-teal-600 rounded-full text-sm font-medium">
                  No Storage
                </span>
              </div>

              {/* Added Password Security Tips */}
              <div className="mt-4  bg-white/90  rounded-xl">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-teal-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Password Security Tips
                </h2>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-teal-500 mr-2">•</span>
                    Use unique passwords for each account
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-500 mr-2">•</span>
                    Longer passwords are stronger (12+ characters)
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-500 mr-2">•</span>
                    Mix uppercase, lowercase, numbers, and symbols
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-500 mr-2">•</span>
                    Avoid personal information in passwords
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-500 mr-2">•</span>
                    Change passwords periodically
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Section - Password Generator */}
          <div className="w-full">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              <div className="p-6 space-y-6">
                {/* Password Display */}
                <div className="relative group">
                  <div className="password-display bg-gray-100 rounded-xl p-5 text-lg font-mono tracking-wider flex items-center justify-between min-h-[64px] border border-gray-200">
                    <span className="break-all pr-12 text-gray-800">
                      {password || "Your password"}
                    </span>
                    <div className="absolute right-4 flex gap-2">
                      <button
                        onClick={handleCopy}
                        aria-label="Copy password"
                        className="p-2 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        {copied ? (
                          <FaCheck className="text-green-500 text-xl" />
                        ) : (
                          <FaCopy className="text-gray-600 text-xl hover:text-gray-800" />
                        )}
                      </button>
                      <button
                        onClick={generatePassword}
                        aria-label="Regenerate password"
                        className="p-2 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <FaRandom className="text-gray-600 text-xl hover:text-gray-800" />
                      </button>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                {/* Password Strength Indicator */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <FaShieldAlt
                      className={`text-xl ${
                        getStrengthLabel(passwordStrength)[2]
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-gray-700">
                          Password Strength
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            getStrengthLabel(passwordStrength)[2]
                          }`}
                        >
                          {getStrengthLabel(passwordStrength)[0]}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            getStrengthLabel(passwordStrength)[1]
                          }`}
                          style={{
                            width: `${passwordStrength}%`,
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1) inset",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {passwordStrength < 60
                      ? "Try adding more characters and symbols to make your password stronger"
                      : "Your password meets recommended security standards"}
                  </p>
                </div>

                {/* Configuration Section */}
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Customize Your Password
                  </h2>

                  {/* Word Input */}
                  <div className="space-y-2">
                    <label className="text-gray-700 font-medium">
                      Base Word
                    </label>
                    <input
                      type="text"
                      name="word"
                      value={options.word}
                      onChange={handleInputChange}
                      className="bg-gray-50 border border-gray-200 text-gray-800 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                      placeholder="Enter your base word"
                      maxLength={20}
                    />
                  </div>

                  {/* Options Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-gray-700 font-medium">
                        Numbers
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          name="numbers"
                          value={options.numbers}
                          onChange={handleInputChange}
                          className="bg-gray-50 border border-gray-200 text-gray-800 rounded-l-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                          placeholder="123"
                          maxLength={5}
                        />
                        <button
                          onClick={() => toggleOption("addNumbers")}
                          className={`px-4 rounded-r-lg transition-colors ${
                            options.addNumbers
                              ? "bg-teal-500 hover:bg-teal-600"
                              : "bg-gray-200 hover:bg-gray-300"
                          }`}
                          aria-label="Toggle numbers"
                        >
                          {options.addNumbers ? "On" : "Off"}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-gray-700 font-medium">
                        Special Characters
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          name="specialChars"
                          value={options.specialChars}
                          onChange={handleInputChange}
                          className="bg-gray-50 border border-gray-200 text-gray-800 rounded-l-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                          placeholder="!@#"
                          maxLength={5}
                        />
                        <button
                          onClick={() => toggleOption("addSpecialChars")}
                          className={`px-4 rounded-r-lg transition-colors ${
                            options.addSpecialChars
                              ? "bg-teal-500 hover:bg-teal-600"
                              : "bg-gray-200 hover:bg-gray-300"
                          }`}
                          aria-label="Toggle special characters"
                        >
                          {options.addSpecialChars ? "On" : "Off"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Case Options */}
                  <CaseOptions />

                  {/* Capitalization Options - Removed in favor of new CaseOptions component */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-8 text-center max-w-md w-full">
          <p className="text-gray-600">
            Made with 💖 by{" "}
            <a
              href="https://github.com/surajkushwaha"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-500 hover:text-teal-600 font-medium transition-colors"
            >
              Suraj Kushwaha
            </a>
          </p>
        </footer>
      </div>
    </>
  );
}

export default App;
