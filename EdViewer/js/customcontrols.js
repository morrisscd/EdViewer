var controlUI = [];
var controlText = [];
var countryHighlights = [];
var allPaths = [];
var index = 0;

/**
 * The CenterControl adds a control to the map that recenters the map on
 * Chicago.
 * This constructor takes the control DIV as an argument.
 * @constructor
 */

function CenterControl(controlDiv, map, survey, cNumber) {

    // Set CSS for the control border.
    controlUI[cNumber] = document.createElement('div');
    // controlUI.style.backgroundColor = '#1779ba';
    controlUI[cNumber] .style.border = '4px solid transparent';
    //controlUI.style.borderColor = '#FF3333, transparent';
    controlUI[cNumber] .style.borderRadius = '3px';
    // controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI[cNumber] .style.cursor = 'pointer';
    controlUI[cNumber] .style.marginBottom = '22px';
    controlUI[cNumber] .style.textAlign = 'center';
    controlUI[cNumber] .title = 'Click to recenter the map';

    controlDiv.appendChild(controlUI[cNumber] );

    // Set CSS for the control interior.
    controlText[cNumber] = document.createElement('div');
    controlText[cNumber] .style.transition = 'backgroundColor 0.25s ease-out, color 0.25s ease-out';
    controlText[cNumber] .style.color = 'rgb(255,255,255)';
    controlText[cNumber] .style.backgroundColor = '#1779ba';
    controlText[cNumber] .style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText[cNumber] .style.fontSize = '16px';
    controlText[cNumber] .style.lineHeight = '38px';
    controlText[cNumber] .style.paddingLeft = '5px';
    controlText[cNumber] .style.paddingRight = '5px';
    controlText[cNumber] .innerHTML = survey;
    controlUI[cNumber].appendChild(controlText[cNumber] );

    // Setup the click event listeners: simply set the map to Chicago.

    controlUI[cNumber].addEventListener('click', function (evt) {
      
        $.getJSON("data/nuts1ukungrouped.json", function (json) {

            //var allPaths = [];
            var areaPaths = [];

            var k = 0;

            if (countryHighlights.length > 0) {
                clearData(allPaths, index);
            }
            
            //Each Country
            $.each(json.features, function (i, item) {

                //only show the countries from the selected survey
               if (item.properties[survey] == 'True') {

                var numPaths = item.geometry.coordinates.length;

                var coords;

                var areaPaths = [];

                //Each GeoJson path within each country
                //handles single and multi polygons
                    for (var i = 0; i < numPaths; i++) {

                        var points = [];

                        var coords = item.geometry.coordinates[i];
                        //multipolygons
                        if (numPaths > 1) {
                            for (var j = 0; j < coords[0].length; j++) {
                                points.push({
                                    lat: coords[0][j][1],
                                    lng: coords[0][j][0]
                                });
                            }
                            areaPaths.push(points);
                        }
                        //single polygons
                        else {
                            points.push(new Array());
                            for (var j = 0; j < coords.length; j++) {
                                points[0].push({
                                    lat: coords[j][1],
                                    lng: coords[j][0]
                                });
                            }
                        }
                    }

                    if (numPaths > 1) {
                        allPaths.push(areaPaths);
                    }
                    else {
                        allPaths.push(points);
                    }
                    k = k + 1;
               }

            });

            index = 0;
            var count = 0;

            var timer = window.setInterval(function () {

                if (index < k) {

                    for (var i = 0; i < allPaths[index].length; i++) {
                                                                  
                            countryHighlights[count] = new google.maps.Polygon({
                                paths: allPaths[index][i],
                                strokeColor: '#FF0000',
                                strokeOpacity: 0.8,
                                strokeWeight: 2,
                                fillColor: '#FF0000',
                                fillOpacity: 0.35,
                                map: map
                        });

                        count = count + 1;
                        
                    }
                    index = index + 1;
                }
                else { window.clearInterval(timer) }

            }, 100);

        });
            
    });
}


function clearData(allPaths, index) {

    for (var i = 0; i < countryHighlights.length; i++) {
        countryHighlights[i].setMap(null);
    }

    countryHighlights = [];
    //for (var i = 0; i < index; i++) {
    //    for (var j = 0; j < allPaths[i].length; j++) {
    //        //countryHighlights[j] = new google.maps.Polygon({
    //        //    paths: allPaths[i][j],
    //        //    strokeColor: '#00FF00',
    //        //    strokeOpacity: 0.8,
    //        //    strokeWeight: 2,
    //        //    fillColor: '#00FF00',
    //        //    fillOpacity: 0.35,
    //        //    map: map
    //        //});
    //    }
    //}
    var stop = 0;
}







