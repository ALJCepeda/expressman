import Manifest from "../services/Manifest";
import {RouteHandlerConstructor} from "../models/IRouteHandler";
import {injectable} from "tsyringe";

export function Route(method:string, path:string) {
  return (target:RouteHandlerConstructor) => {
    injectable()(target);
    Manifest.recordRoute(target, method, path);
  }
}