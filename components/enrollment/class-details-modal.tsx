"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, MapPin, Users, BookOpen, GraduationCap, AlertCircle } from "lucide-react"

interface ClassDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  classData: {
    id: number
    code: string
    subjectName: string
    professor: string
    schedule: string
    days: string
    time: string
    room: string
    building: string
    vacancies: number
    enrolled: number
    credits: number
    department: string
    description: string
    syllabus: string
    prerequisites: string[]
  } | null
  onAddClass: (classData: any) => void
  isAlreadySelected: boolean
}

export function ClassDetailsModal({
  open,
  onOpenChange,
  classData,
  onAddClass,
  isAlreadySelected,
}: ClassDetailsModalProps) {
  if (!classData) return null

  const availableVacancies = classData.vacancies - classData.enrolled

  const handleAddClass = () => {
    onAddClass(classData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="font-mono">
              {classData.code}
            </Badge>
            <Badge variant={availableVacancies > 5 ? "default" : "destructive"}>{availableVacancies} vagas</Badge>
          </div>
          <DialogTitle className="text-2xl">{classData.subjectName}</DialogTitle>
          <DialogDescription>{classData.department}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Professor</p>
                  <p className="text-sm text-muted-foreground">{classData.professor}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Horário</p>
                  <p className="text-sm text-muted-foreground">{classData.days}</p>
                  <p className="text-sm text-muted-foreground">{classData.time}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Local</p>
                  <p className="text-sm text-muted-foreground">{classData.room}</p>
                  <p className="text-sm text-muted-foreground">{classData.building}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Vagas</p>
                  <p className="text-sm text-muted-foreground">
                    {classData.enrolled} matriculados de {classData.vacancies} vagas
                  </p>
                  <p className="text-sm text-muted-foreground">{availableVacancies} vagas disponíveis</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Descrição */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold">Descrição da Disciplina</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{classData.description}</p>
          </div>

          <Separator />

          {/* Ementa */}
          <div>
            <h3 className="font-semibold mb-2">Ementa</h3>
            <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed bg-muted p-4 rounded-lg">
              {classData.syllabus}
            </div>
          </div>

          {/* Pré-requisitos */}
          {classData.prerequisites.length > 0 && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold">Pré-requisitos</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {classData.prerequisites.map((prereq, index) => (
                    <Badge key={index} variant="secondary">
                      {prereq}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Informações Adicionais */}
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Créditos</p>
                <p className="text-2xl font-bold">{classData.credits}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Carga Horária</p>
                <p className="text-2xl font-bold">{classData.credits * 15}h</p>
              </div>
            </div>
          </div>

          {/* Botão de Ação */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Fechar
            </Button>
            {isAlreadySelected ? (
              <Button variant="secondary" className="flex-1" disabled>
                Já Adicionada
              </Button>
            ) : (
              <Button onClick={handleAddClass} disabled={availableVacancies === 0} className="flex-1">
                {availableVacancies === 0 ? "Sem Vagas" : "Adicionar à Matrícula"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
