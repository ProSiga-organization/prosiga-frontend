"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null) // Para feedback de erro
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const authApiUrl = process.env.NEXT_PUBLIC_API_AUTH_URL

    try {
      // A API de login (prosiga-login/app/login/router.py) espera 
      // dados de formulário (Form()).
      const formData = new URLSearchParams()
      formData.append("username", email)
      formData.append("password", password)

      // 1. Chamar a API de login
      const loginResponse = await fetch(`${authApiUrl}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      })

      if (!loginResponse.ok) {
        throw new Error("Email ou senha incorretos, ou usuário não ativo.")
      }

      const tokenData = await loginResponse.json()
      const accessToken = tokenData.access_token

      // Salva o token no localStorage para ser usado em outras páginas
      localStorage.setItem("authToken", accessToken)

      // 2. Com o token, chamar a API /me do *mesmo* serviço de login
      const meResponse = await fetch(`${authApiUrl}/login/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!meResponse.ok) {
        throw new Error("Não foi possível obter os dados do usuário.")
      }

      const userData = await meResponse.json()
      
      // 3. Redirecionar com base no 'tipo_usuario' retornado pela API
      const userType = userData.tipo_usuario
      if (userType === "aluno") {
        router.push("/dashboard/student")
      } else if (userType === "professor") {
        router.push("/dashboard/teacher")
      } else if (userType === "coordenador") {
        router.push("/dashboard/admin")
      } else {
        throw new Error("Tipo de usuário desconhecido recebido da API.")
      }
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro. Tente novamente.")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-red-600 text-sm p-3 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}
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

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
        {isLoading ? "Entrando..." : "Entrar"}
      </Button>

      <div className="text-center pt-4">
        <Link href="/auth/register" className="text-sm text-slate-600 hover:text-slate-700 block">
          Não tem conta? <span className="text-blue-600">Realizar primeiro acesso</span>
        </Link>
      </div>
    </form>
  )
}