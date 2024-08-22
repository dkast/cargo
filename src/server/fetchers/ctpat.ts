"use server"

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import {
  InspectionItemResult,
  InspectionStatus,
  type InspectionResult
} from "@prisma/client"
import { endOfDay, parseISO, subMonths } from "date-fns"
import { unstable_cache as cache } from "next/cache"

import { prisma } from "@/server/db"
import { type InspectionQueryFilter } from "@/lib/types"
import { env } from "@/env.mjs"

// Create an Cloudflare R2 service client object
const R2 = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_KEY_ID
  }
})

export async function getInspections(filter: InspectionQueryFilter) {
  return await prisma.inspection.findMany({
    take: filter.take ? filter.take : undefined,
    where: {
      organizationId: filter.organizationId,
      inspectionType: filter.inspectionType,
      start: {
        gte: filter.start ? parseISO(filter.start) : subMonths(new Date(), 1),
        lte: filter.end ? endOfDay(parseISO(filter.end)) : endOfDay(new Date())
      },
      status: filter.status
        ? { in: filter.status.split(",") as InspectionStatus[] }
        : undefined,
      result: filter.result
        ? { in: filter.result.split(",") as InspectionResult[] }
        : undefined,
      locationId: filter.location
        ? { in: filter.location.split(",") }
        : undefined
    },
    select: {
      id: true,
      inspectionNbr: true,
      inspectedBy: {
        select: {
          id: true,
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      },
      start: true,
      end: true,
      status: true,
      result: true,
      organizationId: true,
      vehicle: {
        select: {
          id: true,
          vehicleNbr: true,
          licensePlate: true
        }
      },
      operator: {
        select: {
          id: true,
          name: true,
          licenseNumber: true
        }
      },
      company: {
        select: {
          id: true,
          name: true
        }
      },
      container: {
        select: {
          id: true,
          containerNbr: true
        }
      },
      location: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: {
      start: "desc"
    }
  })
}

export async function getInspectionById(inspectionId: string) {
  const data = await prisma.inspection.findUnique({
    where: {
      id: inspectionId
    },
    select: {
      id: true,
      inspectionNbr: true,
      inspectedBy: {
        select: {
          id: true,
          user: {
            select: {
              id: true,
              username: true,
              name: true
            }
          }
        }
      },
      approvedBy: {
        select: {
          id: true,
          user: {
            select: {
              id: true,
              username: true,
              name: true
            }
          }
        }
      },
      start: true,
      end: true,
      status: true,
      result: true,
      isLoaded: true,
      tripType: true,
      sealNbr: true,
      tiresVehicle: true,
      tiresContainer: true,
      organizationId: true,
      notes: true,
      vehicle: {
        select: {
          id: true,
          vehicleNbr: true,
          licensePlate: true
        }
      },
      operator: {
        select: {
          id: true,
          name: true,
          licenseNumber: true
        }
      },
      company: {
        select: {
          id: true,
          name: true
        }
      },
      container: {
        select: {
          id: true,
          containerNbr: true
        }
      },
      location: {
        select: {
          id: true,
          name: true,
          description: true
        }
      },
      inspectionItems: {
        select: {
          id: true,
          question: true,
          result: true,
          notes: true,
          order: true,
          createdAt: true,
          inspectionItemFiles: {
            select: {
              id: true,
              fileUrl: true
            }
          }
        },
        orderBy: {
          order: "asc"
        }
      }
    }
  })

  // Replace fileUrl with a signed URL
  if (data) {
    for (const item of data.inspectionItems) {
      for (const file of item.inspectionItemFiles) {
        file.fileUrl = await getSignedUrl(
          R2,
          new GetObjectCommand({
            Bucket: env.R2_BUCKET_NAME,
            Key: file.fileUrl
          }),
          { expiresIn: 3600 }
        )
      }
    }
  }

  return data
}

// Get count of inspections by status
export async function getInspectionStatusCount(filter: InspectionQueryFilter) {
  return await prisma.inspection.groupBy({
    by: ["status"],
    where: {
      organizationId: filter.organizationId,
      inspectionType: filter.inspectionType,
      start: {
        gte: filter.start ? parseISO(filter.start) : subMonths(new Date(), 1),
        lte: filter.end ? endOfDay(parseISO(filter.end)) : endOfDay(new Date())
      }
    },
    _count: {
      status: true
    },
    orderBy: {
      status: "asc"
    }
  })
}

// Get count of inspections by date and result
export async function getInspectionResultCount(filter: InspectionQueryFilter) {
  return await prisma.$queryRaw`select result, start, cast(count(*) as char) as total from "Inspection" where "organizationId" = ${
    filter.organizationId
  } and
  "inspectionType" = ${filter.inspectionType} and
  start >= ${
    filter.start ? parseISO(filter.start) : subMonths(new Date(), 1)
  } and
  start <= ${
    filter.end ? endOfDay(parseISO(filter.end)) : endOfDay(new Date())
  } and result is not null
  group by result, start order by start asc`
}

// Get count of inspections items where the result was set to fail
export async function getInspectionIssuesCount(filter: InspectionQueryFilter) {
  return await prisma.$queryRaw`select question as issue, cast(count(*) as char) as total from "InspectionItem" where "inspectionId" in (select id from "Inspection" where "organizationId" = ${
    filter.organizationId
  } and
  "inspectionType" = ${filter.inspectionType} and
  start >= ${
    filter.start ? parseISO(filter.start) : subMonths(new Date(), 1)
  } and
  start <= ${
    filter.end ? endOfDay(parseISO(filter.end)) : endOfDay(new Date())
  }) and result = ${InspectionItemResult.FAIL}
  group by question order by total desc`
}

// Get inspection items with comments where the result was set to fail
export async function getInspectionIssues(filter: InspectionQueryFilter) {
  return await prisma.inspectionItem.findMany({
    where: {
      inspection: {
        organizationId: filter.organizationId,
        inspectionType: filter.inspectionType,
        start: {
          gte: filter.start ? parseISO(filter.start) : subMonths(new Date(), 1),
          lte: filter.end
            ? endOfDay(parseISO(filter.end))
            : endOfDay(new Date())
        }
      },
      result: InspectionItemResult.FAIL,
      notes: {
        not: null
      }
    },
    select: {
      id: true,
      question: true,
      result: true,
      notes: true,
      order: true,
      createdAt: true,
      inspection: {
        select: {
          id: true,
          inspectionNbr: true,
          start: true,
          end: true,
          status: true,
          result: true,
          isLoaded: true,
          tripType: true,
          sealNbr: true,
          tiresVehicle: true,
          tiresContainer: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  })
}

// Get list of locations and include data of inspections with status OPEN
export async function getOpenInspectionsByLocation(
  filter: InspectionQueryFilter
) {
  return await prisma.location.findMany({
    where: {
      organizationId: filter.organizationId
    },
    select: {
      id: true,
      name: true,
      description: true,
      inspections: {
        where: {
          status: InspectionStatus.OPEN,
          inspectionType: filter.inspectionType
        },
        select: {
          id: true,
          inspectionNbr: true,
          start: true,
          status: true,
          tripType: true,
          isLoaded: true,
          company: {
            select: {
              id: true,
              name: true
            }
          },
          vehicle: {
            select: {
              id: true,
              vehicleNbr: true,
              licensePlate: true
            }
          },
          container: {
            select: {
              id: true,
              containerNbr: true
            }
          }
        }
      }
    }
  })
}
