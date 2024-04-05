import * as core from "@actions/core";
import { context } from "@actions/github";

console.log("Doodlin Actions: generate-tag.");

function shorten(sha, length) {
  if (!sha) {
    throw new Error("Input SHA must be passed");
  }

  if (length <= 0 || !Number.isInteger(length)) {
    throw new Error("Input SHA has invalid length");
  }

  if (sha.length < length) {
    throw new Error("Input SHA is too short");
  }

  return sha.substring(0, length);
}

await (async () => {
  try {
    const sha = context.sha;
    const length = core.getInput("length", { required: true });
    const manualTag = core.getInput("tag", { required: false });
    const prefix = core.getInput("prefix", { required: false });

    const tagParts = [];
    if (prefix.length > 0) {
      tagParts.push(prefix);
    }

    if (manualTag.length > 0) {
      tagParts.push(manualTag);
    } else {
      tagParts.push(shorten(sha, length));
    }

    const tag = tagParts.join("-");

    core.setOutput("tag", tag);
    core.exportVariable("tag", tag);

    console.log(
      `Generated tag: "${tag}" you can use this for the next step. output name is tag`
    );
  } catch (error) {
    core.setFailed(error.message);
  }
})();
