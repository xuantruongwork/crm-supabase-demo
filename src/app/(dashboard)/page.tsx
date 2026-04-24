import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, MessageCircle, ShoppingCart, Ban } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch summary data
  const { data: leads, error } = await supabase
    .from('leads')
    .select('status')
    
  let newLeads = 0
  let consultingLeads = 0
  let boughtLeads = 0
  let rejectedLeads = 0
  
  if (leads) {
    leads.forEach(lead => {
      if (lead.status === 'Mới') newLeads++
      else if (lead.status === 'Đang tư vấn') consultingLeads++
      else if (lead.status === 'Đã mua') boughtLeads++
      else if (lead.status === 'Từ chối') rejectedLeads++
    })
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-stone-800">
          Xin chào, {user?.email}
        </h1>
        <p className="text-stone-500 mt-2 text-lg">
          Chào mừng bạn trở lại. Dưới đây là tóm tắt hoạt động bán hàng của bạn.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-l-4 border-l-yellow-400 shadow-sm rounded-xl overflow-hidden bg-[#faf9f7]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-yellow-600" />
            </div>
            <div className="px-2 py-0.5 rounded-full border border-yellow-200 text-xs font-semibold text-yellow-600 bg-yellow-50">
              HOT
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xs font-bold text-stone-400 tracking-wider mb-1">MỚI</div>
            <div className="text-4xl font-serif text-stone-800">{newLeads}</div>
            <div className="flex items-center gap-1 mt-4 text-sm text-green-600 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              Cần liên hệ sớm
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-400 shadow-sm rounded-xl overflow-hidden bg-[#faf9f7]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xs font-bold text-stone-400 tracking-wider mb-1">ĐANG TƯ VẤN</div>
            <div className="text-4xl font-serif text-stone-800">{consultingLeads}</div>
            <div className="flex items-center gap-1 mt-4 text-sm text-stone-500">
              <MessageCircle className="w-4 h-4" />
              {consultingLeads} lead đang theo đuổi
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-400 shadow-sm rounded-xl overflow-hidden bg-[#faf9f7]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xs font-bold text-stone-400 tracking-wider mb-1">ĐÃ MUA</div>
            <div className="text-4xl font-serif text-stone-800">{boughtLeads}</div>
            <div className="flex items-center gap-1 mt-4 text-sm text-green-600 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              Ghi nhận thành công
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-stone-300 shadow-sm rounded-xl overflow-hidden bg-[#faf9f7]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center">
              <Ban className="w-4 h-4 text-stone-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xs font-bold text-stone-400 tracking-wider mb-1">TỪ CHỐI</div>
            <div className="text-4xl font-serif text-stone-800">{rejectedLeads}</div>
            <div className="flex items-center gap-1 mt-4 text-sm text-stone-500">
              <Ban className="w-4 h-4" />
              {rejectedLeads} lead đã đóng
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
