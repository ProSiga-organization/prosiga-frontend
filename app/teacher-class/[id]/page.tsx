"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Download, FileText, Check, Plus, X, Bell, Pencil, Trash2 } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ClassReportModal } from "@/components/dashboard/class-report-modal"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Announcement {
  id: number
  title: string
  description: string
  date: string
}

const teacherClassData = {
  1: {
    id: 1,
    name: "Algoritmos e Estruturas de Dados",
    code: "AED001",
    semester: "2024.1",
    schedule: "Seg/Qua 14:00-16:00",
    room: "Lab 101",
    students: [
      { id: 1, name: "João Silva", registration: "2024001", grades: {} },
      { id: 2, name: "Ana Costa", registration: "2024002", grades: {} },
      { id: 3, name: "Carlos Santos", registration: "2024003", grades: {} },
      { id: 4, name: "Maria Oliveira", registration: "2024004", grades: {} },
      { id: 5, name: "Pedro Almeida", registration: "2024005", grades: {} },
    ],
  },
  2: {
    id: 2,
    name: "Programação Orientada a Objetos",
    code: "POO001",
    semester: "2024.1",
    schedule: "Ter/Qui 16:00-18:00",
    room: "Sala 205",
    students: [
      { id: 6, name: "Lucas Ferreira", registration: "2024006", grades: {} },
      { id: 7, name: "Juliana Souza", registration: "2024007", grades: {} },
    ],
  },
  3: {
    id: 3,
    name: "Estruturas de Dados Avançadas",
    code: "EDA001",
    semester: "2024.1",
    schedule: "Sex 08:00-12:00",
    room: "Lab 102",
    students: [
      { id: 8, name: "Rafael Lima", registration: "2024008", grades: {} },
      { id: 9, name: "Beatriz Costa", registration: "2024009", grades: {} },
    ],
  },
}

