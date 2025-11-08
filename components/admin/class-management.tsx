"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ClassModal } from "@/components/admin/class-modal"
import { BookOpen, Edit, Trash2, Search, Users } from "lucide-react"
import Link from "next/link"

// Dados simulados
const classesData = [
  {
    id: 1,
    code: "AED001-T01",
    subject: "Algoritmos e Estruturas de Dados",
    subjectCode: "AED001",
    teacher: "Prof. Maria Santos",
    teacherId: 1,
    period: "2025.1",
    schedule: "Seg/Qua 14:00-16:00",
    maxStudents: 30,
    enrolledStudents: 28,
    approvalCriteria: "Média >= 7.0",
    department: "Ciência da Computação",
  },
  {
    id: 2,
    code: "CDI001-T01",
    subject: "Cálculo Diferencial e Integral",
    subjectCode: "CDI001",
    teacher: "Prof. João Oliveira",
    teacherId: 2,
    period: "2025.1",
    schedule: "Ter/Qui 10:00-12:00",
    maxStudents: 50,
    enrolledStudents: 45,
    approvalCriteria: "Média >= 6.0",
    department: "Matemática",
  },
  {
    id: 3,
    code: "FIS001-T01",
    subject: "Física Geral",
    subjectCode: "FIS001",
    teacher: "Prof. Roberto Lima",
    teacherId: 3,
    period: "2025.1",
    schedule: "Seg/Qua 08:00-10:00",
    maxStudents: 35,
    enrolledStudents: 32,
    approvalCriteria: "Média >= 6.0 e Frequência >= 75%",
    department: "Física",
  },
]

const periodsData = ["2025.1", "2024.2", "2024.1"]

export function ClassManagement() {
  const [showModal, setShowModal] = useState(false)
  const [selectedClass, setSelectedClass] = useState<any>(null)
  const [selectedPeriod, setSelectedPeriod] = useState("2025.1")
  const [searchTerm, setSearchTerm] = useState("")

  const handleEdit = (classItem: any) => {
    setSelectedClass(classItem)
    setShowModal(true)
  }

  const handleNew = () => {
    setSelectedClass(null)
    setShowModal(true)
  }

  const filteredClasses = classesData.filter(
    (c) =>
      c.period === selectedPeriod &&
      (c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.teacher.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader
        title="Gestão de Turmas"
        userName="Admin Sistema"
        userInfo="ADMIN001 - Administração Acadêmica"
      />

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Turmas por Período</h2>
            <p className="text-slate-600 mt-1">Gerencie as turmas, professores e vagas</p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/admin">
              <Button variant="outline">Voltar ao Dashboard</Button>
            </Link>
            <Button onClick={handleNew} className="bg-blue-600 hover:bg-blue-700">
              Nova Turma
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Período Letivo</Label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {periodsData.map((period) => (
                      <SelectItem key={period} value={period}>
                        {period}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Buscar Turma</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Código, disciplina ou professor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Turmas */}
        <div className="grid gap-4">
          {filteredClasses.map((classItem) => (
            <Card key={classItem.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <BookOpen className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{classItem.code}</CardTitle>
                      <CardDescription className="mt-1">
                        {classItem.subject} - {classItem.department}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary">{classItem.period}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-slate-600">Professor</p>
                    <p className="font-medium">{classItem.teacher}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Horário</p>
                    <p className="font-medium">{classItem.schedule}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Vagas</p>
                    <p className="font-medium">
                      {classItem.enrolledStudents}/{classItem.maxStudents}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Ver Lista de Alunos
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(classItem)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 border-red-600 bg-transparent">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <ClassModal open={showModal} onOpenChange={setShowModal} classData={selectedClass} />
    </div>
  )
}
