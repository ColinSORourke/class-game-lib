$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "mySheet.csv",
        dataType: "text",
        success: function(data) {CSVToArray(data);}
     });
});

// https://download-directory.github.io

// ref: http://stackoverflow.com/a/1293163/2343
    // This will parse a delimited string into an array of
    // arrays. The default delimiter is the comma, but this
    // can be overriden in the second argument.
function CSVToArray( strData, strDelimiter ){
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
        );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )){

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[ 1 ];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
            ){

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push( [] );

        }

        var strMatchedValue;

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]){

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
                );

        } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[ 3 ];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }

    // Return the parsed data.
    console.log(arrData)
    function1( arrData );
}

function function1( arrData) {
    var ul = document.getElementById("fullList");
    while (arrData.length > 1){
        let j = Math.floor(Math.random() * (arrData.length - 1)) + 1;
        var li = document.createElement("li");
        let gifDiv = document.createElement("div");
        gifDiv.id = "gif"
        let image = document.createElement("img")
        console.log(arrData.length);
        image.src = arrData[j][1] + "/" + arrData[j][1] + ".gif";
        let link = document.createElement('a')
        link.href= "games.html?" + arrData[j][1]
        link.target = "_blank"
        link.appendChild(image)
        gifDiv.appendChild(link)
        li.appendChild(gifDiv)
        let textDiv = document.createElement("div")
        textDiv.id = "text";
        
        let gameName = document.createElement("h")
        gameName.innerHTML = arrData[j][0];
        textDiv.appendChild(gameName)
        let a = 2;
        let Authors = "";
        Authors += arrData[j][a]
        a += 1;
        while(a < 9 && arrData[j][a] != ""){
            Authors += ", " + arrData[j][a];
            a += 1;
        }
        let authorList = document.createElement("p");
        authorList.innerHTML = Authors;
        textDiv.appendChild(authorList);

        li.appendChild(textDiv);

        li.style.backgroundColor = arrData[j][11]
        li.style.borderColor = arrData[j][12]
        li.style.color = arrData[j][13]
        ul.appendChild(li);
        arrData.splice(j, 1);
    }
  }