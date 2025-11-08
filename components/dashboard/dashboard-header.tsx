import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"

interface DashboardHeaderProps {
  title: string
  userName: string
  userInfo: string
}

export function DashboardHeader({ title, userName, userInfo }: DashboardHeaderProps) {
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-slate-900">PróSiga</h1>
            <div className="hidden md:block w-px h-6 bg-slate-300" />
            <div className="hidden md:block">
              <h2 className="text-lg font-medium text-slate-700">{title}</h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="font-medium text-slate-900">{userName}</p>
              <p className="text-sm text-slate-600">{userInfo}</p>
            </div>
            <Avatar>
              <AvatarFallback className="bg-blue-600 text-white">{initials}</AvatarFallback>
            </Avatar>
            <Button variant="outline" asChild>
              <Link href="/">Sair</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
