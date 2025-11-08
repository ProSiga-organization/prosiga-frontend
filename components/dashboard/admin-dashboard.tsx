"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Calendar, BookOpen, FileText, Bell, Upload } from "lucide-react"
import Link from "next/link"

// Dados simulados
const adminData = {
  name: "Admin Sistema",
  registration: "ADMIN001",
  department: "Administração Acadêmica",
  email: "admin@prosiga.edu.br",
}

const systemStats = {
  totalStudents: 1247,
  totalTeachers: 89,
  totalSubjects: 156,
  totalCourses: 12,
  activeEnrollments: 3421,
  currentPeriod: "2025.1",
}

export function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader
        title="Dashboard do Administrador"
        userName={adminData.name}
        userInfo={`${adminData.registration} - ${adminData.department}`}
      />

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Estatísticas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Alunos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{systemStats.totalStudents.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Professores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{systemStats.totalTeachers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Disciplinas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{systemStats.totalSubjects}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Cursos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{systemStats.totalCourses}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Matrículas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{systemStats.activeEnrollments.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Período Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{systemStats.currentPeriod}</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-900">Gestão Acadêmica</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/admin/periods">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">Períodos Letivos</CardTitle>
                  </div>
                  <CardDescription className="mt-2">
                    Criar, editar e gerenciar períodos letivos. Controlar abertura e fechamento de matrículas.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    Acessar
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/classes">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <BookOpen className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="text-lg">Gestão de Turmas</CardTitle>
                  </div>
                  <CardDescription className="mt-2">
                    Criar e gerenciar turmas por período. Definir professores, vagas e critérios de aprovação.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    Acessar
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/manual-enrollment">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Upload className="h-6 w-6 text-purple-600" />
                    </div>
                    <CardTitle className="text-lg">Matrícula Manual</CardTitle>
                  </div>
                  <CardDescription className="mt-2">
                    Realizar matrículas excepcionais de alunos com justificativa, mesmo com restrições.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    Acessar
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/reports">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <FileText className="h-6 w-6 text-orange-600" />
                    </div>
                    <CardTitle className="text-lg">Relatórios Gerenciais</CardTitle>
                  </div>
                  <CardDescription className="mt-2">
                    Gerar relatórios de alunos, turmas, ocupação de vagas e histórico de disciplinas.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    Acessar
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/announcements">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Bell className="h-6 w-6 text-red-600" />
                    </div>
                    <CardTitle className="text-lg">Avisos da Coordenação</CardTitle>
                  </div>
                  <CardDescription className="mt-2">
                    Criar e gerenciar avisos institucionais para cursos específicos ou toda a instituição.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    Acessar
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/users">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-100 rounded-lg">
                      <Upload className="h-6 w-6 text-cyan-600" />
                    </div>
                    <CardTitle className="text-lg">Cadastro de Usuários</CardTitle>
                  </div>
                  <CardDescription className="mt-2">
                    Fazer upload de CSV com novos usuários (alunos, professores e administradores).
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    Acessar
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
