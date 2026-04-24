'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addActivity(formData: FormData) {
  const supabase = await createClient()

  const leadId = formData.get('lead_id') as string
  const type = formData.get('type') as string
  const description = formData.get('description') as string
  
  // Create activity
  const { error } = await supabase
    .from('activities')
    .insert([{
      lead_id: leadId,
      type: type,
      description: description,
      status: 'completed'
    }])

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/leads/${leadId}`)
  return { success: true }
}

export async function updateLeadStatus(leadId: string, newStatus: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('leads')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', leadId)

  if (error) {
    return { error: error.message }
  }

  // Also log status change as an activity
  await supabase
    .from('activities')
    .insert([{
      lead_id: leadId,
      type: 'Trạng thái',
      description: `Đã thay đổi trạng thái thành: ${newStatus}`,
      status: 'completed'
    }])

  revalidatePath(`/leads/${leadId}`)
  revalidatePath('/leads')
  revalidatePath('/')
  return { success: true }
}
