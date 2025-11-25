"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Download, BookOpen, TrendingUp, CheckCircle, Clock, Megaphone } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton" // Importando o Skeleton

// --- Interfaces para os dados da API ---
interface AlunoData {
  nome: string
  matricula: string
  curso?: { nome: string } // A API /me retorna id_curso, mas o /matriculas/me (com a turma) pode ter o nome
}

interface IraData {
  ira: number | null
}

interface SemestreData {
  semestre_atual: number
}

interface Disciplina {
  id: number
  nome: string
  codigo: string
}

interface Professor {
  nome: string
}

interface Turma {
  id: number
  horario: string
  local: string
  disciplina: Disciplina
  professor: Professor
}

interface Matricula {
  id_turma: number
  status: string
  nota_final: number | null
  turma: Turma
}

interface Autor {
  id: number
  nome: string
}

interface Aviso {
  id: number
  titulo: string
  conteudo: string | null
  data_publicacao: string
  autor: Autor
}

// --- Componente de Loading (Skeleton) ---
function DashboardLoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Semestre Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-1/4" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">IRA</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-1/4" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Disciplinas</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-1/4" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Ações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </CardContent>
        </Card>
      </div>

      {/* Tabs e Lista */}
      <Tabs defaultValue="subjects" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="subjects">Disciplinas</TabsTrigger>
          <TabsTrigger value="schedule">Horários</TabsTrigger>
        </TabsList>
        <TabsContent value="subjects" className="space-y-4">
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-5 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export function StudentDashboard() {
  const [aluno, setAluno] = useState<AlunoData | null>(null)
  const [ira, setIra] = useState<IraData | null>(null)
  const [semestre, setSemestre] = useState<SemestreData | null>(null)
  const [matriculas, setMatriculas] = useState<Matricula[]>([])
  const [avisos, setAvisos] = useState<Aviso[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem("authToken")
      if (!token) {
        setError("Token não encontrado. Faça login novamente.")
        setLoading(false)
        // Idealmente, redirecionar para o login
        // router.push("/") 
        return
      }

      const headers = { Authorization: `Bearer ${token}` }
      const apiBaseUrl = "http://localhost:8000"

      try {
        const [alunoRes, iraRes, semestreRes, matriculasRes, avisosRes] = await Promise.all([
          fetch(`${apiBaseUrl}/usuarios/me`, { headers }),
          fetch(`${apiBaseUrl}/usuarios/me/ira`, { headers }),
          fetch(`${apiBaseUrl}/usuarios/me/semestre-atual`, { headers }),
          fetch(`${apiBaseUrl}/matriculas/me`, { headers }),
          fetch(`${apiBaseUrl}/avisos/me`, { headers }),
        ])

        if (!alunoRes.ok || !iraRes.ok || !semestreRes.ok) {
          throw new Error("Falha ao buscar dados. Verifique sua conexão ou tente logar novamente.")
        }

        const alunoData = await alunoRes.json()
        const iraData = await iraRes.json()
        const semestreData = await semestreRes.json()
        // Tratamento para 404 em matrículas
        const matriculasData = matriculasRes.status === 404 ? [] : await matriculasRes.json()
        // Tratamento para avisos (pode não haver nenhum)
        const avisosData = avisosRes.ok ? await avisosRes.json() : []

        setAluno(alunoData)
        setIra(iraData)
        setSemestre(semestreData)
        setMatriculas(matriculasData)
        setAvisos(avisosData)

      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDownloadHistory = async () => {
    const token = localStorage.getItem("authToken")
    if (!token) return

    try {
      const response = await fetch("http://localhost:8000/usuarios/me/historico-pdf", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error("Não foi possível gerar o histórico.")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      // Extrai o nome do arquivo do cabeçalho Content-Disposition
      const disposition = response.headers.get('content-disposition')
      let filename = `historico_${aluno?.matricula || 'aluno'}.pdf`
      if (disposition && disposition.indexOf('attachment') !== -1) {
          const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
          const matches = filenameRegex.exec(disposition)
          if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, '')
          }
      }
      
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)

    } catch (err: any) {
      alert(`Erro ao baixar histórico: ${err.message}`)
    }
  }

  // Define os dados do cabeçalho
  const headerTitle = aluno ? "Dashboard do Aluno" : "Carregando..."
  const headerUserName = aluno ? aluno.nome : "Carregando..."
  const headerUserInfo = aluno ? `${aluno.matricula} - ${aluno.curso?.nome || 'Curso não definido'}` : ""

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <DashboardHeader
          title={headerTitle}
          userName={headerUserName}
          userInfo={headerUserInfo}
        />
        <DashboardLoadingSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-96 border-red-600 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Erro ao carregar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">{error}</p>
            <Button asChild className="w-full mt-4">
              <Link href="/">Voltar para o Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // --- Processamento dos dados para o schedule (horários) ---
  const schedule = matriculas.map(m => ({
    day: m.turma.horario.split(" ")[0], // Simplista, assume "Seg/Qua 14:00-16:00"
    time: m.turma.horario.split(" ").slice(1).join(" "),
    subject: m.turma.disciplina.nome,
    room: m.turma.local,
  }))
  // Nota: Isso pode criar duplicatas se o horário for "Seg/Qua". 
  // Uma lógica mais robusta seria necessária para dividir os dias.

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader
        title={headerTitle}
        userName={headerUserName}
        userInfo={headerUserInfo}
      />

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Informações do Aluno */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Semestre Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{semestre?.semestre_atual || 0}º Semestre</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">IRA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{ira?.ira?.toFixed(2) || "N/A"}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Disciplinas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{matriculas.length}</div>
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

        {/* Avisos da Coordenação */}
        {avisos.length > 0 && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-blue-900">Avisos da Coordenação</CardTitle>
              </div>
              <CardDescription className="text-blue-700">
                Comunicados importantes do seu curso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {avisos.map((aviso) => (
                <div key={aviso.id} className="bg-white border border-blue-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-slate-900">{aviso.titulo}</h3>
                    <span className="text-xs text-slate-500">
                      {new Date(aviso.data_publicacao).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  {aviso.conteudo && (
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{aviso.conteudo}</p>
                  )}
                  <p className="text-xs text-slate-500 mt-2">Por: {aviso.autor.nome}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="subjects" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="subjects">Disciplinas</TabsTrigger>
            <TabsTrigger value="schedule">Horários</TabsTrigger>
          </TabsList>

          <TabsContent value="subjects" className="space-y-4">
            <div className="grid gap-4">
              {matriculas.map((matricula) => (
                <Card key={matricula.id_turma}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{matricula.turma.disciplina.nome}</CardTitle>
                        <CardDescription>
                          {matricula.turma.disciplina.codigo} - {matricula.turma.professor.nome}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="secondary">{matricula.status}</Badge>
                        <Link href={`/student-class/${matricula.id_turma}`}>
                          <Button size="sm" variant="outline">
                            Ver Turma
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-slate-600">Horário</p>
                        <p className="font-medium">{matricula.turma.horario}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Local</p>
                        <p className="font-medium">{matricula.turma.local}</p>
                      </div>
                       <div>
                        <p className="text-sm text-slate-600">Nota Final</p>
                        <p className="font-medium">{matricula.nota_final?.toFixed(1) || "N/A"}</p>
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