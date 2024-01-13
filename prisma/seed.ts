import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.eCategories.deleteMany({})
  const eCategoriesSeed = await prisma.eCategories.createMany({
    data: [
      { id: "pw2mtah", name: '3D Printer' },
      { id: "384ieci", name: 'CNC (Laser cutter)' },
      { id: "bgwbjwd", name: 'Welding' },
      { id: "wec92q8", name: 'Hand power tools' },
      { id: "cpwp422", name: 'Hand tools' },
      { id: "233g4pc", name: 'Design station' },
      { id: "zyyymkp", name: 'Testing equipment' },
      { id: "ex7r4z9", name: 'PCB design' },
      { id: "htbyq6g", name: 'Standalone power tools' }
    ]
  })

  console.log({ eCategoriesSeed })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })