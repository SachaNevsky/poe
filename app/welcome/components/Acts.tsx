import { useState, useEffect, useRef } from "react";
import guide from "../guide.json";
import { formatter } from "../utils/formatter";

interface ActsProps {
    className: string;
    act: number;
}

type NotesStorage = Record<string, string[]>;
const STORAGE_KEY: string = "act_notes";

function loadNotes(): NotesStorage {
    try {
        const raw: string | null = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch { }
    return Object.fromEntries(
        Array.from({ length: 10 }, (_, i) => [String(i + 1), []])
    );
}

function saveNotes(notes: NotesStorage): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function Acts({ className, act }: ActsProps) {
    const curAct: { steps: string[]; image: boolean } = guide[act as unknown as keyof typeof guide]
    const steps: string[] = curAct.steps;
    const image: boolean = curAct.image;

    const [allNotes, setAllNotes] = useState<NotesStorage>(loadNotes);
    const [actNotes, setActNotes] = useState<string[]>(allNotes[String(act)] ?? []);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editText, setEditText] = useState<string>("");
    const isClearing = useRef<boolean>(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const hasNotes: boolean = actNotes.length > 0 && actNotes.some((n) => n.trim() !== "");

    useEffect(() => {
        if (isEditing) {
            setEditText(actNotes.join("\n"));
        }
    }, [isEditing, act]);

    useEffect(() => {
        if (isClearing.current) {
            setActNotes(allNotes[String(act)] ?? []);
            isClearing.current = false;
        }
    }, [actNotes]);

    useEffect(() => {
        isClearing.current = true;
        setActNotes([]);
    }, [act]);

    useEffect(() => {
        setIsEditing(false);
    }, [act]);

    function handleEdit(): void {
        setEditText(actNotes.join("\n"));
        setIsEditing(true);
    }

    function handleSave(): void {
        const lines: string[] = editText
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l !== "");
        const updated: NotesStorage = { ...allNotes, [String(act)]: lines };
        setAllNotes(updated);
        saveNotes(updated);
        setActNotes(lines);
        setIsEditing(false);
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
                            <div className="flex flex-row gap-2 p-2 border-b border-current ">
                                <button onClick={() => addFormatting("blue")} className="px-3 py-1 rounded font-semibold bg-blue-500">Blue</button>
                                <button onClick={() => addFormatting("red")} className="px-3 py-1 rounded font-semibold bg-red-600">Red</button>
                                <button onClick={() => addFormatting("green")} className="px-3 py-1 rounded font-semibold bg-green-500">Green</button>
                                <button onClick={() => addFormatting("b")} className="px-3 py-1 rounded font-semibold bg-gray-100 text-black">Bold</button>
                                <button onClick={() => addFormatting("name")} className="px-3 py-1 rounded font-semibold bg-yellow-200 text-black">Yellow</button>
                                <button onClick={() => addFormatting("orange")} className="px-3 py-1 rounded font-semibold bg-orange-500 text-black">Orange</button>
                                <button onClick={() => addFormatting("item")} className="px-3 py-1 rounded font-semibold bg-green-400 text-black">Item</button>
                                <button onClick={() => addFormatting("pink")} className="px-3 py-1 rounded font-semibold bg-pink-500 text-black">Pink</button>
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
                        hasNotes && (
                            <ul className="list-disc list-outside ml-6">
                                {actNotes.map((note) => (
                                    <li className="pl-2 pb-0.5" key={note}>
                                        {formatter(note)}
                                    </li>
                                ))}
                            </ul>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}