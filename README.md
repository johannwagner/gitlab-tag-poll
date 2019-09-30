# gitlab-tag-poll

## Requirements

+ npx
+ GitLab Access Token
    + Scope: api

## Usage

```
export GITLAB_TAG_POLL_URL=<GITLAB_URL>
export GITLAB_TAG_POLL_TOKEN=<SECRET_TOKEN>
npx @johannwagner/gitlab-tag-poll <PATH_OF_GROUP>
```

## Example Output

URL: `https://gitlabinstance.example/test/testeroni`


```
➜  gitlab-tag-poll git:(master) ✗ node src/index.js test/testeroni
2019-09-30T14:10:42.329Z [DEBUG] index.js: groupName test/testeroni
2019-09-30T14:10:43.220Z [DEBUG] index.js: Found Group:  81
2019-09-30T14:10:46.065Z [WARN]  index.js: Ignoring mockups, because there are no tags.
2019-09-30T14:10:46.066Z [INFO]  index.js: race-manager: 0.0.10
2019-09-30T14:10:46.066Z [INFO]  index.js: migration-service: 0.0.13
2019-09-30T14:10:46.066Z [INFO]  index.js: user-service: 0.2.3
2019-09-30T14:10:46.066Z [INFO]  index.js: simulation-service: 0.0.9
2019-09-30T14:10:46.066Z [INFO]  index.js: shared: 0.0.17
2019-09-30T14:10:46.066Z [INFO]  index.js: settings-service: 0.0.1
2019-09-30T14:10:46.066Z [WARN]  index.js: Ignoring registration-client, because there are no tags.
2019-09-30T14:10:46.066Z [INFO]  index.js: race-service: 0.4.5
2019-09-30T14:10:46.067Z [INFO]  index.js: number-service: 0.0.3
2019-09-30T14:10:46.067Z [INFO]  index.js: history-service: 0.0.2
2019-09-30T14:10:46.067Z [WARN]  index.js: Ignoring database-service, because there are no tags.
2019-09-30T14:10:46.067Z [INFO]  index.js: customer-service: 0.3.9
2019-09-30T14:10:46.067Z [INFO]  index.js: credit-service: 0.3.1
2019-09-30T14:10:46.067Z [INFO]  index.js: cartmaintenance-service: 0.0.2
2019-09-30T14:10:46.067Z [INFO]  index.js: cart-service: 0.3.10
2019-09-30T14:10:46.067Z [INFO]  index.js: client: 0.0.6
2019-09-30T14:10:46.067Z [INFO]  index.js: authentication-service: 0.0.2
```