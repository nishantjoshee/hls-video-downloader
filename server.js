const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;


app.get('/convert', (req, res) => {
    const hlsUrl = req.query.hlsUrl;
    if (!hlsUrl) {
        return res.status(400).send('No HLS URL provided');
    }

    const outputMp4 = path.join(__dirname, 'output.mp4');

    ffmpeg(hlsUrl)
        .outputOptions('-c copy')
        .output(outputMp4)
        .on('end', () => {

            res.download(outputMp4, (err) => {
                if (err) {
                    console.error('Error in file download:', err);
                }
                fs.unlinkSync(outputMp4); 
            });
        })
        .on('error', (err) => {
            res.status(500).send(err);
        })
        .run();
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

