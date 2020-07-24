import {Project} from "ts-morph";

const project = new Project();

project.addSourceFilesAtPaths([
  'src/unit-test-resources/DeclarationParser/JSONFromType/*.ts',
  'src/unit-test-resources/DeclarationParser/JSONFromClass/*.ts',
  'src/unit-test-resources/DeclarationParser/Tracker/*.ts'
]);

export default project;
