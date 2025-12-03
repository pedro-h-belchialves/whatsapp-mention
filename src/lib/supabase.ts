import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function checkUserAuthorized(phoneNumber: string): Promise<any> {
  try {
    const { data, error } = await supabase
      .from("authorized_users")
      .select("*")
      .eq("phone_number", phoneNumber);

    console.log(data);
    if (error) {
      console.error("Erro ao verificar usuário:", error);
      return false;
    }

    if (data.length === 0) {
      return false;
    }

    return data[0];
  } catch (error) {
    console.error("Erro na verificação:", error);
    return false;
  }
}

interface AttendanceData {
  userName: string;
  clinicName: string;
}

interface AttendanceResult {
  success: boolean;
  userId?: string;
  attendanceId?: string;
  error?: string;
}

interface SpectatorWithAttendance {
  id: string;
  name: string;
  clinic: string;
  attendanceCount: number;
}

interface DashboardData {
  spectators: SpectatorWithAttendance[];
  totalAttendances: number;
  uniqueSpectators: number;
  chartData: { date: string; attendances: number }[];
}

export async function getDashboardData(
  year: number,
  month: number
): Promise<DashboardData> {
  try {
    // Calcula o primeiro e último dia do mês
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0, 23, 59, 59);

    // 1. Busca todos os registros de presença do mês
    const { data: attendances, error: attendanceError } = await supabase
      .from("attendanceRecord")
      .select("user_id, date")
      .gte("date", firstDay.toISOString())
      .lte("date", lastDay.toISOString());

    if (attendanceError) {
      console.error("Erro ao buscar presenças:", attendanceError);
      throw new Error("Erro ao buscar presenças");
    }

    // 2. Conta presenças por usuário
    const attendanceCountMap = new Map<string, number>();
    attendances?.forEach((att) => {
      const count = attendanceCountMap.get(att.user_id) || 0;
      attendanceCountMap.set(att.user_id, count + 1);
    });

    // 3. Busca dados dos usuários
    const userIds = Array.from(attendanceCountMap.keys());
    const { data: spectators, error: spectatorsError } = await supabase
      .from("spectators")
      .select("id, name, clinic")
      .in("id", userIds);

    if (spectatorsError) {
      console.error("Erro ao buscar espectadores:", spectatorsError);
      throw new Error("Erro ao buscar espectadores");
    }

    // 4. Combina dados
    const spectatorsWithAttendance: SpectatorWithAttendance[] = (
      spectators || []
    ).map((spec) => ({
      id: spec.id,
      name: spec.name,
      clinic: spec.clinic,
      attendanceCount: attendanceCountMap.get(spec.id) || 0,
    }));

    // Ordena por número de presenças (decrescente)
    spectatorsWithAttendance.sort(
      (a, b) => b.attendanceCount - a.attendanceCount
    );

    // 5. Prepara dados do gráfico (presenças por semana)
    const chartData = getChartDataByWeek(attendances || [], year, month);

    return {
      spectators: spectatorsWithAttendance,
      totalAttendances: attendances?.length || 0,
      uniqueSpectators: userIds.length,
      chartData,
    };
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error);
    throw error;
  }
}

function getChartDataByWeek(
  attendances: { user_id: string; date: string }[],
  year: number,
  month: number
): { date: string; attendances: number }[] {
  const weeks: { date: string; attendances: number }[] = [];
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  // Calcula quantas semanas tem no mês
  const totalDays = lastDay.getDate();
  const totalWeeks = Math.ceil(totalDays / 7);

  for (let week = 1; week <= totalWeeks; week++) {
    const weekStart = new Date(year, month - 1, (week - 1) * 7 + 1);
    const weekEnd = new Date(
      year,
      month - 1,
      Math.min(week * 7, totalDays),
      23,
      59,
      59
    );

    const weekAttendances = attendances.filter((att) => {
      const attDate = new Date(att.date);
      return attDate >= weekStart && attDate <= weekEnd;
    });

    weeks.push({
      date: `${week}ª Semana`,
      attendances: weekAttendances.length,
    });
  }

  return weeks;
}

export async function registerAttendance(
  data: AttendanceData
): Promise<AttendanceResult> {
  try {
    // 1. Verifica se o usuário já existe pelo nome
    const { data: existingUser, error: searchError } = await supabase
      .from("spectators")
      .select("id")
      .eq("name", data.userName)
      .single();

    if (searchError && searchError.code !== "PGRST116") {
      // PGRST116 é o código para "nenhum resultado encontrado"
      console.error("Erro ao buscar usuário:", searchError);
      return {
        success: false,
        error: "Erro ao buscar usuário no banco de dados",
      };
    }

    let userId: string;

    // 2. Se o usuário não existe, cria um novo
    if (!existingUser) {
      const { data: newUser, error: createError } = await supabase
        .from("spectators")
        .insert({
          name: data.userName,
          clinic: data.clinicName,
        })
        .select("id")
        .single();

      if (createError) {
        console.error("Erro ao criar usuário:", createError);
        return { success: false, error: "Erro ao criar usuário" };
      }

      userId = newUser.id;
      console.log("Novo usuário criado:", userId);
    } else {
      userId = existingUser.id;
      console.log("Usuário existente encontrado:", userId);
    }

    // 3. Cria o registro de presença
    const { data: attendanceRecord, error: attendanceError } = await supabase
      .from("attendanceRecord")
      .insert({
        user_id: userId,
        date: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (attendanceError) {
      console.error("Erro ao registrar presença:", attendanceError);
      return { success: false, error: "Erro ao registrar presença", userId };
    }

    console.log("Presença registrada com sucesso:", attendanceRecord.id);

    return {
      success: true,
      userId,
      attendanceId: attendanceRecord.id,
    };
  } catch (error) {
    console.error("Erro inesperado ao registrar presença:", error);
    return {
      success: false,
      error: "Erro inesperado ao processar o registro",
    };
  }
}
