"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface Student {
  id: number
  name: string
  registration: string
  grades: Record<string, number>
}

interface ClassInfo {
  id: number
  name: string
  code: string
  semester: string
  schedule: string
  room: string
}

interface ClassReportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  classInfo: ClassInfo
  students: Student[]
  gradeColumns: string[]
}

export function ClassReportModal({ open, onOpenChange, classInfo, students, gradeColumns }: ClassReportModalProps) {
  const handleDownloadPDF = () => {
    // Simula download do PDF
    alert("Gerando diário de classe em PDF...")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Visualização do Diário de Classe</DialogTitle>
          <DialogDescription>Confira os dados antes de fazer o download do PDF</DialogDescription>
        </DialogHeader>

        {/* Preview do diário */}
        <div className="bg-white border rounded-lg p-6 space-y-6">
          {/* Cabeçalho */}
          <div className="text-center border-b pb-4">
            <h2 className="text-2xl font-bold text-slate-900">Diário de Classe</h2>
            <p className="text-slate-600 mt-2">Sistema Acadêmico PróSiga</p>
          </div>

          {/* Informações da disciplina */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600">Disciplina</p>
              <p className="font-medium text-slate-900">{classInfo.name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Código</p>
              <p className="font-medium text-slate-900">{classInfo.code}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Semestre</p>
              <p className="font-medium text-slate-900">{classInfo.semester}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Horário</p>
              <p className="font-medium text-slate-900">{classInfo.schedule}</p>
            </div>
          </div>

          {/* Tabela de alunos */}
          <div>
            <h3 className="font-medium text-slate-900 mb-3">Lista de Alunos e Notas</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium text-slate-600">Matrícula</th>
                    <th className="text-left py-2 font-medium text-slate-600">Nome</th>
                    {gradeColumns.map((column) => (
                      <th key={column} className="text-center py-2 font-medium text-slate-600">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b">
                      <td className="py-2 text-slate-900">{student.registration}</td>
                      <td className="py-2 text-slate-900">{student.name}</td>
                      {gradeColumns.map((column) => (
                        <td key={column} className="text-center py-2 text-slate-900">
                          {student.grades[column] !== undefined ? student.grades[column].toFixed(1) : "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="text-center">
              <p className="text-sm text-slate-600">Total de Alunos</p>
              <p className="text-2xl font-bold text-slate-900">{students.length}</p>
            </div>
          </div>
        </div>

        {/* Botão de download */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleDownloadPDF} className="bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Baixar PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
