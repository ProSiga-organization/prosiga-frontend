"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface AttendanceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subjectId: number | null
  subjectName: string
}

const studentsAttendance = [
  {
    id: 1,
    name: "João Silva",
    registration: "2024001",
    attendanceRate: 92,
    totalClasses: 24,
    attendedClasses: 22,
  },
  {
    id: 2,
    name: "Maria Oliveira",
    registration: "2024002",
    attendanceRate: 96,
    totalClasses: 24,
    attendedClasses: 23,
  },
  {
    id: 3,
    name: "Pedro Santos",
    registration: "2024003",
    attendanceRate: 83,
    totalClasses: 24,
    attendedClasses: 20,
  },
  {
    id: 4,
    name: "Ana Costa",
    registration: "2024004",
    attendanceRate: 88,
    totalClasses: 24,
    attendedClasses: 21,
  },
]

export function AttendanceModal({ open, onOpenChange, subjectId, subjectName }: AttendanceModalProps) {
  const [attendance, setAttendance] = useState<Record<number, boolean>>({})
  const [classDate, setClassDate] = useState(new Date().toISOString().split("T")[0])

  const handleAttendanceChange = (studentId: number, present: boolean) => {
    setAttendance((prev) => ({ ...prev, [studentId]: present }))
  }

  const handleSaveAttendance = () => {
    console.log("Salvando frequência:", attendance)
    setAttendance({})
    onOpenChange(false)
  }

  if (!subjectId) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Frequência - {subjectName}</DialogTitle>
          <DialogDescription>Registre a presença dos alunos na aula</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="classDate">Data da Aula</Label>
            <input
              id="classDate"
              type="date"
              value={classDate}
              onChange={(e) => setClassDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid gap-3">
            {studentsAttendance.map((student) => (
              <Card key={student.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-base">{student.name}</CardTitle>
                      <p className="text-sm text-slate-600">{student.registration}</p>
                    </div>
                    <Badge variant={student.attendanceRate >= 75 ? "default" : "destructive"}>
                      {student.attendanceRate}% frequência
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-slate-600">
                      {student.attendedClasses}/{student.totalClasses} aulas presentes
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`attendance-${student.id}`}
                        checked={attendance[student.id] || false}
                        onCheckedChange={(checked) => handleAttendanceChange(student.id, checked as boolean)}
                      />
                      <Label htmlFor={`attendance-${student.id}`} className="text-sm font-medium">
                        Presente
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-slate-600">
              {Object.values(attendance).filter(Boolean).length} de {studentsAttendance.length} alunos presentes
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveAttendance} className="bg-blue-600 hover:bg-blue-700">
                Salvar Frequência
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
