export default function PageSubtitle({
  title,
  description
}: {
  title: string
  description?: string
}) {
  return (
    <>
      <h2 className="text-base font-semibold leading-7 text-zinc-900">
        {title}
      </h2>
      <p className="mt-1 text-sm leading-6 text-zinc-600">{description}</p>
    </>
  )
}
