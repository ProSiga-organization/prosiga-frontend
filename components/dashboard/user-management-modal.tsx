"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UserManagementModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserManagementModal({ open, onOpenChange }: UserManagementModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    userType: "",
    registration: "",
    department: "",
    course: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Criando usuário:", formData)
    setFormData({
      name: "",
      email: "",
      userType: "",
      registration: "",
      department: "",
      course: "",
    })
    onOpenChange(false)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo Usuário</DialogTitle>
          <DialogDescription>Cadastre um novo usuário no sistema</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                placeholder="Nome completo"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="userType">Tipo de Usuário</Label>
              <Select value={formData.userType} onValueChange={(value) => handleChange("userType", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Aluno</SelectItem>
                  <SelectItem value="teacher">Professor</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="registration">{formData.userType === "student" ? "Matrícula" : "Registro"}</Label>
              <Input
                id="registration"
                placeholder={formData.userType === "student" ? "Número da matrícula" : "Número do registro"}
                value={formData.registration}
                onChange={(e) => handleChange("registration", e.target.value)}
                required
              />
            </div>
          </div>

          {formData.userType === "teacher" && (
            <div className="space-y-2">
              <Label htmlFor="department">Departamento</Label>
              <Select value={formData.department} onValueChange={(value) => handleChange("department", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="computer-science">Ciência da Computação</SelectItem>
                  <SelectItem value="mathematics">Matemática</SelectItem>
                  <SelectItem value="physics">Física</SelectItem>
                  <SelectItem value="engineering">Engenharia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {formData.userType === "student" && (
            <div className="space-y-2">
              <Label htmlFor="course">Curso</Label>
              <Select value={formData.course} onValueChange={(value) => handleChange("course", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o curso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="software-engineering">Engenharia de Software</SelectItem>
                  <SelectItem value="computer-science">Ciência da Computação</SelectItem>
                  <SelectItem value="information-systems">Sistemas de Informação</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Criar Usuário
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
