"use client"

import { useState, useEffect } from "react"
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
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"


interface Aluno {
  nome: string
  matricula: string
}

interface Aviso {
  id: number
  titulo: string
  conteudo: string
  data_publicacao: string
  autor: { nome: string }
}

interface NotaAvaliacao {
  id: number
  id_avaliacao_turma: number
  nota: number | null
}

interface Disciplina {
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
  id_aluno: number
  status: "APROVADO" | "REPROVADO" | "TRANCADO" | "EM_CURSO"
  nota_final: number | null
  notas_avaliacoes: NotaAvaliacao[]
  turma: Turma
}

interface Colega {
  nome: string
  matricula: string
}

// --- Componente de Loading ---

function ClassPageLoadingSkeleton() {
  return (
    <main className="container mx-auto px-4 py-6 max-w-7xl">
      <Skeleton className="h-9 w-48 mb-4" /> {/* Botão Voltar */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-1/2" />
            </CardContent>
          </Card>
        ))}
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
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-5 w-1/3" />
              <div className="pt-4 border-t">
                <Skeleton className="h-6 w-1/3 mb-3" />
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}

// --- Componente Principal ---

export default function StudentClassPage() {
  const params = useParams()
  const router = useRouter()
  const classId = params.id as string

  const [matricula, setMatricula] = useState<Matricula | null>(null)
  const [colegas, setColegas] = useState<Colega[]>([])
  const [avisos, setAvisos] = useState<Aviso[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [isTrancando, setIsTrancando] = useState(false)

  const token = typeof window !== 'undefined' ? localStorage.getItem("authToken") : null
  const apiBaseUrl = "http://localhost:8000"

  useEffect(() => {
    if (!classId || !token) {
      if(!token) router.push("/")
      return
    }

    const fetchData = async () => {
      setLoading(true)
      setError(null)
      const headers = { Authorization: `Bearer ${token}` }

      try {
        // 1. Buscar dados da matrícula (inclui notas, status, e info da turma)
        // Usamos /matriculas/me para pegar *só* a matrícula deste aluno
        const matriculasRes = await fetch(`${apiBaseUrl}/matriculas/me`, { headers })
        if (!matriculasRes.ok) throw new Error("Falha ao buscar dados da matrícula.")
        
        const todasMatriculas: Matricula[] = await matriculasRes.json()
        const matriculaAtual = todasMatriculas.find(m => m.id_turma.toString() === classId)
        
        if (!matriculaAtual) {
          throw new Error("Matrícula não encontrada para este aluno.")
        }
        setMatricula(matriculaAtual)

        // 2. Buscar colegas e avisos em paralelo
        const [colegasRes, avisosRes] = await Promise.all([
          fetch(`${apiBaseUrl}/turmas/${classId}/colegas`, { headers }),
          fetch(`${apiBaseUrl}/avisos/turma/${classId}`, { headers }),
        ])

        if (colegasRes.ok) setColegas(await colegasRes.json())
        if (avisosRes.ok) setAvisos(await avisosRes.json())
        
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [classId, token, router])

  const handleWithdraw = async () => {
    if (!token || !matricula) return

    setIsTrancando(true)
    const toastId = toast.loading("Processando trancamento...")

    try {
      const response = await fetch(`${apiBaseUrl}/matriculas/${matricula.id_turma}/trancar`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || "Falha ao trancar a disciplina.")
      }

      toast.success("Turma trancada com sucesso!", { id: toastId })
      // Atualiza o estado local da matrícula para refletir a mudança
      setMatricula(prev => prev ? { ...prev, status: "TRANCADO" } : null)
      setShowWithdrawModal(false)

    } catch (err: any) {
      toast.error(err.message, { id: toastId })
    } finally {
      setIsTrancando(false)
    }
  }

  // Dados do cabeçalho (precisam esperar o 'matricula' carregar)
  const headerTitle = matricula ? matricula.turma.disciplina.nome : "Carregando..."
  const headerUserInfo = matricula ? `${matricula.turma.disciplina.codigo} - ${matricula.turma.horario}` : "..."
  
  // Dados do aluno (idealmente viriam de um contexto/store global, mas buscamos aqui)
  const [aluno, setAluno] = useState<Aluno | null>(null)
  useEffect(() => {
    const fetchAluno = async () => {
      if (token) {
        const res = await fetch("http://localhost:8001/login/me", {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) setAluno(await res.json())
      }
    }
    fetchAluno()
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <DashboardHeader
          title={headerTitle}
          userName={aluno?.nome || "Carregando..."}
          userInfo={headerUserInfo}
        />
        <ClassPageLoadingSkeleton />
      </div>
    )
  }

  if (error || !matricula) {
    return (
       <div className="min-h-screen bg-slate-50">
        <DashboardHeader title="Erro" userName={aluno?.nome || ""} userInfo="" />
         <main className="container mx-auto px-4 py-6 max-w-7xl">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Card className="border-red-600 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800">Erro ao carregar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-700">{error || "Não foi possível carregar os dados da turma."}</p>
              </CardContent>
            </Card>
         </main>
      </div>
    )
  }

  // Dados para a UI (já carregados)
  const classInfo = matricula.turma
  const canWithdraw = matricula.status === "EM_CURSO" // Simplificação (API checa a data)

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader
        title={headerTitle}
        userName={aluno?.nome || ""}
        userInfo={headerUserInfo}
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
              <div className="font-medium text-slate-900">{classInfo.professor.nome}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Horário</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-medium text-slate-900">{classInfo.horario}</div>
              <div className="text-sm text-slate-600">{classInfo.local}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Colegas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-600" />
                <span className="text-lg font-medium">{colegas.length} alunos</span>
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
                <CardDescription>Status e colegas de turma</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Status da Matrícula</p>
                  <Badge variant={matricula.status === "TRANCADO" ? "destructive" : "secondary"}>
                    {matricula.status.replace("_", " ")}
                  </Badge>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="font-semibold text-slate-900 mb-3">Colegas de Turma</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {colegas.length > 0 ? (
                      colegas.map((student) => (
                        <div key={student.matricula} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <span className="font-medium text-slate-900">{student.nome}</span>
                          <span className="text-sm text-slate-600">{student.matricula}</span>
                        </div>
                      ))
                    ) : (
                       <p className="text-sm text-slate-500">Nenhum outro aluno encontrado.</p>
                    )}
                  </div>
                </div>

                {canWithdraw && (
                  <div className="pt-4 border-t">
                    <Button
                      variant="destructive"
                      onClick={() => setShowWithdrawModal(true)}
                      className="w-full md:w-auto"
                      disabled={isTrancando}
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      {isTrancando ? "Trancando..." : "Trancar Turma"}
                    </Button>
                    <p className="text-sm text-slate-500 mt-2">
                      Esta ação solicita o trancamento da disciplina.
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
                  {matricula.notas_avaliacoes.length > 0 ? (
                     matricula.notas_avaliacoes.map((nota) => (
                      <div key={nota.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        {/* O backend não retorna o NOME da avaliação, apenas o ID. 
                            Idealmente, o backend deveria retornar o nome.
                            Por enquanto, usaremos o ID. */}
                        <span className="font-medium text-slate-900">Avaliação (ID: {nota.id_avaliacao_turma})</span>
                        {nota.nota !== null ? (
                          <span className="text-lg font-bold text-slate-900">{nota.nota.toFixed(1)}</span>
                        ) : (
                          <Badge variant="secondary">Não lançada</Badge>
                        )}
                      </div>
                    ))
                  ) : (
                     <p className="text-sm text-slate-500">Nenhuma avaliação lançada pelo professor.</p>
                  )}
                 
                  <div className="pt-4 border-t">
                     <div className="flex justify-between items-center p-3 bg-slate-100 rounded-lg">
                        <span className="font-bold text-slate-900 text-lg">Nota Final</span>
                        {matricula.nota_final !== null ? (
                          <span className="text-lg font-bold text-slate-900">{matricula.nota_final.toFixed(1)}</span>
                        ) : (
                          <Badge variant="secondary">Não lançada</Badge>
                        )}
                      </div>
                  </div>
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
                {avisos.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Bell className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>Nenhum aviso no momento</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {avisos.map((aviso) => (
                      <div key={aviso.id} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Bell className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 mb-1">{aviso.titulo}</h3>
                            <p className="text-slate-600 mb-2">{aviso.conteudo}</p>
                            <p className="text-sm text-slate-500">
                              {new Date(aviso.data_publicacao).toLocaleDateString("pt-BR")} por {aviso.autor.nome}
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
              Tem certeza que deseja solicitar o trancamento desta turma?
              A solicitação será processada de acordo com o calendário acadêmico.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWithdrawModal(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleWithdraw} disabled={isTrancando}>
              {isTrancando ? "Solicitando..." : "Confirmar Trancamento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}