import Calculator from './components/Calculator';

function App() {
	return (
		<main className="container min-h-svh mx-auto flex flex-col gap-4 items-center pt-16 md:pt-0 md:justify-center px-4 w-full max-w-lg">
			<h1 className="text-balance	text-center sm:text-left scroll-m-20 text-4xl font-extrabold tracking-tight md:text-5xl md:mb-4">
				Sähkö
				<span className="italic text-[var(--color-brand)]">mittari</span>
			</h1>

			<Calculator />
		</main>
	);
}

export default App;
