import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Badge, Button, Grid, Popover, debounce } from "@mui/material"
import FilterListIcon from "@mui/icons-material/FilterList"
import AddIcon from "@mui/icons-material/Add"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import type { XDataGridProps } from "@hatchifyjs/react-ui"
import type { FilterArray } from "@hatchifyjs/rest-client"
import { MuiFilterRows } from "./components/MuiFilterRows"
import { getFilterableFields } from "./utils"

export const MuiFilters: React.FC<XDataGridProps> = ({
  finalSchemas,
  partialSchemas,
  include,
  schemaName,
  filter: queryFilter,
  setFilter: setQueryFilter,
  page,
  setPage,
}) => {
  const fields = useMemo(
    () =>
      getFilterableFields(
        finalSchemas,
        schemaName,
        (include as string[]) ?? [],
      ),
    [finalSchemas, include, schemaName],
  )

  const defaultFilter = useMemo(
    () => ({ field: fields[0], operator: "icontains", value: "" }),
    [fields],
  )

  const buttonRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState<boolean>(false)
  const [filters, _setFilters] = useState<FilterArray>([{ ...defaultFilter }])

  const applyFilters = useCallback(
    debounce((filters: FilterArray) => {
      const queryFilters = filters.filter((filter) => {
        // filter out empty values only if they are not empty operators
        if (filter.operator === "empty" || filter.operator === "nempty") {
          return true
        }
        return filter.value !== "" && (filter.value as string[]).length !== 0
      })
      if (queryFilters.length) {
        setPage({ ...page, number: 1 })
      }
      setQueryFilter(queryFilters.length ? queryFilters : undefined)
    }, 500),
    [setQueryFilter],
  )

  const setFilters = useCallback(
    (filters: FilterArray) => {
      _setFilters(filters)
      applyFilters(filters)
    },
    [applyFilters],
  )

  useEffect(() => {
    setFilters([{ ...defaultFilter }])
  }, [defaultFilter, schemaName, setFilters])

  const addNewFilter = () => {
    setFilters([...filters, { ...defaultFilter }])
  }

  const clearFilters = () => {
    setOpen(false)
    setFilters([{ ...defaultFilter }])
  }

  const removeFilter = (index: number) => {
    if (filters.length === 1) {
      return clearFilters()
    }
    const newFilters = [...filters]
    newFilters.splice(index, 1)
    setFilters(newFilters)
  }

  return (
    <>
      <Popover
        anchorEl={buttonRef.current}
        open={open}
        onClose={() => setOpen(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Grid container spacing={1} width="39.5rem" padding="0.75rem">
          <Grid item xs={12}>
            <MuiFilterRows
              finalSchemas={finalSchemas}
              schemaName={schemaName}
              fields={fields}
              filters={filters}
              setFilters={setFilters}
              removeFilter={removeFilter}
            />
          </Grid>
          <Grid item xs={12} justifyContent="space-between" display="flex">
            <Button
              variant="text"
              startIcon={<AddIcon />}
              onClick={addNewFilter}
            >
              Add Filter
            </Button>
            <Button
              variant="text"
              startIcon={<DeleteForeverIcon />}
              onClick={clearFilters}
            >
              Remove All
            </Button>
          </Grid>
        </Grid>
      </Popover>
      <Button
        ref={buttonRef}
        variant="text"
        onClick={() => setOpen(true)}
        startIcon={
          <Badge
            badgeContent={
              Array.isArray(queryFilter) ? queryFilter?.length : undefined
            }
            color="primary"
          >
            <FilterListIcon />
          </Badge>
        }
      >
        Filters
      </Button>
    </>
  )
}

export default MuiFilters
