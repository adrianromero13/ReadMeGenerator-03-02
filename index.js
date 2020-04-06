const doc = require("./generateHTML");
// console.log(typeof generateHTML.generateHTML);
// console.log(typeof generateHTML.colors);
const fs = require("fs"),
    convertFactory = require('electron-html-to');
const axios = require("axios");
const inquirer = require("inquirer");
const electron = require("electron");

const conversion = convertFactory({
    converterPath: convertFactory.converters.PDF,
    allowLocalFilesAccess: true
});

let questions = [
    {
        message: 'What is your github username?',
        name: 'username',
    },
    {
        message: 'What is your favorite color',
        name: 'color',
        type: 'list',
        choices: ['green', 'blue', 'pink', 'red'],
    }
]

function init() {
    inquirer
        .prompt(questions)
        .then(function ({ username, color }) {
            const queryUrl = `https://api.github.com/users/${username}`;

            axios
                .get(queryUrl)
                .then((res) => {
                    console.log(res.data)
                    let data = res.data;
                    // console.log(res.data);

                    // data.color = [];


                    switch (color) {
                        case 'green':
                            data.color = 0;
                            break;
                        case 'blue':
                            data.color = 1;
                            break;
                        case 'pink':
                            data.color = 2;
                            break;
                        case 'red':
                            data.color = 3;
                            break;
                        default:
                            console.log('');
                    }
                    // console.log(data.color)
                    // console.log(colors);  

                    data.username = username;
                    data.numOfRepo = res.data.public_repos;
                    data.name = res.data.name
                    data.followers = res.data.followers;
                    data.following = res.data.following;
                    data.portPic = res.data.avatar_url;
                    data.location = res.data.location;
                    data.blog = res.data.blog;
                    data.company = res.data.company
                    data.bio = res.data.bio
                    // console.log(data);
                    axios // Requires a different axios call to get stars
                        .get(`https://api.github.com/users/${username}/repos?per_page=100`)
                        .then((res) => {
                            // console.log(res)
                            data.stars = 0;
                            for (let i = 0; i < res.data.length; i++) { // Loop through each repository and count the number of stars
                                data.stars += res.data[i].stargazers_count;
                            }
                            let newHTML = doc.generateHTML(data);
                            // create html file
                            fs.writeFile('./resume.html', newHTML, (err) => { 
                                if (err) {
                                    return err;
                            }});
                            // console.log(data.stars)
                            // window.ELECTRON_HTML_TO_READY = true;
                            console.log(newHTML);
                            conversion({ html: newHTML }, function (err, result) {

                                if (err) {
                                    return console.error(err);

                                }
                                //    console.log(result);
                                //     console.log(result.numberOfPages);
                                //     console.log(result.logs);
                                result.stream.pipe(fs.createWriteStream('./resume.pdf'));

                                conversion.kill(); // necessary if you use the electron-server strategy, see bellow for details
                                // an error is passed but ignoring since a server is not needed for this project
                                fstream.on('error', function(err) {
                                    console.log("ERROR:" + err);
                                    file.read();
                                  });
                            })

                        });
                })
        })
}

init();