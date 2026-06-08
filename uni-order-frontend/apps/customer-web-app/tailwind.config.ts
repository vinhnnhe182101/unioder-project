/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}", // Quét toàn bộ file trong app customer
        "../../shared/**/*.{js,ts,jsx,tsx}", // QUAN TRỌNG: Quét cả các component dùng chung ở tầng shared ngoài app
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}