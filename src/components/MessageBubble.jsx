function MessageBubble({ message, mine }) {
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
          mine
            ? "bg-[#3D3A3A] text-white rounded-br-md"
            : "bg-[#F1ECE9] text-[#3D3A3A] rounded-bl-md"
        }`}
      >
        <p className="text-sm leading-relaxed">{message}</p>
      </div>
    </div>
  );
}

export default MessageBubble;