import { MembershipRole, PrismaClient } from "@prisma/client"
import { Argon2id } from "oslo/password"

const prisma = new PrismaClient()

async function main() {
  const argon2id = new Argon2id()
  const org = await prisma.organization.upsert({
    where: { subdomain: "cargo" },
    update: {},
    create: {
      name: "CargoHQ",
      subdomain: "cargo",
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
      password: await argon2id.hash("cargo2024"),
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
