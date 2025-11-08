"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Clock, MapPin, Users, X, ChevronLeft } from "lucide-react"
import { ClassDetailsModal } from "@/components/enrollment/class-details-modal"
import Link from "next/link"

const availableClasses = [
  {
    id: 1,
    code: "POO001-T01",
    subjectName: "Programação Orientada a Objetos",
    professor: "Prof. Roberto Silva",
    schedule: "Seg/Qua 16:00-18:00",
    days: "Segunda e Quarta",
    time: "16:00 - 18:00",
    room: "Lab 201",
    building: "Bloco A",
    vacancies: 25,
    enrolled: 18,
    credits: 4,
    department: "Ciência da Computação",
    description:
      "Introdução aos conceitos de programação orientada a objetos, incluindo classes, objetos, herança, polimorfismo e encapsulamento.",
    syllabus:
      "1. Conceitos básicos de OOP\n2. Classes e Objetos\n3. Herança e Polimorfismo\n4. Interfaces e Classes Abstratas\n5. Tratamento de Exceções\n6. Padrões de Projeto",
    prerequisites: ["Algoritmos e Estruturas de Dados"],
  },
  {
    id: 2,
    code: "RC001-T01",
    subjectName: "Redes de Computadores",
    professor: "Prof. Fernanda Oliveira",
    schedule: "Ter/Qui 14:00-16:00",
    days: "Terça e Quinta",
    time: "14:00 - 16:00",
    room: "Sala 305",
    building: "Bloco B",
    vacancies: 30,
    enrolled: 22,
    credits: 4,
    department: "Ciência da Computação",
    description: "Fundamentos de redes de computadores, protocolos de comunicação e arquiteturas de rede.",
    syllabus:
      "1. Modelo OSI e TCP/IP\n2. Camada de Aplicação\n3. Camada de Transporte\n4. Camada de Rede\n5. Roteamento e Switching\n6. Segurança em Redes",
    prerequisites: [],
  },
  {
    id: 3,
    code: "IA001-T01",
    subjectName: "Inteligência Artificial",
    professor: "Prof. Lucas Mendes",
    schedule: "Sex 14:00-18:00",
    days: "Sexta",
    time: "14:00 - 18:00",
    room: "Lab 401",
    building: "Bloco C",
    vacancies: 20,
    enrolled: 15,
    credits: 6,
    department: "Ciência da Computação",
    description:
      "Introdução aos conceitos e técnicas de inteligência artificial, incluindo algoritmos de busca, aprendizado de máquina e redes neurais.",
    syllabus:
      "1. Algoritmos de Busca\n2. Aprendizado de Máquina\n3. Redes Neurais\n4. Processamento de Linguagem Natural\n5. Visão Computacional\n6. Sistemas Especialistas",
    prerequisites: ["Algoritmos e Estruturas de Dados", "Banco de Dados"],
  },
  {
    id: 4,
    code: "MAT001-T01",
    subjectName: "Cálculo I",
    professor: "Prof. Ana Matemática",
    schedule: "Seg/Qua/Sex 08:00-10:00",
    days: "Segunda, Quarta e Sexta",
    time: "08:00 - 10:00",
    room: "Auditório A",
    building: "Bloco D",
    vacancies: 40,
    enrolled: 35,
    credits: 6,
    department: "Matemática",
    description: "Fundamentos do cálculo diferencial e integral de funções de uma variável.",
    syllabus:
      "1. Limites e Continuidade\n2. Derivadas\n3. Aplicações de Derivadas\n4. Integrais\n5. Técnicas de Integração\n6. Aplicações de Integrais",
    prerequisites: [],
  },
  {
    id: 5,
    code: "BD001-T02",
    subjectName: "Banco de Dados",
    professor: "Prof. Carlos Santos",
    schedule: "Ter/Qui 10:00-12:00",
    days: "Terça e Quinta",
    time: "10:00 - 12:00",
    room: "Lab 102",
    building: "Bloco A",
    vacancies: 28,
    enrolled: 20,
    credits: 4,
    department: "Ciência da Computação",
    description: "Conceitos fundamentais de sistemas de banco de dados, modelagem e linguagem SQL.",
    syllabus:
      "1. Modelo Entidade-Relacionamento\n2. Modelo Relacional\n3. SQL Básico\n4. SQL Avançado\n5. Normalização\n6. Transações e Concorrência",
    prerequisites: [],
  },
]

