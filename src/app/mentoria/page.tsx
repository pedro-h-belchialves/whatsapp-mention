"use client";
import React, { useState, useEffect } from "react";
import { User, Building2, Video, CheckCircle } from "lucide-react";
import { registerAttendance } from "@/src/lib/supabase";

// Tipos
interface FormData {
  userName: string;
  clinicName: string;
}

interface AttendanceRecord {
  id: string;
  user_id: string;
  meet_id: string;
  attended_at: string;
}

const MentoriaAttendance = () => {
  const [formData, setFormData] = useState<FormData>({
    userName: "",
    clinicName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [meetId, setMeetId] = useState("");

  useEffect(() => {
    // Pega o meetId da URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id") || "";
    setMeetId(id);

    // Verifica se há dados em memória (simulando localStorage)
    const stored = localStorage.getItem("mentoriaUser");
    console.log("stored");
    console.log(stored);
    if (stored) {
      const data = JSON.parse(stored);
      if (!data.userName || !data.clinicName) return;
      //   setFormData(data);
      //   setHasStoredData(true);
      //   // Auto-submit se já tiver dados
      //   handleAutoSubmit(data);

      formData.userName = data.userName;
      formData.clinicName = data.clinicName;
      // setHasStoredData(true);
      // // Auto-submit se já tiver dados
      // handleAutoSubmit(data);
    }
  }, []);

  //   const handleAutoSubmit = async (data: FormData) => {
  //     console.log("registrando com autoSubmit");
  //     console.log(data);
  //     await handleSubmit(null, data);
  //   };

  const handleSubmit = async (
    e: React.FormEvent | null,
    autoData?: FormData
  ) => {
    if (e) e.preventDefault();

    const dataToSubmit = autoData || formData;

    console.log(autoData);

    if (!dataToSubmit.userName || !dataToSubmit.clinicName) return;

    setIsSubmitting(true);

    try {
      const result = await registerAttendance({
        userName: formData.userName,
        clinicName: formData.clinicName,
      });

      if (result.success) {
        // Salva no localStorage
        // if (!hasStoredData) {
        localStorage.setItem("mentoriaUser", JSON.stringify(formData));
        // }

        setShowSuccess(true);

        // Redireciona para o Meet
        setTimeout(() => {
          if (meetId) {
            window.location.href = `https://meet.google.com/${meetId}`;
          }
        }, 2000);
      } else {
        alert(`Erro: ${result.error}`);
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao registrar presença. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 mb-6">
            <CheckCircle className="w-12 h-12 text-zinc-900" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Presença Registrada!
          </h2>
          <p className="text-zinc-400 text-lg">Redirecionando para o Meet...</p>
          <div className="mt-8">
            <div className="inline-block h-2 w-32 bg-zinc-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black  to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8 flex flex-col gap-0">
          {/* <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#A48B58] to-[#EFD6A3] mb-4">
            <Video className="w-8 h-8 text-zinc-900" />
          </div> */}
          <h1 className="text-sm md:text-xl font-bold font-sans font-extralight text-white ">
            MENTORIA ADVANCED COM
          </h1>
          <br />
          <span className="text-3xl md:text-4xl text-transparent bg-clip-text font-[bosca] font-black bg-gradient-to-r from-[#A48B58] to-[#EFD6A3] mb-8">
            FÁBIO GARCIA
          </span>
          <p className="text-zinc-400 uppercase">
            Registre sua presença para continuar
          </p>
        </div>

        {/* Card do Formulário */}
        <div className="bg-zinc-950 backdrop-blur-xl rounded-sm shadow-2xl border border-zinc-700/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Nome */}
            <div>
              <label
                htmlFor="userName"
                className="block text-sm font-medium text-zinc-300 mb-2"
              >
                Seu Nome
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-[#A48B58]" />
                </div>
                <input
                  type="text"
                  id="userName"
                  required
                  value={formData.userName}
                  onChange={(e) =>
                    setFormData({ ...formData, userName: e.target.value })
                  }
                  className="block w-full pl-12 pr-4 py-3 bg-black border border-zinc-800 rounded-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#A48B58] focus:border-transparent transition-all"
                  placeholder="Digite seu nome completo"
                />
              </div>
            </div>

            {/* Campo Clínica */}
            <div>
              <label
                htmlFor="clinicName"
                className="block text-sm font-medium text-zinc-300 mb-2"
              >
                Nome da Clínica
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-[#A48B58]" />
                </div>
                <input
                  type="text"
                  id="clinicName"
                  required
                  value={formData.clinicName}
                  onChange={(e) =>
                    setFormData({ ...formData, clinicName: e.target.value })
                  }
                  className="block w-full pl-12 pr-4 py-3 bg-black border border-zinc-800 rounded-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#A48B58] focus:border-transparent transition-all"
                  placeholder="Nome da sua clínica"
                />
              </div>
            </div>

            {/* Botão Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 uppercase rounded-sm font-semibold text-zinc-900 bg-gradient-to-r from-[#A48B58] to-[#EFD6A3] hover:from-[#765D2A] hover:to-[#A48B58] focus:outline-none focus:ring-2 focus:ring-[#A48B58] focus:ring-offset-2 focus:ring-offset-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-yellow-500/50"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-zinc-900"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Registrando...
                </span>
              ) : (
                "Entrar na Mentoria"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-zinc-700/50">
            <p className="text-center text-sm text-zinc-500">
              Suas informações serão salvas para as próximas mentorias
            </p>
          </div>
        </div>

        {/* Info adicional */}
        <div className="mt-6 text-center">
          <p className="text-zinc-500 text-sm">
            Mentorias toda segunda-feira • Até 5 sessões por mês
          </p>
        </div>
      </div>
    </div>
  );
};

export default MentoriaAttendance;
