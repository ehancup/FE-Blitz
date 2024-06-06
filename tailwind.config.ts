import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    fontFamily: {
      'poppins' : ['Poppins', 'sans-serif'],
      'montserrat' : ['Montserrat', 'sans-serif'],
      'roboto' : ['"Roboto"', 'sans-serif'],
      'quicksand' : ['"Quicksand"', 'sans-serif'],
      'handrawn' : ['"Delicious Handrawn"', 'cursive'],
    },
    // colors: {
    //   'blitz' : '#3f7099'
    // }
  },
  plugins: [
    require('daisyui')
  ],
  daisyui: {
    themes: ["bumblebee", "dark", "cmyk"],
  },
};
export default config;
