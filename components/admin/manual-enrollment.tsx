"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Search, AlertTriangle, CheckCircle } from "lucide-react"
import Link from "next/link"

// Dados simulados
const studentsData = [
  { id: 1, name: "João Silva", registration: "2023001", course: "Engenharia de Software" },
  { id: 2, name: "Maria Santos", registration: "2023002", course: "Ciência da Computação" },
]

const classesData = [
  {
    id: 1,
    code: "AED001-T01",
    subject: "Algoritmos e Estruturas de Dados",
    teacher: "Prof. Maria Santos",
    schedule: "Seg/Qua 14:00-16:00",
    maxStudents: 30,
    enrolledStudents: 30,
    hasPrerequisites: true,
  },
  {
    id: 2,
    code: "CDI001-T01",
    subject: "Cálculo Diferencial e Integral",
    teacher: "Prof. João Oliveira",
    schedule: "Ter/Qui 10:00-12:00",
    maxStudents: 50,
    enrolledStudents: 45,
    hasPrerequisites: false,
  },
]

export function ManualEnrollment() {
  const [studentSearch, setStudentSearch] = useState("")
  const [classSearch, setClassSearch] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [selectedClass, setSelectedClass] = useState<any>(null)
  const [justification, setJustification] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

  const handleEnroll = () => {
    if (!selectedStudent || !selectedClass || !justification.trim()) {
      alert("Por favor, selecione um aluno, uma turma e forneça uma justificativa.")
      return
    }

    console.log("[v0] Matrícula excepcional:", {
      student: selectedStudent,
      class: selectedClass,
      justification,
    })

    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      setSelectedStudent(null)
      setSelectedClass(null)
      setJustification("")
      setStudentSearch("")
      setClassSearch("")
    }, 3000)
  }

  const filteredStudents = studentsData.filter(
    (s) =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.registration.toLowerCase().includes(studentSearch.toLowerCase()),
  )

  const filteredClasses = classesData.filter(
    (c) =>
      c.code.toLowerCase().includes(classSearch.toLowerCase()) ||
      c.subject.toLowerCase().includes(classSearch.toLowerCase()),
  )

  const hasRestrictions =
    selectedClass && (selectedClass.enrolledStudents >= selectedClass.maxStudents || selectedClass.hasPrerequisites)

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader
        title="Matrícula Manual de Alunos"
        userName="Admin Sistema"
        userInfo="ADMIN001 - Administração Acadêmica"
      />

      <main className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Matrícula Excepcional</h2>
            <p className="text-slate-600 mt-1">Realize matrículas mesmo com restrições de vagas ou pré-requisitos</p>
          </div>
          <Link href="/dashboard/admin">
            <Button variant="outline">Voltar ao Dashboard</Button>
          </Link>
        </div>

        {showSuccess && (
          <Card className="mb-6 border-green-600 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-green-700">
                <CheckCircle className="h-5 w-5" />
                <p className="font-medium">Matrícula excepcional realizada com sucesso!</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6">
          {/* Buscar Aluno */}
          <Card>
            <CardHeader>
              <CardTitle>1. Buscar Aluno</CardTitle>
              <CardDescription>Pesquise por nome ou matrícula</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Nome ou matrícula do aluno..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {studentSearch && (
                <div className="space-y-2">
                  {filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      onClick={() => setSelectedStudent(student)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedStudent?.id === student.id
                          ? "border-blue-600 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-slate-600">
                        {student.registration} - {student.course}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {selectedStudent && !studentSearch && (
                <div className="p-3 border border-blue-600 bg-blue-50 rounded-lg">
                  <p className="font-medium">{selectedStudent.name}</p>
                  <p className="text-sm text-slate-600">
                    {selectedStudent.registration} - {selectedStudent.course}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Buscar Turma */}
          <Card>
            <CardHeader>
              <CardTitle>2. Buscar Turma</CardTitle>
              <CardDescription>Pesquise por código ou nome da disciplina</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Código ou nome da disciplina..."
                  value={classSearch}
                  onChange={(e) => setClassSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {classSearch && (
                <div className="space-y-2">
                  {filteredClasses.map((classItem) => (
                    <div
                      key={classItem.id}
                      onClick={() => setSelectedClass(classItem)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedClass?.id === classItem.id
                          ? "border-blue-600 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{classItem.code}</p>
                          <p className="text-sm text-slate-600">{classItem.subject}</p>
                        </div>
                        <div className="flex gap-2">
                          {classItem.enrolledStudents >= classItem.maxStudents && (
                            <Badge variant="destructive">Lotada</Badge>
                          )}
                          {classItem.hasPrerequisites && <Badge variant="secondary">Pré-requisitos</Badge>}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600">
                        {classItem.teacher} • {classItem.schedule}
                      </p>
                      <p className="text-sm text-slate-600">
                        Vagas: {classItem.enrolledStudents}/{classItem.maxStudents}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {selectedClass && !classSearch && (
                <div className="p-3 border border-blue-600 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{selectedClass.code}</p>
                      <p className="text-sm text-slate-600">{selectedClass.subject}</p>
                    </div>
                    <div className="flex gap-2">
                      {selectedClass.enrolledStudents >= selectedClass.maxStudents && (
                        <Badge variant="destructive">Lotada</Badge>
                      )}
                      {selectedClass.hasPrerequisites && <Badge variant="secondary">Pré-requisitos</Badge>}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">
                    {selectedClass.teacher} • {selectedClass.schedule}
                  </p>
                  <p className="text-sm text-slate-600">
                    Vagas: {selectedClass.enrolledStudents}/{selectedClass.maxStudents}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Justificativa */}
          {selectedStudent && selectedClass && (
            <Card>
              <CardHeader>
                <CardTitle>3. Justificativa *</CardTitle>
                <CardDescription>Informe o motivo da matrícula excepcional</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {hasRestrictions && (
                  <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-orange-900">Restrições Identificadas</p>
                      <ul className="text-sm text-orange-700 mt-1 space-y-1">
                        {selectedClass.enrolledStudents >= selectedClass.maxStudents && (
                          <li>• Turma está com vagas esgotadas</li>
                        )}
                        {selectedClass.hasPrerequisites && <li>• Aluno não cumpre os pré-requisitos</li>}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="justification">Justificativa Obrigatória</Label>
                  <Textarea
                    id="justification"
                    placeholder="Descreva o motivo da matrícula excepcional..."
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <Button onClick={handleEnroll} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                  Confirmar Matrícula Excepcional
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
