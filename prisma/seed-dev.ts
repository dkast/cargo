import {
  // InspectionItemResult,
  // InspectionResult,
  // InspectionStatus,
  // InspectionTripType,
  // InspectionType,
  MembershipRole,
  PrismaClient
} from "@prisma/client"
import * as argon2 from "argon2"

// import { subDays } from "date-fns"

// import { ctpatInspections } from "../src/lib/types"

const prisma = new PrismaClient()

async function main() {
  const org = await prisma.organization.upsert({
    where: { subdomain: "demo" },
    update: {},
    create: {
      name: "Demo",
      subdomain: "demo",
      description: "Organizacion de prueba"
    }
  })

  const admin = await prisma.user.upsert({
    where: { email: "devcastillejo@gmail.com" },
    update: {
      memberships: {
        create: [
          {
            role: MembershipRole.ADMIN,
            organizationId: org.id
          }
        ]
      }
    },
    create: {
      email: "devcastillejo@gmail.com",
      name: "Administrador",
      username: "admin",
      password: await argon2.hash("cargo2024"),
      memberships: {
        create: [
          {
            role: MembershipRole.ADMIN,
            organizationId: org.id
          }
        ]
      }
    }
  })

  console.log(admin)

  // Create 3 new locations named "Caseta 1", "Caseta 2" and "Caseta 3"
  await prisma.location.createMany({
    data: [
      { name: "Caseta 1", organizationId: org.id },
      { name: "Caseta 2", organizationId: org.id },
      { name: "Caseta 3", organizationId: org.id }
    ]
  })

  // Create 5 new companies with names related to transportation
  await prisma.company.createMany({
    data: [
      { name: "Transportes Alfa", organizationId: org.id },
      { name: "Transportes Beta", organizationId: org.id },
      { name: "Transportes Gamma", organizationId: org.id },
      { name: "Transportes Delta", organizationId: org.id },
      { name: "Transportes Epsilon", organizationId: org.id }
    ]
  })

  // Create 5 new operators with a random name and a license number
  await prisma.operator.createMany({
    data: [
      { name: "Juan Perez", licenseNumber: "123456", organizationId: org.id },
      {
        name: "Pedro Sanchez",
        licenseNumber: "654321",
        organizationId: org.id
      },
      {
        name: "Luis Martinez",
        licenseNumber: "456123",
        organizationId: org.id
      },
      {
        name: "Carlos Rodriguez",
        licenseNumber: "321654",
        organizationId: org.id
      },
      { name: "Javier Garcia", licenseNumber: "654123", organizationId: org.id }
    ]
  })

  // Create 5 new vehicles with a random unit number and a license plate
  await prisma.vehicle.createMany({
    data: [
      { vehicleNbr: "123", licensePlate: "ABC123", organizationId: org.id },
      { vehicleNbr: "456", licensePlate: "DEF456", organizationId: org.id },
      { vehicleNbr: "789", licensePlate: "GHI789", organizationId: org.id },
      { vehicleNbr: "012", licensePlate: "JKL012", organizationId: org.id },
      { vehicleNbr: "345", licensePlate: "MNO345", organizationId: org.id }
    ]
  })

  // Create 5 containers with a random identifier
  await prisma.container.createMany({
    data: [
      { containerNbr: "AAA123", organizationId: org.id },
      { containerNbr: "BBB456", organizationId: org.id },
      { containerNbr: "CCC789", organizationId: org.id },
      { containerNbr: "DDD012", organizationId: org.id },
      { containerNbr: "EEE345", organizationId: org.id }
    ]
  })

  /* Create 30 inspections based on the inspection model, one by one, and with random data based on the database entities, 
  the creation date must be in the last 30 days, some of them must be loaded and some of them must be unloaded,
  the trip type must be random between IN or OUT, the status can be CLOSED or "APPROVED" */

  const adminMembership = await prisma.membership.findFirst({
    where: { userId: admin.id, organizationId: org.id }
  })

  if (!adminMembership) {
    throw new Error("No se encontró la membresía del administrador")
  }

  // const inspectionData = []

  // for (let i = 0; i < 30; i++) {
  //   const randomLocation = await prisma.location.findFirst({
  //     where: { organizationId: org.id },
  //     take: 1,
  //     skip: Math.floor(Math.random() * 3)
  //   })

  //   const randomCompany = await prisma.company.findFirst({
  //     where: { organizationId: org.id },
  //     take: 1,
  //     skip: Math.floor(Math.random() * 5)
  //   })

  //   const randomOperator = await prisma.operator.findFirst({
  //     where: { organizationId: org.id },
  //     take: 1,
  //     skip: Math.floor(Math.random() * 5)
  //   })

  //   const randomVehicle = await prisma.vehicle.findFirst({
  //     where: { organizationId: org.id },
  //     take: 1,
  //     skip: Math.floor(Math.random() * 5)
  //   })

  //   const randomContainer = await prisma.container.findFirst({
  //     where: { organizationId: org.id },
  //     take: 1,
  //     skip: Math.floor(Math.random() * 5)
  //   })

  //   const randomDate = subDays(new Date(), Math.floor(Math.random() * 30))

  //   const randomTripType =
  //     Math.random() < 0.5 ? InspectionTripType.IN : InspectionTripType.OUT

  //   const randomStatus =
  //     Math.random() < 0.5 ? InspectionStatus.CLOSED : InspectionStatus.APPROVED

  //   const randomResult =
  //     Math.random() < 0.8 ? InspectionResult.PASS : InspectionResult.FAIL

  //   const inspection = {
  //     locationId: randomLocation?.id ?? "error",
  //     companyId: randomCompany?.id ?? "error",
  //     operatorId: randomOperator?.id ?? "error",
  //     licenseNumber: "123456",
  //     vehicleId: randomVehicle?.id ?? "error",
  //     licensePlate: "ABC123",
  //     containerId: randomContainer?.id ?? "error",
  //     start: randomDate,
  //     end: randomDate,
  //     tripType: randomTripType,
  //     status: randomStatus,
  //     organizationId: org.id,
  //     inspectedById: adminMembership.id,
  //     isLoaded: Math.random() < 0.5,
  //     result: randomResult,
  //     inspectionType: InspectionType.CTPAT
  //   }

  //   inspectionData.push(inspection)
  // }

  // for (const inspection of inspectionData) {
  //   await prisma.inspection.create({
  //     data: {
  //       ...inspection,
  //       inspectionItems: {
  //         create: [
  //           ...ctpatInspections.map(item => ({
  //             question: item,
  //             result:
  //               inspection.result === InspectionResult.PASS
  //                 ? InspectionItemResult.PASS
  //                 : Math.random() < 0.9
  //                   ? InspectionItemResult.PASS
  //                   : InspectionItemResult.FAIL,
  //             notes:
  //               inspection.result === InspectionResult.PASS
  //                 ? ""
  //                 : Math.random() < 0.5
  //                   ? "Notas de prueba"
  //                   : "",
  //             order: Math.floor(Math.random() * 10),
  //             organization: { connect: { id: org.id } } // Add the missing organization property
  //           }))
  //         ]
  //       }
  //     }
  //   })
  //   // Log the number of the inspection created
  //   console.log(`Inspección ${inspectionData.indexOf(inspection) + 1} creada`)
  // }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
