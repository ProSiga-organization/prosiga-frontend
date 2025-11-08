"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Upload, Download, FileText, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function UsersPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{
    success: number
    errors: number
    total: number
  } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setUploadResult(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    // Simular upload
    setTimeout(() => {
      setUploadResult({
        success: 45,
        errors: 2,
        total: 47,
      })
      setUploading(false)
      setFile(null)
    }, 2000)
  }

  const handleDownloadTemplate = () => {
    // Simular download do template CSV
    alert("Baixando template CSV...")
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
                    Colunas obrigatórias: <code className="bg-slate-100 px-1 rounded">nome</code>,{" "}
                    <code className="bg-slate-100 px-1 rounded">email</code>,{" "}
                    <code className="bg-slate-100 px-1 rounded">tipo</code> (aluno, professor ou admin),{" "}
                    <code className="bg-slate-100 px-1 rounded">matricula</code>
                  </li>
                  <li>Para alunos, adicione também: curso, semestre</li>
                  <li>Para professores, adicione também: departamento</li>
                  <li>A senha inicial será gerada automaticamente e enviada por email</li>
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Resultado do Upload
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-600">Total de Registros</p>
                    <p className="text-2xl font-bold text-slate-900">{uploadResult.total}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600">Cadastrados com Sucesso</p>
                    <p className="text-2xl font-bold text-green-600">{uploadResult.success}</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-600">Erros</p>
                    <p className="text-2xl font-bold text-red-600">{uploadResult.errors}</p>
                  </div>
                </div>

                {uploadResult.errors > 0 && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-900">Alguns registros não foram processados</p>
                        <p className="text-sm text-red-700 mt-1">
                          Verifique se todos os campos obrigatórios estão preenchidos corretamente e se não há emails
                          duplicados.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
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
                  {`nome,email,tipo,matricula,curso,semestre,departamento
João Silva,joao@email.com,aluno,2024001,Engenharia de Software,3,
Maria Santos,maria@email.com,professor,PROF001,,,Ciência da Computação
Carlos Lima,carlos@email.com,aluno,2024002,Sistemas de Informação,1,
Ana Costa,ana@email.com,professor,PROF002,,,Matemática`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
