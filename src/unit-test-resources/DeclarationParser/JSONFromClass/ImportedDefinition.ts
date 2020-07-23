import {MyPayload} from "./MyPayload";
import {MyResult} from "./MyResult";
import {IRouteHandler} from "../../../types";

export class InterfaceDefinition implements IRouteHandler {
  handle(payload:MyPayload): MyResult {
    return { success: true };
  };
}
