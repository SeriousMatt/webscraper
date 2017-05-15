var fs = require('fs');

//Define url for testing site
var url = 'http://test-seed-company.pantheonsite.io';
var i = 0;
var t = 1;
//Pull needed files
var projects = pullProjects();
var data     = pullData();
//Initialize scrape
urlTesting(projects, data);

function pullProjects(){
  //Define projects array
  var projects = [];
  //Get array of urls to sort through
  console.log('Loading projectList.csv......................');
  var file_projects = fs.open('projectList.csv','r');
  var line = file_projects.readLine();
  //Create projects list
  while(line){
    projects.push(line);
    line = file_projects.readLine();
  }
  //Close reading stream
  file_projects.close();
  return projects;
}

function pullData(){
  //Define data array
  var data = [];
  //Get correct data
  console.log('Loading book1.csv......................');
  var file_data = fs.open('book1.csv','r');
  var line = file_data.readLine();

  while(line){
    data.push(line);
    line = file_data.readLine();
  }
  file_data.close();
  return data;
}

function urlTesting(projects,data){
  //Define success and set to false until proven true...
  var success = false;
  //Loop through project links
  scrapeUrl(url+projects[i],function(success){
    if(!success){
      console.log(success);
      console.log('There was an error in retrieving data for the url: '+ url+projects[i]);
      // break;
    }
    if(i < projects.length) {
      i++;                                 //  if the counter < 10, call the loop function
      t++;
      urlTesting(projects);                //  ..  again which will trigger another
    }
  });
}

function scrapeUrl(url, callback) {
  console.log(url);
    // Read the Phantom webpage '.version' element text using jQuery and "includeJs"
    "use strict";
    var page = require('webpage').create();
    // phantom.exit();
    page.onConsoleMessage = function(msg) {
        console.log(msg);
    };
    //Load page and get element
    page.open(url, function(status) {
        if (status === "success") {
            page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js", function() {
                page.evaluate(function() {
                    //Latest version on the web
                    //Get value
                    var projectName = $("#node-project-full-group-wrapper > div > div > h1").text();
                    if (projectName == ''){
                      projectName = 'NULL';
                    }
                    var products =  $("div.view-header > h3").text();
                    if (products == ''){
                      products = 'NULL';
                    }
                    var projectInfo =  $(".view-projects.view-display-id-entity_view_4 > div").text();
                    if(projectInfo == ''){
                     projectInfo =  $(".view-languages.view-id-languages.view-display-id-entity_view_3 > div").text();
                    }
                    // console.log(projectInfo);
                    if(projectInfo != ''){
                      var startYear = projectInfo.split('Start Year');
                      var endYear = projectInfo.split('People Impacted');
                      endYear = endYear[1].split('End Year');
                      var tscPop = projectInfo.split('Start Year');
                      tscPop = tscPop[1].split('People Impacted');

                    } else{
                      startYear = 'NULL';
                      endYear = 'NULL';
                      tscPop = 'NULL';
                    }
                    var prayerCommits =  $("span.how-few").text();
                    if (prayerCommits == ''){
                      prayerCommits = 'NULL';
                    }
                    var prayerNeeded =  $("span.how-many").text();
                    if (prayerNeeded == ''){
                      prayerNeeded = 'NULL';
                    }
                    var remainingNeed =  $("div.view-footer > h3").text();
                    if (remainingNeed == ''){
                      remainingNeed = 'NULL';
                    } else{
                      remainingNeed = remainingNeed.split('Remaining Need ');
                      remainingNeed = remainingNeed[1];
                    }
                    var totalNeed =  $("div.view-footer > p:nth-child(3) > span").text();
                    if (totalNeed == ''){
                      totalNeed = 'NULL';
                    }
                    else{
                      totalNeed = totalNeed.split('Total Need ');
                      totalNeed = totalNeed[1];
                    }
                    console.log(projectName+','+products+','+startYear[0].trim()+','+endYear[0].trim()+',"'+tscPop[0].trim()+'",'+prayerCommits+','+prayerNeeded+',"'+remainingNeed+'","'+totalNeed+'"');

                    // var endYear =  $("field field-type-number-integer:second").text();
                    // console.log("EndYr: "+endYear+',');
                    // var tscPop =  $("field field-type-number-integer:third").text();
                    // console.log("TscPop: "+tscPop+',');
                  });
                // phantom.exit(0);
                callback(true);
            });
        } else {
          console.log(url+projects[i]);
          console.log(status);
          // phantom.exit(1);
          callback(false);
        }
    });
}
// phantom.exit();
