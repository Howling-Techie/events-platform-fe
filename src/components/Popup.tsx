export const Popup = ({title, message, onClose, type, showButton = true}: {
    title: string,
    message: string,
    onClose: () => void,
    type: string,
    showButton?: boolean
}) => {
    let icon = "";
    if (type === "error") {
        icon = "❌";
    } else if (type === "success") {
        icon = "✅";
    } else if (type === "info") {
        icon = "ℹ️";
    }

    return (
        <>
            <div className="fixed inset-0  bg-gray-300 opacity-50"></div>
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white p-8 max-w-sm rounded border-2 shadow-lg">
                    <h2 className="text-xl mb-4">{title}</h2>
                    <div className="flex items-center mb-4">
                        <span className="mr-2 text-4xl">{icon}</span>
                        <p>{message}</p>
                    </div>
                    {showButton &&
                        <div className="w-full flex justify-end">
                            <button onClick={onClose} className="bg-blue-500 text-white px-4 py-2 rounded">
                                OK
                            </button>
                        </div>
                    }
                </div>
            </div>
        </>
    );
};