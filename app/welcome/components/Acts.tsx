// ./app/welcome/components/Acts.tsx

import { useState, useEffect, useRef } from "react";
import guide from "../guide.json";
import { formatter } from "../utils/formatter";

interface ActsProps {
    className: string;
    act: number;
}

interface Build {
    name: string;
    regex: string;
    notes: Record<string, string[]>;
}

const NUM_BUILDS = 5;
const BUILDS_KEY = "act_notes_builds";
const SELECTED_BUILD_KEY = "act_notes_selected_build";

function defaultBuilds(): Build[] {
    return Array.from({ length: NUM_BUILDS }, (_, i) => ({
        name: `Build ${i + 1}`,
        regex: "",
        notes: {},
    }));
}

function loadBuilds(): Build[] {
    try {
        const raw: string | null = localStorage.getItem(BUILDS_KEY);
        if (raw) {
            const parsed: Build[] = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length === NUM_BUILDS) {
                return parsed.map((b) => ({ ...b, regex: b.regex ?? "" }));
            }
        }
    } catch { }
    return defaultBuilds();
}

function saveBuilds(builds: Build[]): void {
    localStorage.setItem(BUILDS_KEY, JSON.stringify(builds));
}

function loadSelectedBuild(): number {
    const raw: string | null = localStorage.getItem(SELECTED_BUILD_KEY);
    const parsed: number = Number(raw);
    if (Number.isInteger(parsed) && parsed >= 0 && parsed < NUM_BUILDS) return parsed;
    return 0;
}

function saveSelectedBuild(index: number): void {
    localStorage.setItem(SELECTED_BUILD_KEY, String(index));
}

