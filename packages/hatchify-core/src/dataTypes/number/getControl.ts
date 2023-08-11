import { calculateAllowNull } from "./calculateAllowNull"
import type { PartialNumberControlType, PartialNumberProps } from "../../types"

export function getControl(
  finalize: true,
  props?: PartialNumberProps,
): Required<PartialNumberControlType>

export function getControl(
  finalize: false,
  props?: PartialNumberProps,
): PartialNumberControlType

export function getControl(
  finalize: boolean,
  props?: PartialNumberProps,
): PartialNumberControlType | Required<PartialNumberControlType>

export function getControl(
  finalize: boolean,
  props?: PartialNumberProps,
): PartialNumberControlType | Required<PartialNumberControlType> {
  return {
    type: "Number",
    allowNull: calculateAllowNull(finalize, props?.required, props?.primary),
    min: finalize ? props?.min ?? -Infinity : props?.min,
    max: finalize ? props?.max ?? Infinity : props?.max,
    primary: finalize ? !!props?.primary : props?.primary,
    step: props?.step,
  }
}
