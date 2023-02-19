
const { Configuration, OpenAIApi } = require("openai");
const fs = require('fs');
const { url } = require("inspector");

const key = "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"

const configuration = new Configuration({
    apiKey: key
});
const openai = new OpenAIApi(configuration);

const predict = async function () {
    const response = await openai.createImage({
        prompt: "nyls has long hair ugly boy what the heck boy ",
        n: 1,
        size: "256x256",
        // size: "1024x1024",
        response_format: 'b64_json',
    });

    console.log()
    return response.data;
}
predict()
    .then(
        response => {
            const now = Date.now();
            for (let i = 0; i < response.data.length; i++)
            {
                console.log(response.data[0].url)
                const b64 = response.data[i]['b64_json'];
                const buffer = Buffer.from(b64, "base64");
                const filename = `image_${now}_${i}.png`;
                console.log("Writing image " + filename);
                fs.writeFileSync(filename, buffer);
            }
        }
    )

const genURL = async function(responsedata) {
        const myurl = responsedata.data[0].url
        
}