export default function TeacherClassPage() {
  const params = useParams()
  const router = useRouter()
  const classId = Number.parseInt(params.id as string)
  const classInfo = teacherClassData[classId as keyof typeof teacherClassData]

  const [students, setStudents] = useState(classInfo?.students || [])
  const [gradeColumns, setGradeColumns] = useState<string[]>([])
  const [finalGrades, setFinalGrades] = useState<{ [key: number]: number | null }>({})
  const [savedStatus, setSavedStatus] = useState<{ [key: number]: boolean }>({})
  const [showReportModal, setShowReportModal] = useState(false)
  const [showAddGradeModal, setShowAddGradeModal] = useState(false)
  const [newGradeName, setNewGradeName] = useState("")

  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: 1,
      title: "Prova marcada",
      description: "A prova será no dia 15/03 às 14h. Estudem os capítulos 1 a 5.",
      date: "2024-03-01",
    },
  ])
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  })

  if (!classInfo) {
    return <div>Turma não encontrada</div>
  }

  const handleAddGradeColumn = () => {
    if (newGradeName.trim()) {
      setGradeColumns((prev) => [...prev, newGradeName.trim()])
      setNewGradeName("")
      setShowAddGradeModal(false)
    }
  }

  const handleRemoveGradeColumn = (columnName: string) => {
    setGradeColumns((prev) => prev.filter((col) => col !== columnName))
    setStudents((prev) =>
      prev.map((student) => {
        const newGrades = { ...student.grades }
        delete newGrades[columnName]
        return { ...student, grades: newGrades }
      }),
    )
  }

  const handleGradeChange = (studentId: number, gradeName: string, value: string) => {
    const numValue = Number.parseFloat(value) || 0
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id === studentId) {
          return {
            ...student,
            grades: {
              ...student.grades,
              [gradeName]: numValue,
            },
          }
        }
        return student
      }),
    )
    setSavedStatus((prev) => ({ ...prev, [studentId]: false }))
  }

  const handleFinalGradeChange = (studentId: number, value: string) => {
    const numValue = value === "" ? null : Number.parseFloat(value) || 0
    setFinalGrades((prev) => ({ ...prev, [studentId]: numValue }))
    setSavedStatus((prev) => ({ ...prev, [studentId]: false }))
  }

  const handleSaveChanges = () => {
    const newSavedStatus: { [key: number]: boolean } = {}
    students.forEach((student) => {
      newSavedStatus[student.id] = true
    })
    setSavedStatus(newSavedStatus)

    setTimeout(() => {
      setSavedStatus({})
    }, 3000)
  }

  const handleExportGrades = (format: "xlsx" | "csv") => {
    alert(`Exportando notas em formato ${format.toUpperCase()}...`)
  }

  const handleOpenAnnouncementModal = (announcement?: Announcement) => {
    if (announcement) {
      setEditingAnnouncement(announcement)
      setAnnouncementForm({
        title: announcement.title,
        description: announcement.description,
        date: announcement.date,
      })
    } else {
      setEditingAnnouncement(null)
      setAnnouncementForm({
        title: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      })
    }
    setShowAnnouncementModal(true)
  }

  const handleSaveAnnouncement = () => {
    if (!announcementForm.title.trim() || !announcementForm.description.trim()) {
      return
    }

    if (editingAnnouncement) {
      setAnnouncements((prev) =>
        prev.map((ann) => (ann.id === editingAnnouncement.id ? { ...ann, ...announcementForm } : ann)),
      )
    } else {
      const newAnnouncement: Announcement = {
        id: Date.now(),
        ...announcementForm,
      }
      setAnnouncements((prev) => [newAnnouncement, ...prev])
    }

    setShowAnnouncementModal(false)
    setEditingAnnouncement(null)
    setAnnouncementForm({
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    })
  }

  const handleDeleteAnnouncement = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este aviso?")) {
      setAnnouncements((prev) => prev.filter((ann) => ann.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader
        title={classInfo.name}
        userName="Prof. Maria Santos"
        userInfo={`${classInfo.code} - ${classInfo.semester}`}
      />

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Minhas Turmas
          </Button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{classInfo.name}</h2>
              <p className="text-slate-600">
                {classInfo.schedule} - {classInfo.room}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleExportGrades("xlsx")}>
                <Download className="w-4 h-4 mr-2" />
                Exportar Excel
              </Button>
              <Button variant="outline" onClick={() => handleExportGrades("csv")}>
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
              <Button variant="outline" onClick={() => setShowReportModal(true)}>
                <FileText className="w-4 h-4 mr-2" />
                Gerar Diário (PDF)
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="grades" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="grades">Notas</TabsTrigger>
            <TabsTrigger value="announcements">Avisos</TabsTrigger>
          </TabsList>

          <TabsContent value="grades">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Lançamento de Notas</CardTitle>
                    <CardDescription>Gerencie as notas dos {students.length} alunos matriculados</CardDescription>
                  </div>
                  <Button onClick={() => setShowAddGradeModal(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Nota
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-slate-600">Nome do Aluno</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600">Matrícula</th>
                        {gradeColumns.map((columnName) => (
                          <th key={columnName} className="text-center py-3 px-4 font-medium text-slate-600">
                            <div className="flex items-center justify-center gap-2">
                              <span>{columnName}</span>
                              <button
                                onClick={() => handleRemoveGradeColumn(columnName)}
                                className="text-red-500 hover:text-red-700"
                                title="Remover nota"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </th>
                        ))}
                        <th className="text-center py-3 px-4 font-medium text-slate-600">Nota Final</th>
                        <th className="text-center py-3 px-4 font-medium text-slate-600">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id} className="border-b hover:bg-slate-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  {student.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </span>
                              </div>
                              <span className="font-medium text-slate-900">{student.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-600">{student.registration}</td>
                          {gradeColumns.map((columnName) => (
                            <td key={columnName} className="py-3 px-4">
                              <Input
                                type="number"
                                min="0"
                                max="10"
                                step="0.1"
                                value={student.grades[columnName] || ""}
                                onChange={(e) => handleGradeChange(student.id, columnName, e.target.value)}
                                className="w-20 text-center"
                                placeholder="0.0"
                              />
                            </td>
                          ))}
                          <td className="py-3 px-4">
                            <Input
                              type="number"
                              min="0"
                              max="10"
                              step="0.1"
                              value={finalGrades[student.id] ?? ""}
                              onChange={(e) => handleFinalGradeChange(student.id, e.target.value)}
                              className="w-20 text-center"
                              placeholder="0.0"
                            />
                          </td>
                          <td className="py-3 px-4 text-center">
                            {savedStatus[student.id] && (
                              <div className="flex items-center justify-center gap-1 text-green-600">
                                <Check className="w-4 h-4" />
                                <span className="text-sm">Salvo</span>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {gradeColumns.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <p>Nenhuma nota cadastrada ainda.</p>
                    <p className="text-sm">Clique em "Adicionar Nota" para começar.</p>
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <Button onClick={handleSaveChanges} className="bg-blue-600 hover:bg-blue-700">
                    Salvar Alterações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="announcements">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Avisos da Turma</CardTitle>
                    <CardDescription>Gerencie os avisos para os alunos matriculados</CardDescription>
                  </div>
                  <Button onClick={() => handleOpenAnnouncementModal()} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Aviso
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {announcements.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <Bell className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p className="text-lg font-medium">Nenhum aviso cadastrado</p>
                    <p className="text-sm">Clique em "Novo Aviso" para criar o primeiro aviso da turma.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {announcements.map((announcement) => (
                      <div
                        key={announcement.id}
                        className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Bell className="w-4 h-4 text-blue-600" />
                              <h3 className="font-semibold text-slate-900">{announcement.title}</h3>
                            </div>
                            <p className="text-slate-600 mb-2">{announcement.description}</p>
                            <p className="text-sm text-slate-500">
                              {new Date(announcement.date).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleOpenAnnouncementModal(announcement)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAnnouncement(announcement.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
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

      <Dialog open={showAnnouncementModal} onOpenChange={setShowAnnouncementModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingAnnouncement ? "Editar Aviso" : "Novo Aviso"}</DialogTitle>
            <DialogDescription>
              {editingAnnouncement
                ? "Edite as informações do aviso abaixo"
                : "Crie um novo aviso para os alunos da turma"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">Título do Aviso</Label>
              <Input
                id="title"
                value={announcementForm.title}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                placeholder="Ex: Prova marcada"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={announcementForm.description}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, description: e.target.value })}
                placeholder="Descreva os detalhes do aviso..."
                className="mt-2 min-h-[120px]"
              />
            </div>
            <div>
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={announcementForm.date}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, date: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAnnouncementModal(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSaveAnnouncement}
              disabled={!announcementForm.title.trim() || !announcementForm.description.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {editingAnnouncement ? "Salvar Alterações" : "Criar Aviso"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddGradeModal} onOpenChange={setShowAddGradeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Nota</DialogTitle>
            <DialogDescription>
              Digite o nome da avaliação que deseja adicionar (ex: Prova 1, Trabalho Final, Participação)
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="gradeName">Nome da Nota</Label>
            <Input
              id="gradeName"
              value={newGradeName}
              onChange={(e) => setNewGradeName(e.target.value)}
              placeholder="Ex: Prova 1"
              className="mt-2"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddGradeColumn()
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddGradeModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddGradeColumn} disabled={!newGradeName.trim()}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ClassReportModal
        open={showReportModal}
        onOpenChange={setShowReportModal}
        classInfo={classInfo}
        students={students}
        gradeColumns={gradeColumns}
        finalGrades={finalGrades}
      />
    </div>
  )
}