export function Acts({ className, act }: ActsProps) {
    const curAct: { steps: string[]; image: boolean } = guide[act as unknown as keyof typeof guide]
    const steps: string[] = curAct.steps;
    const image: boolean = curAct.image;

    const [builds, setBuilds] = useState<Build[]>(loadBuilds);
    const [selectedBuild, setSelectedBuild] = useState<number>(loadSelectedBuild);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editText, setEditText] = useState<string>("");
    const [editName, setEditName] = useState<string>("");
    const [editRegex, setEditRegex] = useState<string>("");
    const [copied, setCopied] = useState<boolean>(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const actKey: string = String(act);
    const currentBuild: Build = builds[selectedBuild];
    const actNotes: string[] = currentBuild.notes[actKey] ?? [];
    const hasNotes: boolean = actNotes.length > 0 && actNotes.some((n) => n.trim() !== "");

    useEffect(() => {
        setIsEditing(false);
    }, [act, selectedBuild]);

    function handleSelectBuild(index: number): void {
        setSelectedBuild(index);
        saveSelectedBuild(index);
    }

    function handleEdit(): void {
        setEditText(actNotes.join("\n"));
        setEditName(currentBuild.name);
        setEditRegex(currentBuild.regex);
        setIsEditing(true);
    }

    function handleSave(): void {
        const lines: string[] = editText
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l !== "");
        const trimmedName: string = editName.trim();
        const updated: Build[] = builds.map((b, i) =>
            i === selectedBuild
                ? { name: trimmedName || b.name, regex: editRegex, notes: { ...b.notes, [actKey]: lines } }
                : b
        );
        setBuilds(updated);
        saveBuilds(updated);
        setIsEditing(false);
    }

    async function handleCopyRegex(): Promise<void> {
        try {
            await navigator.clipboard.writeText(currentBuild.regex);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch { }
    }

    function addFormatting(format: string): void {
        const textarea: HTMLTextAreaElement | null = textareaRef.current;
        if (!textarea) return;
        const start: number = textarea.selectionStart;
        const end: number = textarea.selectionEnd;
        const insertion: string = `<${format}></${format}>`;
        const newText: string = editText.slice(0, start) + insertion + editText.slice(end);
        setEditText(newText);
        const cursorPos: number = start + `<${format}>`.length;
        requestAnimationFrame(() => {
            textarea.selectionStart = cursorPos;
            textarea.selectionEnd = cursorPos;
            textarea.focus();
        });
    }

    function insertIcon(tag: string): void {
        const textarea: HTMLTextAreaElement | null = textareaRef.current;
        if (!textarea) return;
        const start: number = textarea.selectionStart;
        const end: number = textarea.selectionEnd;
        const insertion: string = `<${tag}/>`;
        const newText: string = editText.slice(0, start) + insertion + editText.slice(end);
        setEditText(newText);
        const cursorPos: number = start + insertion.length;
        requestAnimationFrame(() => {
            textarea.selectionStart = cursorPos;
            textarea.selectionEnd = cursorPos;
            textarea.focus();
        });
    }

    return (
        <div className={className}>
            <div className="ml-8 mr-4 lg:mx-16 text-base lg:text-xl grid grid-cols-1 lg:grid-cols-[max-content_minmax(0,1fr)] gap-x-4 lg:gap-x-10">
                <ol className="list-decimal order-2 lg:order-1">
                    <div className="mb-2 font-bold text-xl lg:text-2xl">Steps:</div>
                    {steps.map((step) => (
                        <li className="pl-2 pb-1 wrap-break-word max-w-full lg:max-w-[55vw]" key={step}>
                            {formatter(step)}
                        </li>
                    ))}
                    {image && <div className="py-1">
                        <img src={`act${act}.png`} />
                    </div>}
                </ol>

                <div className="min-w-0 order-1 lg:order-2">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        {builds.map((build, i) => (
                            <button
                                key={i}
                                onClick={() => handleSelectBuild(i)}
                                className={`text-sm px-3 py-1 rounded border border-current transition-opacity ${i === selectedBuild ? "opacity-100 bg-red-900" : "opacity-60 hover:opacity-90"}`}
                            >
                                {build.name}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 mb-2">
                        <span className="font-bold text-xl lg:text-2xl">Notes:</span>
                        <button
                            onClick={isEditing ? handleSave : handleEdit}
                            className="text-sm px-3 py-0.5 rounded border border-current opacity-70 hover:opacity-100 transition-opacity"
                        >
                            {isEditing ? "Save" : hasNotes ? "Edit" : "Add notes"}
                        </button>
                    </div>

                    {isEditing ? (
                        <div className="flex flex-col border border-current rounded w-full text-base">
                            <div className="flex flex-row gap-2 p-2 border-b border-current">
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    placeholder="Build name"
                                    className="flex-1 min-w-0 bg-transparent outline-none font-semibold px-1"
                                />
                                <input
                                    type="text"
                                    value={editRegex}
                                    onChange={(e) => setEditRegex(e.target.value)}
                                    placeholder="Regex"
                                    className="flex-1 min-w-0 bg-transparent outline-none font-mono text-sm px-1 border-l border-current"
                                />
                            </div>
                            <div className="flex flex-row items-center gap-2 p-2 border-b border-current flex-wrap">
                                <button onClick={() => addFormatting("blue")} className="px-3 py-1 rounded font-semibold bg-blue-500">Blue</button>
                                <button onClick={() => addFormatting("red")} className="px-3 py-1 rounded font-semibold bg-red-600">Red</button>
                                <button onClick={() => addFormatting("green")} className="px-3 py-1 rounded font-semibold bg-green-500">Green</button>
                                <button onClick={() => addFormatting("b")} className="px-3 py-1 rounded font-semibold bg-gray-100 text-black">Bold</button>
                                <button onClick={() => addFormatting("name")} className="px-3 py-1 rounded font-semibold bg-yellow-200 text-black">Yellow</button>
                                <button onClick={() => addFormatting("orange")} className="px-3 py-1 rounded font-semibold bg-orange-500 text-black">Orange</button>
                                <button onClick={() => addFormatting("item")} className="px-3 py-1 rounded font-semibold bg-green-400 text-black">Item</button>
                                <button onClick={() => addFormatting("pink")} className="px-3 py-1 rounded font-semibold bg-pink-500 text-black">Pink</button>
                                <button onClick={() => addFormatting("i")} className="px-3 py-1 rounded font-semibold bg-gray-100 text-black italic">Italic</button>

                                <div className="w-px self-stretch bg-current/40 mx-1" />

                                <button onClick={() => insertIcon("quest")} title="Quest" className="px-2.5 py-1 rounded bg-transparent hover:bg-white/10 transition-colors flex items-center justify-center">
                                    <i className="fa-solid fa-exclamation" style={{ color: "gold", fontSize: "1.25em" }} />
                                </button>
                                <button onClick={() => insertIcon("buy")} title="Buy" className="px-2.5 py-1 rounded bg-transparent hover:bg-white/10 transition-colors flex items-center justify-center">
                                    <i className="fa-solid fa-dollar-sign" style={{ color: "gold", fontSize: "1.25em" }} />
                                </button>
                                <button onClick={() => insertIcon("kill")} title="Kill" className="px-2.5 py-1 rounded bg-transparent hover:bg-white/10 transition-colors flex items-center justify-center">
                                    <i className="fa-solid fa-skull" style={{ color: "gold", fontSize: "1.25em" }} />
                                </button>
                                <button onClick={() => insertIcon("wisdom")} title="Wisdom" className="px-2 py-1 rounded bg-transparent hover:bg-white/10 transition-colors flex items-center justify-center">
                                    <img src="wisdom.png" alt="Wisdom" className="h-4 w-4" />
                                </button>
                                <button onClick={() => insertIcon("transmutation")} title="Transmutation" className="px-2 py-1 rounded bg-transparent hover:bg-white/10 transition-colors flex items-center justify-center">
                                    <img src="transmutation.png" alt="Transmutation" className="h-4 w-4" />
                                </button>
                                <button onClick={() => insertIcon("augmentation")} title="Augmentation" className="px-2 py-1 rounded bg-transparent hover:bg-white/10 transition-colors flex items-center justify-center">
                                    <img src="augmentation.png" alt="Augmentation" className="h-4 w-4" />
                                </button>
                                <button onClick={() => insertIcon("alteration")} title="Alteration" className="px-2 py-1 rounded bg-transparent hover:bg-white/10 transition-colors flex items-center justify-center">
                                    <img src="alteration.png" alt="Alteration" className="h-4 w-4" />
                                </button>
                                <button onClick={() => insertIcon("chance")} title="Chance" className="px-2 py-1 rounded bg-transparent hover:bg-white/10 transition-colors flex items-center justify-center">
                                    <img src="chance.png" alt="Chance" className="h-4 w-4" />
                                </button>
                                <button onClick={() => insertIcon("alchemy")} title="Alchemy" className="px-2 py-1 rounded bg-transparent hover:bg-white/10 transition-colors flex items-center justify-center">
                                    <img src="alchemy.png" alt="Alchemy" className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="relative w-full">
                                <div
                                    className="invisible whitespace-pre-wrap wrap-break-word w-full p-2"
                                    style={{ minHeight: "4rem" }}
                                >
                                    {editText + "\n"}
                                </div>
                                <textarea
                                    ref={textareaRef}
                                    className="absolute inset-0 w-full h-full bg-transparent p-2 text-base opacity-90 focus:opacity-100 outline-none resize-none overflow-hidden"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    placeholder="Enter notes here"
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            {currentBuild.regex.trim() !== "" && (
                                <div className="inline-flex w-fit max-w-full items-center gap-2 mb-3 rounded border border-current/40">
                                    <code className="px-3 py-1.5 font-mono text-sm wrap-break-word whitespace-pre-wrap">
                                        {currentBuild.regex}
                                    </code>
                                    <button
                                        onClick={handleCopyRegex}
                                        aria-label="Copy regex"
                                        className="p-1.5 mr-1 rounded opacity-60 hover:opacity-100 transition-opacity shrink-0"
                                    >
                                        {copied ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                                <rect x="9" y="9" width="13" height="13" rx="2" />
                                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            )}
                            {hasNotes && (
                                <ul className="list-disc list-outside ml-6">
                                    {actNotes.map((note, i) => (
                                        <li className="pl-2 pb-0.5" key={i}>
                                            {formatter(note)}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}