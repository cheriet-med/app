import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: "var(--font-montserrat), sans-serif",
        playfair: "var(--font-playfair), serif",
      },
      animation: {
        flickerHover: "flickerHover 350ms ease-in-out forwards",
        contentFlickerHover: "contentFlickerHover 350ms ease-in-out forwards"
      },
      colors: {
  			primary: "#F25C54",
  			secondary:"#2F3E46",
  			a: '#000000',
		    neutral:"#2D628C",
			  yel:"#2D628C",
			  bl:"#7EB8E0",
        accent:"#F4D35E",
        background:"#FDFDFD",
        highlights:"#A8DADC",
		}, 
    },
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      'custom': '1300px', // Add a custom breakpoint
    },
  
  },
  plugins: [],
} satisfies Config;
