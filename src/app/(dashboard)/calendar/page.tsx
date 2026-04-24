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
      leads ( full_name )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching activities:', error)
  }

  return <CalendarClient initialActivities={(activities as unknown as CalendarActivity[]) || []} />
}
