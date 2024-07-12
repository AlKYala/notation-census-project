require('dotenv').config();
const querystring = require('querystring');

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { Octokit } = await import("@octokit/rest");
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    // Parse the form data
    const payload = querystring.parse(event.body);

    console.log('Received payload:', payload);  // Debug log

    const { title, symbol, definition, usage, tags, example1_description, example1_latex, example2_description, example2_latex, relatedConcepts } = payload;

    const content = JSON.stringify({
      title,
      symbol,
      definition,
      usage,
      examples: [
        { description: example1_description, latex: example1_latex },
        { description: example2_description, latex: example2_latex }
      ],
      tags: tags.split(',').map(tag => tag.trim()),
      relatedConcepts: relatedConcepts.split(',').map(concept => concept.trim())
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
    console.error('Error:', error);  // Debug log
    return { statusCode: 500, body: error.toString() };
  }
};