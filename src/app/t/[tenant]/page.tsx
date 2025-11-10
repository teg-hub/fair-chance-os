'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function TenantSetter({ params }: { params: { tenant: string } }) {
  const router = useRouter()
  useEffect(() => {
    document.cookie = `tenant_subdomain=${params.tenant}; path=/; max-age=31536000`
    router.replace('/')
  }, [params.tenant, router])
  return <p className="text-sm">Setting tenant…</p>
}
