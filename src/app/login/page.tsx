"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { Card } from "@/src/components/catd";
import { Input } from "@/src/components/input";
import { Button } from "@/src/components/button";
import { checkUserAuthorized } from "@/src/lib/supabase";
import { setCookie } from "cookies-next";

export default function LoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const user = await checkUserAuthorized(phoneNumber);
      console.log(user);

      if (!user) {
        throw new Error("Número não autorizado");
      }

      setCookie("userPhone", user.phone_number);

      // Salva no localStorage
      localStorage.setItem("userPhone", user.phone_number);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("evolutionInstance", user.evolution_key);

      // Redireciona para a página principal
      router.push("/mention");
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Logo" className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo!</h2>
          <p className="text-gray-600">Entre com seu número para continuar</p>
        </div>

        <div className="space-y-6">
          <Input
            label="Seu nome"
            type="text"
            placeholder="Digite seu nome"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            onKeyPress={handleKeyPress}
            error={error}
          />

          <Button
            onClick={handleLogin}
            variant="primary"
            loading={loading}
            className="w-full"
          >
            {loading ? "Verificando..." : "Entrar"}
          </Button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Apenas usuários autorizados podem acessar</p>
        </div>
      </Card>
    </div>
  );
}
