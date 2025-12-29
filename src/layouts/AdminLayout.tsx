import { useEffect, useRef, useState } from "react";
import { getConversations } from "../api/api_conversation";
import { getMessages } from "../api/api_messages";
import type { Message } from "../types/Message";
import Skeleton from "../components/admin/Skeleton";
// importar panel de usuarios
import UsersPanel from "../components/admin/UserPanel";
// sidebar de admin
import AdminSidebar from "../components/admin/AdminSidebar";
// obtener conversaciones
import type { ConversationItem } from "../types/api/ConversationItem";
import AdminChatView from "../components/admin/AdminChatView";

export default function AdminLayout() {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  // crud de usuarios 
  const [tab, setTab] = useState<"conversations" | "users">("conversations");
  const bottomRef = useRef<HTMLDivElement>(null);

  async function loadMsgs(id: number) {
    setLoading(true); // empieza el skeleton
    setSelected(id);
    setMessages([]); // limpiar mensajes mientras llegan

    const data = await getMessages(id);

    setMessages(data.items || []);
    setLoading(false);  // termina el skeleton
  }

  useEffect(() => {
    let active = true;

    const loadConversations = async () => {
      const data = await getConversations();
      if (active) setConversations(data.items || []);
    };

    loadConversations();

    return () => { active = false };
  }, []);
  // para el scroll automático al final de la conversación
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-full bg-background text-text-primary">

      {/* SIDEBAR */}
      <AdminSidebar
        tab={tab}
        selected={selected}
        conversations={conversations}
        loadMsgs={loadMsgs}
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-0 overflow-auto bg-background">
        {/* selector de pestañas */}
        <div className="flex space-x-4 px-6 py-3 border-b border-border bg-surface">
          <button
            onClick={() => setTab("conversations")}
            className={`font-medium transition ${
              tab === "conversations"
                ? "text-primary border-b-2 border-primary"
                : "text-text-secondary"
            }`}
          >
            Conversaciones
          </button>

          <button
            onClick={() => setTab("users")}
            className={`font-medium transition ${
              tab === "users"
                ? "text-primary border-b-2 border-primary"
                : "text-text-secondary"
            }`}
          >
            Usuarios
          </button>
        </div>

        {/* PANEL DE CONVERSACIONES */}
        {tab === "conversations" && (
        <>
          <div className="pl-6 pr-6 pt-6 pb-0">
            <h3 className="font-semibold mb-4 text-text-primary">Mensajes</h3>

            {!selected && (
              <p className="text-text-secondary text-sm">
                Selecciona una conversación
              </p>
            )}

            {loading && <Skeleton lines={4} />}

            {tab === "conversations" && selected && (
              <AdminChatView
                messages={messages}
                loading={loading} />
            )}
          </div><div ref={bottomRef} />
        </>
        )}

        {/* PANEL DE USUARIOS */}
        {tab === "users" && <UsersPanel />}
      </main>
    </div>
  );
}
