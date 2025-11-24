"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { FileText, Download, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

const reportTypes = [
  {
    id: "students-by-course",
    name: "Lista de Alunos por Curso",
    description: "Relatório completo de alunos matriculados em cada curso.",
    filters: [], // Este endpoint não filtra por nada no backend atual
    endpoint: (params: any) => `/cursos/relatorio-alunos`
  },
  {
    id: "classes-by-teacher",
    name: "Turmas por Professor",
    description: "Distribuição de turmas e carga horária por professor no período.",
    filters: ["period"],
    endpoint: (params: any) => `/periodos-letivos/${params.period}/relatorio-turmas-professor`
  },
  {
    id: "vacancy-occupation",
    name: "Ocupação de Vagas",
    description: "Análise de ocupação de vagas por turma e disciplina no período.",
    filters: ["period"],
    endpoint: (params: any) => `/periodos-letivos/${params.period}/relatorio-ocupacao`
  },
  {
    id: "subject-history",
    name: "Histórico Escolar",
    description: "Histórico completo de disciplinas cursadas por um aluno específico.",
    filters: ["student_matricula"],
    endpoint: (params: any) => `/usuarios/${params.matricula}/historico-pdf`
  },
]

interface Periodo {
  id: number
  ano: number
  semestre: number
}

export function ReportsManagement() {
  const [selectedReport, setSelectedReport] = useState<string>("")
  const [periods, setPeriods] = useState<Periodo[]>([])
  
  // Estados dos Filtros
  const [selectedPeriod, setSelectedPeriod] = useState<string>("")
  const [studentMatricula, setStudentMatricula] = useState<string>("")
  
  const [loading, setLoading] = useState(false)

  // Carregar Períodos
  useEffect(() => {
    const fetchPeriods = async () => {
      const token = localStorage.getItem("authToken")
      if (!token) return
      try {
        const res = await fetch("http://localhost:8000/periodos-letivos/", {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
            const data = await res.json()
            const sorted = data.sort((a: Periodo, b: Periodo) => (b.ano !== a.ano ? b.ano - a.ano : b.semestre - a.semestre))
            setPeriods(sorted)
            if(sorted.length > 0) setSelectedPeriod(sorted[0].id.toString())
        }
      } catch (e) { console.error(e) }
    }
    fetchPeriods()
  }, [])

  const currentReportConfig = reportTypes.find((r) => r.id === selectedReport)

  const handleExport = async () => {
    if (!currentReportConfig) return
    setLoading(true)

    const token = localStorage.getItem("authToken")
    if (!token) {
        toast.error("Erro de autenticação.")
        setLoading(false)
        return
    }

    // Validação básica
    if (currentReportConfig.filters.includes("period") && !selectedPeriod) {
        toast.error("Selecione um período letivo.")
        setLoading(false)
        return
    }
    if (currentReportConfig.filters.includes("student_matricula") && !studentMatricula) {
        toast.error("Digite a matrícula do aluno.")
        setLoading(false)
        return
    }

    try {
        const endpoint = currentReportConfig.endpoint({
            period: selectedPeriod,
            matricula: studentMatricula
        })
        
        const response = await fetch(`http://localhost:8000${endpoint}`, {
            headers: { Authorization: `Bearer ${token}` }
        })

        if (!response.ok) {
            const err = await response.json()
            throw new Error(err.detail || "Erro ao gerar relatório.")
        }

        // Download do Blob
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        
        // Tenta pegar o nome do arquivo do header
        const disposition = response.headers.get('content-disposition')
        let filename = "relatorio.pdf"
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
        
        toast.success("Relatório gerado com sucesso!")

    } catch (err: any) {
        toast.error(err.message)
    } finally {
        setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader
        title="Relatórios Gerenciais"
        userName="Administrador"
        userInfo="Coordenação"
      />

      <main className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Relatórios do Sistema</h2>
            <p className="text-slate-600 mt-1">Gere relatórios em PDF para controle acadêmico</p>
          </div>
          <Link href="/dashboard/admin">
            <Button variant="outline">Voltar ao Dashboard</Button>
          </Link>
        </div>

        <div className="grid gap-6">
          {/* Seleção de Relatório */}
          <Card>
            <CardHeader>
              <CardTitle>Selecione o Relatório</CardTitle>
              <CardDescription>Escolha o tipo de documento que deseja gerar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {reportTypes.map((report) => (
                  <div
                    key={report.id}
                    onClick={() => setSelectedReport(report.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedReport === report.id
                        ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${selectedReport === report.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${selectedReport === report.id ? 'text-blue-900' : 'text-slate-900'}`}>
                            {report.name}
                        </p>
                        <p className="text-sm text-slate-600 mt-1">{report.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Filtros e Ação */}
          {currentReportConfig && (
            <Card className="animate-in fade-in slide-in-from-top-4">
              <CardHeader>
                <CardTitle>Configuração do Relatório</CardTitle>
                <CardDescription>Defina os parâmetros para a geração do {currentReportConfig.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                  
                  {/* Filtro de Período */}
                  {currentReportConfig.filters.includes("period") && (
                    <div className="space-y-2">
                      <Label>Período Letivo</Label>
                      <Select
                        value={selectedPeriod}
                        onValueChange={setSelectedPeriod}
                      >
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
                  )}

                  {/* Filtro de Matrícula de Aluno */}
                  {currentReportConfig.filters.includes("student_matricula") && (
                    <div className="space-y-2">
                      <Label>Matrícula do Aluno</Label>
                      <Input 
                        placeholder="Ex: 20250001" 
                        value={studentMatricula}
                        onChange={(e) => setStudentMatricula(e.target.value)}
                      />
                    </div>
                  )}
                  
                  {/* Caso não haja filtros */}
                  {currentReportConfig.filters.length === 0 && (
                      <div className="text-sm text-slate-500 pb-3">
                          Este relatório não requer filtros adicionais.
                      </div>
                  )}

                  <Button 
                    onClick={handleExport} 
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Gerando...
                        </>
                    ) : (
                        <>
                            <Download className="h-4 w-4 mr-2" /> Baixar PDF
                        </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}