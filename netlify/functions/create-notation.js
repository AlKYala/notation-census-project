require('dotenv').config();
const { Buffer } = require('buffer');
const busboy = require('busboy');

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  return new Promise((resolve, reject) => {
    const fields = {};
    let imageBuffer;
    let imageName;

    const bb = busboy({ headers: event.headers });

    bb.on('file', (name, file, info) => {
      const { filename, encoding, mimeType } = info;
      console.log(`File [${name}]: filename: %j, encoding: %j, mimeType: %j`, filename, encoding, mimeType);
      
      const chunks = [];
      file.on('data', (data) => chunks.push(data));
      file.on('end', () => {
        imageBuffer = Buffer.concat(chunks);
        imageName = filename;
        console.log(`File [${name}] Finished`);
      });
    });

    bb.on('field', (name, val, info) => {
      console.log(`Field [${name}]: value: %j`, val);
      fields[name] = val;
    });

    bb.on('close', async () => {
      console.log('Parse finished');
      
      try {
        const { Octokit } = await import("@octokit/rest");
        const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

        let imagePath = '';
        if (imageBuffer && imageName) {
          const uniqueImageName = `${Date.now()}-${imageName}`;
          imagePath = `images/notations/${uniqueImageName}`;

          await octokit.repos.createOrUpdateFileContents({
            owner: 'AlKYala',
            repo: 'notation-census-project',
            path: `src/${imagePath}`,
            message: `Add image for notation: ${fields.title}`,
            content: imageBuffer.toString('base64'),
            branch: 'resource/asset-mule'
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
        const filePath = `src/_data/notations/${fileName}`;

        const repoDetails = {
          owner: 'AlKYala',
          repo: 'notation-census-project',
          path: filePath,
          branch: 'resource/asset-mule'
        };

        console.log('Repo details:', repoDetails);

        // Check if file already exists
        let sha;
        try {
          const { data } = await octokit.repos.getContent(repoDetails);
          sha = data.sha;
        } catch (error) {
          if (error.status !== 404) throw error;
          // File doesn't exist, which is fine
        }

        await octokit.repos.createOrUpdateFileContents({
          ...repoDetails,
          message: `Add new notation: ${fields.title || 'Untitled'}`,
          content: Buffer.from(content).toString('base64'),
          sha: sha // This will be undefined if the file doesn't exist, which is what we want
        });

        resolve({
          statusCode: 200,
          body: JSON.stringify({ message: "Notation added successfully" }),
        });
      } catch (error) {
        console.error('Error details:', error.message, error.stack);
        reject({ statusCode: 500, body: JSON.stringify({ error: error.message, stack: error.stack }) });
      }
    });

    bb.write(Buffer.from(event.body, 'base64'));
    bb.end();
  });
};