const generateHTML = require("./generateHTML");
console.log(typeof generateHTML.generateHTML);
console.log(typeof generateHTML.colors);
const fs = require("fs"),
    convertFactory = require('electron-html-to');
const axios = require("axios");
const inquirer = require("inquirer");

const conversion = convertFactory({
    converterPath: convertFactory.converters.PDF
});

// let data = {};
// console.log(data)

let newHTML = generateHTML.generateHTML;
console.log(newHTML)
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
// function generateHTML() to get called from gerenateHTML.js

// function writeToFile(fileName, data) {
    
    // } not necessary with electron-html-to\
// let HTML = function generateHTML(res) {
//     return res;
// }

let colors = generateHTML.colors;
function init() {
        newHTML;
            inquirer
            .prompt(questions)
            .then(function ({username, color}) {
                const queryUrl = `https://api.github.com/users/${username}`; 
                
                axios
                .get(queryUrl)
                .then((res) => {    
                    console.log(res.data)
                    let data = res.data;
                    
                    data.color = [];
                    
                    
                    switch(color) {
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
                                    }      
                                    console.log(data.color)
                                    console.log(colors);  
                                    
                                    let = data.username = username;
                                    let = data.numOfRepo = res.data.public_repos;
                                    let = data.name = res.data.name
                                    let = data.followers = res.data.followers;
                                    let = data.following = res.data.following;
                                    let = data.portPic = res.data.avatar_url;
                                    let = data.location = res.data.location;
                                    let = data.blog = res.data.blog; 
                                    let = data.company = res.data.company
                                    let = data.bio = res.data.bio
                                    console.log(data);
                                    axios // Requires a different axios call to get stars
                                    .get(`https://api.github.com/users/${username}/repos?per_page=100`)
                                    .then((res) => {
                                        // console.log(res)
                                        data.stars = 0;
                                        for (let i = 0; i < res.data.length; i++) { // Loop through each repository and count the number of stars
                                            data.stars += res.data[i].stargazers_count;
                                        }
                                        
                                        
                                        // console.log(data.stars)
                                        // let resumeHTML = JSON.stringify(generateHTML.generateHTML());








                                        /*this is returning resumeHTML as colors but redefined to case switch choice*/
                                        
                                        console.log(newHTML(data));
                                        conversion({ html: newHTML }, function(err, result) {
                                            if (err) {
                                  return console.error(err);
                                }
                            //    console.log(result);
                            //     console.log(result.numberOfPages);
                            //     console.log(result.logs);
                                result.stream.pipe(fs.createWriteStream('./resume.pdf'));
                                conversion.kill(); // necessary if you use the electron-server strategy, see bellow for details
                                    })
                                    
                          });
                })
        })
    }

init();