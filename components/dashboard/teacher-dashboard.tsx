"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Users, Clock, MapPin } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

interface TeacherData {
  nome: string
  cpf: string
  email: string
}

interface Turma {
  id: number
  codigo: string
  horario: string
  local: string
  disciplina: {
    nome: string
    codigo: string
  }
  qtd_matriculas: number
}

export function TeacherDashboard() {
  const [teacher, setTeacher] = useState<TeacherData | null>(null)
  const [classes, setClasses] = useState<Turma[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken")
      if (!token) return // Redirecionar se necessário

      const headers = { Authorization: `Bearer ${token}` }
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BACKEND_URL
      const authApiUrl = process.env.NEXT_PUBLIC_API_AUTH_URL

      try {
        // 1. Buscar dados do professor
        const meRes = await fetch(`${authApiUrl}/login/me`, { headers })
        if (meRes.ok) {
            setTeacher(await meRes.json())
        }

        // 2. Buscar turmas do professor
        const classesRes = await fetch(`${apiBaseUrl}/turmas/me`, { headers })
        if (classesRes.ok) {
          setClasses(await classesRes.json())
        } else {
             console.error("Erro ao buscar turmas")
        }

      } catch (err: any) {
        setError(err.message)
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
             <Skeleton className="h-20 w-full mb-6" />
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full" />)}
             </div>
         </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader
        title="Minhas Turmas"
        userName={teacher?.nome || "Professor"}
        userInfo={`Docente - ${teacher?.email}`}
      />

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Visão Geral</h2>
          <p className="text-slate-600">
            Você está lecionando {classes.length} disciplina(s) neste período.
          </p>
        </div>

        {classes.length === 0 ? (
            <Card>
                <CardContent className="py-10 text-center text-slate-500">
                    Nenhuma turma alocada para você neste momento.
                </CardContent>
            </Card>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classItem) => (
                <Card
                key={classItem.id}
                >
                <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg font-bold text-blue-600">
                            {classItem.disciplina.codigo.substring(0, 3)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                        <Users className="w-4 h-4" />
                        <span>{classItem.qtd_matriculas} alunos</span>
                    </div>
                    </div>
                    <CardTitle className="text-lg leading-tight">{classItem.disciplina.nome}</CardTitle>
                    <CardDescription className="font-medium">{classItem.codigo}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>{classItem.horario || "Horário a definir"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>{classItem.local || "Local a definir"}</span>
                    </div>
                    </div>
                    <Button asChild className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                        <Link href={`/teacher-class/${classItem.id}`}>
                            Gerenciar Turma
                        </Link>
                    </Button>
                </CardContent>
                </Card>
            ))}
            </div>
        )}
      </main>
    </div>
  )
}