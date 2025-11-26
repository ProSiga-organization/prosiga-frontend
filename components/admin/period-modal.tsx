"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface PeriodoBackend {
  id?: number
  ano: number
  semestre: number
  inicio_matricula: string
  fim_matricula: string
  fim_trancamento: string
}

interface PeriodModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  period?: PeriodoBackend | null
  onSuccess: () => void
}

export function PeriodModal({ open, onOpenChange, period, onSuccess }: PeriodModalProps) {
  const [formData, setFormData] = useState({
    ano: new Date().getFullYear(),
    semestre: 1,
    inicio_matricula: "",
    fim_matricula: "",
    fim_trancamento: "",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (period) {
      setFormData({
        ano: period.ano,
        semestre: period.semestre,
        inicio_matricula: period.inicio_matricula,
        fim_matricula: period.fim_matricula,
        fim_trancamento: period.fim_trancamento,
      })
    } else {
      setFormData({
        ano: new Date().getFullYear(),
        semestre: 1,
        inicio_matricula: "",
        fim_matricula: "",
        fim_trancamento: "",
      })
    }
  }, [period, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const token = localStorage.getItem("authToken")
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BACKEND_URL
    
    try {
      const url = period 
        ? `${apiBaseUrl}/periodos-letivos/${period.id}`
        : `${apiBaseUrl}/periodos-letivos/`
      
      const method = period ? "PUT" : "POST"

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error("Falha ao salvar período.")

      toast.success(period ? "Período atualizado!" : "Período criado!")
      onSuccess()
      onOpenChange(false)

    } catch (error) {
      toast.error("Erro ao salvar.")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{period ? "Editar Período Letivo" : "Novo Período Letivo"}</DialogTitle>
          <DialogDescription>
            Defina o ano, semestre e os prazos importantes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ano">Ano *</Label>
              <Input
                id="ano"
                type="number"
                value={formData.ano}
                onChange={(e) => setFormData({ ...formData, ano: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="semestre">Semestre *</Label>
              <Input
                id="semestre"
                type="number"
                min="1"
                max="2"
                value={formData.semestre}
                onChange={(e) => setFormData({ ...formData, semestre: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="inicio_matricula">Início das Matrículas *</Label>
              <Input
                id="inicio_matricula"
                type="date"
                value={formData.inicio_matricula}
                onChange={(e) => setFormData({ ...formData, inicio_matricula: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fim_matricula">Fim das Matrículas *</Label>
              <Input
                id="fim_matricula"
                type="date"
                value={formData.fim_matricula}
                onChange={(e) => setFormData({ ...formData, fim_matricula: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fim_trancamento">Prazo Final para Trancamento *</Label>
            <Input
              id="fim_trancamento"
              type="date"
              value={formData.fim_trancamento}
              onChange={(e) => setFormData({ ...formData, fim_trancamento: e.target.value })}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? "Salvando..." : (period ? "Salvar Alterações" : "Criar Período")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}