import ChatBubble from "../chat/ChatBubble";
import Skeleton from "./Skeleton";
import type { Message } from "../../types/Message";

export default function AdminChatView({
  messages,
  loading,
}: {
  messages: Message[];
  loading: boolean;
}) {
  return (
    <div className="flex flex-col h-[calc(100vh-160px)]">

      {/* zona de mensajes */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loading && <Skeleton lines={4} />}

        {!loading &&
          messages.map((m) => (
            <ChatBubble key={m.id} m={m} />
          ))}
      </div>

    </div>
  );
}
