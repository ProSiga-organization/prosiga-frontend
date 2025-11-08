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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ClassModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  classData?: any
}

// Dados simulados
const subjects = [
  { id: 1, code: "AED001", name: "Algoritmos e Estruturas de Dados" },
  { id: 2, code: "CDI001", name: "Cálculo Diferencial e Integral" },
  { id: 3, code: "FIS001", name: "Física Geral" },
]

const teachers = [
  { id: 1, name: "Prof. Maria Santos" },
  { id: 2, name: "Prof. João Oliveira" },
  { id: 3, name: "Prof. Roberto Lima" },
]

const periods = ["2025.1", "2024.2", "2024.1"]

export function ClassModal({ open, onOpenChange, classData }: ClassModalProps) {
  const [formData, setFormData] = useState({
    code: "",
    subjectId: "",
    teacherId: "",
    period: "2025.1",
    schedule: "",
    maxStudents: "",
    approvalCriteria: "",
  })

  useEffect(() => {
    if (classData) {
      setFormData({
        code: classData.code,
        subjectId: classData.subjectCode,
        teacherId: classData.teacherId.toString(),
        period: classData.period,
        schedule: classData.schedule,
        maxStudents: classData.maxStudents.toString(),
        approvalCriteria: classData.approvalCriteria,
      })
    } else {
      setFormData({
        code: "",
        subjectId: "",
        teacherId: "",
        period: "2025.1",
        schedule: "",
        maxStudents: "",
        approvalCriteria: "",
      })
    }
  }, [classData, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Salvando turma:", formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{classData ? "Editar Turma" : "Nova Turma"}</DialogTitle>
          <DialogDescription>
            {classData ? "Edite as informações da turma" : "Preencha as informações da nova turma"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código da Turma *</Label>
              <Input
                id="code"
                placeholder="Ex: AED001-T01"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="period">Período Letivo *</Label>
              <Select value={formData.period} onValueChange={(value) => setFormData({ ...formData, period: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((period) => (
                    <SelectItem key={period} value={period}>
                      {period}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Disciplina *</Label>
              <Select
                value={formData.subjectId}
                onValueChange={(value) => setFormData({ ...formData, subjectId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a disciplina" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.code}>
                      {subject.code} - {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="teacher">Professor Responsável *</Label>
              <Select
                value={formData.teacherId}
                onValueChange={(value) => setFormData({ ...formData, teacherId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o professor" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id.toString()}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="schedule">Horário *</Label>
              <Input
                id="schedule"
                placeholder="Ex: Seg/Qua 14:00-16:00"
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxStudents">Número de Vagas *</Label>
              <Input
                id="maxStudents"
                type="number"
                placeholder="Ex: 30"
                value={formData.maxStudents}
                onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="approvalCriteria">Critérios de Aprovação *</Label>
            <Textarea
              id="approvalCriteria"
              placeholder="Ex: Média >= 7.0 e Frequência >= 75%"
              value={formData.approvalCriteria}
              onChange={(e) => setFormData({ ...formData, approvalCriteria: e.target.value })}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {classData ? "Salvar Alterações" : "Criar Turma"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
