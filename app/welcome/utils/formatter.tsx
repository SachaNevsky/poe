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
    pink: "font-medium text-pink-500"
};

export function formatter(text: string): React.ReactNode {
    const regex: RegExp = /<(\w+)>(.*?)<\/\1>/g;

    const parts: React.ReactNode[] = [];
    let lastIndex: number = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
        const [fullMatch, tag, content] = match;

        if (match.index > lastIndex) {
            parts.push(text.slice(lastIndex, match.index));
        }

        const className: string = formatMap[tag];
        if (className) {
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