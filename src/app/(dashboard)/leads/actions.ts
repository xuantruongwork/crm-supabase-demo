'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createLead(formData: FormData) {
  const supabase = await createClient()

  const fullName = formData.get('full_name') as string
  const phone = formData.get('phone') as string
  const email = formData.get('email') as string
  const company = formData.get('company') as string
  const title = formData.get('title') as string
  const status = formData.get('status') as string || 'Mới'
  const source = formData.get('source') as string

  const { data, error } = await supabase
    .from('leads')
    .insert([{
      full_name: fullName,
      phone,
      email,
      company,
      title,
      status,
      source
    }])
    .select()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/leads')
  revalidatePath('/')
  return { data }
}

export async function deleteLead(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/leads')
  revalidatePath('/')
}
