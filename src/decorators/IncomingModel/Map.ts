import { kebabCase } from 'lodash';
import InputMetadata from "../../services/metadata/InputMetadata";
import {Definition} from "typescript-json-schema";

export type RuleFactory<InputType, FactoryArgs = InputType> = (arg:FactoryArgs, modifiers?: RuleModifiers<InputType>) => ValidationRule<InputType>;
export type RuleDict = { [key:string]: RuleFactory<any> | ValidationRule<any> };

export interface RuleModifiers<InputType> {
  rejectWith?(input:InputType, label?:string): string
}

export interface ValidationRule<InputType> {
  modifiers?: RuleModifiers<InputType>;
  valid(input:InputType):boolean;
  rejectWith(input:InputType, label?:string): string;
  schema: Definition;
}

export interface MapOptions<InputType> {
  label?:string;
  default?:InputType;
  optional?:boolean;
  transform?(input:any): InputType;
  validate?:Array<ValidationRule<InputType>>;
}

export function Map<InputType>(path:string[], options:MapOptions<InputType> = {}) {
  return (target:any, propertyKey: string) => {
    if(path.length === 1) {
      path.push(kebabCase(propertyKey));
    }

    InputMetadata.createMap(target.constructor, propertyKey, path, options);
  }
}
function createMap<InputType>(requestKey:'query' | 'body' | 'headers' | 'cookies' | 'params', options:MapOptions<InputType>);
function createMap<InputType>(requestKey:'query' | 'body' | 'headers' | 'cookies' | 'params', key?:string, options?:MapOptions<InputType>);
function createMap(requestKey:'query' | 'body' | 'headers' | 'cookies' | 'params', key?:any, options?:any) {
  const path: string[] = [requestKey];

  if(typeof key === 'string') {
    path.push(key);
    return Map(path, options);
  }

  return Map(path, key);
}
export function Query<InputType>(options?:MapOptions<InputType>);
export function Query<InputType>(key:string, options?:MapOptions<InputType>);
export function Query(key?:any, options?:any) {
  return createMap('query', key, options);
}

export function Body<InputType>(options?:MapOptions<InputType>);
export function Body<InputType>(key:string, options?:MapOptions<InputType>);
export function Body(key?:any, options?:any) {
  return createMap('body', key, options);
}

export function Header<InputType>(options?:MapOptions<InputType>);
export function Header<InputType>(key:string, options?:MapOptions<InputType>);
export function Header(key?:any, options?:any) {
  return createMap('headers', key, options);
}

export function Cookie<InputType>(options?:MapOptions<InputType>);
export function Cookie<InputType>(key:string, options?:MapOptions<InputType>);
export function Cookie(key?:any, options?:any) {
  return createMap('cookies', key, options);
}

export function Param<InputType>(options?:MapOptions<InputType>);
export function Param<InputType>(key:string, options?:MapOptions<InputType>);
export function Param(key?:any, options?:any) {
  return createMap('params', key, options);
}
