const Logger = require('logplease');
const gitlab = require('gitlab');
const semver = require('semver');

const logger = Logger.create('index.js');

const {
    GITLAB_TAG_POLL_URL,
    GITLAB_TAG_POLL_TOKEN,
} = process.env;

if (!GITLAB_TAG_POLL_TOKEN || !GITLAB_TAG_POLL_URL) {
    logger.error('GITLAB_TAG_POLL_TOKEN and GITLAB_TAG_POLL_URL must be defined in environment.');
    process.exit(1);
}

const gitlabInstance = new gitlab.Gitlab({
    host: GITLAB_TAG_POLL_URL,
    token: GITLAB_TAG_POLL_TOKEN,
});

const [,,
    groupName,
] = process.argv;

logger.debug('groupName', groupName);

(async () => {
    const group = await gitlabInstance.Groups.show(groupName);
    logger.debug('Found Group: ', group.id);

    const tagsPerProjectPromises = group.projects.map(async (p) => {
        return {
            project: p,
            tags: await gitlabInstance.Tags.all(p.id),
        };
    });

    const tagsPerProject = await Promise.all(tagsPerProjectPromises);

    const latestTags = tagsPerProject.map((projectWithTags) => {
        let latestTag = null;

        projectWithTags.tags.forEach((tag) => {
            const unifiedTag = semver.coerce(tag.name);

            if (!latestTag || semver.gt(unifiedTag, latestTag)) {
                latestTag = unifiedTag;
            }
        });

        return {
            ...projectWithTags,
            latestTag,
        };
    });

    latestTags.forEach((t) => {
        logger.info(`${t.project.name}: ${t.latestTag.version}`);
    });

    process.exit(0);
})();
