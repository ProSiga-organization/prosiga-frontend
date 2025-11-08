"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Bell, Lock, Users } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const classData = {
  1: {
    id: 1,
    name: "Algoritmos e Estruturas de Dados",
    code: "AED001",
    professor: "Prof. Maria Santos",
    schedule: "Seg/Qua 14:00-16:00",
    room: "Lab 101",
    semester: "2024.1",
    students: [
      { id: 1, name: "Ana Costa", registration: "2021001" },
      { id: 2, name: "Carlos Mendes", registration: "2021002" },
      { id: 3, name: "Fernanda Lima", registration: "2021003" },
      { id: 4, name: "João Silva", registration: "2021004" },
      { id: 5, name: "Mariana Souza", registration: "2021005" },
    ],
    totalStudents: 5,
    grades: {
      "Prova 1": 8.5,
      "Trabalho 1": 9.0,
      "Nota Final": null,
    },
    announcements: [
      {
        id: 1,
        title: "Prova marcada",
        description: "A prova será no dia 15/03 às 14h. Estudem os capítulos 1 a 5.",
        date: "2024-03-01",
      },
    ],
    canWithdraw: true,
  },
}

export default function StudentClassPage() {
  const params = useParams()
  const router = useRouter()
  const classId = Number.parseInt(params.id as string)
  const classInfo = classData[classId as keyof typeof classData]

  const [showWithdrawModal, setShowWithdrawModal] = useState(false)

  if (!classInfo) {
    return <div>Turma não encontrada</div>
  }

  const handleWithdraw = () => {
    alert("Solicitação de trancamento enviada!")
    setShowWithdrawModal(false)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader
        title={classInfo.name}
        userName="João Silva"
        userInfo={`${classInfo.code} - ${classInfo.semester}`}
      />

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Dashboard
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Professor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-medium text-slate-900">{classInfo.professor}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Horário</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-medium text-slate-900">{classInfo.schedule}</div>
              <div className="text-sm text-slate-600">{classInfo.room}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Alunos Matriculados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-600" />
                <span className="text-lg font-medium">{classInfo.totalStudents} alunos</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="info" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="grades">Notas</TabsTrigger>
            <TabsTrigger value="announcements">Avisos</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Turma</CardTitle>
                <CardDescription>Detalhes sobre a disciplina</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Código da Turma</p>
                  <p className="font-medium">{classInfo.code}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Semestre</p>
                  <p className="font-medium">{classInfo.semester}</p>
                </div>
                <div className="pt-4 border-t">
                  <h3 className="font-semibold text-slate-900 mb-3">Colegas de Turma</h3>
                  <div className="space-y-2">
                    {classInfo.students.map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="font-medium text-slate-900">{student.name}</span>
                        <span className="text-sm text-slate-600">{student.registration}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {classInfo.canWithdraw && (
                  <div className="pt-4 border-t">
                    <Button
                      variant="destructive"
                      onClick={() => setShowWithdrawModal(true)}
                      className="w-full md:w-auto"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Trancar Turma
                    </Button>
                    <p className="text-sm text-slate-500 mt-2">
                      Você está dentro do período permitido para trancamento
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grades">
            <Card>
              <CardHeader>
                <CardTitle>Notas</CardTitle>
                <CardDescription>Suas avaliações nesta disciplina</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(classInfo.grades).map(([gradeName, gradeValue]) => (
                    <div key={gradeName} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="font-medium text-slate-900">{gradeName}</span>
                      {gradeValue !== null ? (
                        <span className="text-lg font-bold text-slate-900">{gradeValue.toFixed(1)}</span>
                      ) : (
                        <Badge variant="secondary">Não lançada</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="announcements">
            <Card>
              <CardHeader>
                <CardTitle>Avisos da Turma</CardTitle>
                <CardDescription>Comunicados do professor</CardDescription>
              </CardHeader>
              <CardContent>
                {classInfo.announcements.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Bell className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>Nenhum aviso no momento</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {classInfo.announcements.map((announcement) => (
                      <div key={announcement.id} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Bell className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 mb-1">{announcement.title}</h3>
                            <p className="text-slate-600 mb-2">{announcement.description}</p>
                            <p className="text-sm text-slate-500">
                              {new Date(announcement.date).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Trancamento</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja trancar esta turma? Esta ação não poderá ser desfeita e você precisará se
              matricular novamente em outro período.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWithdrawModal(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleWithdraw}>
              Confirmar Trancamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
