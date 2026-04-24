'use client'

import { useState } from 'react'
import { Lead } from '../LeadsClient'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Phone, Mail, Building, Briefcase, Calendar, Clock, Edit, MessageSquare, PhoneCall, Trash2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { addActivity, updateLeadStatus } from './actions'
import { updateLead, deleteLead } from '../actions'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

import { toast } from "sonner"

export type Activity = {
  id: string
  type: string
  description: string
  status: string
  created_at: string
}

const statusColors: Record<string, string> = {
  'Mới': 'bg-yellow-100 text-yellow-800',
  'Đang tư vấn': 'bg-blue-100 text-blue-800',
  'Đã mua': 'bg-green-100 text-green-800',
  'Từ chối': 'bg-stone-200 text-stone-800',
}

export default function LeadDetailClient({ lead, activities }: { lead: Lead, activities: Activity[] }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('Ghi chú')
  const [currentLead, setCurrentLead] = useState<Lead>(lead)

  function getInitials(name: string) {
    return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
  }

  async function handleStatusChange(val: string | null) {
    if (val) {
      const res = await updateLeadStatus(currentLead.id, val)
      if (res?.error) {
        toast.error(res.error)
      } else {
        setCurrentLead({ ...currentLead, status: val })
        toast.success(`Đã chuyển trạng thái thành: ${val}`)
      }
    }
  }

  async function handleEditLead(formData: FormData) {
    setIsSubmitting(true)
    const result = await updateLead(currentLead.id, formData)
    setIsSubmitting(false)
    
    if (result?.error) {
      toast.error(result.error)
    } else {
      setIsEditOpen(false)
      if (result.data) {
        setCurrentLead(result.data[0] as Lead)
        toast.success("Cập nhật khách hàng thành công!")
      }
    }
  }

  async function handleAddActivity(formData: FormData) {
    setIsSubmitting(true)
    formData.append('lead_id', lead.id)
    formData.append('type', activeTab)
    const res = await addActivity(formData)
    if (res?.error) {
      toast.error(res.error)
    } else {
      (document.getElementById('activity-form') as HTMLFormElement).reset()
      toast.success(`Đã thêm ${activeTab.toLowerCase()} mới!`)
    }
    setIsSubmitting(false)
  }

  async function handleDelete() {
    if (confirm('Bạn có chắc chắn muốn xoá khách hàng này?')) {
      setIsSubmitting(true)
      const res = await deleteLead(currentLead.id)
      setIsSubmitting(false)
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success("Đã xoá khách hàng.")
        router.push('/leads')
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-stone-500">
        <Link href="/leads" className="hover:text-stone-900 transition-colors">Leads</Link>
        <span>/</span>
        <span className="text-stone-900 font-medium">{currentLead.full_name}</span>
      </div>

      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-stone-800">Chi tiết khách hàng</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Xoá khách hàng
          </Button>
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger render={<Button variant="outline" className="border-stone-200 text-stone-600 hover:bg-stone-50" />}>
              <Edit className="w-4 h-4 mr-2" /> Chỉnh sửa thông tin
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Chỉnh sửa khách hàng</DialogTitle>
                <DialogDescription>
                  Cập nhật thông tin chi tiết của {currentLead.full_name}.
                </DialogDescription>
              </DialogHeader>
              <form action={handleEditLead}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit_full_name">Tên khách hàng *</Label>
                    <Input id="edit_full_name" name="full_name" required defaultValue={currentLead.full_name} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit_phone">Số điện thoại</Label>
                      <Input id="edit_phone" name="phone" defaultValue={currentLead.phone || ''} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit_email">Email</Label>
                      <Input id="edit_email" name="email" type="email" defaultValue={currentLead.email || ''} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit_status">Trạng thái</Label>
                      <Select name="status" defaultValue={currentLead.status}>
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
                      <Label htmlFor="edit_source">Nguồn</Label>
                      <Select name="source" defaultValue={currentLead.source || 'Khác'}>
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
                    <Label htmlFor="edit_company">Công ty</Label>
                    <Input id="edit_company" name="company" defaultValue={currentLead.company || ''} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit_title">Chức vụ</Label>
                    <Input id="edit_title" name="title" defaultValue={currentLead.title || ''} />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting} className="bg-[#c66540] hover:bg-[#a55232] text-white">
                    {isSubmitting ? 'Đang lưu...' : 'Cập nhật'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Lead Info */}
        <div className="space-y-6">
          <Card className="border-stone-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <Avatar className="h-16 w-16 bg-orange-100 text-[#c66540]">
                  <AvatarFallback className="text-xl font-bold bg-orange-100 text-[#c66540]">
                    {getInitials(currentLead.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-xl font-bold text-stone-800 font-serif">{currentLead.full_name}</h1>
                  <p className="text-sm text-stone-500 mb-2">Thêm vào lúc {new Date(currentLead.created_at).toLocaleDateString('vi-VN')}</p>
                  <Select value={currentLead.status} onValueChange={handleStatusChange}>
                    <SelectTrigger className={`w-[140px] h-8 text-xs font-semibold border-0 ${statusColors[currentLead.status] || 'bg-stone-100'}`}>
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
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-stone-600">
                  <Phone className="w-4 h-4 text-stone-400" />
                  {currentLead.phone || '—'}
                </div>
                <div className="flex items-center gap-3 text-sm text-stone-600">
                  <Mail className="w-4 h-4 text-stone-400" />
                  {currentLead.email || '—'}
                </div>
                <div className="flex items-center gap-3 text-sm text-stone-600">
                  <Building className="w-4 h-4 text-stone-400" />
                  {currentLead.company || '—'}
                </div>
                <div className="flex items-center gap-3 text-sm text-stone-600">
                  <Briefcase className="w-4 h-4 text-stone-400" />
                  {currentLead.title || '—'}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-stone-200 shadow-sm">
            <CardHeader className="p-4 border-b border-stone-100">
              <CardTitle className="text-base font-bold text-stone-800">Thông tin thêm</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">Nguồn:</span>
                <span className="font-medium text-stone-800">{currentLead.source || 'Khác'}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Timeline & Activities */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-stone-200 shadow-sm">
            <CardHeader className="p-0 border-b border-stone-100">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('Ghi chú')}
                  className={`flex-1 p-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'Ghi chú' ? 'border-[#c66540] text-[#c66540]' : 'border-transparent text-stone-500 hover:text-stone-700 hover:bg-stone-50'}`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Ghi chú
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('Cuộc gọi')}
                  className={`flex-1 p-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'Cuộc gọi' ? 'border-[#c66540] text-[#c66540]' : 'border-transparent text-stone-500 hover:text-stone-700 hover:bg-stone-50'}`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <PhoneCall className="w-4 h-4" /> Cuộc gọi
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('Cuộc hẹn')}
                  className={`flex-1 p-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'Cuộc hẹn' ? 'border-[#c66540] text-[#c66540]' : 'border-transparent text-stone-500 hover:text-stone-700 hover:bg-stone-50'}`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4" /> Cuộc hẹn
                  </div>
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <form id="activity-form" action={handleAddActivity} className="space-y-4">
                <Textarea 
                  name="description"
                  placeholder={activeTab === 'Ghi chú' ? 'Nhập nội dung ghi chú...' : activeTab === 'Cuộc gọi' ? 'Tóm tắt nội dung cuộc gọi...' : 'Chi tiết cuộc hẹn...'} 
                  className="min-h-[100px] resize-none bg-stone-50 border-stone-200 focus-visible:ring-[#c66540]"
                  required
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting} className="bg-[#c66540] hover:bg-[#a55232] text-white">
                    {isSubmitting ? 'Đang lưu...' : `Lưu ${activeTab.toLowerCase()}`}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="font-bold text-stone-800">Lịch sử hoạt động</h3>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-stone-200 before:to-transparent">
              {activities.length === 0 ? (
                <div className="text-center py-8 text-sm text-stone-500 bg-white rounded-xl border border-stone-100 shadow-sm relative z-10">
                  Chưa có hoạt động nào được ghi nhận.
                </div>
              ) : (
                activities.map((activity) => (
                  <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-stone-100 text-stone-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      {activity.type === 'Ghi chú' ? <MessageSquare className="w-4 h-4" /> :
                       activity.type === 'Cuộc gọi' ? <PhoneCall className="w-4 h-4" /> :
                       activity.type === 'Trạng thái' ? <Edit className="w-4 h-4" /> :
                       <Calendar className="w-4 h-4" />}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="outline" className="text-xs bg-stone-50 font-medium text-stone-600">
                          {activity.type}
                        </Badge>
                        <time className="text-xs text-stone-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(activity.created_at).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </time>
                      </div>
                      <div className="text-sm text-stone-700 whitespace-pre-wrap leading-relaxed mt-2">
                        {activity.description}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
