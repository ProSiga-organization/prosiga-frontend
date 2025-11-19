"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Download, FileText, Check, Plus, X, Bell, Pencil, Trash2, Loader2 } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ClassReportModal } from "@/components/dashboard/class-report-modal"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

// --- Interfaces ---
interface Avaliacao {
  id: number
  nome: string
  id_turma: number
}

interface Nota {
  id: number
  id_avaliacao_turma: number
  nota: number | null
}

interface Aluno {
  id: number
  nome: string
  matricula: string
}

interface Matricula {
  id_aluno: number
  id_turma: number
  status: string
  nota_final: number | null
  aluno: Aluno
  notas_avaliacoes: Nota[]
}

interface Turma {
  id: number
  codigo: string
  horario: string
  local: string
  disciplina: { nome: string; codigo: string }
  professor: { nome: string }
  avaliacoes_definidas: Avaliacao[]
}

interface Aviso {
  id: number
  titulo: string
  conteudo: string
  data_publicacao: string
  id_autor: number
}

export default function TeacherClassPage() {
  const params = useParams()
  const router = useRouter()
  const classId = params.id as string

  // Estados de Dados
  const [turma, setTurma] = useState<Turma | null>(null)
  const [matriculas, setMatriculas] = useState<Matricula[]>([])
  const [avisos, setAvisos] = useState<Aviso[]>([])
  
  // Estados de UI
  const [loading, setLoading] = useState(true)
  const [showReportModal, setShowReportModal] = useState(false)
  
  // Estado para Adicionar Coluna de Nota
  const [showAddGradeModal, setShowAddGradeModal] = useState(false)
  const [newGradeName, setNewGradeName] = useState("")
  const [isCreatingColumn, setIsCreatingColumn] = useState(false)

  // Estado para Avisos
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Aviso | null>(null)
  const [announcementForm, setAnnouncementForm] = useState({ title: "", description: "" })
  const [isSavingAnnouncement, setIsSavingAnnouncement] = useState(false)

  // Controle de Edição de Notas (para mostrar feedback visual)
  const [savingGrades, setSavingGrades] = useState<Record<string, boolean>>({})

  const apiBaseUrl = "http://localhost:8000"
  const token = typeof window !== 'undefined' ? localStorage.getItem("authToken") : null

  // --- Carregamento de Dados ---
  const fetchData = useCallback(async () => {
    if (!token || !classId) return
    
    try {
      const headers = { Authorization: `Bearer ${token}` }
      
      const [turmaRes, matriculasRes, avisosRes] = await Promise.all([
        fetch(`${apiBaseUrl}/turmas/${classId}`, { headers }),
        fetch(`${apiBaseUrl}/turmas/${classId}/matriculas`, { headers }),
        fetch(`${apiBaseUrl}/avisos/turma/${classId}`, { headers })
      ])

      if (turmaRes.ok && matriculasRes.ok) {
        setTurma(await turmaRes.json())
        setMatriculas(await matriculasRes.json())
      }
      
      if (avisosRes.ok) {
        setAvisos(await avisosRes.json())
      }

    } catch (error) {
      toast.error("Erro ao carregar dados da turma.")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [classId, token])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // --- Gerenciamento de Notas ---

  const handleAddGradeColumn = async () => {
    if (!newGradeName.trim() || !token) return

    setIsCreatingColumn(true)
    try {
      const response = await fetch(`${apiBaseUrl}/turmas/${classId}/avaliacoes`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ nome: newGradeName })
      })

      if (!response.ok) throw new Error("Falha ao criar avaliação")
      
      toast.success("Coluna de nota criada!")
      setNewGradeName("")
      setShowAddGradeModal(false)
      fetchData() // Recarrega para atualizar a tabela

    } catch (error) {
      toast.error("Erro ao criar coluna.")
    } finally {
      setIsCreatingColumn(false)
    }
  }

  const handleDeleteColumn = async (avaliacaoId: number) => {
    if (!token || !confirm("Tem certeza? Isso apagará todas as notas desta coluna.")) return

    try {
      const response = await fetch(`${apiBaseUrl}/turmas/avaliacoes/${avaliacaoId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!response.ok) throw new Error("Falha ao deletar")
      
      toast.success("Avaliação removida.")
      fetchData()
    } catch (error) {
      toast.error("Erro ao remover avaliação.")
    }
  }

  const handleUpdateGrade = async (matriculaAluno: string, avaliacaoId: number, valor: string) => {
    if (!token) return
    
    const numValor = valor === "" ? null : parseFloat(valor)
    const loadingKey = `${matriculaAluno}-${avaliacaoId}`
    
    setSavingGrades(prev => ({ ...prev, [loadingKey]: true }))

    try {
      const response = await fetch(`${apiBaseUrl}/matriculas/notas`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          matricula_aluno: matriculaAluno,
          id_avaliacao_turma: avaliacaoId,
          nota: numValor
        })
      })

      if (!response.ok) throw new Error()
      
      // Atualiza estado local para feedback instantâneo sem recarregar tudo
      setMatriculas(prev => prev.map(m => {
        if (m.aluno.matricula === matriculaAluno) {
          const notasAtualizadas = m.notas_avaliacoes.map(n => 
            n.id_avaliacao_turma === avaliacaoId ? { ...n, nota: numValor } : n
          )
          return { ...m, notas_avaliacoes: notasAtualizadas }
        }
        return m
      }))

    } catch (error) {
      toast.error("Erro ao salvar nota.")
    } finally {
      setTimeout(() => {
        setSavingGrades(prev => {
          const newState = { ...prev }
          delete newState[loadingKey]
          return newState
        })
      }, 500)
    }
  }

  const handleUpdateFinalGrade = async (matriculaAluno: string, valor: string) => {
    if (!token) return
    const numValor = valor === "" ? null : parseFloat(valor)
    
    try {
      const response = await fetch(`${apiBaseUrl}/matriculas/${classId}/${matriculaAluno}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ nota_final: numValor })
      })

      if (!response.ok) throw new Error()
      
      toast.success("Nota final atualizada")
      // Atualiza estado local
      setMatriculas(prev => prev.map(m => 
        m.aluno.matricula === matriculaAluno ? { ...m, nota_final: numValor } : m
      ))

    } catch (error) {
      toast.error("Erro ao salvar nota final.")
    }
  }

  // --- Relatórios (Download) ---
  const handleDownload = async (type: 'csv' | 'pdf') => {
    if (!token) return
    const endpoint = type === 'csv' ? 'exportar-csv' : 'diario-pdf'
    const filename = type === 'csv' ? `notas_${turma?.codigo}.csv` : `diario_${turma?.codigo}.pdf`
    
    try {
      const response = await fetch(`${apiBaseUrl}/turmas/${classId}/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (!response.ok) throw new Error()
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (error) {
      toast.error(`Erro ao baixar ${type.toUpperCase()}.`)
    }
  }

  // --- Gerenciamento de Avisos ---

  const handleSaveAnnouncement = async () => {
    if (!announcementForm.title.trim() || !announcementForm.description.trim() || !token) return

    setIsSavingAnnouncement(true)
    try {
      if (editingAnnouncement) {
        // Editar (PUT)
        const response = await fetch(`${apiBaseUrl}/avisos/${editingAnnouncement.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ titulo: announcementForm.title, conteudo: announcementForm.description })
        })
        if (!response.ok) throw new Error()
        toast.success("Aviso atualizado!")
      } else {
        // Criar (POST)
        const response = await fetch(`${apiBaseUrl}/avisos/turma`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ 
            titulo: announcementForm.title, 
            conteudo: announcementForm.description,
            id_turma: parseInt(classId)
          })
        })
        if (!response.ok) throw new Error()
        toast.success("Aviso criado!")
      }
      
      setShowAnnouncementModal(false)
      setEditingAnnouncement(null)
      setAnnouncementForm({ title: "", description: "" })
      fetchData() // Recarrega lista

    } catch (error) {
      toast.error("Erro ao salvar aviso.")
    } finally {
      setIsSavingAnnouncement(false)
    }
  }

  const handleDeleteAnnouncement = async (id: number) => {
    if (!token || !confirm("Excluir este aviso?")) return
    try {
      await fetch(`${apiBaseUrl}/avisos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success("Aviso excluído.")
      setAvisos(prev => prev.filter(a => a.id !== id))
    } catch {
      toast.error("Erro ao excluir.")
    }
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
         <Skeleton className="h-12 w-1/3 mb-4" />
         <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!turma) return <div>Turma não encontrada</div>

  // Ordenar avaliações por ID para manter a ordem das colunas consistente
  const avaliacoesOrdenadas = turma.avaliacoes_definidas?.sort((a, b) => a.id - b.id) || []

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader
        title={turma.disciplina.nome}
        userName={turma.professor.nome}
        userInfo={`${turma.codigo} - ${turma.horario}`}
      />

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Minhas Turmas
          </Button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{turma.disciplina.nome}</h2>
              <p className="text-slate-600">
                {turma.horario} - {turma.local}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleDownload('csv')}>
                <Download className="w-4 h-4 mr-2" />
                Excel/CSV
              </Button>
              <Button variant="outline" onClick={() => handleDownload('pdf')}>
                <FileText className="w-4 h-4 mr-2" />
                Diário (PDF)
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
                    <CardTitle>Diário de Notas</CardTitle>
                    <CardDescription>{matriculas.length} alunos matriculados</CardDescription>
                  </div>
                  <Button onClick={() => setShowAddGradeModal(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Avaliação
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-slate-600 w-64">Aluno</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600 w-32">Matrícula</th>
                        
                        {/* Colunas Dinâmicas de Avaliação */}
                        {avaliacoesOrdenadas.map((av) => (
                          <th key={av.id} className="text-center py-3 px-2 font-medium text-slate-600 min-w-[100px]">
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-xs uppercase">{av.nome}</span>
                              <button 
                                onClick={() => handleDeleteColumn(av.id)}
                                className="text-red-400 hover:text-red-600 text-[10px]"
                              >
                                (remover)
                              </button>
                            </div>
                          </th>
                        ))}

                        <th className="text-center py-3 px-4 font-medium text-slate-600 w-24 bg-slate-50">Nota Final</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matriculas.map((mat) => (
                        <tr key={mat.id_aluno} className="border-b hover:bg-slate-50">
                          <td className="py-3 px-4 font-medium">{mat.aluno.nome}</td>
                          <td className="py-3 px-4 text-slate-600">{mat.aluno.matricula}</td>
                          
                          {/* Células de Notas */}
                          {avaliacoesOrdenadas.map((av) => {
                            const notaObj = mat.notas_avaliacoes.find(n => n.id_avaliacao_turma === av.id)
                            const valorNota = notaObj?.nota !== undefined && notaObj?.nota !== null ? notaObj.nota : ""
                            const isSaving = savingGrades[`${mat.aluno.matricula}-${av.id}`]

                            return (
                              <td key={av.id} className="py-3 px-2 text-center relative">
                                <Input
                                  type="number"
                                  min="0"
                                  max="10"
                                  step="0.1"
                                  className={`w-20 text-center mx-auto h-8 ${isSaving ? 'border-green-500 bg-green-50' : ''}`}
                                  defaultValue={valorNota}
                                  onBlur={(e) => handleUpdateGrade(mat.aluno.matricula, av.id, e.target.value)}
                                  placeholder="-"
                                />
                                {isSaving && <Loader2 className="w-3 h-3 animate-spin absolute right-4 top-4 text-green-600" />}
                              </td>
                            )
                          })}

                          {/* Nota Final */}
                          <td className="py-3 px-4 text-center bg-slate-50">
                            <Input
                              type="number"
                              min="0"
                              max="10"
                              step="0.1"
                              className="w-20 text-center mx-auto h-8 font-bold"
                              defaultValue={mat.nota_final ?? ""}
                              onBlur={(e) => handleUpdateFinalGrade(mat.aluno.matricula, e.target.value)}
                              placeholder="-"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="announcements">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Avisos da Turma</CardTitle>
                  <Button onClick={() => {
                    setEditingAnnouncement(null)
                    setAnnouncementForm({ title: "", description: "" })
                    setShowAnnouncementModal(true)
                  }} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" /> Novo Aviso
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {avisos.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <Bell className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>Nenhum aviso publicado.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {avisos.map((aviso) => (
                      <div key={aviso.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="font-semibold text-slate-900">{aviso.titulo}</h3>
                            <p className="text-slate-600 mt-1">{aviso.conteudo}</p>
                            <p className="text-xs text-slate-400 mt-2">
                              {new Date(aviso.data_publicacao).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => {
                              setEditingAnnouncement(aviso)
                              setAnnouncementForm({ title: aviso.titulo, description: aviso.conteudo })
                              setShowAnnouncementModal(true)
                            }}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteAnnouncement(aviso.id)} className="text-red-600 hover:bg-red-50">
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

      {/* Modal de Avisos */}
      <Dialog open={showAnnouncementModal} onOpenChange={setShowAnnouncementModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingAnnouncement ? "Editar Aviso" : "Novo Aviso"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Título</Label>
              <Input 
                value={announcementForm.title} 
                onChange={e => setAnnouncementForm({...announcementForm, title: e.target.value})}
              />
            </div>
            <div>
              <Label>Conteúdo</Label>
              <Textarea 
                value={announcementForm.description}
                onChange={e => setAnnouncementForm({...announcementForm, description: e.target.value})}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveAnnouncement} disabled={isSavingAnnouncement} className="bg-blue-600">
              {isSavingAnnouncement ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Nova Nota */}
      <Dialog open={showAddGradeModal} onOpenChange={setShowAddGradeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Coluna de Nota</DialogTitle>
            <DialogDescription>Ex: Prova 1, Trabalho, Seminário</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input 
              placeholder="Nome da Avaliação" 
              value={newGradeName} 
              onChange={e => setNewGradeName(e.target.value)} 
            />
          </div>
          <DialogFooter>
            <Button onClick={handleAddGradeColumn} disabled={isCreatingColumn || !newGradeName.trim()}>
              {isCreatingColumn ? "Criando..." : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}