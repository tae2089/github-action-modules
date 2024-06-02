import * as core from "@actions/core";
import * as github from "@actions/github";

class GitHub {
  constructor(token) {
    this.octokit = github.getOctokit(token);
  }

  async getFileContent(owner, repo, branch, filePath) {
    try {
      const response = await this.octokit.rest.repos.getContent({
        owner: owner,
        repo: repo,
        path: filePath,
        ref: branch,
      });

      const content = Buffer.from(response.data.content, "base64").toString();
      return { content, sha: response.data.sha };
    } catch (error) {
      core.setFailed(`Failed to fetch file content: ${error.message}`);
      return null;
    }
  }

  async updateFileContent(
    owner,
    repo,
    branch,
    filePath,
    content,
    sha,
    commitMessage
  ) {
    try {
      const encodedContent = Buffer.from(content).toString("base64");

      await this.octokit.rest.repos.createOrUpdateFileContents({
        owner: owner,
        repo: repo,
        path: filePath,
        branch: branch,
        message: commitMessage,
        content: encodedContent,
        sha: sha,
      });
      core.setOutput("result", "File content updated successfully.");
    } catch (error) {
      core.setFailed(`Failed to update file content: ${error.message}`);
    }
  }
}

export default GitHub;
