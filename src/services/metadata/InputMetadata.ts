import {
  AnyNewable
} from "../../types";
import Dict = NodeJS.Dict;
import {MapOptions} from "../../decorators";

type MappedPropertyOptions = MapOptions<any> & {
  path: string[];
}

export class InputDescriptor {
  public propertyMap:Dict<MappedPropertyOptions> = {};
  
  constructor(
    public target:AnyNewable
  ) { }
}

class InputMetadata {
  inputs: Map<AnyNewable, InputDescriptor> = new Map();
  byName: Map<string, InputDescriptor> = new Map();
  
  get(target:AnyNewable): InputDescriptor {
    if(!this.inputs.has(target)) {
      const descriptor = new InputDescriptor(target);
      this.inputs.set(target, descriptor);
      this.byName.set(target.name, descriptor);
      return descriptor;
    }
    
    return this.inputs.get(target)!;
  }
  
  forProperty(name:string, property:string): MappedPropertyOptions | undefined {
    const descriptor = this.byName.get(name);
    return descriptor?.propertyMap[property];
  }
  
  createMap<InputType>(target:AnyNewable, property:string, path:string[], options:MapOptions<InputType>) {
    const descriptor = this.get(target as AnyNewable);
    descriptor.propertyMap[property] = {
      ...options,
      path
    };
    
    this.inputs.set(target, descriptor);
  }
}

export default new InputMetadata();
