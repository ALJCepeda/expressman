import {Application, Request, Response} from "express";
import glob = require("glob");
import Manifest from "./Manifest";
import DependencyContainer from "tsyringe/dist/typings/types/dependency-container";

interface PublishOptions {
  routeDir: string;
  prehandle?(container:DependencyContainer, request:Request, response:Response);
}

interface PublishResult {
  app:Application,
  files:string[]
}

export function publish<U>(app:Application, options:PublishOptions): Promise<PublishResult> {
  return new Promise((resolve, reject) => {
    glob(`${process.cwd()}/${options.routeDir}/**/*.ts`, (err, files) => {
      if(err) reject(err);

      files.forEach(file => require(file));
      Manifest.generateRoutes(app, options);
      resolve({
        app, files
      });
    });
  });
}
