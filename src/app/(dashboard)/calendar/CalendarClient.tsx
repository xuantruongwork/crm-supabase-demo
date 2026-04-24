'use client'

import { useState } from 'react'
import { format, isSameDay, parseISO } from 'date-fns'
import { vi } from 'date-fns/locale'
import { 
  Calendar as CalendarIcon, 
  Clock, 
  PhoneCall, 
  MessageSquare, 
  Edit, 
  Plus, 
  MoreVertical, 
  Trash2,
  CalendarDays,
  User,
  Info
} from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from './actions'

export type CalendarActivity = {
  id: string
  type: string
  description: string
  status: string
  created_at: string
  due_date: string | null
  lead_id: string | null
  leads: { id: string; full_name: string } | null
}

interface Lead {
  id: string
  full_name: string
}

export default function CalendarClient({ 
  initialActivities, 
  leads 
}: { 
  initialActivities: CalendarActivity[],
  leads: Lead[]
}) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [activities, setActivities] = useState<CalendarActivity[]>(initialActivities)
  
  // Dialog states
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [currentEvent, setCurrentEvent] = useState<CalendarActivity | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Helper to get date object from activity
  const getEventDate = (act: CalendarActivity) => new Date(act.due_date || act.created_at)

  // Filter activities for selected date
  const selectedDateActivities = date 
    ? activities.filter(act => isSameDay(getEventDate(act), date))
    : []

  // Handle Add Event
  async function handleAddEvent(formData: FormData) {
    setIsSubmitting(true)
    const result = await createCalendarEvent(formData)
    setIsSubmitting(false)

    if (result.error) {
      toast.error("Lỗi: " + result.error)
    } else {
      toast.success("Đã thêm sự kiện mới.")
      setIsAddOpen(false)
      // Ideally we would re-fetch or use optimistic updates
      // For now, reload to get fresh data from server components
      window.location.reload()
    }
  }

  // Handle Edit Event
  async function handleEditEvent(formData: FormData) {
    if (!currentEvent) return
    setIsSubmitting(true)
    const result = await updateCalendarEvent(currentEvent.id, formData)
    setIsSubmitting(false)

    if (result.error) {
      toast.error("Lỗi: " + result.error)
    } else {
      toast.success("Đã cập nhật sự kiện.")
      setIsEditOpen(false)
      window.location.reload()
    }
  }

  // Handle Delete Event
  async function handleDeleteEvent(id: string) {
    if (!confirm("Bạn có chắc chắn muốn xoá sự kiện này?")) return
    
    const result = await deleteCalendarEvent(id)
    if (result.error) {
      toast.error("Lỗi: " + result.error)
    } else {
      toast.success("Đã xoá sự kiện.")
      setActivities(activities.filter(a => a.id !== id))
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-800 font-serif">Lịch làm việc</h1>
        <Button 
          onClick={() => setIsAddOpen(true)}
          className="bg-[#c66540] hover:bg-[#a55232] text-white shadow-lg shadow-orange-200/50 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Thêm sự kiện
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="border-stone-200 shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
            <CardContent className="p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                locale={vi}
                className="p-4 flex justify-center"
                modifiers={{
                  hasEvent: (day) => activities.some(act => isSameDay(getEventDate(act), day))
                }}
                modifiersStyles={{
                  hasEvent: { 
                    fontWeight: 'bold', 
                    color: '#c66540',
                    backgroundColor: '#fff7ed',
                    borderRadius: '50%'
                  }
                }}
              />
            </CardContent>
          </Card>

          <Card className="mt-6 border-stone-200 shadow-sm bg-stone-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-2">
                <Info className="w-4 h-4" />
                Thông tin
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-stone-600 space-y-2">
              <p>Chọn một ngày trên lịch để xem các hoạt động và sự kiện đã lên lịch.</p>
              <div className="flex items-center gap-2 mt-4">
                <div className="w-2 h-2 rounded-full bg-[#c66540]"></div>
                <span>Ngày có sự kiện</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="border-stone-200 shadow-sm h-full bg-white">
            <CardHeader className="border-b border-stone-100 bg-stone-50/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-stone-800 flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-[#c66540]" />
                  Lịch trình ngày {date ? format(date, 'dd/MM/yyyy') : ''}
                </CardTitle>
                <Badge variant="secondary" className="bg-stone-100 text-stone-600 font-medium border-stone-200">
                  {selectedDateActivities.length} hoạt động
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {selectedDateActivities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-stone-400">
                  <div className="w-16 h-16 rounded-full bg-stone-50 flex items-center justify-center mb-4">
                    <CalendarIcon className="w-8 h-8 opacity-20" />
                  </div>
                  <p className="font-medium">Không có sự kiện nào trong ngày này.</p>
                  <Button 
                    variant="link" 
                    className="text-[#c66540] mt-2"
                    onClick={() => setIsAddOpen(true)}
                  >
                    Tạo sự kiện mới ngay
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {selectedDateActivities.map((act) => (
                    <div key={act.id} className="relative pl-8 before:absolute before:left-3 before:top-2 before:bottom-0 before:w-0.5 before:bg-stone-100 last:before:hidden">
                      <div className="absolute left-0 top-1 w-6 h-6 rounded-full border-2 border-white bg-white shadow-sm flex items-center justify-center z-10">
                        {act.type === 'Ghi chú' ? <MessageSquare className="w-3 h-3 text-blue-500" /> :
                         act.type === 'Cuộc gọi' ? <PhoneCall className="w-3 h-3 text-green-500" /> :
                         act.type === 'Cuộc hẹn' ? <CalendarIcon className="w-3 h-3 text-orange-500" /> :
                         <Edit className="w-3 h-3 text-stone-500" />}
                      </div>
                      
                      <div className="group relative bg-stone-50/50 hover:bg-stone-50 p-4 rounded-xl border border-stone-100 transition-all hover:border-stone-200 hover:shadow-sm">
                        <div className="flex items-start justify-between mb-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-[10px] uppercase font-bold px-1.5 py-0 bg-white">
                                {act.type}
                              </Badge>
                              <span className="text-xs text-stone-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {format(getEventDate(act), 'HH:mm')}
                              </span>
                            </div>
                            <h3 className="font-semibold text-stone-800 text-base">
                              {act.leads?.full_name || 'Sự kiện chung'}
                            </h3>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 text-stone-400 hover:text-stone-600" />}>
                              <MoreVertical className="w-4 h-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem onClick={() => {
                                setCurrentEvent(act)
                                setIsEditOpen(true)
                              }}>
                                <Edit className="w-4 h-4 mr-2" />
                                Chỉnh sửa
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDeleteEvent(act.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Xoá
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-wrap">
                          {act.description}
                        </p>
                        
                        {act.status === 'pending' && (
                          <div className="mt-3 flex justify-end">
                             <Badge className="bg-amber-50 text-amber-600 border-amber-100 text-[10px] font-bold">CHƯA HOÀN THÀNH</Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Event Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Thêm sự kiện mới</DialogTitle>
            <DialogDescription>
              Lên lịch cuộc gọi, cuộc hẹn hoặc ghi chú công việc.
            </DialogDescription>
          </DialogHeader>
          <form action={handleAddEvent}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Loại sự kiện</Label>
                <Select name="type" defaultValue="Cuộc hẹn">
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cuộc hẹn">Cuộc hẹn</SelectItem>
                    <SelectItem value="Cuộc gọi">Cuộc gọi</SelectItem>
                    <SelectItem value="Ghi chú">Ghi chú</SelectItem>
                    <SelectItem value="Khác">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="lead_id">Khách hàng (Tùy chọn)</Label>
                <Select name="lead_id">
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn khách hàng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">-- Không có --</SelectItem>
                    {leads.map((lead) => (
                      <SelectItem key={lead.id} value={lead.id}>
                        {lead.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="due_date">Thời gian</Label>
                <Input 
                  id="due_date" 
                  name="due_date" 
                  type="datetime-local" 
                  defaultValue={date ? format(date, "yyyy-MM-dd'T'HH:mm") : ''}
                  required 
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Nội dung</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="Nhập chi tiết sự kiện..." 
                  className="min-h-[100px]"
                  required 
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                Huỷ
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-[#c66540] hover:bg-[#a55232] text-white">
                {isSubmitting ? 'Đang lưu...' : 'Lưu sự kiện'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa sự kiện</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin sự kiện đã lên lịch.
            </DialogDescription>
          </DialogHeader>
          {currentEvent && (
            <form action={handleEditEvent}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit_type">Loại sự kiện</Label>
                  <Select name="type" defaultValue={currentEvent.type}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cuộc hẹn">Cuộc hẹn</SelectItem>
                      <SelectItem value="Cuộc gọi">Cuộc gọi</SelectItem>
                      <SelectItem value="Ghi chú">Ghi chú</SelectItem>
                      <SelectItem value="Khác">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit_lead_id">Khách hàng</Label>
                  <Select name="lead_id" defaultValue={currentEvent.lead_id || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn khách hàng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">-- Không có --</SelectItem>
                      {leads.map((lead) => (
                        <SelectItem key={lead.id} value={lead.id}>
                          {lead.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit_due_date">Thời gian</Label>
                  <Input 
                    id="edit_due_date" 
                    name="due_date" 
                    type="datetime-local" 
                    defaultValue={currentEvent.due_date ? format(new Date(currentEvent.due_date), "yyyy-MM-dd'T'HH:mm") : ''}
                    required 
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit_description">Nội dung</Label>
                  <Textarea 
                    id="edit_description" 
                    name="description" 
                    defaultValue={currentEvent.description}
                    className="min-h-[100px]"
                    required 
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit_status">Trạng thái</Label>
                  <Select name="status" defaultValue={currentEvent.status}>
                    <SelectTrigger>
                      <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Chưa hoàn thành</SelectItem>
                      <SelectItem value="completed">Đã hoàn thành</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                  Huỷ
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-[#c66540] hover:bg-[#a55232] text-white">
                  {isSubmitting ? 'Đang lưu...' : 'Cập nhật'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
