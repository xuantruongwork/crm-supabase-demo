'use client'

import { useState } from 'react'
import { Plus, Search, MoreHorizontal, Trash2, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createLead, deleteLead } from './actions'
import { useSearchParams, useRouter } from 'next/navigation'

export type Lead = {
  id: string
  full_name: string
  phone: string | null
  email: string | null
  company: string | null
  title: string | null
  status: string
  source: string | null
  created_at: string
}

const statusColors: Record<string, string> = {
  'Mới': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  'Đang tư vấn': 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  'Đã mua': 'bg-green-100 text-green-800 hover:bg-green-100',
  'Từ chối': 'bg-stone-200 text-stone-800 hover:bg-stone-200',
}

export default function LeadsClient({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultOpen = searchParams.get('action') === 'new'
  
  if (defaultOpen && !isAddOpen) {
    setIsAddOpen(true)
    router.replace('/leads')
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (lead.email && lead.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (lead.phone && lead.phone.includes(searchQuery))
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

  async function handleAddLead(formData: FormData) {
    setIsSubmitting(true)
    const result = await createLead(formData)
    setIsSubmitting(false)
    
    if (result?.error) {
      alert(result.error)
    } else {
      setIsAddOpen(false)
      if (result.data) {
        setLeads([result.data[0] as Lead, ...leads])
      }
    }
  }

  async function handleDelete(id: string) {
    if (confirm('Bạn có chắc chắn muốn xoá khách hàng này?')) {
      const result = await deleteLead(id)
      if (result?.error) {
        alert(result.error)
      } else {
        setLeads(leads.filter(l => l.id !== id))
      }
    }
  }

  function getInitials(name: string) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-stone-200">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-800 font-serif">Leads</h1>
        
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <Input 
              className="pl-9 bg-stone-50 border-stone-200" 
              placeholder="Tìm tên, SĐT, email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || 'all')}>
            <SelectTrigger className="w-[180px] bg-stone-50 border-stone-200">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="Mới">Mới</SelectItem>
              <SelectItem value="Đang tư vấn">Đang tư vấn</SelectItem>
              <SelectItem value="Đã mua">Đã mua</SelectItem>
              <SelectItem value="Từ chối">Từ chối</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger render={<Button className="bg-[#c66540] hover:bg-[#a55232] text-white" />}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm Lead
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Thêm Lead mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin chi tiết của khách hàng tiềm năng.
                </DialogDescription>
              </DialogHeader>
              <form action={handleAddLead}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="full_name">Tên khách hàng *</Label>
                    <Input id="full_name" name="full_name" required placeholder="Ví dụ: Nguyễn Văn A" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Số điện thoại</Label>
                      <Input id="phone" name="phone" placeholder="09..." />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" placeholder="@gmail.com" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="status">Trạng thái</Label>
                      <Select name="status" defaultValue="Mới">
                        <SelectTrigger>
                          <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mới">Mới</SelectItem>
                          <SelectItem value="Đang tư vấn">Đang tư vấn</SelectItem>
                          <SelectItem value="Đã mua">Đã mua</SelectItem>
                          <SelectItem value="Từ chối">Từ chối</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="source">Nguồn</Label>
                      <Select name="source" defaultValue="Khác">
                        <SelectTrigger>
                          <SelectValue placeholder="Nguồn" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Facebook Ads">Facebook Ads</SelectItem>
                          <SelectItem value="Google Search">Google Search</SelectItem>
                          <SelectItem value="Referral">Referral</SelectItem>
                          <SelectItem value="Khác">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="company">Công ty</Label>
                    <Input id="company" name="company" placeholder="Công ty XYZ" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="title">Chức vụ</Label>
                    <Input id="title" name="title" placeholder="Giám đốc, Quản lý..." />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting} className="bg-[#c66540] hover:bg-[#a55232]">
                    {isSubmitting ? 'Đang lưu...' : 'Lưu Lead'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="border border-stone-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-stone-50">
            <TableRow>
              <TableHead className="w-[300px] text-xs font-bold text-stone-500 uppercase tracking-wider">Tên khách hàng</TableHead>
              <TableHead className="text-xs font-bold text-stone-500 uppercase tracking-wider">Số điện thoại</TableHead>
              <TableHead className="text-xs font-bold text-stone-500 uppercase tracking-wider">Email</TableHead>
              <TableHead className="text-xs font-bold text-stone-500 uppercase tracking-wider">Trạng thái</TableHead>
              <TableHead className="text-xs font-bold text-stone-500 uppercase tracking-wider">Nguồn</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-stone-500">
                  Không tìm thấy dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              filteredLeads.map((lead) => (
                <TableRow 
                  key={lead.id} 
                  className="hover:bg-stone-50/50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/leads/${lead.id}`)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 bg-orange-100 text-[#c66540]">
                        <AvatarFallback className="bg-orange-100 text-[#c66540] font-semibold">
                          {getInitials(lead.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-semibold text-stone-800">{lead.full_name}</div>
                        {(lead.title || lead.company) && (
                          <div className="text-xs text-stone-500">
                            {lead.title} {lead.title && lead.company && '@ '} {lead.company}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-stone-600">{lead.phone || '—'}</TableCell>
                  <TableCell className="text-stone-600">{lead.email || '—'}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`font-normal rounded-full ${statusColors[lead.status] || 'bg-stone-100 text-stone-800'}`}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-stone-600 text-sm">{lead.source || 'Khác'}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={
                        <Button variant="ghost" className="h-8 w-8 p-0 text-stone-400 hover:text-stone-600">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      }>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => router.push(`/leads/${lead.id}`)}>
                          <Edit className="w-4 h-4 mr-2" /> Xem / Sửa chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(lead.id)}>
                          <Trash2 className="w-4 h-4 mr-2" /> Xoá
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
