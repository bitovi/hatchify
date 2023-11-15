type ColorFunc = (str: string | number) => string

export type Framework = {
  name: string
  display: string
  color: ColorFunc
  dependencies: string[]
  devDependencies: string[]
}
export type Dialect = {
  name: string
  display: string
  color: ColorFunc
  dependencies: string[]
  devDependencies: string[]
}
