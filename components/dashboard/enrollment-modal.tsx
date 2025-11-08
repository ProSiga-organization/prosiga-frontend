"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SubjectDetailsModal } from "@/components/dashboard/subject-details-modal"

interface EnrollmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const availableSubjects = [
  {
    id: 4,
    name: "Programação Orientada a Objetos",
    code: "POO001",
    professor: "Prof. Roberto Silva",
    schedule: "Seg/Qua 16:00-18:00",
    credits: 4,
    prerequisites: ["AED001"],
    vacancies: 25,
    enrolled: 18,
    department: "Ciência da Computação",
    description:
      "Introdução aos conceitos de programação orientada a objetos, incluindo classes, objetos, herança, polimorfismo e encapsulamento.",
    syllabus: [
      "Conceitos básicos de OOP",
      "Classes e Objetos",
      "Herança",
      "Polimorfismo",
      "Interfaces",
      "Tratamento de Exceções",
    ],
    room: "Lab 201",
  },
  {
    id: 5,
    name: "Redes de Computadores",
    code: "RC001",
    professor: "Prof. Fernanda Oliveira",
    schedule: "Ter/Qui 14:00-16:00",
    credits: 4,
    prerequisites: [],
    vacancies: 30,
    enrolled: 22,
    department: "Ciência da Computação",
    description: "Fundamentos de redes de computadores, protocolos de comunicação e arquiteturas de rede.",
    syllabus: ["Modelo OSI", "TCP/IP", "Roteamento", "Switching", "Segurança em Redes"],
    room: "Sala 305",
  },
  {
    id: 6,
    name: "Inteligência Artificial",
    code: "IA001",
    professor: "Prof. Lucas Mendes",
    schedule: "Sex 14:00-18:00",
    credits: 6,
    prerequisites: ["AED001", "BD001"],
    vacancies: 20,
    enrolled: 15,
    department: "Ciência da Computação",
    description:
      "Introdução aos conceitos e técnicas de inteligência artificial, incluindo algoritmos de busca, aprendizado de máquina e redes neurais.",
    syllabus: ["Algoritmos de Busca", "Machine Learning", "Redes Neurais", "Processamento de Linguagem Natural"],
    room: "Lab 401",
  },
  {
    id: 7,
    name: "Cálculo I",
    code: "MAT001",
    professor: "Prof. Ana Matemática",
    schedule: "Seg/Qua/Sex 08:00-10:00",
    credits: 6,
    prerequisites: [],
    vacancies: 40,
    enrolled: 35,
    department: "Matemática",
    description: "Fundamentos do cálculo diferencial e integral de funções de uma variável.",
    syllabus: ["Limites", "Derivadas", "Integrais", "Aplicações do Cálculo"],
    room: "Auditório A",
  },
]

export function EnrollmentModal({ open, onOpenChange }: EnrollmentModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([])
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [creditsFilter, setCreditsFilter] = useState<string>("all")
  const [selectedSubjectForDetails, setSelectedSubjectForDetails] = useState<(typeof availableSubjects)[0] | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  const filteredSubjects = availableSubjects.filter((subject) => {
    const matchesSearch =
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.professor.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment = departmentFilter === "all" || subject.department === departmentFilter
    const matchesCredits = creditsFilter === "all" || subject.credits.toString() === creditsFilter

    return matchesSearch && matchesDepartment && matchesCredits
  })

  const departments = [...new Set(availableSubjects.map((subject) => subject.department))]
  const creditOptions = [...new Set(availableSubjects.map((subject) => subject.credits))]

  const toggleSubject = (subjectId: number) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId) ? prev.filter((id) => id !== subjectId) : [...prev, subjectId],
    )
  }

  const handleViewDetails = (subject: (typeof availableSubjects)[0], e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedSubjectForDetails(subject)
    setShowDetailsModal(true)
  }

  const handleEnroll = () => {
    console.log("Matriculando em:", selectedSubjects)
    setSelectedSubjects([])
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Matrícula</DialogTitle>
            <DialogDescription>Selecione as disciplinas que deseja cursar no próximo semestre</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg">
              <div>
                <Label htmlFor="search">Buscar Disciplinas</Label>
                <Input
                  id="search"
                  placeholder="Nome, código ou professor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Departamento</Label>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Todos os departamentos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os departamentos</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Créditos</Label>
                <Select value={creditsFilter} onValueChange={setCreditsFilter}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Todos os créditos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os créditos</SelectItem>
                    {creditOptions.map((credits) => (
                      <SelectItem key={credits} value={credits.toString()}>
                        {credits} créditos
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setDepartmentFilter("all")
                    setCreditsFilter("all")
                  }}
                  className="w-full"
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredSubjects.map((subject) => {
                const isSelected = selectedSubjects.includes(subject.id)
                const availableVacancies = subject.vacancies - subject.enrolled

                return (
                  <Card
                    key={subject.id}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-slate-50"
                    }`}
                    onClick={() => toggleSubject(subject.id)}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{subject.name}</CardTitle>
                          <CardDescription>
                            {subject.code} - {subject.professor} • {subject.department}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline">{subject.credits} créditos</Badge>
                          <Badge variant={availableVacancies > 0 ? "default" : "destructive"}>
                            {availableVacancies} vagas
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => handleViewDetails(subject, e)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            Ver Detalhes
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-slate-600">Horário</p>
                          <p className="font-medium">{subject.schedule}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">Sala</p>
                          <p className="font-medium">{subject.room}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">Pré-requisitos</p>
                          <p className="font-medium">
                            {subject.prerequisites.length > 0 ? subject.prerequisites.join(", ") : "Nenhum"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {filteredSubjects.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                Nenhuma disciplina encontrada com os filtros aplicados.
              </div>
            )}

            {selectedSubjects.length > 0 && (
              <div className="flex justify-between items-center pt-4 border-t">
                <p className="text-sm text-slate-600">{selectedSubjects.length} disciplina(s) selecionada(s)</p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setSelectedSubjects([])}>
                    Limpar Seleção
                  </Button>
                  <Button onClick={handleEnroll} className="bg-blue-600 hover:bg-blue-700">
                    Confirmar Matrícula
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <SubjectDetailsModal
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        subject={selectedSubjectForDetails}
      />
    </>
  )
}
