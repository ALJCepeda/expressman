import path from "path";
import RouteMetadata, {RouteSchemaArg} from "./metadata/RouteMetadata";
import { HTTPMethods } from "../decorators";
import {Definition} from "typescript-json-schema/typescript-json-schema";
import InputMetadata from "./metadata/InputMetadata";

interface TypeDefinition {
  name: string,
  schema: Definition
}
type RouteSchema = {
  [key in HTTPMethods]: {
    method: key,
    path: string,
    input?: TypeDefinition,
    output?: TypeDefinition
  }
}

interface GenerateAPISchema {
  [key:string]: RouteSchema
}

export const APISchemaGenerator = {
  schemaFromMetadata(): GenerateAPISchema {
    const schema: GenerateAPISchema = {};
    
    RouteMetadata.apis.forEach((api) => {
      api.routes.forEach((route) => {
        const url = path.normalize(`${api.path}/${route.schema.path}`).replace(/\/$/, '');
        const routeDefinition = {
          ...schema[url],
          [route.schema.method]: route.schema
        };
        
        if(route.schema.input) {
          addInputMetadataSchemas(route.schema.input);
        }
  
        if(route.schema.output) {
          addInputMetadataSchemas(route.schema.output);
        }
        
        schema[url] = routeDefinition;
      });
    });
    
    return schema;
  }
}

function addInputMetadataSchemas(arg: RouteSchemaArg) {
  Object.entries(arg.schema.properties).forEach(([property, propSchema]) => {
    const mapOptions = InputMetadata.forProperty(arg.name, property);
    
    if(mapOptions) {
      mapOptions.validate?.forEach((rule) => {
        Object.assign(propSchema, rule.schema);
      });
    }
  });
}