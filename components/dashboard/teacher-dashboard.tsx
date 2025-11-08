"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Users, Clock, MapPin } from "lucide-react"

// Dados simulados
const teacherData = {
  name: "Prof. Maria Santos",
  registration: "PROF001",
  department: "Ciência da Computação",
  email: "maria.santos@prosiga.edu.br",
}

const currentClasses = [
  {
    id: 1,
    code: "AED001",
    name: "Algoritmos e Estruturas de Dados",
    schedule: "Seg/Qua 14:00-16:00",
    students: 28,
    room: "Lab 101",
  },
  {
    id: 2,
    code: "POO001",
    name: "Programação Orientada a Objetos",
    schedule: "Ter/Qui 16:00-18:00",
    students: 22,
    room: "Sala 205",
  },
  {
    id: 3,
    code: "EDA001",
    name: "Estruturas de Dados Avançadas",
    schedule: "Sex 08:00-12:00",
    students: 15,
    room: "Lab 102",
  },
]

export function TeacherDashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader
        title="Minhas Turmas"
        userName={teacherData.name}
        userInfo={`${teacherData.registration} - ${teacherData.department}`}
      />

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Período Letivo 2024.1</h2>
          <p className="text-slate-600">Você está lecionando {currentClasses.length} disciplinas neste semestre</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentClasses.map((classItem) => (
            <Card
              key={classItem.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => (window.location.href = `/teacher-class/${classItem.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg font-bold text-blue-600">{classItem.code.slice(0, 3)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users className="w-4 h-4" />
                    <span>{classItem.students}</span>
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight">{classItem.name}</CardTitle>
                <CardDescription className="font-medium">{classItem.code}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span>{classItem.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4" />
                    <span>{classItem.room}</span>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">Gerenciar Turma</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
