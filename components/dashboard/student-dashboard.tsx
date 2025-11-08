"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Download } from "lucide-react"
import Link from "next/link"

// Dados simulados
const studentData = {
  name: "João Silva",
  registration: "2024001",
  course: "Engenharia de Software",
  semester: "3º Semestre",
  gpa: 8.5,
}

const enrolledSubjects = [
  {
    id: 1,
    name: "Algoritmos e Estruturas de Dados",
    code: "AED001",
    professor: "Prof. Maria Santos",
    schedule: "Seg/Qua 14:00-16:00",
    grade: 8.7,
    attendance: 92,
    status: "Em andamento",
  },
  {
    id: 2,
    name: "Banco de Dados",
    code: "BD001",
    professor: "Prof. Carlos Lima",
    schedule: "Ter/Qui 16:00-18:00",
    grade: 9.2,
    attendance: 88,
    status: "Em andamento",
  },
  {
    id: 3,
    name: "Engenharia de Software",
    code: "ES001",
    professor: "Prof. Ana Costa",
    schedule: "Sex 08:00-12:00",
    grade: 7.8,
    attendance: 95,
    status: "Em andamento",
  },
]

const schedule = [
  { day: "Segunda", time: "14:00-16:00", subject: "Algoritmos e Estruturas de Dados", room: "Lab 101" },
  { day: "Terça", time: "16:00-18:00", subject: "Banco de Dados", room: "Sala 205" },
  { day: "Quarta", time: "14:00-16:00", subject: "Algoritmos e Estruturas de Dados", room: "Lab 101" },
  { day: "Quinta", time: "16:00-18:00", subject: "Banco de Dados", room: "Sala 205" },
  { day: "Sexta", time: "08:00-12:00", subject: "Engenharia de Software", room: "Auditório" },
]

export function StudentDashboard() {
  const handleDownloadHistory = () => {
    alert("Baixando histórico acadêmico...")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader
        title="Dashboard do Aluno"
        userName={studentData.name}
        userInfo={`${studentData.registration} - ${studentData.course}`}
      />

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Informações do Aluno */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Semestre Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{studentData.semester}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">IRA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{studentData.gpa}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Disciplinas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{enrolledSubjects.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/enrollment">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Nova Matrícula</Button>
              </Link>
              <Button onClick={handleDownloadHistory} variant="outline" className="w-full bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Baixar Histórico
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="subjects" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="subjects">Disciplinas</TabsTrigger>
            <TabsTrigger value="schedule">Horários</TabsTrigger>
          </TabsList>

          <TabsContent value="subjects" className="space-y-4">
            <div className="grid gap-4">
              {enrolledSubjects.map((subject) => (
                <Card key={subject.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{subject.name}</CardTitle>
                        <CardDescription>
                          {subject.code} - {subject.professor}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="secondary">{subject.status}</Badge>
                        <Link href={`/student-class/${subject.id}`}>
                          <Button size="sm" variant="outline">
                            Ver Turma
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                      <div>
                        <p className="text-sm text-slate-600">Horário</p>
                        <p className="font-medium">{subject.schedule}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Horário Semanal</CardTitle>
                <CardDescription>Sua grade de horários da semana</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {schedule.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-20 text-sm font-medium text-slate-600">{item.day}</div>
                        <div className="text-sm text-slate-600">{item.time}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{item.subject}</div>
                        <div className="text-sm text-slate-600">{item.room}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
