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
          info: "#96d8ee",
          success: "#bbe09d",
          warning: "#FDEFAE",
          error: "#FAB2AB",
        },
      },
    ],
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate"), require("daisyui")],
};
