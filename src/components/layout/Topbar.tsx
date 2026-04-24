'use client'

import { Search, Bell, Settings, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'

export default function Topbar() {
  return (
    <div className="h-16 border-b border-stone-200 bg-white flex items-center justify-between px-6">
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <Input 
          className="pl-9 bg-stone-100 border-none h-10 w-full focus-visible:ring-1 focus-visible:ring-stone-300 rounded-full" 
          placeholder="Tìm kiếm lead..." 
        />
      </div>

      <div className="flex items-center gap-4">
        <Button render={<Link href="/leads?action=new" />} className="bg-[#c66540] hover:bg-[#a55232] text-white rounded-lg h-10 px-4">
          <Plus className="w-4 h-4 mr-2" />
          Thêm Lead
        </Button>
        
        <div className="flex items-center gap-2 border-l border-stone-200 pl-4">
          <Button variant="ghost" size="icon" className="text-stone-500 rounded-full w-10 h-10">
            <Bell className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-stone-500 rounded-full w-10 h-10">
            <Settings className="w-5 h-5" />
          </Button>
          <Avatar className="w-9 h-9 border border-stone-200 bg-stone-100 font-medium text-stone-600">
            <AvatarFallback>PH</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  )
}
