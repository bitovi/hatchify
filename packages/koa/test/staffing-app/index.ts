import { createStaffingAppInstance } from "./staffing"

async function init() {
  const [app, hatchify] = await createStaffingAppInstance()

  await hatchify.createDatabase()

  app.listen(3000, () => {
    console.log("Hatchify Started")
  })
}

init()
