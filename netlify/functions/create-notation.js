require('dotenv').config();
const { Buffer } = require('buffer');

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  console.log("Received headers:", JSON.stringify(event.headers, null, 2));
  console.log("Received body:", event.body);

  try {
    const { Octokit } = await import("@octokit/rest");
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    // Parse the form data
    const formData = new URLSearchParams(event.body);
    const fields = Object.fromEntries(formData);

    console.log('Parsed fields:', fields);

    // Handle image separately if it exists
    let imagePath = '';
    if (event.isBase64Encoded) {
      const imageBuffer = Buffer.from(event.body, 'base64');
      const imageName = `${Date.now()}-image.jpg`; // Assuming it's a jpg, adjust as needed
      imagePath = `images/notations/${imageName}`;

      await octokit.repos.createOrUpdateFileContents({
        owner: 'AlKYala',
        repo: 'notation-census-project',
        path: `src/${imagePath}`,
        message: `Add image for notation: ${fields.title}`,
        content: imageBuffer.toString('base64'),
        branch: 'develop'
      });
    }

    const content = JSON.stringify({
      title: fields.title,
      symbol: fields.symbol,
      definition: fields.definition,
      usage: fields.usage,
      image: imagePath,
      examples: [
        { description: fields.example1_description, latex: fields.example1_latex },
        { description: fields.example2_description, latex: fields.example2_latex }
      ],
      tags: fields.tags ? fields.tags.split(',').map(tag => tag.trim()) : [],
      relatedConcepts: fields.relatedConcepts ? fields.relatedConcepts.split(',').map(concept => concept.trim()) : []
    }, null, 2);

    const fileName = `${fields.title ? fields.title.toLowerCase().replace(/\s+/g, '-') : 'untitled'}.json`;

    const repoDetails = {
      owner: 'AlKYala',
      repo: 'notation-census-project',
      path: `src/_data/notations/${fileName}`,
      branch: 'develop'
    };

    console.log('Repo details:', repoDetails);

    await octokit.repos.createOrUpdateFileContents({
      ...repoDetails,
      message: `Add new notation: ${fields.title || 'Untitled'}`,
      content: Buffer.from(content).toString('base64')
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Notation added successfully" }),
    };
  } catch (error) {
    console.error('Error details:', error.message, error.stack);
    return { statusCode: 500, body: JSON.stringify({ error: error.message, stack: error.stack }) };
  }
};