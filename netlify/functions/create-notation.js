const dotenv = require('dotenv');
dotenv.config();

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { Octokit } = await import("@octokit/rest");
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    const { payload } = JSON.parse(event.body);
    const { title, symbol, definition, usage, tags } = payload;

    const content = JSON.stringify({
      title,
      symbol,
      definition,
      usage,
      tags: tags.split(',').map(tag => tag.trim()),
    }, null, 2);

    const fileName = `${title.toLowerCase().replace(/\s+/g, '-')}.json`;

    await octokit.repos.createOrUpdateFileContents({
      owner: 'your-github-username',
      repo: 'your-repo-name',
      path: `src/_data/notations/${fileName}`,
      message: `Add new notation: ${title}`,
      content: Buffer.from(content).toString('base64'),
      branch: 'main'
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Notation added successfully" }),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};