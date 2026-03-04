interface HeaderProps {
    className: string;
    currentAct: number;
    handleClick: (act: number) => void;
}

export function Header({ className, currentAct, handleClick }: HeaderProps) {
    const acts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    return (
        <div className={`${className} mx-4`}>
            {acts.map((act) =>
                <button
                    key={`act${act}`}
                    className={`w-32 text-start rounded ml-6 px-4 py-2 cursor-pointer ${act === currentAct ? "bg-red-900" : "bg-yellow-900"}`}
                    onClick={() => handleClick(act)}
                >
                    Act {act}
                </button>
            )}
        </div>
    )
}