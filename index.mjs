// Imports
import * as http from "http";
import * as fs from "fs";
import request from "requests"; 


// APIs URLS
const todayAPI = "https://zenquotes.io/api/today"; // Quote of the Day.
var quotesAPI = "https://zenquotes.io/api/random"; // Random quote
var myAPI = "http://api.weatherapi.com/v1/current.json?key=0186bc84c0e44f0593a64520220505&q="; // Weather of particular location

// Reading Web Pages Synchronously
const myDetailedPage = fs.readFileSync("weatherdetail.html", "utf8");

// Replacer Method for details.html
const replaceMoreVal = (file, val, quote) => {
  let myfile = file.replace("%city%", val.location.name);
  myfile = myfile.replace("%region%", val.location.region);
  myfile = myfile.replace("%country%", val.location.country);
  myfile = myfile.replace("%windspeed%", val.current.wind_kph);
  myfile = myfile.replace("%visibility%", val.current.vis_km);
  myfile = myfile.replace("%precipitation%", val.current.precip_mm);
  // myfile = myfile.replace("%region%", val.location.region);
  myfile = myfile.replace("%temperature%", val.current.temp_c);
  myfile = myfile.replace("%weathercon%", val.current.condition.text);
  myfile = myfile.replace("%icon%", val.current.condition.icon);
  let localdate = String(val.location.localtime).substring(0, 10);
  let localtime = String(val.location.localtime).substring(11, 16);
  myfile = myfile.replace("%date%", localdate);
  myfile = myfile.replace("%time%", localtime);

  myfile = myfile.replace("%quote%", quote[0].q)
  myfile = myfile.replace("%quoteauthor%", quote[0].a)
  return myfile;
}

// Server Runs
const server = http.createServer((req, res) => {
  // default (HOME) page
  if (req.url == "/") {
    // requesting the default weather location details
    res.write(`
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title> Weather I/O </title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
        <!DOCTYPE html>
        <html>
    
        <head>
            <style>
                .flex-container {
                    display: flex;
                    background-color: rgba(100, 148, 237, 0.226);
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    flex-direction: column;
                }
            
                .me-2{
                    width: 50%;
                }
    
                .flex-container>div {
                    background-color: #f1f1f1;
                    margin: 10px;
                    padding: 20px;
                    font-size: 30px;
                }
            </style>
        </head>
    
    <body>
        <div class="flex-container">
            <img src="https://cdn-icons-png.flaticon.com/512/4005/4005857.png" width="100vw" height="100vh" alt="Weather.io logo" srcset="">
            <h1>Weather.io</h1>
            <p>Search for weathers across the Globe.</p>
            <br> <br>
            <input class="form-control me-2" type="search" placeholder="Search for City" id="submitval" aria-label="Search">
            <br>
            <button class="btn btn-outline-success" onclick=search() type="submit">Search</button>
        </div>
        <script>
            const search = () => {
                location.href = "/"+$("#submitval").val()+"/more";
            }
        </script>
        <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"
            crossorigin="anonymous"></script>
    </body>
    
    </html>
    `);
    res.end();
    // Ommiting the favicon hidden request
  } else if (req.url == "/favicon.ico") {
    res.end();
    // If more informmation is required
  } else if (req.url == String(req.url).substr(0, String(req.url).length - 5) + "/more") {
    request(myAPI + String(req.url).substr(0, String(req.url).length - 5))
      .on('data', (chunk) => {
        request(quotesAPI)
          .on("data", (quotechunk) => {
            const apidata = JSON.parse(quotechunk);
            const allData = JSON.parse(chunk);
            let currentPage = myDetailedPage;
            // If location does not exists
            if (allData.location != undefined) {
              const finalPage = replaceMoreVal(currentPage, allData, apidata);
              res.write(finalPage);
            }
            // Error is generated here
            else {
              res.write(`<div class="alert alert-danger d-flex align-items-center" role="alert">
          <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>
          <div>
            Error, The Entered location is not available!
          </div>
        </div>`);
              res.end(`
              <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title> Weather I/O </title>
              <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
              <style>
                  body{
                      display: flex;
                      flex-direction: column;
                      justify-content: center;
                      align-items: center;
                  }
              </style>
          </head>
          <body>
                  <button class="btn btn-outline-success"> <a href='/'> Home </a> </button>
                
          <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
          
          </body>
          </html>
          `);
            }
          })
          .on("end", (err) => {
            if (err) return err;
            res.end();
          })
      })

    // Fetching a particular location details based on location name
  } else {}
});

// Listening to the server at port
server.listen(100, "localhost", () => {
  console.log("Listening...");
})
