/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "zh-pink": "#FFC0CB",
        "zh-blue": "#ADD8E6",
        "zh-navy": "#0B132B",
        "zh-soft": "#F7F9FC",
        "zh-white": "#FFFFFF",
        "zh-gray-light": "#E5E7EB",
        "zh-gray": "#9CA3AF",
        "zh-gray-dark": "#4B5563",
        "zh-danger": "#FF6B6B",
        "zh-success": "#10B981",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        poppins: ["var(--font-poppins)", "Poppins", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
        button: "10px",
      },
      boxShadow: {
        soft: "0 8px 24px rgba(11, 19, 43, 0.06)",
      },
    },
  },
  plugins: [],
};

