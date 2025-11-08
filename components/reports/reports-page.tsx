"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { EnrollmentChart } from "@/components/reports/enrollment-chart"
import { PerformanceChart } from "@/components/reports/performance-chart"
import { AttendanceChart } from "@/components/reports/attendance-chart"
import { CourseDistributionChart } from "@/components/reports/course-distribution-chart"

// Dados simulados para relatórios
const reportData = {
  totalStudents: 1247,
  totalTeachers: 89,
  totalSubjects: 156,
  averageGrade: 7.8,
  attendanceRate: 87,
  enrollmentGrowth: 12.5,
}

const topPerformingSubjects = [
  { name: "Algoritmos e Estruturas de Dados", average: 8.7, students: 28 },
  { name: "Banco de Dados", average: 8.5, students: 32 },
  { name: "Engenharia de Software", average: 8.3, students: 25 },
  { name: "Programação Orientada a Objetos", average: 8.1, students: 22 },
  { name: "Redes de Computadores", average: 7.9, students: 30 },
]

const courseStats = [
  { course: "Engenharia de Software", students: 234, avgGrade: 8.2, completion: 92 },
  { course: "Ciência da Computação", students: 189, avgGrade: 7.9, completion: 89 },
  { course: "Sistemas de Informação", students: 156, avgGrade: 8.0, completion: 91 },
  { course: "Engenharia da Computação", students: 143, avgGrade: 7.7, completion: 87 },
]

export function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("2024.1")
  const [selectedCourse, setSelectedCourse] = useState("all")

  const adminData = {
    name: "Admin Sistema",
    registration: "ADMIN001",
    department: "Administração Acadêmica",
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader
        title="Relatórios Acadêmicos"
        userName={adminData.name}
        userInfo={`${adminData.registration} - ${adminData.department}`}
      />

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Filtros */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Label htmlFor="period">Período:</Label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024.1">2024.1</SelectItem>
                <SelectItem value="2023.2">2023.2</SelectItem>
                <SelectItem value="2023.1">2023.1</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="course">Curso:</Label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Cursos</SelectItem>
                <SelectItem value="software-engineering">Engenharia de Software</SelectItem>
                <SelectItem value="computer-science">Ciência da Computação</SelectItem>
                <SelectItem value="information-systems">Sistemas de Informação</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="bg-blue-600 hover:bg-blue-700">Exportar PDF</Button>
        </div>

        {/* Resumo Executivo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total de Alunos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{reportData.totalStudents.toLocaleString()}</div>
              <p className="text-xs text-green-600">+{reportData.enrollmentGrowth}% vs período anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Professores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{reportData.totalTeachers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Disciplinas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{reportData.totalSubjects}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Média Geral</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{reportData.averageGrade}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Taxa de Frequência</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{reportData.attendanceRate}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Taxa de Aprovação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">89%</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="enrollment" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="enrollment">Matrículas</TabsTrigger>
            <TabsTrigger value="performance">Desempenho</TabsTrigger>
            <TabsTrigger value="attendance">Frequência</TabsTrigger>
            <TabsTrigger value="courses">Cursos</TabsTrigger>
            <TabsTrigger value="subjects">Disciplinas</TabsTrigger>
          </TabsList>

          <TabsContent value="enrollment" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Evolução de Matrículas</CardTitle>
                  <CardDescription>Número de matrículas por semestre</CardDescription>
                </CardHeader>
                <CardContent>
                  <EnrollmentChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Curso</CardTitle>
                  <CardDescription>Percentual de alunos por curso</CardDescription>
                </CardHeader>
                <CardContent>
                  <CourseDistributionChart />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Desempenho por Período</CardTitle>
                  <CardDescription>Média das notas ao longo dos semestres</CardDescription>
                </CardHeader>
                <CardContent>
                  <PerformanceChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top 5 Disciplinas</CardTitle>
                  <CardDescription>Disciplinas com melhor desempenho</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topPerformingSubjects.map((subject, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900">{subject.name}</p>
                          <p className="text-sm text-slate-600">{subject.students} alunos</p>
                        </div>
                        <Badge variant="default" className="bg-green-600">
                          {subject.average}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Taxa de Frequência por Mês</CardTitle>
                <CardDescription>Acompanhamento da presença dos alunos</CardDescription>
              </CardHeader>
              <CardContent>
                <AttendanceChart />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas por Curso</CardTitle>
                <CardDescription>Resumo do desempenho de cada curso</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courseStats.map((course, index) => (
                    <div key={index} className="p-4 border border-slate-200 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium text-slate-900">{course.course}</h4>
                        <Badge variant="outline">{course.students} alunos</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-slate-600">Média do Curso</p>
                          <p className="text-xl font-bold text-slate-900">{course.avgGrade}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">Taxa de Conclusão</p>
                          <p className="text-xl font-bold text-slate-900">{course.completion}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Relatório de Disciplinas</CardTitle>
                <CardDescription>Análise detalhada por disciplina</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left p-2 font-medium text-slate-600">Disciplina</th>
                        <th className="text-left p-2 font-medium text-slate-600">Professor</th>
                        <th className="text-left p-2 font-medium text-slate-600">Alunos</th>
                        <th className="text-left p-2 font-medium text-slate-600">Média</th>
                        <th className="text-left p-2 font-medium text-slate-600">Frequência</th>
                        <th className="text-left p-2 font-medium text-slate-600">Aprovação</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-100">
                        <td className="p-2">Algoritmos e Estruturas de Dados</td>
                        <td className="p-2">Prof. Maria Santos</td>
                        <td className="p-2">28</td>
                        <td className="p-2">8.7</td>
                        <td className="p-2">92%</td>
                        <td className="p-2">96%</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="p-2">Banco de Dados</td>
                        <td className="p-2">Prof. Carlos Lima</td>
                        <td className="p-2">32</td>
                        <td className="p-2">8.5</td>
                        <td className="p-2">88%</td>
                        <td className="p-2">94%</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="p-2">Engenharia de Software</td>
                        <td className="p-2">Prof. Ana Costa</td>
                        <td className="p-2">25</td>
                        <td className="p-2">8.3</td>
                        <td className="p-2">95%</td>
                        <td className="p-2">92%</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="p-2">Programação Orientada a Objetos</td>
                        <td className="p-2">Prof. Roberto Silva</td>
                        <td className="p-2">22</td>
                        <td className="p-2">8.1</td>
                        <td className="p-2">90%</td>
                        <td className="p-2">91%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
