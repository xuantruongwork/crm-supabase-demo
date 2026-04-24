import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LeadDetailClient from './LeadDetailClient'
import { Lead } from '../LeadsClient'

export const metadata = {
  title: 'Chi tiết khách hàng - CRM Pro',
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const supabase = await createClient()

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch lead
  const { data: leadData, error: leadError } = await supabase
    .from('leads')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (leadError || !leadData) {
    redirect('/leads')
  }

  // Fetch activities
  const { data: activitiesData, error: activitiesError } = await supabase
    .from('activities')
    .select('*')
    .eq('lead_id', resolvedParams.id)
    .order('created_at', { ascending: false })

  if (activitiesError) {
    console.error('Error fetching activities:', activitiesError)
  }

  return (
    <LeadDetailClient 
      lead={leadData as Lead} 
      activities={activitiesData || []} 
    />
  )
}
