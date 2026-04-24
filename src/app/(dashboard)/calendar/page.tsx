import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CalendarClient, { CalendarActivity } from './CalendarClient'

export const metadata = {
  title: 'Lịch làm việc - CRM Pro',
}

export default async function CalendarPage() {
  const supabase = await createClient()

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch activities (cuộc hẹn, cuộc gọi, ghi chú)
  const { data: activities, error } = await supabase
    .from('activities')
    .select(`
      id,
      type,
      description,
      status,
      created_at,
      due_date,
      lead_id,
      leads ( id, full_name )
    `)
    .order('created_at', { ascending: false })

  // Fetch leads for the dropdown
  const { data: leads } = await supabase
    .from('leads')
    .select('id, full_name')
    .order('full_name')

  return (
    <CalendarClient 
      initialActivities={(activities as unknown as CalendarActivity[]) || []} 
      leads={leads || []}
    />
  )
}
