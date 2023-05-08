import { createContext, useContext } from "react"

import type {
  // XListProps,
  // XLayoutProps,
  // XDetailsProps,
  Relationship as RelationshipType,
  // XFormProps,
} from "../../presentation/interfaces"
// import {
//   Boolean,
//   BooleanList,
//   Date,
//   DateList,
//   Number,
//   NumberList,
//   Relationship,
//   RelationshipList,
//   String,
//   StringList,
// } from "./DefaultDisplayComponents"
// import {
//   Boolean as BooleanInput,
//   Date as DateInput,
//   Number as NumberInput,
//   String as StringInput,
//   Relationship as RelationshipInput,
// } from "./DefaultFieldComponents"

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
