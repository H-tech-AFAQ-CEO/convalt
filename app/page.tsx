'use client'

import dynamic from 'next/dynamic'

const ConvaltApp = dynamic(() => import('@/components/convalt-client'), {
  ssr: false,
})

export default function Page() {
  return <ConvaltApp />
}
