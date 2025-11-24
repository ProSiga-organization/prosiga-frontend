"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface ClassModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  classData?: any
  onSuccess: () => void
}

export function ClassModal({ open, onOpenChange, classData, onSuccess }: ClassModalProps) {
  const [loading, setLoading] = useState(false)
  
  // Listas para os selects
  const [subjects, setSubjects] = useState<any[]>([])
  const [teachers, setTeachers] = useState<any[]>([])
  const [periods, setPeriods] = useState<any[]>([])

  const [formData, setFormData] = useState({
    codigo: "",
    id_disciplina: "",
    id_professor: "",
    id_periodo_letivo: "",
    horario: "",
    local: "",
    vagas: "",
  })

  // Carrega as listas (Disciplinas, Professores, Períodos)
  useEffect(() => {
    if (!open) return
    
    const fetchData = async () => {
      const token = localStorage.getItem("authToken")
      const headers = { Authorization: `Bearer ${token}` }
      const baseUrl = "http://localhost:8000"

      try {
        const [subjRes, teachRes, perRes] = await Promise.all([
          fetch(`${baseUrl}/disciplinas/`, { headers }),
          fetch(`${baseUrl}/usuarios/professores`, { headers }),
          fetch(`${baseUrl}/periodos-letivos/`, { headers }),
        ])

        if (subjRes.ok) setSubjects(await subjRes.json())
        if (teachRes.ok) setTeachers(await teachRes.json())
        if (perRes.ok) setPeriods(await perRes.json())

      } catch (error) {
        console.error("Erro ao carregar listas", error)
        toast.error("Erro ao carregar opções do formulário.")
      }
    }
    fetchData()
  }, [open])

  // Preenche o formulário se for edição
  useEffect(() => {
    if (classData) {
      setFormData({
        codigo: classData.codigo,
        id_disciplina: classData.id_disciplina.toString(),
        id_professor: classData.id_professor.toString(),
        id_periodo_letivo: classData.id_periodo_letivo.toString(),
        horario: classData.horario || "",
        local: classData.local || "",
        vagas: classData.vagas.toString(),
      })
    } else {
      setFormData({
        codigo: "",
        id_disciplina: "",
        id_professor: "",
        id_periodo_letivo: "",
        horario: "",
        local: "",
        vagas: "",
      })
    }
  }, [classData, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const token = localStorage.getItem("authToken")

    try {
      const url = classData
        ? `http://localhost:8000/turmas/${classData.id}`
        : "http://localhost:8000/turmas/"
      
      const method = classData ? "PUT" : "POST"

      // Converter tipos numéricos
      const payload = {
        ...formData,
        vagas: parseInt(formData.vagas),
        id_disciplina: parseInt(formData.id_disciplina),
        id_professor: parseInt(formData.id_professor),
        id_periodo_letivo: parseInt(formData.id_periodo_letivo),
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) throw new Error("Falha ao salvar turma.")

      toast.success(classData ? "Turma atualizada!" : "Turma criada!")
      onSuccess()
      onOpenChange(false)

    } catch (error) {
      toast.error("Erro ao salvar.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{classData ? "Editar Turma" : "Nova Turma"}</DialogTitle>
          <DialogDescription>
            Preencha as informações da turma.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código da Turma *</Label>
              <Input
                id="code"
                placeholder="Ex: T01"
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="period">Período Letivo *</Label>
              <Select 
                value={formData.id_periodo_letivo} 
                onValueChange={(value) => setFormData({ ...formData, id_periodo_letivo: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((p) => (
                    <SelectItem key={p.id} value={p.id.toString()}>
                      {p.ano}.{p.semestre}
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
                value={formData.id_disciplina}
                onValueChange={(value) => setFormData({ ...formData, id_disciplina: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      {s.nome} ({s.codigo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="teacher">Professor Responsável *</Label>
              <Select
                value={formData.id_professor}
                onValueChange={(value) => setFormData({ ...formData, id_professor: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((t) => (
                    <SelectItem key={t.id} value={t.id.toString()}>
                      {t.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="schedule">Horário</Label>
              <Input
                id="schedule"
                placeholder="Ex: Seg/Qua 14:00"
                value={formData.horario}
                onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="local">Local</Label>
              <Input
                id="local"
                placeholder="Ex: Sala 101"
                value={formData.local}
                onChange={(e) => setFormData({ ...formData, local: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
             <Label htmlFor="vagas">Número de Vagas *</Label>
             <Input
                id="vagas"
                type="number"
                min="1"
                value={formData.vagas}
                onChange={(e) => setFormData({ ...formData, vagas: e.target.value })}
                required
              />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}