import {Wrapperware} from "../types";
import {NextFunction, Request, RequestHandler, Response} from "express";
import {APIDescriptor, RouteDescriptor} from "../services/metadata/RouteMetadata";
import {payloadFromMap} from "../services/payloadFromMap";
import {ValidationError} from "../models/errors/ValidationError";
import DependencyContainer from "tsyringe/dist/typings/types/dependency-container";
import InputMetadata from "../services/metadata/InputMetadata";

async function getPayload(api:APIDescriptor, route:RouteDescriptor, req:Request) {
  const inputName = route.schema.input?.name;
  
  if(!inputName) {
    return { payload:req.body, errors:[], valid: true };
  }
  
  const inputMetadata = InputMetadata.byName.get(inputName)!;
  const {payload, errorPairs, valid} = await payloadFromMap(inputMetadata, req);
  const InputClass = inputMetadata.target;
  
  const error = new ValidationError();
  error.payload = errorPairs;

  return {
    payload: Object.assign(new InputClass(), payload),
    error,
    valid
  };
}

export function RouteMiddleware(api:APIDescriptor, route: RouteDescriptor, onResult?: (result:any, resp:Response) => void): RequestHandler {
  let handler;

  return async (req:Request, resp:Response, next:NextFunction) => {
    try {
      const container = resp.locals.container as DependencyContainer;
      const { payload, error, valid } = await getPayload(api, route, req);
      resp.locals['$payload'] = payload;
      resp.locals['$validationError'] = error;
      resp.locals['$valid'] = valid;

      if(!valid) {
        return next(error);
      }
      
      const action = async () => {
        handler = container.resolve(api.target);
        const result = await handler[route.property](payload, req, resp);
        resp.locals[api.target.name] = result;
        onResult && onResult(result, resp);
        return next();
      }

      return await wrap(container, action, route.wrap)();
    } catch(err) {
      return next(err);
    }
  }
}

function wrap(container: DependencyContainer, initiator: () => Promise<any>, wrappers: Array<Wrapperware>): () => Promise<any> {
  return wrappers.reduce((previousCaller, wrapper) => {
    return async () => {
      await wrapper(container, previousCaller as () => Promise<any>);
    };
  }, initiator) as () => Promise<any>;
}
