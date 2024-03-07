import LocationDelete from "@/app/[domain]/dashboard/settings/location-delete"
import LocationEdit from "@/app/[domain]/dashboard/settings/location-edit"
import { MapPin } from "lucide-react"

import { EmptyState } from "@/components/dashboard/empty-state"
import { Badge } from "@/components/ui/badge"
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
          <div className="grid grid-cols-1 divide-y divide-gray-200 dark:divide-gray-800">
            {locations.map(location => (
              <div
                key={location.id}
                className="flex flex-row items-center justify-between py-4"
              >
                <div className="flex flex-col">
                  <span className="flex gap-x-1 text-sm font-medium text-gray-900 dark:text-white">
                    {location.name}
                    {!location.isActive && (
                      <Badge variant="secondary">Inactiva</Badge>
                    )}
                  </span>
                  <span className="text-sm text-gray-500">
                    {location.description}
                  </span>
                </div>
                <div>
                  <LocationEdit data={location} />
                  <LocationDelete data={location} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={<MapPin />} title="No hay ubicaciones" />
        )}
      </CardContent>
    </Card>
  )
}
