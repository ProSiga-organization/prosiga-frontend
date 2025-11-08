"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulação de login - redireciona baseado no tipo de usuário
    setTimeout(() => {
      if (userType === "student") {
        router.push("/dashboard/student")
      } else if (userType === "teacher") {
        router.push("/dashboard/teacher")
      } else if (userType === "admin") {
        router.push("/dashboard/admin")
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-700">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border-slate-200 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="userType" className="text-slate-700">
          Tipo de Usuário
        </Label>
        <Select value={userType} onValueChange={setUserType} required>
          <SelectTrigger className="border-slate-200 focus:border-blue-500">
            <SelectValue placeholder="Selecione seu tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">Aluno</SelectItem>
            <SelectItem value="teacher">Professor</SelectItem>
            <SelectItem value="admin">Administrador</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
        {isLoading ? "Entrando..." : "Entrar"}
      </Button>

      <div className="text-center space-y-2 pt-4">
        <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 block">
          Esqueceu sua senha?
        </Link>
        <Link href="/auth/register" className="text-sm text-slate-600 hover:text-slate-700 block">
          Não tem conta? <span className="text-blue-600">Realizar primeiro acesso</span>
        </Link>
      </div>
    </form>
  )
}
