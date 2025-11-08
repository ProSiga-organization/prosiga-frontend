import { RegisterForm } from "@/components/auth/register-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">PróSiga</h1>
          <p className="text-slate-600">Sistema Acadêmico</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-slate-900">Criar Conta</CardTitle>
            <CardDescription className="text-slate-600">Preencha os dados para se cadastrar</CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
            <div className="text-center mt-4">
              <Link href="/" className="text-sm text-slate-600 hover:text-slate-700">
                Já tem conta? <span className="text-blue-600">Faça login</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
