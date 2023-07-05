import { Fragment } from "react"
import type { Relationship as RelationshipType } from "../../../presentation/interfaces"

export const String: React.FC<{ value: string }> = ({ value }) => {
  return <>{value}</>
}

export const StringList: React.FC<{ values: string[] }> = ({ values }) => {
  return (
    <>
      {values.map((value, index) => {
        return (
          <Fragment key={index}>
            <String value={value} />
            {index !== values.length - 1 && "; "}
          </Fragment>
        )
      })}
    </>
  )
}

export const Number: React.FC<{ value: number }> = ({ value }) => {
  return <>{new Intl.NumberFormat(navigator.language).format(value)}</>
}

export const NumberList: React.FC<{ values: number[] }> = ({ values }) => {
  return (
    <>
      {values.map((value, index) => {
        return (
          <Fragment key={index}>
            <Number value={value} />
            {index !== values.length - 1 && "; "}
          </Fragment>
        )
      })}
    </>
  )
}

export const Boolean: React.FC<{ value: boolean }> = ({ value }) => {
  return <>{value ? "true" : "false"}</>
}

export const BooleanList: React.FC<{ values: boolean[] }> = ({ values }) => {
  return (
    <>
      {values.map((value, index) => {
        return (
          <Fragment key={index}>
            <Boolean value={value} />
            {index !== values.length - 1 && ", "}
          </Fragment>
        )
      })}
    </>
  )
}

export const Date: React.FC<{ value: string }> = ({ value }) => {
  const formattedDate = isNaN(window.Date.parse(value))
    ? undefined
    : new Intl.DateTimeFormat(navigator.language, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      }).format(new window.Date(value))

  return <>{formattedDate}</>
}

export const DateList: React.FC<{ values: string[] }> = ({ values }) => {
  return (
    <>
      {values.map((value, index) => {
        return (
          <Fragment key={index}>
            <Date value={value} />
            {index !== values.length - 1 && "; "}
          </Fragment>
        )
      })}
    </>
  )
}

export const Relationship: React.FC<{ value: RelationshipType }> = ({
  value,
}) => {
  return <>{value.label}</>
}

export const RelationshipList: React.FC<{ values: RelationshipType[] }> = ({
  values,
}) => {
  return (
    <>
      {values.map((value, index) => {
        return (
          <Fragment key={value.id}>
            <Relationship value={value} />
            {index !== values.length - 1 && ", "}
          </Fragment>
        )
      })}
    </>
  )
}
