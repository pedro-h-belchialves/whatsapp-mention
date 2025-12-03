"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Users,
  TrendingUp,
  Calendar,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getDashboardData } from "@/src/lib/supabase";

// Tipos
interface Spectator {
  id: string;
  name: string;
  clinic: string;
  attendanceCount: number;
}

interface ChartData {
  date: string;
  attendances: number;
}

const DashboardAttendance = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [spectators, setSpectators] = useState<Spectator[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalAttendances, setTotalAttendances] = useState(0);
  const [uniqueSpectators, setUniqueSpectators] = useState(0);

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  useEffect(() => {
    loadData();
  }, [currentDate]);

  const loadData = async () => {
    setLoading(true);

    try {
      // Importar a função: import { getDashboardData } from '@/lib/supabase';
      const data = await getDashboardData(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1
      );

      setSpectators(data.spectators);
      setChartData(data.chartData);
      setTotalAttendances(data.totalAttendances);
      setUniqueSpectators(data.uniqueSpectators);

      // VERSÃO DEMO - Remova quando integrar com Supabase
      //   await new Promise((resolve) => setTimeout(resolve, 800));
      //   const mockSpectators: Spectator[] = [
      //     {
      //       id: "1",
      //       name: "Dr. João Silva",
      //       clinic: "Clínica Saúde+",
      //       attendanceCount: 4,
      //     },
      //     {
      //       id: "2",
      //       name: "Dra. Maria Santos",
      //       clinic: "Centro Médico ABC",
      //       attendanceCount: 5,
      //     },
      //     {
      //       id: "3",
      //       name: "Dr. Pedro Costa",
      //       clinic: "Clínica Vida",
      //       attendanceCount: 3,
      //     },
      //     {
      //       id: "4",
      //       name: "Dra. Ana Paula",
      //       clinic: "Espaço Bem-Estar",
      //       attendanceCount: 5,
      //     },
      //     {
      //       id: "5",
      //       name: "Dr. Carlos Eduardo",
      //       clinic: "Clínica Integrada",
      //       attendanceCount: 2,
      //     },
      //     {
      //       id: "6",
      //       name: "Dra. Beatriz Lima",
      //       clinic: "Centro de Saúde Premium",
      //       attendanceCount: 4,
      //     },
      //     {
      //       id: "7",
      //       name: "Dr. Rafael Mendes",
      //       clinic: "Clínica Esperança",
      //       attendanceCount: 1,
      //     },
      //     {
      //       id: "8",
      //       name: "Dra. Juliana Rocha",
      //       clinic: "Saúde Total",
      //       attendanceCount: 5,
      //     },
      //   ];
      //   const mockChartData: ChartData[] = [
      //     { date: "1ª Semana", attendances: 12 },
      //     { date: "2ª Semana", attendances: 15 },
      //     { date: "3ª Semana", attendances: 18 },
      //     { date: "4ª Semana", attendances: 14 },
      //     { date: "5ª Semana", attendances: 10 },
      //   ];
      //   setSpectators(mockSpectators);
      //   setChartData(mockChartData);
      //   setTotalAttendances(
      //     mockSpectators.reduce((sum, s) => sum + s.attendanceCount, 0)
      //   );
      //   setUniqueSpectators(mockSpectators.length);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      alert("Erro ao carregar dados do dashboard");
    } finally {
      setLoading(false);
    }
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getAttendanceColor = (count: number) => {
    if (count === 5) return "text-green-600 bg-green-50";
    if (count >= 3) return "text-blue-600 bg-blue-50";
    if (count >= 1) return "text-orange-600 bg-orange-50";
    return "text-gray-600 bg-gray-50";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Dashboard de Presença
          </h1>
          <p className="text-gray-600">
            Acompanhe a participação nas mentorias
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total de Presenças</p>
                <p className="text-3xl font-bold text-gray-900">
                  {totalAttendances}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  Espectadores Únicos
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {uniqueSpectators}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Média por Pessoa</p>
                <p className="text-3xl font-bold text-gray-900">
                  {(totalAttendances / uniqueSpectators).toFixed(1)}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Presença por Semana
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="attendances" fill="#00C89F" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Lista de Espectadores */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Header da Lista */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Lista de Espectadores
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateMonth("prev")}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <div className="px-4 py-2 bg-green-50 rounded-lg">
                  <p className="text-sm font-semibold text-green-900">
                    {monthNames[currentDate.getMonth()]}{" "}
                    {currentDate.getFullYear()}
                  </p>
                </div>
                <button
                  onClick={() => navigateMonth("next")}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Tabela */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                    Clínica
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Presenças
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {spectators.map((spectator) => (
                  <tr
                    key={spectator.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {spectator.name}
                        </p>
                        <p className="text-sm text-gray-500 md:hidden">
                          {spectator.clinic}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 hidden md:table-cell">
                      {spectator.clinic}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold ${getAttendanceColor(
                          spectator.attendanceCount
                        )}`}
                      >
                        {spectator.attendanceCount}/5
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Total: {spectators.length} espectadores
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAttendance;
