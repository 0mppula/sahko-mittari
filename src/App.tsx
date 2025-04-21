import Calculator from './components/Calculator';

function App() {
	return (
		<main className="container min-h-svh mx-auto flex flex-col gap-4 items-center justify-center px-4 sm:px-8 w-full lg:w-lg">
			<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl lg:mb-4">
				Sähkö
				<span className="italic text-[var(--color-brand)]">mittari</span>
			</h1>

			<Calculator />
		</main>
	);
}

export default App;
