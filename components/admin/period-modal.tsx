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

interface PeriodModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  period?: any
}

export function PeriodModal({ open, onOpenChange, period }: PeriodModalProps) {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    startDate: "",
    endDate: "",
    enrollmentStart: "",
    enrollmentEnd: "",
  })

  useEffect(() => {
    if (period) {
      setFormData({
        code: period.code,
        name: period.name,
        startDate: period.startDate,
        endDate: period.endDate,
        enrollmentStart: period.enrollmentStart,
        enrollmentEnd: period.enrollmentEnd,
      })
    } else {
      setFormData({
        code: "",
        name: "",
        startDate: "",
        endDate: "",
        enrollmentStart: "",
        enrollmentEnd: "",
      })
    }
  }, [period, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Salvando período:", formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{period ? "Editar Período Letivo" : "Novo Período Letivo"}</DialogTitle>
          <DialogDescription>
            {period ? "Edite as informações do período letivo" : "Preencha as informações do novo período letivo"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código do Período *</Label>
              <Input
                id="code"
                placeholder="Ex: 2025.1"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome do Período *</Label>
              <Input
                id="name"
                placeholder="Ex: Primeiro Semestre de 2025"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Data de Início *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Data de Término *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="enrollmentStart">Início das Matrículas *</Label>
              <Input
                id="enrollmentStart"
                type="date"
                value={formData.enrollmentStart}
                onChange={(e) => setFormData({ ...formData, enrollmentStart: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="enrollmentEnd">Fim das Matrículas *</Label>
              <Input
                id="enrollmentEnd"
                type="date"
                value={formData.enrollmentEnd}
                onChange={(e) => setFormData({ ...formData, enrollmentEnd: e.target.value })}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {period ? "Salvar Alterações" : "Criar Período"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
