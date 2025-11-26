"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PeriodModal } from "@/components/admin/period-modal"
import { Calendar, Edit, Trash2, FileText, Users } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

interface Periodo {
  id: number
  ano: number
  semestre: number
  inicio_matricula: string
  fim_matricula: string
  fim_trancamento: string
}

export function PeriodManagement() {
  const [periods, setPeriods] = useState<Periodo[]>([])
  const [showModal, setShowModal] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState<Periodo | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchPeriods = async () => {
    const token = localStorage.getItem("authToken")
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BACKEND_URL
    if (!token) return

    setLoading(true)
    try {
      const response = await fetch(`${apiBaseUrl}/periodos-letivos/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        // Ordena decrescente (mais recentes primeiro)
        setPeriods(data.sort((a: Periodo, b: Periodo) => {
          if (a.ano !== b.ano) return b.ano - a.ano
          return b.semestre - a.semestre
        }))
      }
    } catch (error) {
      toast.error("Erro ao carregar períodos.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPeriods()
  }, [])

  const handleEdit = (period: Periodo) => {
    setSelectedPeriod(period)
    setShowModal(true)
  }

  const handleNew = () => {
    setSelectedPeriod(null)
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza? Isso pode afetar turmas vinculadas.")) return

    const token = localStorage.getItem("authToken")
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BACKEND_URL
    try {
      const response = await fetch(`${apiBaseUrl}/periodos-letivos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!response.ok) throw new Error()
      toast.success("Período removido.")
      fetchPeriods()
    } catch (error) {
      toast.error("Erro ao remover período.")
    }
  }

  // --- Funções de Relatório ---
  const handleReport = async (periodId: number, type: 'ocupacao' | 'turmas-professor') => {
    const token = localStorage.getItem("authToken")
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BACKEND_URL
    const endpoint = type === 'ocupacao' ? 'relatorio-ocupacao' : 'relatorio-turmas-professor'
    
    try {
      const response = await fetch(`${apiBaseUrl}/periodos-letivos/${periodId}/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (!response.ok) throw new Error()
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `relatorio_${type}_${periodId}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (error) {
      toast.error("Erro ao gerar relatório.")
    }
  }

  // --- Helpers de Status ---
  const getStatus = (p: Periodo) => {
    const now = new Date()
    const inicio = new Date(p.inicio_matricula)
    // Assumindo que o semestre acaba 4 meses depois da matrícula (lógica simples para visualização)
    // O ideal seria ter "data_fim_semestre" no backend, mas usaremos o que temos.
    const fimEstimado = new Date(inicio)
    fimEstimado.setMonth(fimEstimado.getMonth() + 5)

    if (now >= inicio && now <= fimEstimado) return "Ativo"
    if (now < inicio) return "Futuro"
    return "Encerrado"
  }

  const isEnrollmentOpen = (p: Periodo) => {
    const now = new Date()
    return now >= new Date(p.inicio_matricula) && now <= new Date(p.fim_matricula)
  }

  if (loading && periods.length === 0) {
    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <Skeleton className="h-12 w-1/3 mb-8" />
            <Skeleton className="h-48 w-full" />
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader
        title="Gestão de Períodos Letivos"
        userName="Administrador"
        userInfo="Coordenação"
      />

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Períodos Letivos</h2>
            <p className="text-slate-600 mt-1">Gerencie o calendário acadêmico</p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/admin">
              <Button variant="outline">Voltar</Button>
            </Link>
            <Button onClick={handleNew} className="bg-blue-600 hover:bg-blue-700">
              Novo Período
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {periods.map((period) => {
            const status = getStatus(period)
            const matriculaAberta = isEnrollmentOpen(period)
            
            return (
            <Card key={period.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{period.ano}.{period.semestre}</CardTitle>
                      <CardDescription className="mt-1">
                        {status === "Ativo" ? "Período Atual" : status}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={status === "Ativo" ? "default" : "secondary"}>
                      {status}
                    </Badge>
                    <Badge
                      variant={matriculaAberta ? "default" : "secondary"}
                      className={matriculaAberta ? "bg-green-600" : ""}
                    >
                      {matriculaAberta ? "Matrícula Aberta" : "Matrícula Fechada"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-slate-600">Período de Matrícula</p>
                    <p className="font-medium">
                      {new Date(period.inicio_matricula).toLocaleDateString("pt-BR")} até {new Date(period.fim_matricula).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Limite para Trancamento</p>
                    <p className="font-medium">
                      {new Date(period.fim_trancamento).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(period)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  
                  <Button size="sm" variant="outline" onClick={() => handleReport(period.id, 'ocupacao')}>
                    <FileText className="h-4 w-4 mr-2" />
                    Rel. Ocupação
                  </Button>
                  
                  <Button size="sm" variant="outline" onClick={() => handleReport(period.id, 'turmas-professor')}>
                    <Users className="h-4 w-4 mr-2" />
                    Rel. Professores
                  </Button>

                  <div className="flex-1"></div>

                  <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50" onClick={() => handleDelete(period.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          )})}

          {periods.length === 0 && !loading && (
             <p className="text-center text-slate-500 mt-8">Nenhum período cadastrado.</p>
          )}
        </div>
      </main>

      <PeriodModal 
        open={showModal} 
        onOpenChange={setShowModal} 
        period={selectedPeriod} 
        onSuccess={fetchPeriods}
      />
    </div>
  )
}