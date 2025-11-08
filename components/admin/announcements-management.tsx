"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AnnouncementModal } from "@/components/admin/announcement-modal"
import { Bell, Edit, Trash2, Plus } from "lucide-react"
import Link from "next/link"

// Dados simulados
const announcementsData = [
  {
    id: 1,
    title: "Início do Período Letivo 2025.1",
    content:
      "As aulas do primeiro semestre de 2025 iniciam no dia 03 de fevereiro. Todos os alunos devem verificar seus horários no sistema.",
    course: "Todos os cursos",
    createdAt: "2025-01-15",
    author: "Coordenação Acadêmica",
  },
  {
    id: 2,
    title: "Matrícula para Disciplinas Optativas",
    content: "O período de matrícula para disciplinas optativas será de 20 a 25 de janeiro. Não perca o prazo!",
    course: "Engenharia de Software",
    createdAt: "2025-01-10",
    author: "Coordenação de Engenharia",
  },
  {
    id: 3,
    title: "Semana de Integração",
    content:
      "Nos dias 27 a 31 de janeiro teremos a Semana de Integração com palestras e workshops. Participação obrigatória para calouros.",
    course: "Ciência da Computação",
    createdAt: "2025-01-08",
    author: "Coordenação de CC",
  },
]

export function AnnouncementsManagement() {
  const [showModal, setShowModal] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null)

  const handleEdit = (announcement: any) => {
    setSelectedAnnouncement(announcement)
    setShowModal(true)
  }

  const handleNew = () => {
    setSelectedAnnouncement(null)
    setShowModal(true)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader
        title="Avisos da Coordenação"
        userName="Admin Sistema"
        userInfo="ADMIN001 - Administração Acadêmica"
      />

      <main className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Gerenciar Avisos Institucionais</h2>
            <p className="text-slate-600 mt-1">Crie e gerencie avisos para cursos específicos ou toda a instituição</p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/admin">
              <Button variant="outline">Voltar ao Dashboard</Button>
            </Link>
            <Button onClick={handleNew} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Aviso
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {announcementsData.map((announcement) => (
            <Card key={announcement.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Bell className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{announcement.title}</CardTitle>
                      <CardDescription className="mt-2">{announcement.content}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <div>
                      <p className="text-sm text-slate-600">Destinatário</p>
                      <Badge variant="secondary" className="mt-1">
                        {announcement.course}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Publicado em</p>
                      <p className="font-medium mt-1">{new Date(announcement.createdAt).toLocaleDateString("pt-BR")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Autor</p>
                      <p className="font-medium mt-1">{announcement.author}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(announcement)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 border-red-600 bg-transparent">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <AnnouncementModal open={showModal} onOpenChange={setShowModal} announcement={selectedAnnouncement} />
    </div>
  )
}
