import { getOrm } from "./getOrm"
import type {
  FinalAttribute,
  FinalNumberORM,
  PartialNumberControlType,
  PartialNumberORM,
  PartialNumberProps,
} from "../../types"
import { getFinalize as getNumberFinalize } from "../number/getFinalize"

export function getFinalize(
  name: string,
  props?: PartialNumberProps,
): FinalAttribute<
  PartialNumberORM,
  PartialNumberControlType,
  number,
  FinalNumberORM
> {
  return { ...getNumberFinalize(name, props), orm: getOrm(true, props) }
}
