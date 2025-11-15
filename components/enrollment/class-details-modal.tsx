"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, MapPin, Users, BookOpen, AlertCircle } from "lucide-react"

interface TurmaBuscaData {
  id_turma: number
  codigo_turma: string
  vagas_disponiveis: number
  horario: string | null
  local: string | null
  codigo_disciplina: string
  nome_disciplina: string
  descricao: string | null
  semestre_ideal: number | null
  status_aluno: "A_FAZER" | "CURSANDO" | "JA_CONCLUIDO" | "TRANCADO"
}

interface ClassDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  classData: TurmaBuscaData | null
  onAddClass: (classData: TurmaBuscaData) => void // Agora os tipos são compatíveis
  isAlreadySelected: boolean
}

export function ClassDetailsModal({
  open,
  onOpenChange,
  classData,
  onAddClass, // O erro vermelho deve desaparecer
  isAlreadySelected,
}: ClassDetailsModalProps) {
  if (!classData) return null

  const handleAddClass = () => {
    onAddClass(classData)
    onOpenChange(false)
  }
  
  // A lógica para pré-requisitos pode ser mais simples
  const hasPrerequisites = classData.semestre_ideal !== null && classData.semestre_ideal > 1

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="font-mono">
              {classData.codigo_turma}
            </Badge>
            <Badge variant={classData.vagas_disponiveis > 5 ? "default" : "destructive"}>
              {classData.vagas_disponiveis} vagas
            </Badge>
          </div>
          <DialogTitle className="text-2xl">{classData.nome_disciplina}</DialogTitle>
          <DialogDescription>{classData.codigo_disciplina}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Horário</p>
                  <p className="text-sm text-muted-foreground">{classData.horario || "A definir"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Semestre Ideal</p>
                  <p className="text-sm text-muted-foreground">
                    {classData.semestre_ideal ? `${classData.semestre_ideal}º Semestre` : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Local</p>
                  <p className="text-sm text-muted-foreground">{classData.local || "A definir"}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Descrição */}
          {classData.descricao && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold">Descrição da Disciplina</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{classData.descricao}</p>
            </div>
          )}
          
          {/* Status do Aluno e Pré-requisitos */}
          {(classData.status_aluno !== "A_FAZER" || hasPrerequisites) && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold">Observações</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {classData.status_aluno === "JA_CONCLUIDO" && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Disciplina já concluída
                    </Badge>
                  )}
                   {classData.status_aluno === "CURSANDO" && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Você já está cursando esta disciplina
                    </Badge>
                  )}
                   {classData.status_aluno === "TRANCADO" && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      Disciplina trancada anteriormente
                    </Badge>
                  )}
                   {hasPrerequisites && classData.status_aluno === "A_FAZER" && (
                    <Badge variant="destructive">
                      Atenção: Quebra de pré-requisito (requer matrícula excepcional)
                    </Badge>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Botão de Ação */}
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Fechar
            </Button>
            {isAlreadySelected ? (
              <Button variant="secondary" className="flex-1" disabled>
                Já Adicionada
              </Button>
            ) : (
              <Button 
                onClick={handleAddClass} 
                disabled={classData.vagas_disponiveis === 0 || classData.status_aluno !== "A_FAZER"} 
                className="flex-1"
              >
                {classData.vagas_disponiveis === 0 ? "Sem Vagas" : 
                 classData.status_aluno !== "A_FAZER" ? "Indisponível" : "Adicionar à Matrícula"
                }
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}