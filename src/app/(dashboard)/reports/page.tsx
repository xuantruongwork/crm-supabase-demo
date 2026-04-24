import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ReportsClient, { ReportData } from './ReportsClient'

export const metadata = {
  title: 'Báo cáo - CRM Pro',
}

export default async function ReportsPage() {
  const supabase = await createClient()

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch all leads for reporting
  const { data: leads, error } = await supabase
    .from('leads')
    .select('id, status, source, created_at')

  if (error) {
    console.error('Error fetching leads for reports:', error)
  }

  return <ReportsClient leads={(leads as ReportData[]) || []} />
}
