"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

export function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "",
    registration: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulação de cadastro
    setTimeout(() => {
      router.push("/")
      setIsLoading(false)
    }, 1000)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-slate-700">
          Nome Completo
        </Label>
        <Input
          id="name"
          placeholder="Seu nome completo"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
          className="border-slate-200 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-700">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          required
          className="border-slate-200 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="userType" className="text-slate-700">
          Tipo de Usuário
        </Label>
        <Select value={formData.userType} onValueChange={(value) => handleChange("userType", value)} required>
          <SelectTrigger className="border-slate-200 focus:border-blue-500">
            <SelectValue placeholder="Selecione seu tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">Aluno</SelectItem>
            <SelectItem value="teacher">Professor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="registration" className="text-slate-700">
          {formData.userType === "student" ? "Matrícula" : "Registro"}
        </Label>
        <Input
          id="registration"
          placeholder={formData.userType === "student" ? "Número da matrícula" : "Número do registro"}
          value={formData.registration}
          onChange={(e) => handleChange("registration", e.target.value)}
          required
          className="border-slate-200 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-slate-700">
          Senha
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          required
          className="border-slate-200 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-slate-700">
          Confirmar Senha
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          required
          className="border-slate-200 focus:border-blue-500"
        />
      </div>

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
        {isLoading ? "Criando conta..." : "Criar Conta"}
      </Button>
    </form>
  )
}
