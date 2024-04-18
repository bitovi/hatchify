import type { ControlTypes, StringStep } from "@hatchifyjs/core"
import { createContext, useContext } from "react"

import type {
  XEverythingProps,
  XLayoutProps,
  Relationship as RelationshipType,
  XDataGridProps,
} from "../../presentation/interfaces.js"

import {
  Boolean,
  BooleanList,
  Date,
  DateList,
  Number,
  NumberList,
  Relationship,
  RelationshipList,
  String,
  StringList,
} from "./DefaultDisplayComponents/index.js"
import {
  Boolean as BooleanInput,
  Date as DateInput,
  Number as NumberInput,
  String as StringInput,
  Relationship as RelationshipInput,
} from "./DefaultFieldComponents/index.js"

export interface DefaultDisplayComponentsTypes {
  String: React.FC<{ value: string }>
  StringList: React.FC<{ values: string[] }>
  Number: React.FC<{ value: number }>
  NumberList: React.FC<{ values: number[] }>
  Boolean: React.FC<{ value: boolean }>
  BooleanList: React.FC<{ values: boolean[] }>
  Date: React.FC<{
    type: ControlTypes
    step?: StringStep | number
    value: string
  }>
  DateList: React.FC<{
    type: ControlTypes
    step?: StringStep | number
    values: string[]
  }>
  Relationship: React.FC<{ value: RelationshipType }>
  RelationshipList: React.FC<{ values: RelationshipType[] }>
}

export interface DefaultFieldComponentsTypes {
  Boolean: React.FC<{
    value: boolean
    label: string
    onUpdate: (value: boolean) => void
  }>
  Date: React.FC<{
    type: ControlTypes
    value: string
    label: string
    onUpdate: (value: string) => void
  }>
  Number: React.FC<{
    value: number
    label: string
    onUpdate: (value: number) => void
  }>
  String: React.FC<{
    value: string
    label: string
    onUpdate: (value: string) => void
  }>
  Relationship: React.FC<{
    values: string[]
    hasMany: boolean
    options: Array<{ id: string; label: string }>
    label: string
    onUpdate: (value: string[]) => void
  }>
}

export interface HatchifyPresentationContextProps {
  DataGrid: React.FC<XDataGridProps>
  Layout: React.FC<XLayoutProps>
  Everything: React.FC<XEverythingProps>
  Navigation: React.FC<any>
  NoSchemas: React.FC<any>
  Filters: React.FC<XDataGridProps>
  Pagination: React.FC<XDataGridProps>
  List: React.FC<XDataGridProps>
  defaultDisplayComponents: DefaultDisplayComponentsTypes
  // future: defaultFieldComponents
}

export const HatchifyPresentationDefaultDisplayComponents = {
  String,
  StringList,
  Number,
  NumberList,
  Boolean,
  BooleanList,
  Date,
  DateList,
  Relationship,
  RelationshipList,
}

export const HatchifyPresentationDefaultFieldComponents = {
  String: StringInput,
  Number: NumberInput,
  Boolean: BooleanInput,
  Date: DateInput,
  Relationship: RelationshipInput,
}

export const HatchifyPresentationContext =
  createContext<HatchifyPresentationContextProps>({
    // should we have a default (headless) implementation of these?
    DataGrid: () => null,
    Everything: () => null,
    Navigation: () => null,
    NoSchemas: () => null,
    Filters: () => null,
    Pagination: () => null,
    List: () => null,
    Layout: () => null,
    defaultDisplayComponents: HatchifyPresentationDefaultDisplayComponents,
    // future: defaultFieldComponents
  })

export const useHatchifyPresentation = (): HatchifyPresentationContextProps =>
  useContext(HatchifyPresentationContext)

interface HatchifyPresentationProviderProps
  extends HatchifyPresentationContextProps {
  children: React.ReactNode
}

export const HatchifyPresentationProvider: React.FC<
  HatchifyPresentationProviderProps
> = ({
  DataGrid,
  Everything,
  Navigation,
  NoSchemas,
  Filters,
  Pagination,
  List,
  Layout,
  defaultDisplayComponents,
  children,
}) => {
  return (
    <HatchifyPresentationContext.Provider
      value={{
        DataGrid,
        Everything,
        Navigation,
        NoSchemas,
        Filters,
        Pagination,
        List,
        Layout,
        defaultDisplayComponents,
      }}
    >
      {children}
    </HatchifyPresentationContext.Provider>
  )
}
