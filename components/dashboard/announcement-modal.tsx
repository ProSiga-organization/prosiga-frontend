"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface AnnouncementModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  classId: number
  className: string
}

export function AnnouncementModal({ open, onOpenChange, classId, className }: AnnouncementModalProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simulação de criação de aviso
    console.log("Criando aviso:", { classId, title, content })

    // Limpar formulário
    setTitle("")
    setContent("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo Aviso</DialogTitle>
          <DialogDescription>Criar um novo aviso para a turma {className}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Título do Aviso</Label>
            <Input
              id="title"
              placeholder="Digite o título do aviso..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="content">Conteúdo</Label>
            <Textarea
              id="content"
              placeholder="Digite o conteúdo do aviso..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={6}
              className="mt-1"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Publicar Aviso
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
