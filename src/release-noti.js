import * as core from "@actions/core";
import * as github from "@actions/github";
import fs from "fs";

await (async () => {
  try {
    const owner = core.getInput("owner", { required: true });
    const repo = core.getInput("repo", { required: true });
    const token = core.getInput("token", { required: true });

    const outputFile = owner + "-" + repo + ".json";
    const octokit = github.getOctokit(token);
    // Get the latest release
    const response = await octokit.rest.repos.getLatestRelease({
      owner,
      repo,
    });
    // Get the tag name
    const html_url_splits = response.html_url.split("/");
    const tag = html_url_splits[html_url_splits.length - 1];
    // Check if the cache file exists for comaparing the latest release
    const isExistsCache = inspectionFindFile("./" + outputFile);
    // when cache file exists,
    if (isExistsCache) {
      // Read the cache file
      const file_data = JSON.parse(fs.readFileSync(outputFile, "utf8"));
      // Compare the latest release tag with the cache file
      if (file_data.tag === tag) {
        core.setOutput("err", "No new release");
        return;
      }
    }
    writeCacheFile(response.html_url, tag, outputFile);
    core.setOutput("url", response.html_url);
    core.setOutput("tag", tag);
    return;
  } catch (error) {
    core.setFailed(error);
  }
})();

const inspectionFindFile = (destPath) => {
  //Directory 존재 여부 체크
  const isExists = fs.existsSync(destPath); //디렉토리 경로 입력
  // isExistsx가 존재 한다면 true 없다면 false
  console.log("Boolan : ", isExists);
  return isExists;
};

const writeCacheFile = (url, tag, fileName) => {
  // Write the latest release to the cache file
  fs.writeFileSync(
    fileName,
    JSON.stringify(
      {
        url: url,
        tag: tag,
      },
      null,
      2
    )
  );
};
