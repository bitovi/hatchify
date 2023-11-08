import { useState } from "react"
import type {
  Filters,
  PaginationObject,
  FinalSchemas,
} from "@hatchifyjs/rest-client"
import type { PartialSchema } from "@hatchifyjs/core"
import type { HatchifyReactRest } from "@hatchifyjs/react-rest"
import { HatchifyCollection } from ".."
import { HatchifyEmpty } from "../HatchifyEmpty"
import type { HatchifyCollectionSelected, SortObject } from "../../presentation"
import Grid from "@mui/material/Grid"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Typography from "@mui/material/Typography"

export interface HatchifyEverythingProps<
  TSchemas extends Record<string, PartialSchema>,
> {
  finalSchemas: FinalSchemas
  partialSchemas: TSchemas
  restClient: HatchifyReactRest<TSchemas>
  children?: React.ReactNode | null
  defaultSelected?: HatchifyCollectionSelected["selected"]
  onSelectedChange?: HatchifyCollectionSelected["setSelected"]
  defaultPage?: PaginationObject
  defaultSort?: SortObject
  baseFilter?: Filters
}

function HatchifyEverything<
  const TSchemas extends Record<string, PartialSchema>,
>({
  finalSchemas,
  partialSchemas,
  restClient,
  ...props
}: HatchifyEverythingProps<TSchemas>): JSX.Element {
  const schemasList = Object.keys(finalSchemas)
  const [selectedSchema, setSelectedSchema] = useState(schemasList[0])

  return (
    <Grid container>
      <Grid item xs={3} sx={{ backgroundColor: "lightgrey", height: "100%" }}>
        {!finalSchemas ? (
          <Typography>
            There are no schemas. Create some to get started!
          </Typography>
        ) : (
          <Tabs orientation="vertical" value={selectedSchema}>
            {schemasList.map((schemaName) => {
              return (
                <Tab
                  value={schemaName}
                  label={schemaName}
                  key={schemaName}
                  onClick={() => setSelectedSchema(schemaName)}
                />
              )
            })}
          </Tabs>
        )}
      </Grid>
      <Grid item xs={9}>
        {!finalSchemas ? (
          <>
            <Typography>Welcome to Hatchify!</Typography>
            <img src={"../../assets/Eggboy.png"} alt="Hatchify logo" />
          </>
        ) : (
          <HatchifyCollection
            {...props}
            finalSchemas={finalSchemas}
            partialSchemas={partialSchemas}
            schemaName={selectedSchema}
            restClient={restClient}
          >
            <HatchifyEmpty {...props}>
              <img src={"../../assets/Eggboy.png"} alt="Hatchify logo" />
            </HatchifyEmpty>
          </HatchifyCollection>
        )}
      </Grid>
    </Grid>
  )
}

HatchifyEverything.displayName = "Everything"

export default HatchifyEverything
