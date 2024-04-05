import * as core from "@actions/core";
import * as github from '@actions/github'
import fs from 'fs'

await(async () =>{
    try {
        const owner = core.getInput('owner',{required: true});
        const repo = core.getInput('repo',{required: true});
        const token = core.getInput('token',{required: true});
        
        const outputFile = owner + '-' + repo + '.json'
        const octokit = github.getOctokit(token)
        inspectionFindFile("./"+outputFile)
       const data =  await octokit.rest.repos.getLatestRelease({
            owner,
            repo,
          });
        
        const html_url_splits = data.html_url.split('/')
        core.setOutput('url', data.html_url)
        core.setOutput('tag', html_url_splits[html_url_splits.length - 1])
    } catch (error) {
        core.setFailed(error);
    }
})();


const inspectionFindFile = (destPath) => {
    //Directory 존재 여부 체크
    const isExists = fs.existsSync(destPath)//디렉토리 경로 입력
    // isExistsx가 존재 한다면 true 없다면 false
    console.log("Boolan : ", isExists);
     return isExists
 }