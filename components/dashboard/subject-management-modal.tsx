"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface SubjectManagementModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SubjectManagementModal({ open, onOpenChange }: SubjectManagementModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    department: "",
    credits: "",
    maxStudents: "",
    teacher: "",
    schedule: "",
    room: "",
    description: "",
    prerequisites: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Criando disciplina:", formData)
    setFormData({
      name: "",
      code: "",
      department: "",
      credits: "",
      maxStudents: "",
      teacher: "",
      schedule: "",
      room: "",
      description: "",
      prerequisites: "",
    })
    onOpenChange(false)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Disciplina</DialogTitle>
          <DialogDescription>Cadastre uma nova disciplina no sistema</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Disciplina</Label>
              <Input
                id="name"
                placeholder="Nome da disciplina"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Código</Label>
              <Input
                id="code"
                placeholder="Ex: AED001"
                value={formData.code}
                onChange={(e) => handleChange("code", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Departamento</Label>
              <Select value={formData.department} onValueChange={(value) => handleChange("department", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="computer-science">Ciência da Computação</SelectItem>
                  <SelectItem value="mathematics">Matemática</SelectItem>
                  <SelectItem value="physics">Física</SelectItem>
                  <SelectItem value="engineering">Engenharia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="credits">Créditos</Label>
              <Input
                id="credits"
                type="number"
                min="1"
                max="10"
                placeholder="4"
                value={formData.credits}
                onChange={(e) => handleChange("credits", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxStudents">Máximo de Alunos</Label>
              <Input
                id="maxStudents"
                type="number"
                min="1"
                placeholder="30"
                value={formData.maxStudents}
                onChange={(e) => handleChange("maxStudents", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="teacher">Professor</Label>
              <Select value={formData.teacher} onValueChange={(value) => handleChange("teacher", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o professor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maria-santos">Prof. Maria Santos</SelectItem>
                  <SelectItem value="joao-oliveira">Prof. João Oliveira</SelectItem>
                  <SelectItem value="ana-costa">Prof. Ana Costa</SelectItem>
                  <SelectItem value="carlos-silva">Prof. Carlos Silva</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="schedule">Horário</Label>
              <Input
                id="schedule"
                placeholder="Ex: Seg/Qua 14:00-16:00"
                value={formData.schedule}
                onChange={(e) => handleChange("schedule", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="room">Sala</Label>
              <Input
                id="room"
                placeholder="Ex: Lab 101"
                value={formData.room}
                onChange={(e) => handleChange("room", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prerequisites">Pré-requisitos</Label>
            <Input
              id="prerequisites"
              placeholder="Ex: AED001, MAT001 (separados por vírgula)"
              value={formData.prerequisites}
              onChange={(e) => handleChange("prerequisites", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descrição da disciplina..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Criar Disciplina
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
