import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import LeadsClient, { Lead } from './LeadsClient'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Leads - CRM Pro',
}

export default async function LeadsPage() {
  const supabase = await createClient()

  // Verify authentication
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Fetch leads
  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching leads:', error)
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LeadsClient initialLeads={(leads as Lead[]) || []} />
    </Suspense>
  )
}
