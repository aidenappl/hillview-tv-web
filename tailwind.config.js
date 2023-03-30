const plugin = require('tailwindcss/plugin');

module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		colors: {
			transparent: '#00000000',
			neutral: {
				50: '#fafafa',
				100: '#F5F5F8',
				150: '#eeeef1',
				200: '#e5e5e5',
				300: '#d4d4d4',
				400: '#a3a3a3',
				500: '#6f6f76',
				600: '#5c5c63',
				700: '#404045',
				800: '#27282B',
				900: '#1B1C1F',
				950: '#111113',
			},
			black: '#000',
			backgrounds: {
				100: '#0d0d0d',
			},
			white: '#FFF',
			primary: {
				100: '#197bff',
				200: '#06E391',
			},
			header: {
				100: '#2d394b',
				200: '#c0cbdd',
			},
			error: '#C4004C',
		},
		extend: {
			boxShadow: {
				sm: '0 1px 2px 0 rgb(0 0 0 / 0.08);',
				md: '0 2px 6px 0 rgb(0 0 0 / 0.1)',
				lg: '0 4px 15px -2px rgb(0 0 0 / 0.1)',
				xl: '0 5px 30px -2px rgb(0 0 0 / 0.1)',
				'2xl': '0 10px 50px -5px rgb(0 0 0 / 0.1);',
			},
			animation: {
				'spin-fast': 'spin 0.5s linear infinite',
			},
			backgroundSize: {
				auto: 'auto',
				cover: 'cover',
				contain: 'contain',
				'100%': '100%',
				'105%': '105%',
			},
		},
	},
	plugins: [require('@tailwindcss/line-clamp')],
};
