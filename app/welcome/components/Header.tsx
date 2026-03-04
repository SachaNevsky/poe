interface HeaderProps {
    className: string;
    currentAct: number;
    handleClick: (act: number) => void;
}

export function Header({ className, currentAct, handleClick }: HeaderProps) {
    const acts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    return (
        <div className={`${className} w-full lg:w-auto lg:mx-4`}>
            {acts.map((act) =>
                <button
                    key={`act${act}`}
                    className={`flex-1 lg:flex-none lg:w-32 text-center lg:text-start rounded mx-1 lg:ml-6 px-2 lg:px-4 py-1 lg:py-2 cursor-pointer text-base lg:text-2xl ${act === currentAct ? "bg-red-900" : "bg-yellow-900"}`}
                    onClick={() => handleClick(act)}
                >
                    <span className="lg:hidden">{act}</span>
                    <span className="hidden lg:inline">Act {act}</span>
                </button>
            )}
        </div>
    )
}