"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Calendar, BookOpen, FileText, Bell, Upload } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface AdminData {
  nome: string
  email: string
  tipo_usuario: string
}

interface SystemStats {
  totalStudents: number
  totalTeachers: number
  totalSubjects: number
  totalCourses: number
  activeEnrollments: number
  currentPeriod: string
}

export function AdminDashboard() {
  const [admin, setAdmin] = useState<AdminData | null>(null)
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken")
      if (!token) return 

      const headers = { Authorization: `Bearer ${token}` }
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BACKEND_URL
      const authApiUrl = process.env.NEXT_PUBLIC_API_AUTH_URL

      try {
        // 1. Buscar dados do administrador
        const meRes = await fetch(`${authApiUrl}/login/me`, { headers })
        if (meRes.ok) setAdmin(await meRes.json())

        // 2. Buscar estatísticas do sistema
        const statsRes = await fetch(`${apiBaseUrl}/stats/dashboard`, { headers })
        if (statsRes.ok) setStats(await statsRes.json())

      } catch (error) {
        console.error("Erro ao carregar dashboard:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
             <Skeleton className="h-20 w-full mb-8" />
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
             </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader
        title="Dashboard do Administrador"
        userName={admin?.nome || "Administrador"}
        userInfo={`${admin?.email || ""} - Coordenação`}
      />

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Estatísticas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Alunos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stats?.totalStudents || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Professores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stats?.totalTeachers || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Disciplinas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stats?.totalSubjects || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Cursos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stats?.totalCourses || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Matrículas Ativas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stats?.activeEnrollments || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Período Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats?.currentPeriod || "N/A"}</div>
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
                  <p className="text-sm text-slate-500 mt-2">
                    Criar, editar e gerenciar períodos letivos. Controlar abertura e fechamento de matrículas.
                  </p>
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
                  <p className="text-sm text-slate-500 mt-2">
                    Criar e gerenciar turmas por período. Definir professores, vagas e critérios de aprovação.
                  </p>
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
                  <p className="text-sm text-slate-500 mt-2">
                    Realizar matrículas excepcionais de alunos com justificativa, mesmo com restrições.
                  </p>
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
                  <p className="text-sm text-slate-500 mt-2">
                    Gerar relatórios de alunos, turmas, ocupação de vagas e histórico de disciplinas.
                  </p>
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
                  <p className="text-sm text-slate-500 mt-2">
                    Criar e gerenciar avisos institucionais para cursos específicos ou toda a instituição.
                  </p>
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
                  <p className="text-sm text-slate-500 mt-2">
                    Fazer upload de CSV com novos usuários (alunos, professores e administradores).
                  </p>
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