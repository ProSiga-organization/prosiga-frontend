"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface GradesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subjectId: number | null
  subjectName: string
}

const studentsData = [
  {
    id: 1,
    name: "João Silva",
    registration: "2024001",
    grades: { p1: 8.5, p2: 7.8, final: null },
    average: 8.15,
  },
  {
    id: 2,
    name: "Maria Oliveira",
    registration: "2024002",
    grades: { p1: 9.2, p2: 8.7, final: null },
    average: 8.95,
  },
  {
    id: 3,
    name: "Pedro Santos",
    registration: "2024003",
    grades: { p1: 6.5, p2: 7.2, final: null },
    average: 6.85,
  },
  {
    id: 4,
    name: "Ana Costa",
    registration: "2024004",
    grades: { p1: 7.8, p2: 8.5, final: null },
    average: 8.15,
  },
]

export function GradesModal({ open, onOpenChange, subjectId, subjectName }: GradesModalProps) {
  const [selectedAssessment, setSelectedAssessment] = useState("p1")
  const [grades, setGrades] = useState<Record<number, string>>({})

  const handleGradeChange = (studentId: number, grade: string) => {
    setGrades((prev) => ({ ...prev, [studentId]: grade }))
  }

  const handleSaveGrades = () => {
    console.log("Salvando notas:", grades)
    setGrades({})
    onOpenChange(false)
  }

  if (!subjectId) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Notas - {subjectName}</DialogTitle>
          <DialogDescription>Lance e edite as notas dos alunos</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="assessment">Avaliação</Label>
            <Select value={selectedAssessment} onValueChange={setSelectedAssessment}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="p1">Prova 1</SelectItem>
                <SelectItem value="p2">Prova 2</SelectItem>
                <SelectItem value="final">Prova Final</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3">
            {studentsData.map((student) => (
              <Card key={student.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-base">{student.name}</CardTitle>
                      <p className="text-sm text-slate-600">{student.registration}</p>
                    </div>
                    <Badge variant="outline">Média: {student.average.toFixed(1)}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div>
                      <Label className="text-xs text-slate-600">P1</Label>
                      <div className="font-medium">{student.grades.p1 || "-"}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-slate-600">P2</Label>
                      <div className="font-medium">{student.grades.p2 || "-"}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-slate-600">Final</Label>
                      <div className="font-medium">{student.grades.final || "-"}</div>
                    </div>
                    <div>
                      <Label htmlFor={`grade-${student.id}`} className="text-xs text-slate-600">
                        Nova Nota ({selectedAssessment.toUpperCase()})
                      </Label>
                      <Input
                        id={`grade-${student.id}`}
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        placeholder="0.0"
                        value={grades[student.id] || ""}
                        onChange={(e) => handleGradeChange(student.id, e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveGrades} className="bg-blue-600 hover:bg-blue-700">
              Salvar Notas
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
