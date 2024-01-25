import { getForeignKeyAttribute } from "./getForeignKeyAttribute.js"
import {
  boolean,
  dateonly,
  datetime,
  enumerate,
  integer,
  number,
  string,
  text,
  uuid,
} from "../../core.js"

describe("getForeignKeyAttribute", () => {
  it("works for boolean", () => {
    expect(
      JSON.stringify(
        getForeignKeyAttribute(
          boolean({
            primary: true,
            required: true,
            unique: true,
          }).finalize(),
        ),
      ),
    ).toBe(JSON.stringify(boolean({ hidden: true }).finalize()))
    expect(
      JSON.stringify(
        getForeignKeyAttribute(
          boolean({
            primary: true,
          }).finalize(),
        ),
      ),
    ).toBe(JSON.stringify(boolean({ hidden: true }).finalize()))
    expect(
      JSON.stringify(
        getForeignKeyAttribute(boolean({ hidden: true }).finalize()),
      ),
    ).toBe(JSON.stringify(boolean({ hidden: true }).finalize()))
    expect(JSON.stringify(getForeignKeyAttribute(boolean().finalize()))).toBe(
      JSON.stringify(boolean({ hidden: true }).finalize()),
    )
  })

  it("works for dateonly", () => {
    expect(
      JSON.stringify(
        getForeignKeyAttribute(
          dateonly({
            primary: true,
            required: true,
            unique: true,
          }).finalize(),
        ),
      ),
    ).toBe(JSON.stringify(dateonly({ hidden: true }).finalize()))
    expect(
      JSON.stringify(
        getForeignKeyAttribute(
          dateonly({
            primary: true,
          }).finalize(),
        ),
      ),
    ).toBe(JSON.stringify(dateonly({ hidden: true }).finalize()))
    expect(
      JSON.stringify(
        getForeignKeyAttribute(dateonly({ hidden: true }).finalize()),
      ),
    ).toBe(JSON.stringify(dateonly({ hidden: true }).finalize()))
    expect(JSON.stringify(getForeignKeyAttribute(dateonly().finalize()))).toBe(
      JSON.stringify(dateonly({ hidden: true }).finalize()),
    )
  })

  it("works for datetime", () => {
    expect(
      JSON.stringify(
        getForeignKeyAttribute(
          datetime({
            primary: true,
            required: true,
            unique: true,
          }).finalize(),
        ),
      ),
    ).toBe(JSON.stringify(datetime({ hidden: true }).finalize()))
    expect(
      JSON.stringify(
        getForeignKeyAttribute(
          datetime({
            primary: true,
          }).finalize(),
        ),
      ),
    ).toBe(JSON.stringify(datetime({ hidden: true }).finalize()))
    expect(
      JSON.stringify(
        getForeignKeyAttribute(datetime({ hidden: true }).finalize()),
      ),
    ).toBe(JSON.stringify(datetime({ hidden: true }).finalize()))
    expect(JSON.stringify(getForeignKeyAttribute(datetime().finalize()))).toBe(
      JSON.stringify(datetime({ hidden: true }).finalize()),
    )
  })

  it("works for enumerate", () => {
    expect(
      JSON.stringify(
        getForeignKeyAttribute(
          enumerate({
            values: ["one", "two", "three"],
            primary: true,
            required: true,
            unique: true,
          }).finalize(),
        ),
      ),
    ).toBe(
      JSON.stringify(
        enumerate({ hidden: true, values: ["one", "two", "three"] }).finalize(),
      ),
    )
    expect(
      JSON.stringify(
        getForeignKeyAttribute(
          enumerate({
            values: ["one", "two", "three"],
            primary: true,
          }).finalize(),
        ),
      ),
    ).toBe(
      JSON.stringify(
        enumerate({ hidden: true, values: ["one", "two", "three"] }).finalize(),
      ),
    )
    expect(
      JSON.stringify(
        getForeignKeyAttribute(
          enumerate({
            values: ["one", "two", "three"],
            hidden: true,
          }).finalize(),
        ),
      ),
    ).toBe(
      JSON.stringify(
        enumerate({ hidden: true, values: ["one", "two", "three"] }).finalize(),
      ),
    )
  })

  it("works for integer", () => {
    expect(
      JSON.stringify(
        getForeignKeyAttribute(
          integer({
            primary: true,
            required: true,
            unique: true,
          }).finalize(),
        ),
      ),
    ).toBe(JSON.stringify(integer({ hidden: true }).finalize()))
    expect(
      JSON.stringify(
        getForeignKeyAttribute(
          integer({
            primary: true,
          }).finalize(),
        ),
      ),
    ).toBe(JSON.stringify(integer({ hidden: true }).finalize()))
    expect(
      JSON.stringify(
        getForeignKeyAttribute(integer({ hidden: true }).finalize()),
      ),
    ).toBe(JSON.stringify(integer({ hidden: true }).finalize()))
    expect(JSON.stringify(getForeignKeyAttribute(integer().finalize()))).toBe(
      JSON.stringify(integer({ hidden: true }).finalize()),
    )
  })

  it("works for number", () => {
    expect(
      JSON.stringify(
        getForeignKeyAttribute(
          number({
            primary: true,
            required: true,
            unique: true,
          }).finalize(),
        ),
      ),
    ).toBe(JSON.stringify(number({ hidden: true }).finalize()))
    expect(
      JSON.stringify(
        getForeignKeyAttribute(
          number({
            primary: true,
          }).finalize(),
        ),
      ),
    ).toBe(JSON.stringify(number({ hidden: true }).finalize()))
    expect(
      JSON.stringify(
        getForeignKeyAttribute(number({ hidden: true }).finalize()),
      ),
    ).toBe(JSON.stringify(number({ hidden: true }).finalize()))
    expect(JSON.stringify(getForeignKeyAttribute(number().finalize()))).toBe(
      JSON.stringify(number({ hidden: true }).finalize()),
    )
  })

  it("works for string", () => {
    expect(
      JSON.stringify(
        getForeignKeyAttribute(
          string({
            primary: true,
            required: true,
            unique: true,
          }).finalize(),
        ),
      ),
    ).toBe(JSON.stringify(string({ hidden: true }).finalize()))
    expect(
      JSON.stringify(
        getForeignKeyAttribute(
          string({
            primary: true,
          }).finalize(),
        ),
      ),
    ).toBe(JSON.stringify(string({ hidden: true }).finalize()))
    expect(
      JSON.stringify(
        getForeignKeyAttribute(string({ hidden: true }).finalize()),
      ),
    ).toBe(JSON.stringify(string({ hidden: true }).finalize()))
    expect(JSON.stringify(getForeignKeyAttribute(string().finalize()))).toBe(
      JSON.stringify(string({ hidden: true }).finalize()),
    )
  })

  it("works for text", () => {
    expect(
      JSON.stringify(
        getForeignKeyAttribute(
          text({
            primary: true,
            required: true,
            unique: true,
          }).finalize(),
        ),
      ),
    ).toBe(JSON.stringify(text({ hidden: true }).finalize()))
    expect(
      JSON.stringify(
        getForeignKeyAttribute(
          text({
            primary: true,
          }).finalize(),
        ),
      ),
    ).toBe(JSON.stringify(text({ hidden: true }).finalize()))
    expect(
      JSON.stringify(getForeignKeyAttribute(text({ hidden: true }).finalize())),
    ).toBe(JSON.stringify(text({ hidden: true }).finalize()))
    expect(JSON.stringify(getForeignKeyAttribute(text().finalize()))).toBe(
      JSON.stringify(text({ hidden: true }).finalize()),
    )
  })

  it("works for uuid", () => {
    expect(
      JSON.stringify(
        getForeignKeyAttribute(
          uuid({
            primary: true,
            required: true,
            unique: true,
          }).finalize(),
        ),
      ),
    ).toBe(JSON.stringify(uuid({ hidden: true }).finalize()))
    expect(
      JSON.stringify(
        getForeignKeyAttribute(
          uuid({
            primary: true,
          }).finalize(),
        ),
      ),
    ).toBe(JSON.stringify(uuid({ hidden: true }).finalize()))
    expect(
      JSON.stringify(getForeignKeyAttribute(uuid({ hidden: true }).finalize())),
    ).toBe(JSON.stringify(uuid({ hidden: true }).finalize()))
    expect(JSON.stringify(getForeignKeyAttribute(uuid().finalize()))).toBe(
      JSON.stringify(uuid({ hidden: true }).finalize()),
    )
  })
})
