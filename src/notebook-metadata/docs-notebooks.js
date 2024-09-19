// @ts-check

import { execSync } from 'child_process';

/**
 * @returns {string}
 */
function getLatestOvReleaseTag() {
  const latestOvReleaseResponse = execSync(
    `curl -L https://api.github.com/repos/openvinotoolkit/openvino/releases/latest`
  ).toString();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const responseJson = /** @type {{ tag_name: string }} */ (JSON.parse(latestOvReleaseResponse));
  if (!responseJson?.tag_name) {
    throw Error(`Unable to fetch latest OpenVINO release via GitHub API. Response: ${latestOvReleaseResponse}.`);
  }
  return responseJson.tag_name;
}

/**
 * @param {string} tag
 * @returns {string[]}
 */
function getAllDocsNotebooksForTag(tag) {
  return execSync(
    `curl -L https://github.com/openvinotoolkit/openvino/raw/${tag}/docs/notebooks/all_notebooks_paths.txt`
  )
    .toString()
    .split('\n');
}

/**
 * @returns {{ latestDocsNotebooks: string[]; latestOVReleaseTag: string}}
 */
function getLatestDocsNotebooksWithTag() {
  const latestOVReleaseTag = getLatestOvReleaseTag();
  const allDocsNotebooks = getAllDocsNotebooksForTag(latestOVReleaseTag);
  // const docsIgnoredNotebooks = getDocsIgnoredNotebooks();
  const latestDocsNotebooks = allDocsNotebooks;
    // .filter((v) => !docsIgnoredNotebooks.includes(v))
    // .map((v) => relative('notebooks', v));
  return { latestDocsNotebooks, latestOVReleaseTag };
}

export const docsNotebooks = getLatestDocsNotebooksWithTag();
