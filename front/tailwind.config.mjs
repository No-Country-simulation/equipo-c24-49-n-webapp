/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#F56F63",
					"primary-content": "#FEFEFE",
          secondary: "#FDEFAE",
					"": "#3D2C00",
          accent: "#3d2c00",
					"accent-content": "#FEFEFE",
          neutral: "#44403c",
          "base-100": "#FEFEFE",
          info: "#a5f3fc",
          success: "#34d399",
          warning: "#eab308",
          error: "#fb7185",
        },
      },
    ],
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate"), require("daisyui")],
};
