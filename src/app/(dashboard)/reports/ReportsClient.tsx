'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { format, parseISO } from 'date-fns'
import { vi } from 'date-fns/locale'

export type ReportData = {
  id: string
  status: string
  source: string | null
  created_at: string
}

const COLORS = ['#c66540', '#d88665', '#e9a88e', '#f4c7b6', '#fce2d8']

export default function ReportsClient({ leads }: { leads: ReportData[] }) {
  
  // Aggregate data for Bar Chart: Leads over the last few months
  const monthlyData = useMemo(() => {
    const dataMap: Record<string, number> = {}
    
    leads.forEach(lead => {
      const date = parseISO(lead.created_at)
      const monthYear = format(date, 'MM/yyyy', { locale: vi })
      dataMap[monthYear] = (dataMap[monthYear] || 0) + 1
    })

    return Object.entries(dataMap)
      .map(([name, total]) => ({ name, total }))
      // Sort by rudimentary string parsing (MM/YYYY)
      .sort((a, b) => {
        const [aM, aY] = a.name.split('/')
        const [bM, bY] = b.name.split('/')
        return new Date(Number(aY), Number(aM) - 1).getTime() - new Date(Number(bY), Number(bM) - 1).getTime()
      })
      .slice(-6) // Last 6 months
  }, [leads])

  // Aggregate data for Pie Chart: Leads by Source
  const sourceData = useMemo(() => {
    const dataMap: Record<string, number> = {}
    
    leads.forEach(lead => {
      const src = lead.source || 'Khác'
      dataMap[src] = (dataMap[src] || 0) + 1
    })

    return Object.entries(dataMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [leads])

  // Aggregate data for Pie Chart: Leads by Status
  const statusData = useMemo(() => {
    const dataMap: Record<string, number> = {}
    
    leads.forEach(lead => {
      const stat = lead.status
      dataMap[stat] = (dataMap[stat] || 0) + 1
    })

    return Object.entries(dataMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [leads])

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-800 font-serif">Báo cáo & Phân tích</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-stone-200 shadow-sm col-span-1 lg:col-span-2">
          <CardHeader className="border-b border-stone-100 bg-stone-50/50">
            <CardTitle className="text-lg font-bold text-stone-800">Tăng trưởng khách hàng (6 tháng gần nhất)</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[350px] w-full">
              {monthlyData.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-stone-500">Chưa có đủ dữ liệu</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e6e2db" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#78716c', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#78716c', fontSize: 12 }}
                      allowDecimals={false}
                    />
                    <RechartsTooltip 
                      cursor={{ fill: '#f4f0e9' }}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e6e2db', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="total" fill="#c66540" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-stone-200 shadow-sm">
          <CardHeader className="border-b border-stone-100 bg-stone-50/50">
            <CardTitle className="text-lg font-bold text-stone-800">Nguồn khách hàng</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px] w-full">
              {sourceData.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-stone-500">Chưa có đủ dữ liệu</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e6e2db', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-stone-200 shadow-sm">
          <CardHeader className="border-b border-stone-100 bg-stone-50/50">
            <CardTitle className="text-lg font-bold text-stone-800">Tỉ lệ chuyển đổi (Trạng thái)</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px] w-full">
              {statusData.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-stone-500">Chưa có đủ dữ liệu</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={0}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e6e2db', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
