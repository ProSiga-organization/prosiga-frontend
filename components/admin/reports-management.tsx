"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { FileText, FileSpreadsheet } from "lucide-react"
import Link from "next/link"

const reportTypes = [
  {
    id: "students-by-course",
    name: "Lista de Alunos por Curso",
    description: "Relatório completo de alunos matriculados em cada curso",
    filters: ["course", "period"],
  },
  {
    id: "classes-by-teacher",
    name: "Turmas por Professor",
    description: "Distribuição de turmas e carga horária por professor",
    filters: ["period", "department"],
  },
  {
    id: "vacancy-occupation",
    name: "Ocupação de Vagas",
    description: "Análise de ocupação de vagas por turma e disciplina",
    filters: ["period", "department"],
  },
  {
    id: "subject-history",
    name: "Histórico de Disciplinas",
    description: "Histórico completo de disciplinas cursadas por aluno",
    filters: ["student", "period"],
  },
]

const courses = ["Engenharia de Software", "Ciência da Computação", "Sistemas de Informação"]
const departments = ["Ciência da Computação", "Matemática", "Física"]
const periods = ["2025.1", "2024.2", "2024.1"]

export function ReportsManagement() {
  const [selectedReport, setSelectedReport] = useState("")
  const [filters, setFilters] = useState({
    course: "",
    department: "",
    period: "",
    student: "",
  })

  const currentReport = reportTypes.find((r) => r.id === selectedReport)

  const handleExport = (format: "pdf" | "excel") => {
    console.log("[v0] Exportando relatório:", { report: selectedReport, format, filters })
    alert(`Gerando relatório em ${format.toUpperCase()}...`)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader
        title="Relatórios Gerenciais"
        userName="Admin Sistema"
        userInfo="ADMIN001 - Administração Acadêmica"
      />

      <main className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Relatórios do Sistema</h2>
            <p className="text-slate-600 mt-1">Gere relatórios personalizados com filtros e exportação</p>
          </div>
          <Link href="/dashboard/admin">
            <Button variant="outline">Voltar ao Dashboard</Button>
          </Link>
        </div>

        <div className="grid gap-6">
          {/* Seleção de Relatório */}
          <Card>
            <CardHeader>
              <CardTitle>Tipo de Relatório</CardTitle>
              <CardDescription>Selecione o tipo de relatório que deseja gerar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {reportTypes.map((report) => (
                  <div
                    key={report.id}
                    onClick={() => setSelectedReport(report.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedReport === report.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-slate-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium">{report.name}</p>
                        <p className="text-sm text-slate-600 mt-1">{report.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Filtros */}
          {currentReport && (
            <Card>
              <CardHeader>
                <CardTitle>Filtros</CardTitle>
                <CardDescription>Configure os filtros para o relatório selecionado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentReport.filters.includes("course") && (
                    <div className="space-y-2">
                      <Label>Curso</Label>
                      <Select
                        value={filters.course}
                        onValueChange={(value) => setFilters({ ...filters, course: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o curso" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos os cursos</SelectItem>
                          {courses.map((course) => (
                            <SelectItem key={course} value={course}>
                              {course}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {currentReport.filters.includes("department") && (
                    <div className="space-y-2">
                      <Label>Departamento</Label>
                      <Select
                        value={filters.department}
                        onValueChange={(value) => setFilters({ ...filters, department: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o departamento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos os departamentos</SelectItem>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {currentReport.filters.includes("period") && (
                    <div className="space-y-2">
                      <Label>Período</Label>
                      <Select
                        value={filters.period}
                        onValueChange={(value) => setFilters({ ...filters, period: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o período" />
                        </SelectTrigger>
                        <SelectContent>
                          {periods.map((period) => (
                            <SelectItem key={period} value={period}>
                              {period}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Exportação */}
          {currentReport && (
            <Card>
              <CardHeader>
                <CardTitle>Exportar Relatório</CardTitle>
                <CardDescription>Escolha o formato de exportação</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Button onClick={() => handleExport("pdf")} className="flex-1 bg-red-600 hover:bg-red-700">
                    <FileText className="h-4 w-4 mr-2" />
                    Exportar PDF
                  </Button>
                  <Button onClick={() => handleExport("excel")} className="flex-1 bg-green-600 hover:bg-green-700">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Exportar Excel
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
