"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Upload, Download, FileText, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

interface UploadResult {
  message: string
  success: boolean
  errors?: string[]
}

export default function UsersPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setUploadResult(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setUploadResult(null)

    const authToken = localStorage.getItem("authToken")
    if (!authToken) {
      setUploadResult({
        message: "Erro de autenticação. Por favor, faça login novamente.",
        success: false,
      })
      setUploading(false)
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BACKEND_URL
    try {
      const response = await fetch(`${apiBaseUrl}/usuarios/upload-csv`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        // Status 201 (Created)
        setUploadResult({
          message: data.message || "Usuários cadastrados com sucesso!",
          success: true,
        })
      } else if (response.status === 207) {
        // Status 207 (Multi-Status) - Sucesso parcial com erros
        setUploadResult({
          message: data.detail || "Upload processado com erros.",
          success: false, // Marcamos como 'false' para mostrar a caixa de alerta
          errors: [data.detail], // O backend já formata a string de erros
        })
      } else {
        // Outros erros (400, 403, 404...)
        throw new Error(data.detail || "Falha ao processar o arquivo.")
      }
    } catch (err: any) {
      setUploadResult({
        message: err.message || "Erro de conexão. Tente novamente.",
        success: false,
      })
    } finally {
      setUploading(false)
      setFile(null)
    }
  }

  const handleDownloadTemplate = () => {
    const templateContent = "cpf,nome,matricula,tipo_usuario,codigo_curso\n" +
                            "11122233301,Bruno Alves,20250002,aluno,CC\n" +
                            "22233344402,Carla Dias,20250003,aluno,ES\n" +
                            "33344455503,Daniel Faria,,professor,\n" +
                            "44455566604,Fernanda Lima,,coordenador,"
    
    const blob = new Blob([templateContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "template_usuarios.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader
        title="Cadastro de Usuários"
        userName="Admin Sistema"
        userInfo="ADMIN001 - Administração Acadêmica"
      />

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Cadastro em Lote</h2>
            <p className="text-slate-600 mt-1">Faça upload de um arquivo CSV com os dados dos novos usuários</p>
          </div>
          <Link href="/dashboard/admin">
            <Button variant="outline">Voltar ao Dashboard</Button>
          </Link>
        </div>

        <div className="grid gap-6">
          {/* Instruções */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Como funciona o cadastro em lote
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Formato do arquivo CSV:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                  <li>O arquivo deve estar no formato CSV (separado por vírgulas)</li>
                  <li>
                    Colunas obrigatórias: <code className="bg-slate-100 px-1 rounded">cpf</code>,{" "}
                    <code className="bg-slate-100 px-1 rounded">nome</code>,{" "}
                    <code className="bg-slate-100 px-1 rounded">tipo_usuario</code> (aluno, professor ou coordenador)
                  </li>
                  <li>
                    Para <code className="bg-slate-100 px-1 rounded">aluno</code>: <code className="bg-slate-100 px-1 rounded">matricula</code> e <code className="bg-slate-100 px-1 rounded">codigo_curso</code> são obrigatórios.
                  </li>
                  <li>A senha será definida pelo usuário no primeiro acesso.</li>
                </ul>
              </div>

              <div>
                <Button onClick={handleDownloadTemplate} variant="outline" className="bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Template CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Upload do Arquivo</CardTitle>
              <CardDescription>Selecione o arquivo CSV com os dados dos usuários</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-sm text-slate-600">
                    {file ? (
                      <span className="font-medium text-slate-900">{file.name}</span>
                    ) : (
                      "Arraste um arquivo CSV ou clique para selecionar"
                    )}
                  </p>
                  <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" id="csv-upload" />
                  <label htmlFor="csv-upload">
                    <Button variant="outline" className="bg-transparent" asChild>
                      <span>Selecionar Arquivo</span>
                    </Button>
                  </label>
                </div>
              </div>

              {file && (
                <div className="flex gap-2">
                  <Button onClick={handleUpload} disabled={uploading} className="bg-blue-600 hover:bg-blue-700">
                    {uploading ? "Processando..." : "Fazer Upload"}
                  </Button>
                  <Button
                    onClick={() => {
                      setFile(null)
                      setUploadResult(null)
                    }}
                    variant="outline"
                    disabled={uploading}
                  >
                    Cancelar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resultado */}
          {uploadResult && (
            <Card className={uploadResult.success ? "border-green-600 bg-green-50" : "border-red-600 bg-red-50"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {uploadResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  Resultado do Upload
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={uploadResult.success ? "text-green-800" : "text-red-800"}>
                  <p className="font-medium">{uploadResult.message}</p>
                  {uploadResult.errors && (
                    <ul className="list-disc list-inside mt-2 text-sm">
                      {uploadResult.errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Exemplo de CSV */}
          <Card>
            <CardHeader>
              <CardTitle>Exemplo de Arquivo CSV</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">
                  {`cpf,nome,matricula,tipo_usuario,codigo_curso
11122233301,Bruno Alves,20250002,aluno,CC
22233344402,Carla Dias,20250003,aluno,ES
33344455503,Daniel Faria,,professor,
44455566604,Fernanda Lima,,coordenador,`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}