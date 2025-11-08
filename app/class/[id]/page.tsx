"use client"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Users, Calendar, BookOpen, MessageSquare } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

// Dados simulados das turmas
const classData = {
  1: {
    id: 1,
    name: "Algoritmos e Estruturas de Dados",
    code: "AED001",
    professor: "Prof. Maria Santos",
    schedule: "Seg/Qua 14:00-16:00",
    room: "Lab 101",
    semester: "2024.1",
    credits: 4,
    description: "Estudo de algoritmos fundamentais e estruturas de dados básicas.",
    students: 28,
    announcements: [
      {
        id: 1,
        title: "Prova 2 - Data Alterada",
        content: "A prova 2 foi reagendada para o dia 15/03. Estudem os capítulos 5 e 6 do livro.",
        date: "2024-03-01",
        author: "Prof. Maria Santos",
      },
      {
        id: 2,
        title: "Lista de Exercícios 3",
        content: "Nova lista disponível no portal. Prazo de entrega: 20/03.",
        date: "2024-02-28",
        author: "Prof. Maria Santos",
      },
    ],
    grades: [
      { assessment: "Prova 1", grade: 8.5, weight: 30, date: "2024-02-15" },
      { assessment: "Lista 1", grade: 9.0, weight: 10, date: "2024-02-10" },
      { assessment: "Lista 2", grade: 7.5, weight: 10, date: "2024-02-25" },
    ],
    classmates: [
      { id: 1, name: "Ana Silva", registration: "2024002" },
      { id: 2, name: "Carlos Santos", registration: "2024003" },
      { id: 3, name: "Maria Oliveira", registration: "2024004" },
      { id: 4, name: "Pedro Costa", registration: "2024005" },
    ],
  },
}

export default function ClassPage() {
  const params = useParams()
  const router = useRouter()
  const classId = Number.parseInt(params.id as string)
  const classInfo = classData[classId as keyof typeof classData]

  if (!classInfo) {
    return <div>Turma não encontrada</div>
  }

  const currentGrade = classInfo.grades.reduce((acc, grade) => acc + (grade.grade * grade.weight) / 100, 0)
  const totalWeight = classInfo.grades.reduce((acc, grade) => acc + grade.weight, 0)
  const finalGrade = totalWeight > 0 ? ((currentGrade / totalWeight) * 100).toFixed(1) : "0.0"

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader
        title={classInfo.name}
        userName="João Silva"
        userInfo={`${classInfo.code} - ${classInfo.semester}`}
      />

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          {/* Informações da Turma */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Alunos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{classInfo.students}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Horário
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium text-slate-900">{classInfo.schedule}</div>
                <div className="text-xs text-slate-600">{classInfo.room}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Créditos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{classInfo.credits}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Nota Atual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{finalGrade}</div>
                <div className="text-xs text-slate-600">{totalWeight}% concluído</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="info" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="announcements">Avisos</TabsTrigger>
            <TabsTrigger value="grades">Notas</TabsTrigger>
            <TabsTrigger value="classmates">Colegas</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sobre a Disciplina</CardTitle>
                <CardDescription>Professor: {classInfo.professor}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 mb-4">{classInfo.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Detalhes</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Código:</span>
                        <span className="font-medium">{classInfo.code}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Semestre:</span>
                        <span className="font-medium">{classInfo.semester}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Créditos:</span>
                        <span className="font-medium">{classInfo.credits}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Horários e Local</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Horário:</span>
                        <span className="font-medium">{classInfo.schedule}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Sala:</span>
                        <span className="font-medium">{classInfo.room}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="announcements" className="space-y-4">
            <div className="space-y-4">
              {classInfo.announcements.map((announcement) => (
                <Card key={announcement.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <MessageSquare className="w-5 h-5 text-blue-600" />
                          {announcement.title}
                        </CardTitle>
                        <CardDescription>
                          Por {announcement.author} • {new Date(announcement.date).toLocaleDateString("pt-BR")}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700">{announcement.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="grades" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notas e Avaliações</CardTitle>
                <CardDescription>Seu desempenho na disciplina</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {classInfo.grades.map((grade, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <div className="font-medium text-slate-900">{grade.assessment}</div>
                        <div className="text-sm text-slate-600">
                          Peso: {grade.weight}% • {new Date(grade.date).toLocaleDateString("pt-BR")}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-slate-900">{grade.grade}</div>
                        <Badge variant={grade.grade >= 7 ? "default" : "destructive"} className="text-xs">
                          {grade.grade >= 7 ? "Aprovado" : "Reprovado"}
                        </Badge>
                      </div>
                    </div>
                  ))}

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-slate-900">Nota Final Parcial</div>
                        <div className="text-sm text-slate-600">Baseada em {totalWeight}% das avaliações</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">{finalGrade}</div>
                        <Progress value={totalWeight} className="w-20 mt-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classmates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Colegas de Turma</CardTitle>
                <CardDescription>{classInfo.students} alunos matriculados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {classInfo.classmates.map((classmate) => (
                    <div key={classmate.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {classmate.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{classmate.name}</div>
                          <div className="text-sm text-slate-600">{classmate.registration}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-center py-4 text-slate-500 text-sm">
                    ... e mais {classInfo.students - classInfo.classmates.length} alunos
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
