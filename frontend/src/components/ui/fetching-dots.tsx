import * as React from 'react'

type FetchingDotsProps = {
  label?: string
  intervalMs?: number
}

export function FetchingDots({ label = 'Fetching video', intervalMs = 400 }: FetchingDotsProps) {
  const [step, setStep] = React.useState(0)

  React.useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % 4), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])

  const dots = ['', '.', '..', '...'][step]
  return (
    <div className="text-sm text-gray-300">
      {label}
      <span className="inline-block w-8 text-left">{dots}</span>
    </div>
  )
}


