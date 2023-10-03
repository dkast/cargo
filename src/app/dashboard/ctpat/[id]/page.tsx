export default async function CTPATPage({
  params
}: {
  params: { id: string }
}) {
  const { id } = params

  return <div>{id}</div>
}
