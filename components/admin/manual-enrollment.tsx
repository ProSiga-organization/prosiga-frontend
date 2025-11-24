"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Search, AlertTriangle, CheckCircle, User, BookOpen } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

// Interfaces
interface Aluno {
  id: number
  nome: string
  matricula: string
  email: string
}

interface Turma {
  id: number
  codigo: string // "T1"
  vagas: number
  horario: string
  disciplina: {
    nome: string
    codigo: string // "COMP101"
  }
  professor: {
    nome: string
  }
  qtd_matriculas: number
}

export function ManualEnrollment() {
  const [studentSearch, setStudentSearch] = useState("")
  const [classSearch, setClassSearch] = useState("")
  
  const [students, setStudents] = useState<Aluno[]>([])
  const [classes, setClasses] = useState<Turma[]>([])
  
  const [selectedStudent, setSelectedStudent] = useState<Aluno | null>(null)
  const [selectedClass, setSelectedClass] = useState<Turma | null>(null)
  const [justification, setJustification] = useState("")
  
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [loadingClasses, setLoadingClasses] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const apiBaseUrl = "http://localhost:8000"

  // Busca de Alunos
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token || !studentSearch) {
        setStudents([])
        return
    }

    const timer = setTimeout(async () => {
        setLoadingStudents(true)
        try {
            const res = await fetch(`${apiBaseUrl}/usuarios/alunos?term=${studentSearch}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) setStudents(await res.json())
        } catch (error) {
            console.error(error)
        } finally {
            setLoadingStudents(false)
        }
    }, 500)

    return () => clearTimeout(timer)
  }, [studentSearch])

  // Busca de Turmas (CORRIGIDA para usar endpoint admin)
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token || !classSearch) {
        setClasses([])
        return
    }

    const timer = setTimeout(async () => {
        setLoadingClasses(true)
        try {
            // Usa o endpoint de ADMIN que permite busca livre
            const res = await fetch(`${apiBaseUrl}/turmas/admin/list?codigo_disciplina=${classSearch}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) setClasses(await res.json())
        } catch (error) {
            console.error(error)
        } finally {
            setLoadingClasses(false)
        }
    }, 500)

    return () => clearTimeout(timer)
  }, [classSearch])


  const handleEnroll = async () => {
    if (!selectedStudent || !selectedClass || !justification.trim()) {
      toast.error("Preencha todos os campos obrigatórios.")
      return
    }

    setProcessing(true)
    const token = localStorage.getItem("authToken")

    try {
      const response = await fetch(`${apiBaseUrl}/matriculas/admin/matricular`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            matricula_aluno: selectedStudent.matricula,
            id_turma: selectedClass.id // O ID da turma vem no campo 'id' do objeto TurmaResponse
        })
      })

      const data = await response.json()

      if (!response.ok) {
          throw new Error(data.detail || "Erro ao realizar matrícula.")
      }

      setShowSuccess(true)
      toast.success("Matrícula realizada com sucesso!")
      
      setTimeout(() => {
        setShowSuccess(false)
        setSelectedStudent(null)
        setSelectedClass(null)
        setJustification("")
        setStudentSearch("")
        setClassSearch("")
      }, 3000)

    } catch (error: any) {
        toast.error(error.message)
    } finally {
        setProcessing(false)
    }
  }

  const vagasDisponiveis = selectedClass ? selectedClass.vagas - selectedClass.qtd_matriculas : 0
  const hasRestrictions = selectedClass && vagasDisponiveis <= 0

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader
        title="Matrícula Manual de Alunos"
        userName="Administrador"
        userInfo="Coordenação"
      />

      <main className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Matrícula Excepcional</h2>
            <p className="text-slate-600 mt-1">Realize matrículas ignorando validações de sistema</p>
          </div>
          <Link href="/dashboard/admin">
            <Button variant="outline">Voltar ao Dashboard</Button>
          </Link>
        </div>

        {showSuccess && (
          <Card className="mb-6 border-green-600 bg-green-50 animate-in fade-in slide-in-from-top-4">
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
                  placeholder="Nome ou matrícula..."
                  value={studentSearch}
                  onChange={(e) => {
                      setStudentSearch(e.target.value)
                      if (!e.target.value) setSelectedStudent(null)
                  }}
                  className="pl-10"
                  disabled={!!selectedStudent}
                />
                 {selectedStudent && (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-7"
                        onClick={() => {
                            setSelectedStudent(null)
                            setStudentSearch("")
                        }}
                    >
                        Trocar
                    </Button>
                )}
              </div>

              {!selectedStudent && studentSearch && (
                <div className="space-y-2 max-h-60 overflow-y-auto border rounded-md">
                  {loadingStudents ? (
                      <div className="p-4 text-center text-slate-500">Buscando...</div>
                  ) : students.length === 0 ? (
                      <div className="p-4 text-center text-slate-500">Nenhum aluno encontrado.</div>
                  ) : (
                      students.map((student) => (
                        <div
                          key={student.id}
                          onClick={() => {
                              setSelectedStudent(student)
                              setStudentSearch(student.nome)
                          }}
                          className="p-3 border-b last:border-0 cursor-pointer hover:bg-slate-50 flex items-center gap-3"
                        >
                          <div className="bg-slate-100 p-2 rounded-full">
                              <User className="h-4 w-4 text-slate-600" />
                          </div>
                          <div>
                            <p className="font-medium">{student.nome}</p>
                            <p className="text-sm text-slate-600">{student.matricula}</p>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Buscar Turma */}
          <Card>
            <CardHeader>
              <CardTitle>2. Buscar Turma</CardTitle>
              <CardDescription>Pesquise por nome da disciplina ou código (ex: COMP)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Disciplina ou código..."
                  value={classSearch}
                  onChange={(e) => {
                      setClassSearch(e.target.value)
                      if(!e.target.value) setSelectedClass(null)
                  }}
                  className="pl-10"
                  disabled={!!selectedClass}
                />
                 {selectedClass && (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-7"
                        onClick={() => {
                            setSelectedClass(null)
                            setClassSearch("")
                        }}
                    >
                        Trocar
                    </Button>
                )}
              </div>

              {!selectedClass && classSearch && (
                <div className="space-y-2 max-h-60 overflow-y-auto border rounded-md">
                   {loadingClasses ? (
                      <div className="p-4 text-center text-slate-500">Buscando...</div>
                  ) : classes.length === 0 ? (
                      <div className="p-4 text-center text-slate-500">Nenhuma turma encontrada.</div>
                  ) : (
                      classes.map((classItem) => {
                        const vagasRestantes = classItem.vagas - classItem.qtd_matriculas
                        return (
                        <div
                          key={classItem.id}
                          onClick={() => {
                              setSelectedClass(classItem)
                              setClassSearch(`${classItem.disciplina.nome} (${classItem.codigo})`)
                          }}
                          className="p-3 border-b last:border-0 cursor-pointer hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-slate-500" />
                                <p className="font-medium">{classItem.disciplina.nome}</p>
                            </div>
                            {vagasRestantes <= 0 && (
                                <Badge variant="destructive">Lotada</Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 ml-6">
                            {classItem.disciplina.codigo} - Turma {classItem.codigo}
                          </p>
                          <p className="text-sm text-slate-500 ml-6">
                             {classItem.professor.nome} • {classItem.horario || "Sem horário"} • Vagas: {vagasRestantes}
                          </p>
                        </div>
                      )
                    })
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Justificativa */}
          {selectedStudent && selectedClass && (
            <Card>
              <CardHeader>
                <CardTitle>3. Confirmação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {hasRestrictions && (
                  <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-orange-900">Turma Lotada</p>
                      <p className="text-sm text-orange-700 mt-1">
                        Você está prestes a matricular um aluno em uma turma sem vagas.
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="justification">Justificativa Obrigatória</Label>
                  <Textarea
                    id="justification"
                    placeholder="Motivo da matrícula manual..."
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    rows={3}
                    required
                  />
                </div>

                <Button 
                    onClick={handleEnroll} 
                    className="w-full bg-blue-600 hover:bg-blue-700" 
                    size="lg"
                    disabled={processing}
                >
                  {processing ? "Processando..." : "Confirmar Matrícula"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}