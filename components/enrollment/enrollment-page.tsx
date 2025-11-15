"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Clock, MapPin, Users, X, ChevronLeft, AlertCircle } from "lucide-react"
import { ClassDetailsModal } from "@/components/enrollment/class-details-modal"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

// --- Interfaces de Dados da API ---

interface PeriodoLetivo {
  id: number
  ano: number
  semestre: number
}

interface TurmaBuscaData {
  id_turma: number
  codigo_turma: string
  vagas_disponiveis: number
  horario: string | null
  local: string | null
  codigo_disciplina: string
  nome_disciplina: string
  descricao: string | null
  semestre_ideal: number | null
  status_aluno: "A_FAZER" | "CURSANDO" | "JA_CONCLUIDO" | "TRANCADO"
}

// Componente Skeleton para loading
function EnrollmentLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <Skeleton className="h-5 w-1/4 mb-2" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="lg:col-span-1">
        <div className="sticky top-6">
          <Card>
            <CardHeader>
              <CardTitle>Turmas Selecionadas</CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-1/2" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground text-sm">
                Carregando...
              </div>
              <div className="mt-6 pt-6 border-t space-y-3">
                <Skeleton className="h-9 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


export function EnrollmentPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [turmas, setTurmas] = useState<TurmaBuscaData[]>([])
  const [periodos, setPeriodos] = useState<PeriodoLetivo[]>([])
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>("")
  
  const [selectedClasses, setSelectedClasses] = useState<TurmaBuscaData[]>([])
  const [selectedClassForDetails, setSelectedClassForDetails] = useState<TurmaBuscaData | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const apiBaseUrl = "http://localhost:8000"
  const token = typeof window !== 'undefined' ? localStorage.getItem("authToken") : null

  // Hook inicial para buscar períodos
  useEffect(() => {
    const fetchPeriodos = async () => {
      if (!token) {
        setError("Token não encontrado. Faça login novamente.")
        setLoading(false)
        router.push("/")
        return
      }
      
      try {
        const response = await fetch(`${apiBaseUrl}/periodos-letivos/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!response.ok) throw new Error("Falha ao buscar períodos letivos.")
        
        const data: PeriodoLetivo[] = await response.json()
        setPeriodos(data)
        // Define o período mais recente (primeiro da lista, assumindo ordenação da API)
        if (data.length > 0) {
          setSelectedPeriodId(data[0].id.toString())
        } else {
          setLoading(false)
        }
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
      }
    }
    fetchPeriodos()
  }, [token, router])

  // Hook para buscar turmas quando o período ou a busca mudam
  useEffect(() => {
    if (!selectedPeriodId || !token) return;

    const fetchTurmas = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        params.append("id_periodo_letivo", selectedPeriodId)
        if (searchTerm) {
          params.append("codigo_disciplina", searchTerm)
        }

        const response = await fetch(`${apiBaseUrl}/turmas/?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) throw new Error("Falha ao buscar turmas.")
        
        const data: TurmaBuscaData[] = await response.json()
        setTurmas(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    // Debounce na busca para não sobrecarregar a API
    const timer = setTimeout(fetchTurmas, 500)
    return () => clearTimeout(timer)

  }, [selectedPeriodId, searchTerm, token])


  const handleViewDetails = (classItem: TurmaBuscaData) => {
    setSelectedClassForDetails(classItem)
    setShowDetailsModal(true)
  }

  const handleAddClass = (classItem: TurmaBuscaData) => {
    if (!selectedClasses.find((c) => c.id_turma === classItem.id_turma)) {
      if (classItem.status_aluno !== "A_FAZER") {
        toast.warning(`Você não pode se matricular em "${classItem.nome_disciplina}", pois você já está/esteve nela.`)
        return
      }
      setSelectedClasses([...selectedClasses, classItem])
      toast.success(`${classItem.nome_disciplina} adicionada!`)
    }
  }

  const handleRemoveClass = (classId: number) => {
    setSelectedClasses(selectedClasses.filter((c) => c.id_turma !== classId))
  }

  const handleConfirmEnrollment = async () => {
    if (!token) {
      toast.error("Erro de autenticação. Faça login novamente.")
      return
    }

    const toastId = toast.loading(`Processando ${selectedClasses.length} matrículas...`)
    
    const enrollmentRequests = selectedClasses.map(classItem => {
      return fetch(`${apiBaseUrl}/matriculas/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_turma: classItem.id_turma }),
      }).then(async (res) => {
        if (!res.ok) {
          const data = await res.json()
          return { success: false, name: classItem.nome_disciplina, error: data.detail || "Erro desconhecido" }
        }
        return { success: true, name: classItem.nome_disciplina }
      }).catch(err => {
        return { success: false, name: classItem.nome_disciplina, error: err.message }
      })
    })

    const results = await Promise.allSettled(enrollmentRequests)
    
    let successes = 0
    const errors: string[] = []

    results.forEach(result => {
      if (result.status === "fulfilled") {
        if (result.value.success) {
          successes++
        } else {
          errors.push(`Falha em ${result.value.name}: ${result.value.error}`)
        }
      } else {
        errors.push("Uma requisição falhou: " + result.reason)
      }
    })

    toast.dismiss(toastId)

    if (successes > 0) {
      toast.success(`${successes} matrículas realizadas com sucesso!`)
      setSelectedClasses([]) // Limpa a lista
      // Re-busca as turmas para atualizar o status (ex: vagas)
      setSelectedPeriodId(id => id ? id : "") 
    }
    if (errors.length > 0) {
      toast.error(
        <div>
          <p>{errors.length} matrículas falharam:</p>
          <ul className="list-disc list-inside mt-2">
            {errors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      )
    }
  }


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/student">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Nova Matrícula</h1>
              <p className="text-sm text-muted-foreground">Selecione as turmas para o próximo semestre</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {error && (
           <Card className="mb-6 border-red-600 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <p className="font-medium">{error}</p>
                <Button onClick={() => setError(null)} variant="ghost" size="icon" className="h-6 w-6">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {loading && turmas.length === 0 ? (
          <EnrollmentLoadingSkeleton />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Lista de Turmas */}
            <div className="lg:col-span-2 space-y-6">
              {/* Barra de Pesquisa e Filtros */}
              <Card>
                <CardContent className="pt-6 flex flex-col md:flex-row gap-4">
                   <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nome ou código da disciplina..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="w-full md:w-56">
                    <Select value={selectedPeriodId} onValueChange={setSelectedPeriodId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um período..." />
                      </SelectTrigger>
                      <SelectContent>
                        {periodos.map(p => (
                          <SelectItem key={p.id} value={p.id.toString()}>
                            {p.ano}.{p.semestre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Lista de Resultados */}
              <div className="space-y-4">
                {turmas.length === 0 && !loading ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <p className="text-muted-foreground">Nenhuma turma encontrada para este período ou busca.</p>
                    </CardContent>
                  </Card>
                ) : (
                  turmas.map((classItem) => {
                    const isSelected = selectedClasses.find((c) => c.id_turma === classItem.id_turma)
                    
                    let statusBadge: React.ReactNode = null
                    if (classItem.status_aluno === "JA_CONCLUIDO") {
                      statusBadge = <Badge variant="secondary" className="bg-green-100 text-green-800">Concluída</Badge>
                    } else if (classItem.status_aluno === "CURSANDO") {
                      statusBadge = <Badge variant="secondary" className="bg-blue-100 text-blue-800">Cursando</Badge>
                    }

                    return (
                      <Card
                        key={classItem.id_turma}
                        className={`transition-all hover:shadow-md ${isSelected ? "ring-2 ring-primary" : ""}`}
                      >
                        <CardHeader>
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="font-mono text-xs">
                                  {classItem.codigo_turma}
                                </Badge>
                                <Badge variant={classItem.vagas_disponiveis > 5 ? "default" : "destructive"}>
                                  {classItem.vagas_disponiveis} vagas
                                </Badge>
                                {statusBadge}
                              </div>
                              <CardTitle className="text-lg mb-1">{classItem.nome_disciplina}</CardTitle>
                              <CardDescription>{classItem.codigo_disciplina}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{classItem.horario || "A definir"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {classItem.local || "A definir"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {classItem.semestre_ideal}º Semestre
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" onClick={() => handleViewDetails(classItem)} className="flex-1">
                              Ver Detalhes
                            </Button>
                            {isSelected ? (
                              <Button
                                variant="secondary"
                                onClick={() => handleRemoveClass(classItem.id_turma)}
                                className="flex-1"
                              >
                                Remover
                              </Button>
                            ) : (
                              <Button
                                onClick={() => handleAddClass(classItem)}
                                disabled={classItem.vagas_disponiveis === 0 || classItem.status_aluno !== "A_FAZER"}
                                className="flex-1"
                              >
                                {classItem.vagas_disponiveis === 0 ? "Lotada" : 
                                 classItem.status_aluno !== "A_FAZER" ? "Indisponível" : "Adicionar"
                                }
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                )}
              </div>
            </div>

            {/* Sidebar - Turmas Selecionadas */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Turmas Selecionadas</CardTitle>
                    <CardDescription>
                      {selectedClasses.length} turma(s) selecionada(s)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedClasses.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        Nenhuma turma selecionada ainda. Adicione turmas da lista ao lado.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedClasses.map((classItem) => (
                          <div key={classItem.id_turma} className="p-3 bg-muted rounded-lg">
                            <div className="flex justify-between items-start gap-2 mb-2">
                              <div className="flex-1">
                                <p className="font-medium text-sm leading-tight">{classItem.nome_disciplina}</p>
                                <p className="text-xs text-muted-foreground mt-1">{classItem.codigo_turma}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 -mt-1"
                                onClick={() => handleRemoveClass(classItem.id_turma)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{classItem.horario}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-6 pt-6 border-t space-y-3">
                      <Button
                        onClick={handleConfirmEnrollment}
                        disabled={selectedClasses.length === 0 || loading}
                        className="w-full"
                        size="lg"
                      >
                        Confirmar Matrículas
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>

      <ClassDetailsModal
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        classData={selectedClassForDetails}
        onAddClass={handleAddClass}
        isAlreadySelected={
          selectedClassForDetails ? !!selectedClasses.find((c) => c.id_turma === selectedClassForDetails.id_turma) : false
        }
      />
    </div>
  )
}