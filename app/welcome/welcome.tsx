import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Acts } from "./components/Acts";

const ACT_STORAGE_KEY = "currentAct";

export function Welcome() {
	const [currentAct, setCurrentAct] = useState<number>(1);

	useEffect(() => {
		const stored: string | null = localStorage.getItem(ACT_STORAGE_KEY);
		const parsed: number = Number(stored);
		if (Number.isInteger(parsed) && parsed > 0) {
			setCurrentAct(parsed);
		}
	}, []);

	const handleClick = (act: number) => {
		setCurrentAct(act);
		localStorage.setItem(ACT_STORAGE_KEY, String(act));
	};

	return (
		<main className="lg:grid lg:grid-cols-[max-content_1fr] justify-start mx-1 lg:mx-4 my-2 lg:my-4 min-h-full">
			<Header
				className="lg:text-3xl flex lg:flex-col lg:gap-4 pb-2 lg:pb-0"
				currentAct={currentAct}
				handleClick={handleClick}
			/>
			<Acts
				className="flex flex-col"
				act={currentAct}
			/>
		</main>
	);
}