import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Acts } from "./components/Acts";

const ACT_STORAGE_KEY = "currentAct";

export function Welcome() {
	const [currentAct, setCurrentAct] = useState<number>(1);

	useEffect(() => {
		const stored = localStorage.getItem(ACT_STORAGE_KEY);
		const parsed = Number(stored);
		if (Number.isInteger(parsed) && parsed > 0) {
			setCurrentAct(parsed);
		}
	}, []);

	const handleClick = (act: number) => {
		setCurrentAct(act);
		localStorage.setItem(ACT_STORAGE_KEY, String(act));
	};

	return (
		<main className="grid grid-cols-[max-content_1fr] justify-start m-4 h-full overflow-hidden">
			<Header
				className="text-3xl flex flex-col gap-4"
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