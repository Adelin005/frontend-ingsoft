/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "uni-dark": "#001f3f", // Albastrul închis din poza ta
      },
    },
  },
  plugins: [],
};
