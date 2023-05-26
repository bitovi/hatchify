import { createStaffingAppInstance } from "./staffing"

async function init() {
  const [app, scaffold] = await createStaffingAppInstance()

  await scaffold.createDatabase()

  app.listen(3000, () => {
    console.log("Scaffold Started")
  })
}

init()
