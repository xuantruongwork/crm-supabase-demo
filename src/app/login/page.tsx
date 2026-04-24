'use client'

import { useState } from 'react'
import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLogin, setIsLogin] = useState(true)

  async function handleSubmit(formData: FormData) {
    const res = isLogin ? await login(formData) : await signup(formData)
    if (res?.error) {
      setError(res.error)
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-stone-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-stone-800">
            {isLogin ? 'Đăng nhập' : 'Đăng ký'} CRM Pro
          </CardTitle>
          <CardDescription>
            Nhập email và mật khẩu của bạn để {isLogin ? 'truy cập' : 'tạo tài khoản'}.
          </CardDescription>
        </CardHeader>
        <form action={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="text-sm font-medium text-destructive">{error}</div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="xuantruongwork@gmail.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button className="w-full bg-[#c66540] hover:bg-[#a55232] text-white" type="submit">
              {isLogin ? 'Đăng nhập' : 'Đăng ký'}
            </Button>
            <Button
              variant="link"
              className="text-stone-500 text-sm"
              type="button"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
