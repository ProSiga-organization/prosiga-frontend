"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AnnouncementModal } from "@/components/admin/announcement-modal"
import { Bell, Edit, Trash2, Plus } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

interface Aviso {
  id: number
  titulo: string
  conteudo: string
  data_publicacao: string
  id_curso: number
  curso?: { nome: string } // Vem do backend com a nossa alteração
  autor: { nome: string }
}

export function AnnouncementsManagement() {
  const [avisos, setAvisos] = useState<Aviso[]>([])
  const [showModal, setShowModal] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Aviso | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchAvisos = async () => {
    const token = localStorage.getItem("authToken")
    if(!token) return

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BACKEND_URL
    setLoading(true)
    try {
        const res = await fetch(`${apiBaseUrl}/avisos/admin/list`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        if(res.ok) setAvisos(await res.json())
    } catch {
        toast.error("Erro ao carregar avisos")
    } finally {
        setLoading(false)
    }
  }

  useEffect(() => {
    fetchAvisos()
  }, [])

  const handleEdit = (announcement: Aviso) => {
    setSelectedAnnouncement(announcement)
    setShowModal(true)
  }

  const handleNew = () => {
    setSelectedAnnouncement(null)
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if(!confirm("Excluir este aviso?")) return
    const token = localStorage.getItem("authToken")
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BACKEND_URL
    try {
        const res = await fetch(`${apiBaseUrl}/avisos/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        })
        if(res.ok) {
            toast.success("Aviso excluído")
            fetchAvisos()
        }
    } catch {
        toast.error("Erro ao excluir")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader
        title="Avisos da Coordenação"
        userName="Administrador"
        userInfo="Coordenação"
      />

      <main className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Gerenciar Avisos Institucionais</h2>
            <p className="text-slate-600 mt-1">Crie e gerencie avisos para cursos específicos</p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/admin">
              <Button variant="outline">Voltar</Button>
            </Link>
            <Button onClick={handleNew} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Aviso
            </Button>
          </div>
        </div>

        {loading ? (
             <div className="grid gap-4">
                {[1,2,3].map(i => <Skeleton key={i} className="h-32 w-full" />)}
             </div>
        ) : avisos.length === 0 ? (
            <p className="text-center text-slate-500 py-10">Nenhum aviso encontrado.</p>
        ) : (
            <div className="grid gap-4">
            {avisos.map((announcement) => (
                <Card key={announcement.id}>
                <CardHeader>
                    <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-red-100 rounded-lg">
                        <Bell className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="flex-1">
                        <CardTitle className="text-xl">{announcement.titulo}</CardTitle>
                        <CardDescription className="mt-2">{announcement.conteudo}</CardDescription>
                        </div>
                    </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center flex-wrap gap-4">
                    <div className="flex gap-4 flex-wrap">
                        <div>
                        <p className="text-sm text-slate-600">Destinatário</p>
                        <Badge variant="secondary" className="mt-1">
                            {announcement.curso?.nome || "Curso não especificado"}
                        </Badge>
                        </div>
                        <div>
                        <p className="text-sm text-slate-600">Publicado em</p>
                        <p className="font-medium mt-1">{new Date(announcement.data_publicacao).toLocaleDateString("pt-BR")}</p>
                        </div>
                        <div>
                        <p className="text-sm text-slate-600">Autor</p>
                        <p className="font-medium mt-1">{announcement.autor.nome}</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(announcement)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50" onClick={() => handleDelete(announcement.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                        </Button>
                    </div>
                    </div>
                </CardContent>
                </Card>
            ))}
            </div>
        )}
      </main>

      <AnnouncementModal 
        open={showModal} 
        onOpenChange={setShowModal} 
        announcement={selectedAnnouncement} 
        onSuccess={fetchAvisos}
      />
    </div>
  )
}