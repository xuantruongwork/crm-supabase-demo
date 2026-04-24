'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCalendarEvent(formData: FormData) {
  const supabase = await createClient()

  const leadId = formData.get('lead_id') as string || null
  const type = formData.get('type') as string
  const description = formData.get('description') as string
  const dueDate = formData.get('due_date') as string
  const status = formData.get('status') as string || 'pending'
  
  const { error } = await supabase
    .from('activities')
    .insert([{
      lead_id: leadId,
      type: type,
      description: description,
      due_date: dueDate,
      status: status
    }])

  if (error) {
    console.error('Create event error:', error)
    return { error: error.message }
  }

  revalidatePath('/calendar')
  return { success: true }
}

export async function updateCalendarEvent(eventId: string, formData: FormData) {
  const supabase = await createClient()

  const leadId = formData.get('lead_id') as string || null
  const type = formData.get('type') as string
  const description = formData.get('description') as string
  const dueDate = formData.get('due_date') as string
  const status = formData.get('status') as string
  
  const { error } = await supabase
    .from('activities')
    .update({
      lead_id: leadId,
      type: type,
      description: description,
      due_date: dueDate,
      status: status,
      updated_at: new Date().toISOString()
    })
    .eq('id', eventId)

  if (error) {
    console.error('Update event error:', error)
    return { error: error.message }
  }

  revalidatePath('/calendar')
  return { success: true }
}

export async function deleteCalendarEvent(eventId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('activities')
    .delete()
    .eq('id', eventId)

  if (error) {
    console.error('Delete event error:', error)
    return { error: error.message }
  }

  revalidatePath('/calendar')
  return { success: true }
}
