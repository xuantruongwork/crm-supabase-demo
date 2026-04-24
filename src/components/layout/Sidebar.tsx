'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Calendar, BarChart3, HelpCircle, LogOut } from 'lucide-react'
import { signout } from '@/app/login/actions'

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Leads', href: '/leads', icon: Users },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 h-full bg-[#f4f0e9] border-r border-[#e6e2db] flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#c66540] rounded-lg flex items-center justify-center text-white font-bold">
            <span className="text-xl leading-none -mt-1">*</span>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight text-stone-800">CRM Pro</h1>
            <p className="text-[10px] text-stone-500 font-semibold tracking-wider uppercase">Sales Intelligence</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-6">
        <div className="text-xs font-semibold text-stone-400 mb-4 px-2 tracking-wider">MENU</div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-[#e8dfd5] text-[#c66540]' 
                    : 'text-stone-600 hover:bg-[#ebe6df] hover:text-stone-900'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#c66540]" />}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-[#e6e2db] space-y-1">
        <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-600 hover:bg-[#ebe6df] hover:text-stone-900 transition-colors">
          <HelpCircle className="w-5 h-5" />
          Help
        </button>
        <button 
          onClick={() => signout()}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-600 hover:bg-[#ebe6df] hover:text-stone-900 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Đăng xuất
        </button>
      </div>
    </div>
  )
}