export function EnrollmentPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClasses, setSelectedClasses] = useState<typeof availableClasses>([])
  const [selectedClassForDetails, setSelectedClassForDetails] = useState<(typeof availableClasses)[0] | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  const filteredClasses = availableClasses.filter((classItem) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      classItem.subjectName.toLowerCase().includes(searchLower) ||
      classItem.code.toLowerCase().includes(searchLower) ||
      classItem.professor.toLowerCase().includes(searchLower)
    )
  })

  const handleViewDetails = (classItem: (typeof availableClasses)[0]) => {
    setSelectedClassForDetails(classItem)
    setShowDetailsModal(true)
  }

  const handleAddClass = (classItem: (typeof availableClasses)[0]) => {
    if (!selectedClasses.find((c) => c.id === classItem.id)) {
      setSelectedClasses([...selectedClasses, classItem])
    }
  }

  const handleRemoveClass = (classId: number) => {
    setSelectedClasses(selectedClasses.filter((c) => c.id !== classId))
  }

  const handleConfirmEnrollment = () => {
    console.log("[v0] Confirmando matrícula nas turmas:", selectedClasses)
    alert(`Matrícula confirmada em ${selectedClasses.length} turma(s)!`)
    setSelectedClasses([])
  }

  const totalCredits = selectedClasses.reduce((sum, c) => sum + c.credits, 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/student">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Nova Matrícula</h1>
              <p className="text-sm text-muted-foreground">Selecione as turmas para o próximo semestre</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Lista de Turmas */}
          <div className="lg:col-span-2 space-y-6">
            {/* Barra de Pesquisa */}
            <Card>
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome da disciplina, código da turma ou professor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Lista de Resultados */}
            <div className="space-y-4">
              {filteredClasses.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">Nenhuma turma encontrada com os critérios de busca.</p>
                  </CardContent>
                </Card>
              ) : (
                filteredClasses.map((classItem) => {
                  const availableVacancies = classItem.vacancies - classItem.enrolled
                  const isSelected = selectedClasses.find((c) => c.id === classItem.id)

                  return (
                    <Card
                      key={classItem.id}
                      className={`transition-all hover:shadow-md ${isSelected ? "ring-2 ring-primary" : ""}`}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="font-mono text-xs">
                                {classItem.code}
                              </Badge>
                              <Badge variant={availableVacancies > 5 ? "default" : "destructive"}>
                                {availableVacancies} vagas
                              </Badge>
                            </div>
                            <CardTitle className="text-lg mb-1">{classItem.subjectName}</CardTitle>
                            <CardDescription>{classItem.professor}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{classItem.schedule}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {classItem.room} - {classItem.building}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {classItem.enrolled}/{classItem.vacancies} matriculados
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => handleViewDetails(classItem)} className="flex-1">
                            Ver Detalhes
                          </Button>
                          {isSelected ? (
                            <Button
                              variant="secondary"
                              onClick={() => handleRemoveClass(classItem.id)}
                              className="flex-1"
                            >
                              Remover
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleAddClass(classItem)}
                              disabled={availableVacancies === 0}
                              className="flex-1"
                            >
                              Adicionar à Matrícula
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </div>

          {/* Sidebar - Turmas Selecionadas */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card>
                <CardHeader>
                  <CardTitle>Turmas Selecionadas</CardTitle>
                  <CardDescription>
                    {selectedClasses.length} turma(s) • {totalCredits} créditos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedClasses.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      Nenhuma turma selecionada ainda. Adicione turmas da lista ao lado.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedClasses.map((classItem) => (
                        <div key={classItem.id} className="p-3 bg-muted rounded-lg">
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <div className="flex-1">
                              <p className="font-medium text-sm leading-tight">{classItem.subjectName}</p>
                              <p className="text-xs text-muted-foreground mt-1">{classItem.code}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 -mt-1"
                              onClick={() => handleRemoveClass(classItem.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{classItem.schedule}</span>
                          </div>
                          <div className="mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {classItem.credits} créditos
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total de créditos:</span>
                      <span className="font-semibold">{totalCredits}</span>
                    </div>
                    <Button
                      onClick={handleConfirmEnrollment}
                      disabled={selectedClasses.length === 0}
                      className="w-full"
                      size="lg"
                    >
                      Confirmar Matrículas neste Semestre
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <ClassDetailsModal
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        classData={selectedClassForDetails}
        onAddClass={handleAddClass}
        isAlreadySelected={
          selectedClassForDetails ? !!selectedClasses.find((c) => c.id === selectedClassForDetails.id) : false
        }
      />
    </div>
  )
}
