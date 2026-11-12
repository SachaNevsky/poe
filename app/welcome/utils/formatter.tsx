// ./app/welcome/utils/formatter.tsx

import React from "react";

type FormatMap = Record<string, string>;

const formatMap: FormatMap = {
    red: "font-medium text-red-600",
    blue: "font-medium text-blue-500",
    green: "font-medium text-green-500",
    b: "font-bold",
    name: "font-medium text-yellow-200",
    orange: "font-medium text-orange-500",
    item: "font-medium text-green-400",
    pink: "font-medium text-pink-500",
    i: "italic"
};

const faIconMap: FormatMap = {
    quest: "fa-solid fa-exclamation",
    buy: "fa-solid fa-dollar-sign",
    kill: "fa-solid fa-skull"
};

const imageIconMap: FormatMap = {
    wisdom: "wisdom.png",
    transmutation: "transmutation.png",
    alteration: "alteration.png",
    augmentation: "augmentation.png",
    chance: "chance.png",
    alchemy: "alchemy.png",
};

export function formatter(text: string): React.ReactNode {
    const regex: RegExp = /<(\w+)\/>|<(\w+)>(.*?)<\/\2>/g;

    const parts: React.ReactNode[] = [];
    let lastIndex: number = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
        const fullMatch: string = match[0];
        const tag: string = match[1] ?? match[2];
        const content: string = match[3] ?? "";

        if (match.index > lastIndex) {
            parts.push(text.slice(lastIndex, match.index));
        }

        const faIconClass: string = faIconMap[tag];
        const imageSrc: string = imageIconMap[tag];
        const className: string = formatMap[tag];

        if (faIconClass) {
            parts.push(
                <i
                    key={match.index}
                    className={`${faIconClass} mx-1`}
                    style={{ color: "gold", fontSize: "1.25em" }}
                />
            );
        } else if (imageSrc) {
            parts.push(
                <img
                    key={match.index}
                    src={imageSrc}
                    alt={tag}
                    className="inline-block h-[1.25em] w-auto align-middle mx-1"
                />
            );
        } else if (className) {
            parts.push(
                <span key={match.index} className={className} >
                    {content}
                </span>
            );
        } else {
            parts.push(content);
        }

        lastIndex = match.index + fullMatch.length;
    }

    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    return parts;
}