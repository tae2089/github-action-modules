import * as core from "@actions/core";
import * as yaml from "yaml";

class Yaml {
  // 특정 값을 변경하는 메서드
  UpdateValue(fileContents, key, newValue) {
    let data;
    try {
      data = yaml.parse(fileContents);
    } catch (e) {
      core.setFailed(`Failed to parse YAML file: ${e.message}`);
      return null;
    }

    const keys = key.split(".");
    let obj = data;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!obj[keys[i]]) {
        core.setFailed(
          `Key path ${keys
            .slice(0, i + 1)
            .join(".")} not found in the YAML data.`
        );
        return null;
      }
      obj = obj[keys[i]];
    }

    if (obj.hasOwnProperty(keys[keys.length - 1])) {
      obj[keys[keys.length - 1]] = newValue;
      try {
        return yaml.stringify(data);
      } catch (e) {
        core.setFailed(`Failed to stringify YAML file: ${e.message}`);
        return null;
      }
    } else {
      core.setFailed(`Key ${key} not found in the YAML data.`);
      return null;
    }
  }
}

export default Yaml;
