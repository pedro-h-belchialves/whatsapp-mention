"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Send, Users, Check, Loader2 } from "lucide-react";

import { Card } from "@/src/components/catd";
import { Button } from "@/src/components/button";
import {
  getGroups,
  getGroupParticipants,
  sendMessageToGroup,
} from "@/src/lib/evolution";
import { Group } from "../../../types/group";
import { Input } from "../../../components/input";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [success, setSuccess] = useState(false);
  const [instanceName, setInstanceName] = useState("");

  useEffect(() => {
    const phone = localStorage.getItem("userPhone");
    const evolutionInstance = localStorage.getItem("evolutionInstance");
    const userName = localStorage.getItem("userName");

    if (!phone || !evolutionInstance || !userName) {
      router.push("/login");
    } else {
      setUser(phone);
      setInstanceName(evolutionInstance);
      setUserName(userName);
    }
  }, [router]);

  const fetchGroups = async ({ useCache }: { useCache?: boolean }) => {
    if (!instanceName) return;

    setLoadingGroups(true);

    if (useCache) {
      const cachedGroups = localStorage.getItem("groups");
      if (cachedGroups) {
        const cached = JSON.parse(cachedGroups);

        setGroups(cached);
        setLoadingGroups(false);
      } else {
        await fetchGroups({ useCache: false });
      }
      return;
    }

    try {
      const groupsData = await getGroups(instanceName);
      setGroups(groupsData);

      localStorage.setItem("groups", JSON.stringify(groupsData));
    } catch (err) {
      console.error("Erro ao buscar grupos:", err);
    } finally {
      setLoadingGroups(false);
    }
  };

  const handleSelectGroup = async (group: Group) => {
    setSelectedGroup(group);

    // Buscar participantes do grupo
    try {
      const participants = await getGroupParticipants(instanceName, group.id);
      setSelectedGroup({
        ...group,
        participants: participants,
      });
    } catch (err) {
      console.error("Erro ao buscar participantes:", err);
    }
  };

  const extractMeetId = (message: string): string | null => {
    const regex = /https:\/\/meet\.google\.com\/([a-z0-9-]+)/i;
    const match = message.match(regex);
    return match ? match[1] : null;
  };

  const handleSendMessage = async () => {
    if (!selectedGroup || !message.trim()) return;

    setLoading(true);
    setSuccess(false);

    try {
      // Extrair JIDs dos participantes
      const mentionedJids = selectedGroup.participants.map((p) => p.id);

      let messageToSennd = message;

      if (message.includes("meet.google.com")) {
        messageToSennd = message.replace(
          /https:\/\/meet\.google\.com\/([a-z0-9-]+)/i,
          process.env.NEXT_PUBLIC_HOST +
            "/mentoria?id=" +
            extractMeetId(message)
        );
        // message = `https://meet.google.com/${liveLink}`;
      }

      await sendMessageToGroup(
        instanceName,
        selectedGroup.id,
        messageToSennd,
        mentionedJids
      );

      setSuccess(true);
      setMessage("");

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
      alert("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userPhone");
    router.push("/login");
  };

  useEffect(() => {
    if (instanceName) {
      fetchGroups({ useCache: true });
    }
  }, [instanceName]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Sidebar - Lista de Grupos */}
          <Card className="md:col-span-1 p-6">
            <div className="space-y-4 flex flex-col pb-5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Grupos
                </h2>
                <Button
                  variant="secondary"
                  onClick={() => fetchGroups({ useCache: false })}
                  loading={loadingGroups}
                >
                  Atualizar
                </Button>
              </div>

              <Input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar..."
              />
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {loadingGroups ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-500" />
                  <p className="text-gray-600 mt-2">Carregando grupos...</p>
                </div>
              ) : groups.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum grupo encontrado</p>
                </div>
              ) : (
                groups
                  .filter((group) =>
                    group.subject.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((group) => (
                    <button
                      key={group.id}
                      onClick={() => handleSelectGroup(group)}
                      className={`w-full text-left p-4 rounded-lg transition-all ${
                        selectedGroup?.id === group.id
                          ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                          : "bg-gray-50 hover:bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="font-semibold">{group.subject}</p>
                      <p
                        className={`text-sm ${
                          selectedGroup?.id === group.id
                            ? "text-emerald-100"
                            : "text-gray-500"
                        }`}
                      >
                        {group.participants?.length || 0} participantes
                      </p>
                    </button>
                  ))
              )}
            </div>
          </Card>

          {/* Área de Mensagem */}
          <Card className="md:col-span-2 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Enviar Mensagem
            </h2>

            {selectedGroup ? (
              <div className="space-y-6">
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-4">
                  <p className="text-sm text-emerald-800 font-medium">
                    Grupo selecionado:{" "}
                    <span className="font-bold">{selectedGroup.subject}</span>
                  </p>
                  <p className="text-sm text-emerald-600 mt-1">
                    Todos os {selectedGroup.participants?.length || 0}{" "}
                    participantes serão mencionados
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sua Mensagem
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Digite sua mensagem aqui..."
                    rows={8}
                    className="w-full px-4 placeholder:text-gray-400  text-gray-800 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none resize-none"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {message.length} caracteres
                  </p>
                </div>

                {success && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <p className="text-green-800 font-medium">
                      Mensagem enviada com sucesso!
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleSendMessage}
                  variant="primary"
                  icon={Send}
                  loading={loading}
                  disabled={!message.trim()}
                  className="w-full"
                >
                  {loading ? "Enviando..." : "Enviar para Todos"}
                </Button>
              </div>
            ) : (
              <div className="text-center py-16">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 text-lg">
                  Selecione um grupo para começar
                </p>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
