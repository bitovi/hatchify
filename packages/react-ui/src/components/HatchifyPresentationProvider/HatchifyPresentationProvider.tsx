import { createContext, useContext } from "react"

import type {
  XLayoutProps,
  XDetailsProps,
  Relationship as RelationshipType,
  XFormProps,
  XCollectionProps,
} from "../../presentation/interfaces"

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
} from "./DefaultDisplayComponents"
import {
  Boolean as BooleanInput,
  Date as DateInput,
  Number as NumberInput,
  String as StringInput,
  Relationship as RelationshipInput,
} from "./DefaultFieldComponents"

export interface DefaultValueComponentsTypes {
  String: React.FC<{ value: string }>
  StringList: React.FC<{ values: string[] }>
  Number: React.FC<{ value: number }>
  NumberList: React.FC<{ values: number[] }>
  Boolean: React.FC<{ value: boolean }>
  BooleanList: React.FC<{ values: boolean[] }>
  Date: React.FC<{ value: string }>
  DateList: React.FC<{ values: string[] }>
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
  Collection: React.FC<XCollectionProps>
  Layout: React.FC<XLayoutProps>
  Details: React.FC<XDetailsProps>
  Filter: React.FC<XFilterProps>
  Form: React.FC<XFormProps>
  defaultValueComponents: DefaultValueComponentsTypes
  defaultFieldComponents: DefaultFieldComponentsTypes
}

export const HatchifyPresentationDefaultValueComponents = {
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
    // @todo default/headless components?
    Collection: () => null,
    Layout: () => null,
    Details: () => null,
    Form: () => null,
    defaultValueComponents: HatchifyPresentationDefaultValueComponents,
    defaultFieldComponents: HatchifyPresentationDefaultFieldComponents,
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
  Collection,
  Layout,
  Details,
  Form,
  defaultValueComponents,
  defaultFieldComponents,
  children,
}) => {
  return (
    <HatchifyPresentationContext.Provider
      value={{
        Collection,
        Layout,
        Details,
        Form,
        defaultValueComponents,
        defaultFieldComponents,
      }}
    >
      {children}
    </HatchifyPresentationContext.Provider>
  )
}
