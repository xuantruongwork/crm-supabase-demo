'use client'

import { useState } from 'react'
import { format, isSameDay, parseISO } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Calendar as CalendarIcon, Clock, PhoneCall, MessageSquare, Edit } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export type CalendarActivity = {
  id: string
  type: string
  description: string
  status: string
  created_at: string
  due_date: string | null
  leads: { full_name: string } | null
}

export default function CalendarClient({ initialActivities }: { initialActivities: CalendarActivity[] }) {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // We map the activities based on `due_date` if exists, otherwise `created_at`
  const getEventDate = (act: CalendarActivity) => new Date(act.due_date || act.created_at)

  // Filter activities for selected date
  const selectedDateActivities = date 
    ? initialActivities.filter(act => isSameDay(getEventDate(act), date))
    : []

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-800 font-serif">Lịch làm việc</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="border-stone-200 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                locale={vi}
                className="p-4 flex justify-center bg-white"
                modifiers={{
                  hasEvent: (day) => initialActivities.some(act => isSameDay(getEventDate(act), day))
                }}
                modifiersStyles={{
                  hasEvent: { fontWeight: 'bold', textDecoration: 'underline', color: '#c66540' }
                }}
              />
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="border-stone-200 shadow-sm h-full">
            <CardHeader className="border-b border-stone-100 bg-stone-50/50">
              <CardTitle className="text-lg font-bold text-stone-800 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#c66540]" />
                Lịch trình ngày {date ? format(date, 'dd/MM/yyyy') : ''}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {selectedDateActivities.length === 0 ? (
                <div className="text-center py-12 text-stone-500">
                  Không có sự kiện hoặc hoạt động nào trong ngày này.
                </div>
              ) : (
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-stone-200 before:to-transparent">
                  {selectedDateActivities.map((act) => (
                    <div key={act.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-stone-100 text-stone-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        {act.type === 'Ghi chú' ? <MessageSquare className="w-4 h-4" /> :
                         act.type === 'Cuộc gọi' ? <PhoneCall className="w-4 h-4" /> :
                         act.type === 'Trạng thái' ? <Edit className="w-4 h-4" /> :
                         <CalendarIcon className="w-4 h-4" />}
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-xs bg-stone-50 font-medium text-[#c66540] border-[#c66540]/20">
                            {act.type}
                          </Badge>
                          <time className="text-xs text-stone-400 flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3" />
                            {format(getEventDate(act), 'HH:mm')}
                          </time>
                        </div>
                        <div className="font-semibold text-stone-800 text-sm mb-1">
                          {act.leads?.full_name || 'Khách hàng ẩn'}
                        </div>
                        <div className="text-sm text-stone-600 whitespace-pre-wrap leading-relaxed line-clamp-3">
                          {act.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
