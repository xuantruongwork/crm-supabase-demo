'use client'

import { useState } from 'react'
import { Lead } from '../LeadsClient'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Phone, Mail, Building, Briefcase, Calendar, Clock, Edit, MessageSquare, PhoneCall } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { addActivity, updateLeadStatus } from './actions'
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('Ghi chú')

  function getInitials(name: string) {
    return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
  }

  async function handleStatusChange(val: string | null) {
    if (val) {
      const res = await updateLeadStatus(lead.id, val)
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success(`Đã chuyển trạng thái thành: ${val}`)
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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-stone-500">
        <Link href="/leads" className="hover:text-stone-900 transition-colors">Leads</Link>
        <span>/</span>
        <span className="text-stone-900 font-medium">{lead.full_name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Lead Info */}
        <div className="space-y-6">
          <Card className="border-stone-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <Avatar className="h-16 w-16 bg-orange-100 text-[#c66540]">
                  <AvatarFallback className="text-xl font-bold bg-orange-100 text-[#c66540]">
                    {getInitials(lead.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-xl font-bold text-stone-800 font-serif">{lead.full_name}</h1>
                  <p className="text-sm text-stone-500 mb-2">Thêm vào lúc {new Date(lead.created_at).toLocaleDateString('vi-VN')}</p>
                  <Select defaultValue={lead.status} onValueChange={handleStatusChange}>
                    <SelectTrigger className={`w-[140px] h-8 text-xs font-semibold border-0 ${statusColors[lead.status] || 'bg-stone-100'}`}>
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
                  {lead.phone || 'Chưa cập nhật'}
                </div>
                <div className="flex items-center gap-3 text-sm text-stone-600">
                  <Mail className="w-4 h-4 text-stone-400" />
                  {lead.email || 'Chưa cập nhật'}
                </div>
                <div className="flex items-center gap-3 text-sm text-stone-600">
                  <Building className="w-4 h-4 text-stone-400" />
                  {lead.company || 'Chưa cập nhật'}
                </div>
                <div className="flex items-center gap-3 text-sm text-stone-600">
                  <Briefcase className="w-4 h-4 text-stone-400" />
                  {lead.title || 'Chưa cập nhật'}
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
                <span className="font-medium text-stone-800">{lead.source || 'Khác'}</span>
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
