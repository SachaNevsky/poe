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
                    className={`w-20 lg:w-32 text-start rounded ml-2 lg:ml-6 px-2 lg:px-4 py-1 lg:py-2 cursor-pointer text-base lg:text-2xl ${act === currentAct ? "bg-red-900" : "bg-yellow-900"}`}
                    onClick={() => handleClick(act)}
                >
                    Act {act}
                </button>
            )}
        </div>
    )
}