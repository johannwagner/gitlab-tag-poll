#!/usr/bin/env node

const _ = require('lodash');
const gitlab = require('gitlab');
const semver = require('semver');

const {
    GITLAB_TAG_POLL_URL,
    GITLAB_TAG_POLL_TOKEN,
} = process.env;

if (!GITLAB_TAG_POLL_TOKEN || !GITLAB_TAG_POLL_URL) {
    console.error('GITLAB_TAG_POLL_TOKEN and GITLAB_TAG_POLL_URL must be defined in environment.');
    process.exit(1);
}

const gitlabInstance = new gitlab.Gitlab({
    host: GITLAB_TAG_POLL_URL,
    token: GITLAB_TAG_POLL_TOKEN,
});

const [,,
    groupName,
    outputFormat = 'inline',
] = process.argv;

console.warn('groupName', groupName);

const initFunction = async () => {
    const group = await gitlabInstance.Groups.show(groupName);
    console.warn('Found Group: ', group.id);

    const tagsPerProjectPromises = group.projects.map(async (p) => {
        return {
            project: p,
            tags: await gitlabInstance.Tags.all(p.id).catch(() => null),
        };
    });

    const tagsPerProject = await Promise.all(tagsPerProjectPromises);

    const latestTags = tagsPerProject.map((projectWithTags) => {
        let latestTag = null;

        if (projectWithTags.tags === null) {
            console.warn(`Ignoring ${projectWithTags.project.name}, because we could not load tags.`);
            return {
                ...projectWithTags,
            };
        }

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

    const outputArray = [];

    latestTags.forEach((t) => {
        if (!t.latestTag) {
            console.warn(`Ignoring ${t.project.name}, because there are no tags.`);
            return;
        }

        outputArray.push({
            name: t.project.name,
            version: t.latestTag.version,
        });
    });

    const sortedArray = _.sortBy(outputArray, (e) => e.name);

    switch (outputFormat) {
    case 'inline': {
        sortedArray.forEach((e) => console.log(`${e.name}: ${e.version}`));
        break;
    }
    case 'json': {
        console.log(JSON.stringify(sortedArray, null, '  '));
        break;
    }
    default: {
        throw Error('Invalid Output Format');
    }
    }

    process.exit(0);
};

initFunction().catch((e) => {
    console.error(e);
    process.exit(1);
});
