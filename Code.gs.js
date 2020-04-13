function POSTClickUpTask_DEV() {
  var url = '<Insert URL here>';
  var listID = '<Insert list ID here>';
  var apiToken = '<Insert your API key here>';

    //Set spreadsheet vals
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('<Insert sheet name here>');
  
  //Get spreadsheet vals
  var name = '';
  var content = '';
  var version = '';
  var solution = '';
  var description = ''
  var tag1 = '';
  var tag2 = '';
  var searchRange = sheet.getRange(1,2,sheet.getLastRow()).getValues();
  
  //Request headers
  var headers = {
     'Authorization': '<Insert API token here>',
     'Content-Type' : 'application/json',
  };
  
  //Set column constants
  const titleCol = 2;
  const solutionCol = 3;
  const noteCol = 4;
  const versionCol = 5;
  const featureCol = 6;
  const helpCol = 7;
  
  //Loop for each row in the sheet
  for (var i = 1; i < searchRange.length; i++) {
    name = sheet.getRange(1+i,titleCol).getValue();
    solution = sheet.getRange(1+i,solutionCol).getValue();
    version = sheet.getRange(1+i,versionCol).getValue();
    description = sheet.getRange(1+i,noteCol).getValue() + '\nSolution Number: ' + solution;
    
    //variables to check tag status
    var curRow = 1+i;
    var isFeature = sheet.getRange(curRow,featureCol).getValue();
    var isHelp = sheet.getRange(curRow,helpCol).getValue();
    
    if (isFeature) {
      tag1 = 'features';
    } 
    if (isHelp) {
      tag2 = 'help';
    }
   
    var tags = [
      {
        'name' : tag1
      },
      {
        'name' : tag2
      },
      {
        'name' : "v"+version
      }
    ];
    
    var data = {
      'name': name,
      'content': description,
      'tags' : tags,
      'status': 'Pending Review',
      'priority': 3,
    };
    
    var options = {
      'headers' : headers,
      'method' : 'post',
      'payload' : JSON.stringify(data),
      'muteHttpExceptions' : true
    };
    
    //This is the actual request
    var response = UrlFetchApp.fetch('https://api.clickup.com/api/v1/list/'+listID+'/task',options);
    
    //Reset values
    tag1 = '';
    tag2 = '';
  }
  //Deletes spreadsheet contents if HTTP Status 200 (OK)
  //if(response.getResponseCode() == 200){
    sheet.getRange('A2:A').setValue('');
    sheet.getRange('D2:E').setValue('');
    sheet.getRange('F2:G').setValue('FALSE');
    Logger.log(response.getResponseCode());
  //}
}

//This function adds a ClickUp menu that calls POSTClickUpTask function
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('ClickUp')
    .addItem('[Dev] Create ClickUp Tasks', 'POSTClickUpTask_DEV')
    .addToUi();
}