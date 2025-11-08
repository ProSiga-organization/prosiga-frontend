"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Clock, MapPin, BookOpen, GraduationCap } from "lucide-react"

interface Subject {
  id: number
  name: string
  code: string
  professor: string
  schedule: string
  credits: number
  prerequisites: string[]
  vacancies: number
  enrolled: number
  department: string
  description: string
  syllabus: string[]
  room: string
}

interface SubjectDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subject: Subject | null
}

export function SubjectDetailsModal({ open, onOpenChange, subject }: SubjectDetailsModalProps) {
  if (!subject) return null

  const availableVacancies = subject.vacancies - subject.enrolled

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{subject.name}</DialogTitle>
          <DialogDescription>
            {subject.code} • {subject.department}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Créditos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{subject.credits}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Vagas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{availableVacancies}</div>
                <div className="text-xs text-slate-600">
                  {subject.enrolled}/{subject.vacancies} ocupadas
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Horário
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium text-slate-900">{subject.schedule}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Local
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium text-slate-900">{subject.room}</div>
              </CardContent>
            </Card>
          </div>

          {/* Professor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Professor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">
                    {subject.professor
                      .split(" ")
                      .slice(1, 3)
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-slate-900">{subject.professor}</div>
                  <div className="text-sm text-slate-600">{subject.department}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Descrição */}
          <Card>
            <CardHeader>
              <CardTitle>Descrição da Disciplina</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700">{subject.description}</p>
            </CardContent>
          </Card>

          {/* Ementa */}
          <Card>
            <CardHeader>
              <CardTitle>Ementa</CardTitle>
              <CardDescription>Conteúdo programático da disciplina</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {subject.syllabus.map((topic, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-slate-700">{topic}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Pré-requisitos */}
          {subject.prerequisites.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Pré-requisitos</CardTitle>
                <CardDescription>Disciplinas necessárias para cursar esta matéria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {subject.prerequisites.map((prereq) => (
                    <Badge key={prereq} variant="secondary" className="text-sm">
                      {prereq}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status de Disponibilidade */}
          <Card>
            <CardHeader>
              <CardTitle>Status da Disciplina</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant={availableVacancies > 0 ? "default" : "destructive"} className="text-sm">
                  {availableVacancies > 0 ? "Vagas Disponíveis" : "Turma Lotada"}
                </Badge>
                {availableVacancies > 0 && (
                  <span className="text-sm text-slate-600">{availableVacancies} vaga(s) restante(s)</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
