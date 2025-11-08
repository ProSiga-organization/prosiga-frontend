"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PeriodModal } from "@/components/admin/period-modal"
import { Calendar, Lock, Unlock, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

// Dados simulados
const periodsData = [
  {
    id: 1,
    code: "2025.1",
    name: "Primeiro Semestre de 2025",
    startDate: "2025-02-01",
    endDate: "2025-06-30",
    enrollmentOpen: true,
    enrollmentStart: "2024-12-01",
    enrollmentEnd: "2025-01-31",
    withdrawalOpen: true,
    withdrawalStart: "2025-02-15",
    withdrawalEnd: "2025-04-30",
    status: "active",
  },
  {
    id: 2,
    code: "2024.2",
    name: "Segundo Semestre de 2024",
    startDate: "2024-08-01",
    endDate: "2024-12-20",
    enrollmentOpen: false,
    enrollmentStart: "2024-06-01",
    enrollmentEnd: "2024-07-31",
    withdrawalOpen: false,
    withdrawalStart: "2024-08-15",
    withdrawalEnd: "2024-10-31",
    status: "closed",
  },
  {
    id: 3,
    code: "2024.1",
    name: "Primeiro Semestre de 2024",
    startDate: "2024-02-01",
    endDate: "2024-06-30",
    enrollmentOpen: false,
    enrollmentStart: "2023-12-01",
    enrollmentEnd: "2024-01-31",
    withdrawalOpen: false,
    withdrawalStart: "2024-02-15",
    withdrawalEnd: "2024-04-30",
    status: "closed",
  },
]

export function PeriodManagement() {
  const [showModal, setShowModal] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState<any>(null)

  const handleEdit = (period: any) => {
    setSelectedPeriod(period)
    setShowModal(true)
  }

  const handleNew = () => {
    setSelectedPeriod(null)
    setShowModal(true)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader
        title="Gestão de Períodos Letivos"
        userName="Admin Sistema"
        userInfo="ADMIN001 - Administração Acadêmica"
      />

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Períodos Letivos</h2>
            <p className="text-slate-600 mt-1">Gerencie os períodos acadêmicos e controle as matrículas</p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/admin">
              <Button variant="outline">Voltar ao Dashboard</Button>
            </Link>
            <Button onClick={handleNew} className="bg-blue-600 hover:bg-blue-700">
              Novo Período
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {periodsData.map((period) => (
            <Card key={period.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{period.code}</CardTitle>
                      <CardDescription className="mt-1">{period.name}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={period.status === "active" ? "default" : "secondary"}>
                      {period.status === "active" ? "Ativo" : "Encerrado"}
                    </Badge>
                    <Badge
                      variant={period.enrollmentOpen ? "default" : "secondary"}
                      className={period.enrollmentOpen ? "bg-green-600" : ""}
                    >
                      {period.enrollmentOpen ? "Matrícula Aberta" : "Matrícula Fechada"}
                    </Badge>
                    <Badge
                      variant={period.withdrawalOpen ? "default" : "secondary"}
                      className={period.withdrawalOpen ? "bg-orange-600" : ""}
                    >
                      {period.withdrawalOpen ? "Trancamento Aberto" : "Trancamento Fechado"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-slate-600">Início do Período</p>
                    <p className="font-medium">{new Date(period.startDate).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Fim do Período</p>
                    <p className="font-medium">{new Date(period.endDate).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Início das Matrículas</p>
                    <p className="font-medium">{new Date(period.enrollmentStart).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Fim das Matrículas</p>
                    <p className="font-medium">{new Date(period.enrollmentEnd).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Início dos Trancamentos</p>
                    <p className="font-medium">{new Date(period.withdrawalStart).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Fim dos Trancamentos</p>
                    <p className="font-medium">{new Date(period.withdrawalEnd).toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {period.enrollmentOpen ? (
                    <Button size="sm" variant="outline" className="text-red-600 border-red-600 bg-transparent">
                      <Lock className="h-4 w-4 mr-2" />
                      Encerrar Matrícula
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="text-green-600 border-green-600 bg-transparent">
                      <Unlock className="h-4 w-4 mr-2" />
                      Abrir Matrícula
                    </Button>
                  )}
                  {period.withdrawalOpen ? (
                    <Button size="sm" variant="outline" className="text-red-600 border-red-600 bg-transparent">
                      <Lock className="h-4 w-4 mr-2" />
                      Encerrar Trancamento
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="text-orange-600 border-orange-600 bg-transparent">
                      <Unlock className="h-4 w-4 mr-2" />
                      Abrir Trancamento
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => handleEdit(period)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 border-red-600 bg-transparent">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <PeriodModal open={showModal} onOpenChange={setShowModal} period={selectedPeriod} />
    </div>
  )
}
