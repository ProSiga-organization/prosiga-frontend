"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface AnnouncementModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  announcement?: any
  onSuccess: () => void
}

export function AnnouncementModal({ open, onOpenChange, announcement, onSuccess }: AnnouncementModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    id_curso: "",
  })
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Buscar cursos
  useEffect(() => {
    if(!open) return
    const fetchCourses = async () => {
      const token = localStorage.getItem("authToken")
      try {
        const res = await fetch("http://localhost:8000/cursos/", {
            headers: { Authorization: `Bearer ${token}` }
        })
        if(res.ok) setCourses(await res.json())
      } catch(e) { console.error(e) }
    }
    fetchCourses()
  }, [open])

  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title,
        content: announcement.content,
        id_curso: announcement.id_curso.toString(),
      })
    } else {
      setFormData({
        title: "",
        content: "",
        id_curso: "",
      })
    }
  }, [announcement, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if(!formData.id_curso) {
        toast.error("Selecione um curso.")
        return
    }

    setLoading(true)
    const token = localStorage.getItem("authToken")
    
    try {
        const url = announcement 
            ? `http://localhost:8000/avisos/${announcement.id}`
            : "http://localhost:8000/avisos/curso"
        
        const method = announcement ? "PUT" : "POST"
        
        // Para PUT, enviamos apenas titulo/conteudo. Para POST, enviamos tudo.
        const body = announcement 
            ? { titulo: formData.title, conteudo: formData.content }
            : { titulo: formData.title, conteudo: formData.content, id_curso: parseInt(formData.id_curso) }

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(body)
        })

        if(!res.ok) throw new Error()
        
        toast.success(announcement ? "Aviso atualizado" : "Aviso publicado")
        onSuccess()
        onOpenChange(false)
    } catch {
        toast.error("Erro ao salvar aviso")
    } finally {
        setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{announcement ? "Editar Aviso" : "Novo Aviso"}</DialogTitle>
          <DialogDescription>
            {announcement ? "Edite as informações do aviso" : "Crie um novo aviso para um curso"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Aviso *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="course">Destinatário (Curso) *</Label>
            <Select 
                value={formData.id_curso} 
                onValueChange={(value) => setFormData({ ...formData, id_curso: value })}
                disabled={!!announcement} // Não permite mudar o curso na edição (simplificação)
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um curso" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                        {c.nome}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? "Salvando..." : (announcement ? "Salvar Alterações" : "Publicar Aviso")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}