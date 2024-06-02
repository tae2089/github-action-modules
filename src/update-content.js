import * as core from "@actions/core";
import GitHub from "./classes/github";
import Yaml from "./classes/yaml";

await (async () => {
  // get inputs
  const token = core.getInput("token", { required: true });
  const repository = core.getInput("repository", { required: false });
  const branch = core.getInput("branch", { required: false });
  const path = core.getInput("path", { required: true });
  const key = core.getInput("key", { required: true });
  const value = core.getInput("value", { required: true });
  let message = core.getInput("message", { required: false });

  //constant variables
  const [owner, repo] = repository.split("/");

  // setup github clients
  const git = new GitHub(token);
  const yaml = new Yaml();
  // vaildate the inputs
  if (!path.endsWith(".yaml")) {
    core.setFailed(`Expected path to end with .yaml.`);
    return;
  }

  if (!message) {
    message = `Updated ${key} to ${value} in ${path}.`;
  }
  const file = await git.getFileContent(owner, repo, branch, path);
  const updatedContent = yaml.UpdateValue(file.content, key, value);
  await git.updateFileContent(
    owner,
    repo,
    branch,
    path,
    updatedContent,
    file.sha,
    message
  );
})();
