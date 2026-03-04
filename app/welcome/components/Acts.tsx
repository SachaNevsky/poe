import { useState, useEffect } from "react";
import guide from "../guide.json";
import { formatter } from "../utils/formatter";

interface ActsProps {
    className: string;
    act: number;
}

type NotesStorage = Record<string, string[]>;
const STORAGE_KEY = "act_notes";

function loadNotes(): NotesStorage {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch { }
    return Object.fromEntries(
        Array.from({ length: 10 }, (_, i) => [String(i + 1), []])
    );
}

function saveNotes(notes: NotesStorage) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function Acts({ className, act }: ActsProps) {
    const curAct = guide[act as unknown as keyof typeof guide]
    const steps = curAct.steps;
    const image = curAct.image;

    const [allNotes, setAllNotes] = useState<NotesStorage>(loadNotes);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState("");

    const actNotes: string[] = allNotes[String(act)] ?? [];
    const hasNotes = actNotes.length > 0 && actNotes.some((n) => n.trim() !== "");

    useEffect(() => {
        if (isEditing) {
            setEditText(actNotes.join("\n"));
        }
    }, [isEditing, act]);

    useEffect(() => {
        setIsEditing(false);
    }, [act]);

    function handleEdit() {
        setEditText(actNotes.join("\n"));
        setIsEditing(true);
    }

    function handleSave() {
        const lines = editText
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l !== "");
        const updated: NotesStorage = { ...allNotes, [String(act)]: lines };
        setAllNotes(updated);
        saveNotes(updated);
        setIsEditing(false);
    }

    return (
        <div className={className}>
            <div className="mx-4 lg:mx-16 text-base lg:text-xl grid grid-cols-1 lg:grid-cols-[max-content_minmax(0,1fr)] gap-x-4 lg:gap-x-10">
                <ol className="list-decimal order-2 lg:order-1">
                    <div className="mb-2 font-bold text-xl lg:text-2xl">Steps:</div>
                    {steps.map((step) => (
                        <li className="pl-2 pb-1 wrap-break-word max-w-[55vw]" key={step}>
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
                        <div className="relative w-full">
                            <div
                                className="invisible whitespace-pre-wrap wrap-break-word w-full text-base p-2 border"
                                style={{ minHeight: "2rem" }}
                            >
                                {editText + "\n"}
                            </div>
                            <textarea
                                className="absolute inset-0 w-full h-full bg-transparent border border-current rounded p-2 text-base opacity-90 focus:opacity-100 outline-none resize-none overflow-hidden"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                placeholder="Enter notes here"
                            />
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