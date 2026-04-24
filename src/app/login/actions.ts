'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  try {
    const supabase = await createClient()

    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
      console.error('Login error:', error)
      return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/')
  } catch (err) {
    console.error('Unexpected login error:', err)
    return { error: 'Đã xảy ra lỗi không xác định khi đăng nhập.' }
  }
}

export async function signup(formData: FormData) {
  try {
    const supabase = await createClient()

    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
      console.error('Signup error:', error)
      return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/')
  } catch (err) {
    console.error('Unexpected signup error:', err)
    return { error: 'Đã xảy ra lỗi không xác định khi đăng ký.' }
  }
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
