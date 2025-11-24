"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ClassModal } from "@/components/admin/class-modal"
import { BookOpen, Edit, Trash2, Search } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

interface Turma {
  id: number
  codigo: string
  vagas: number
  horario: string
  local: string
  id_periodo_letivo: number
  id_disciplina: number
  id_professor: number
  disciplina: { nome: string; codigo: string }
  professor: { nome: string }
  qtd_matriculas: number // Novo campo vindo do backend
}

interface Periodo {
  id: number
  ano: number
  semestre: number
}

export function ClassManagement() {
  const [showModal, setShowModal] = useState(false)
  const [selectedClass, setSelectedClass] = useState<Turma | null>(null)
  
  const [periods, setPeriods] = useState<Periodo[]>([])
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>("")
  
  const [classes, setClasses] = useState<Turma[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  // 1. Carregar Períodos
  useEffect(() => {
    const fetchPeriods = async () => {
      const token = localStorage.getItem("authToken")
      if(!token) return

      try {
        const res = await fetch("http://localhost:8000/periodos-letivos/", {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data: Periodo[] = await res.json()
          // Ordenar decrescente
          const sorted = data.sort((a, b) => (b.ano !== a.ano ? b.ano - a.ano : b.semestre - a.semestre))
          setPeriods(sorted)
          if(sorted.length > 0) setSelectedPeriodId(sorted[0].id.toString())
        }
      } catch(err) { console.error(err) }
    }
    fetchPeriods()
  }, [])

  // 2. Carregar Turmas (quando muda o período ou busca)
  const fetchClasses = async () => {
    const token = localStorage.getItem("authToken")
    if(!token || !selectedPeriodId) return

    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append("id_periodo_letivo", selectedPeriodId)
      if (searchTerm) params.append("codigo_disciplina", searchTerm)

      // ATUALIZAÇÃO: Usa o novo endpoint para ADMIN
      const res = await fetch(`http://localhost:8000/turmas/admin/list?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if(res.ok) {
        const data = await res.json()
        setClasses(data)
      }
    } catch (err) {
      toast.error("Erro ao buscar turmas")
    } finally {
      setLoading(false)
    }
  }

  // Debounce para busca
  useEffect(() => {
    const timer = setTimeout(fetchClasses, 500)
    return () => clearTimeout(timer)
  }, [selectedPeriodId, searchTerm])

  const handleEdit = async (classItem: Turma) => {
    // Como já temos os dados completos no endpoint /admin/list,
    // podemos passar direto sem precisar de novo fetch (a menos que o schema mude muito)
    setSelectedClass(classItem)
    setShowModal(true)
  }

  const handleNew = () => {
    setSelectedClass(null)
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if(!confirm("Tem certeza?")) return
    const token = localStorage.getItem("authToken")
    
    try {
        const res = await fetch(`http://localhost:8000/turmas/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        })
        if(res.ok) {
            toast.success("Turma removida")
            fetchClasses()
        } else {
            throw new Error()
        }
    } catch {
        toast.error("Erro ao remover")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader
        title="Gestão de Turmas"
        userName="Administrador"
        userInfo="Coordenação"
      />

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Turmas por Período</h2>
            <p className="text-slate-600 mt-1">Gerencie as turmas ofertadas</p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/admin">
              <Button variant="outline">Voltar</Button>
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
                <Select value={selectedPeriodId} onValueChange={setSelectedPeriodId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {periods.map((period) => (
                      <SelectItem key={period.id} value={period.id.toString()}>
                        {period.ano}.{period.semestre}
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
                    placeholder="Nome ou código da disciplina..."
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
        {loading ? (
            <div className="grid gap-4">
                {[1,2,3].map(i => <Skeleton key={i} className="h-32 w-full" />)}
            </div>
        ) : classes.length === 0 ? (
            <p className="text-center text-slate-500 py-10">Nenhuma turma encontrada.</p>
        ) : (
            <div className="grid gap-4">
            {classes.map((classItem) => {
                const vagasLivres = classItem.vagas - (classItem.qtd_matriculas || 0)
                
                return (
                <Card key={classItem.id}>
                <CardHeader>
                    <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                        <BookOpen className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                        {/* ATUALIZAÇÃO: Usa codigo ao invés de codigo_turma */}
                        <CardTitle className="text-xl">{classItem.codigo}</CardTitle>
                        <CardDescription className="mt-1">
                            {/* ATUALIZAÇÃO: Acessa propriedades aninhadas de disciplina */}
                            {classItem.disciplina.nome} ({classItem.disciplina.codigo})
                        </CardDescription>
                        </div>
                    </div>
                    <Badge variant={vagasLivres > 0 ? "secondary" : "destructive"}>
                        {vagasLivres} vagas livres
                    </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <p className="text-sm text-slate-600">Horário</p>
                        <p className="font-medium">{classItem.horario || "A definir"}</p>
                    </div>
                     <div>
                        <p className="text-sm text-slate-600">Local</p>
                        <p className="font-medium">{classItem.local || "A definir"}</p>
                    </div>
                     <div>
                        <p className="text-sm text-slate-600">Professor</p>
                        <p className="font-medium">{classItem.professor?.nome || "A definir"}</p>
                    </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(classItem)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50" onClick={() => handleDelete(classItem.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                    </Button>
                    </div>
                </CardContent>
                </Card>
            )})}
            </div>
        )}
      </main>

      <ClassModal 
        open={showModal} 
        onOpenChange={setShowModal} 
        classData={selectedClass} 
        onSuccess={fetchClasses}
      />
    </div>
  )
}