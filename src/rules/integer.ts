import {RuleFactory} from "../decorators";
import { capitalize } from "lodash";

export const GreaterThan:RuleFactory<number> = (value, modifiers) => ({
  modifiers,
  valid: (input) => input > value,
  rejectWith: (input, label) => `${capitalize(label)} must be greater than ${value}`,
  schema: {
    minimum: (value + 1)
  }
});

export const Integer = {
  GreaterThan
}