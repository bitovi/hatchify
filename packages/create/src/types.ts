type ColorFunc = (str: string | number) => string

export type Backend = {
  name: string
  display: string
  color: ColorFunc
  dependencies: string[]
  devDependencies: string[]
}

export type Database = {
  name: string
  display: string
  color: ColorFunc
  dependencies: string[]
  devDependencies: string[]
}

export type Frontend = {
  name: string
  display: string
  color: ColorFunc
  dependencies: string[]
  devDependencies: string[]
}
