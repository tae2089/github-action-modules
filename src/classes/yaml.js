import * as core from "@actions/core";
import * as yaml from "js-yaml";

class Yaml {
  // 특정 값을 변경하는 메서드
  UpdateValue(fileContents, key, newValue) {
    let data = yaml.load(fileContents);
    if (data && data.hasOwnProperty(key)) {
      data[key] = newValue;
      return data;
    } else {
      core.setFailed(`Key ${key} not found in the YAML data.`);
      return null;
    }
  }
}

export default Yaml;
