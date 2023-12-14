import LocationActionMenu from "@/app/dashboard/settings/location-action-menu"
import { MapPin } from "lucide-react"

import { EmptyState } from "@/components/dashboard/empty-state"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getLocations } from "@/server/fetchers"

export default async function LocationList({
  organizationId
}: {
  organizationId: string
}) {
  const locations = await getLocations(organizationId)

  return (
    <Card className="mt-10">
      <CardHeader title="Ubicaciones">
        <CardTitle className="text-base">Lista de ubicaciones</CardTitle>
      </CardHeader>
      <CardContent>
        {locations && locations.length > 0 ? (
          <div className="grid grid-cols-1 divide-y divide-gray-200">
            {locations.map(location => (
              <div
                key={location.id}
                className="flex flex-row items-center justify-between py-4"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {location.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {location.description}
                  </span>
                </div>
                <LocationActionMenu
                  organizationId={organizationId}
                  id={location.id}
                />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={<MapPin />} />
        )}
      </CardContent>
    </Card>
  )
}
