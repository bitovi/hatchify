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
    ).toBe(JSON.stringify(boolean({ ui: { hidden: true } }).finalize()))
    expect(
      JSON.stringify(
        getForeignKeyAttribute(
          boolean({
            primary: true,
          }).finalize(),
        ),
      ),
    ).toBe(JSON.stringify(boolean({ ui: { hidden: true } }).finalize()))
    expect(
      JSON.stringify(
        getForeignKeyAttribute(boolean({ ui: { hidden: true } }).finalize()),
      ),
    ).toBe(JSON.stringify(boolean({ ui: { hidden: true } }).finalize()))
    expect(JSON.stringify(getForeignKeyAttribute(boolean().finalize()))).toBe(
      JSON.stringify(boolean({ ui: { hidden: true } }).finalize()),
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
    ).toBe(JSON.stringify(dateonly({ ui: { hidden: true } }).finalize()))
    expect(
      JSON.stringify(
        getForeignKeyAttribute(
          dateonly({
            primary: true,
          }).finalize(),
        ),
      ),
    ).toBe(JSON.stringify(dateonly({ ui: { hidden: true } }).finalize()))
    expect(
      JSON.stringify(
        getForeignKeyAttribute(dateonly({ ui: { hidden: true } }).finalize()),
      ),
    ).toBe(JSON.stringify(dateonly({ ui: { hidden: true } }).finalize()))
    expect(JSON.stringify(getForeignKeyAttribute(dateonly().finalize()))).toBe(
      JSON.stringify(dateonly({ ui: { hidden: true } }).finalize()),
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
    ).toBe(JSON.stringify(datetime({ ui: { hidden: true } }).finalize()))
    expect(
      JSON.stringify(
        getForeignKeyAttribute(
          datetime({
            primary: true,
          }).finalize(),
        ),
      ),
    ).toBe(JSON.stringify(datetime({ ui: { hidden: true } }).finalize()))
    expect(
      JSON.stringify(
        getForeignKeyAttribute(datetime({ ui: { hidden: true } }).finalize()),
      ),
    ).toBe(JSON.stringify(datetime({ ui: { hidden: true } }).finalize()))
    expect(JSON.stringify(getForeignKeyAttribute(datetime().finalize()))).toBe(
      JSON.stringify(datetime({ ui: { hidden: true } }).finalize()),
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
        enumerate({
          ui: { hidden: true },
          values: ["one", "two", "three"],
        }).finalize(),
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
        enumerate({
          ui: { hidden: true },
          values: ["one", "two", "three"],
        }).finalize(),
      ),
    )
    expect(
      JSON.stringify(
        getForeignKeyAttribute(
          enumerate({
            values: ["one", "two", "three"],
            ui: { hidden: true },
          }).finalize(),
        ),
      ),
    ).toBe(
      JSON.stringify(
        enumerate({
          ui: { hidden: true },
          values: ["one", "two", "three"],
        }).finalize(),
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
    ).toBe(JSON.stringify(integer({ ui: { hidden: true } }).finalize()))
    expect(
      JSON.stringify(
        getForeignKeyAttribute(
          integer({
            primary: true,
          }).finalize(),
        ),
      ),
    ).toBe(JSON.stringify(integer({ ui: { hidden: true } }).finalize()))
    expect(
      JSON.stringify(
        getForeignKeyAttribute(integer({ ui: { hidden: true } }).finalize()),
      ),
    ).toBe(JSON.stringify(integer({ ui: { hidden: true } }).finalize()))
    expect(JSON.stringify(getForeignKeyAttribute(integer().finalize()))).toBe(
      JSON.stringify(integer({ ui: { hidden: true } }).finalize()),
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
    ).toBe(JSON.stringify(number({ ui: { hidden: true } }).finalize()))
    expect(
      JSON.stringify(
        getForeignKeyAttribute(
          number({
            primary: true,
          }).finalize(),
        ),
      ),
    ).toBe(JSON.stringify(number({ ui: { hidden: true } }).finalize()))
    expect(
      JSON.stringify(
        getForeignKeyAttribute(number({ ui: { hidden: true } }).finalize()),
      ),
    ).toBe(JSON.stringify(number({ ui: { hidden: true } }).finalize()))
    expect(JSON.stringify(getForeignKeyAttribute(number().finalize()))).toBe(
      JSON.stringify(number({ ui: { hidden: true } }).finalize()),
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
    ).toBe(JSON.stringify(string({ ui: { hidden: true } }).finalize()))
    expect(
      JSON.stringify(
        getForeignKeyAttribute(
          string({
            primary: true,
          }).finalize(),
        ),
      ),
    ).toBe(JSON.stringify(string({ ui: { hidden: true } }).finalize()))
    expect(
      JSON.stringify(
        getForeignKeyAttribute(string({ ui: { hidden: true } }).finalize()),
      ),
    ).toBe(JSON.stringify(string({ ui: { hidden: true } }).finalize()))
    expect(JSON.stringify(getForeignKeyAttribute(string().finalize()))).toBe(
      JSON.stringify(string({ ui: { hidden: true } }).finalize()),
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
    ).toBe(JSON.stringify(text({ ui: { hidden: true } }).finalize()))
    expect(
      JSON.stringify(
        getForeignKeyAttribute(
          text({
            primary: true,
          }).finalize(),
        ),
      ),
    ).toBe(JSON.stringify(text({ ui: { hidden: true } }).finalize()))
    expect(
      JSON.stringify(
        getForeignKeyAttribute(text({ ui: { hidden: true } }).finalize()),
      ),
    ).toBe(JSON.stringify(text({ ui: { hidden: true } }).finalize()))
    expect(JSON.stringify(getForeignKeyAttribute(text().finalize()))).toBe(
      JSON.stringify(text({ ui: { hidden: true } }).finalize()),
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
    ).toBe(JSON.stringify(uuid({ ui: { hidden: true } }).finalize()))
    expect(
      JSON.stringify(
        getForeignKeyAttribute(
          uuid({
            primary: true,
          }).finalize(),
        ),
      ),
    ).toBe(JSON.stringify(uuid({ ui: { hidden: true } }).finalize()))
    expect(
      JSON.stringify(
        getForeignKeyAttribute(uuid({ ui: { hidden: true } }).finalize()),
      ),
    ).toBe(JSON.stringify(uuid({ ui: { hidden: true } }).finalize()))
    expect(JSON.stringify(getForeignKeyAttribute(uuid().finalize()))).toBe(
      JSON.stringify(uuid({ ui: { hidden: true } }).finalize()),
    )
  })
})
