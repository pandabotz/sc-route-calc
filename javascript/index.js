//Route calculation javascript

import { Point, Plane, Sphere, Circle } from './vectorMath.js';

import { calculateRoute, getCorrectPoint, distancesToPoint} from './routeCalculation.js';



/*

setup data and related helper classes/function


*/




class Location extends Point{ //added a location name to point
    constructor(n, x, y, z){
        super(x, y, z);
        this.name = n;
    }
}

class Planet extends Sphere{ //added name and Orbital Markers
    constructor(n, r, OMD){
        super(new Point(0, 0, 0), r);
        this.name = n;

        var OMP = [];
        OMP.push(new Point(0, 0, OMD));
        OMP.push(new Point(0, 0, -OMD));
        OMP.push(new Point(0, -OMD, 0));
        OMP.push(new Point(0, OMD, 0));
        OMP.push(new Point(-OMD, 0, 0));
        OMP.push(new Point(OMD, 0, 0));

        this.OMPoints = OMP;
        this.locations = [];

    }

    addLocation(n, coord){ //add location
        var location = new Location(n, coord.x, coord.y, coord.z);
        this.locations.push(location);
    }

    removeLocation(n){ //remove location with specific name
        for(var i = 0; i < this.locations.length; i++){
            if(locations[i].name == n){
                this.locations.splice(i, 1);
            }
        }
    }

    getLocation(n){ //find location with specific name
        for(var i = 0; i < this.locations.length; i++){
            if(this.locations[i].name == n){
                return this.locations[i];
            }
        }
    }
}

// planet array and its helper functions
var planets = [];

function findPlanet(n){ //find planet with specific name
    for(let i = 0; i < planets.length; i++){
        if(planets[i].name == n){
            return planets[i];
        }
    }
}



function setUpData(){ 

    //planet list
    planets.push(new Planet("Cellin", 260, 380));
    planets.push(new Planet("Daymar", 295, 430));
    planets.push(new Planet("Yela", 313, 455.468));
    planets.push(new Planet("Hurston", 1000, 1438)); //TODO update to proper value
    planets.push(new Planet("Arial", 344.494, 501));
    planets.push(new Planet("Aberdeen", 274, 402.7));
    planets.push(new Planet("Magda", 340.826, 494.8));
    planets.push(new Planet("Ita", 325, 472.4));
    planets.push(new Planet("Arccorp", 800, 1151)); //TODO update to proper value
    planets.push(new Planet("Lyria", 223, 328.2));
    planets.push(new Planet("Wala", 283, 413));
    planets.push(new Planet("Microtech", 1000, 1439));
    planets.push(new Planet("Delamar", 75, 118.9));


    //location list
    var OMD = [];
    OMD.push({planetname: "Yela", locationname: "Stash house", OM1: 318.2, OM2: 714.1, OM3: 610.9, OM4: 487.8, OM5: 702.1, OM6: 343.8});
    OMD.push({planetname: "Yela", locationname: "Jumptown", OM1: 699.6, OM2: 349.3, OM3: 541.0, OM4: 564.5, OM5: 723.8, OM6: 295.8});
    OMD.push({planetname: "Daymar", locationname: "Stash house", OM1: 496.2, OM2: 547.1, OM3: 143.2, OM4: 724.6, OM5: 539.8, OM6: 504.1});
    OMD.push({planetname: "Wala", locationname: "Samson & son's salvage center", OM1: 500.4, OM2: 500.6, OM3: 135.4, OM4: 694.7, OM5: 524.9, OM6: 474.8});
    OMD.push({planetname: "Daymar", locationname: "Brio's braker yard", OM1: 350.1, OM2: 651, OM3: 641.2, OM4: 367.7, OM5: 652.5, OM6: 347.3});
    OMD.push({planetname: "Hurston", locationname: "Reclamation & disposal Orinth", OM1: 1058, OM2: 2241, OM3: 2225, OM4: 1091, OM5: 1447, OM6: 2011});
    OMD.push({planetname: "Lyria", locationname: "The orphanage", OM1: 183, OM2: 531.3, OM3: 313.6, OM4: 466.3, OM5: 457, OM6: 326.9});
    OMD.push({planetname: "Lyria", locationname: "Paradise cove", OM1: 441.6, OM2: 347.3, OM3: 166.4, OM4: 536.6, OM5: 463.7, OM6: 317.2});
    OMD.push({planetname: "Cellin", locationname: "Stash house", OM1: 283.1, OM2: 588.5, OM3: 587.3, OM4: 285.6, OM5: 381.4, OM6: 530.1});
    OMD.push({planetname: "Aberdeen", locationname: "Cave 1", OM1: 440, OM2: 531, OM3: 667.4, OM4: 173.5, OM5: 418.1, OM6: 548.4});
    OMD.push({planetname: "Daymar", locationname: "Javelin wreck", OM1: 577.2, OM2: 461.1, OM3: 205.3, OM4: 709.7, OM5: 428.9, OM6: 601.5});
    OMD.push({planetname: "Yela", locationname: "Benny Henge", OM1: 784.0, OM2: 785.1, OM3: 697.9, OM4: 862.6, OM5: 1087.7, OM6: 219.0});

    //OMD.push({planetname: , locationname: , OM1: , OM2: , OM3: , OM4: , OM5: , OM6: }); ---- form used above


    //add locations to planets
    for(let i = 0; i < OMD.length; i++){
        let planet = findPlanet(OMD[i].planetname);
        let targetName = OMD[i].locationname;
        let distances = [OMD[i].OM1, OMD[i].OM2, OMD[i].OM3, OMD[i].OM4, OMD[i].OM5, OMD[i].OM6];
        planet.addLocation(targetName, distancesToPoint(planet, distances));
    }

    //add planets to website dropdown lists
    let selectPlanet = document.getElementById("planet-list");
    for(let i = 0; i < planets.length; i++){
        let opt = planets[i];
        let el = document.createElement("option");
        el.textContent = opt.name;
        el.value = opt.name;
        selectPlanet.appendChild(el);
        
    }

    selectPlanet = document.getElementById("convert-planet-list");
    for(let i = 0; i < planets.length; i++){
        let opt = planets[i];
        let el = document.createElement("option");
        el.textContent = opt.name;
        el.value = opt.name;
        selectPlanet.appendChild(el);
    }

}


setUpData();

function testExcel(){
    
}




/*

javascript for website functionality

*/







function resultToString(planet, target, result){ //convert the returned data to string for textoutput
    let startPoint = "OM" + (result[0]+1);
    let firstTarget = "OM" + (result[1]+1);
    let secondTarget = "OM" + (result[2]+1);
    let thirdTarget;
    if(result[3]==7){
        thirdTarget = "planet centre";
    } else{
        thirdTarget = "OM" + (result[3]+1);
    }

    let distanceUntilFirstTurn = result[4];
    distanceUntilFirstTurn = Math.round(distanceUntilFirstTurn * 100) / 100;
    let distanceUntilSecondTurn = result[5];
    distanceUntilSecondTurn = Math.round(distanceUntilSecondTurn * 100) / 100;
    let distanceUntilTarget = result[6];
    distanceUntilTarget = Math.round(distanceUntilTarget * 100) / 100;

    return planet.name + " -> " + target + "\n\nStartPoint: " + startPoint + "\nFly towards " + firstTarget + " until " + distanceUntilFirstTurn + " km away" + 
    "\nFly towards " + secondTarget + " until " + distanceUntilSecondTurn + " km away" + "\nFly towards " + thirdTarget + " until " + distanceUntilTarget + " km away";
}






function removeAllSelection(select){
    for(var i = select.options.length - 1 ; i >= 0 ; i--)
    {
        select.remove(i);
    }
}




document.getElementById("planet-list").addEventListener("change", onSelect);
document.getElementById("location-list").addEventListener("change", onLocationListChange);
document.getElementById("calculate-button").addEventListener("click", onClickCalculate);
document.getElementById("checkbox").addEventListener("change", checkBoxChange);
document.getElementById("convert-button").addEventListener("click", onClickConvert);

function onSelect(){
    let selectPlanets = document.getElementById("planet-list");
    var selectPlanetResult = findPlanet(selectPlanets.options[selectPlanets.selectedIndex].value);
    let selectLocation = document.getElementById("location-list");
    removeAllSelection(selectLocation);

    for(let i = 0; i < selectPlanetResult.locations.length; i++){
        let opt = selectPlanetResult.locations[i];
        let el = document.createElement("option");
        el.textContent = opt.name;
        el.value = opt.name;
        selectLocation.appendChild(el);
    }
    if(!checkbox.checked){
        if(selectPlanetResult.locations.length == 0){ 
             
        } else {
            let location = findPlanet(selectPlanets.options[selectPlanets.selectedIndex].value).getLocation(selectLocation.options[selectLocation.selectedIndex].value);
            document.getElementById("coordx").value = Math.round(location.x * 100) / 100;
            document.getElementById("coordy").value= Math.round(location.y * 100) / 100;
            document.getElementById("coordz").value = Math.round(location.z * 100) / 100;
        }
    }
}






function onLocationListChange(){
    let checkbox = document.getElementById("checkbox");
    if(!checkbox.checked){
        let selectLocation = document.getElementById("location-list");
        let selectPlanets = document.getElementById("planet-list");
        let location = findPlanet(selectPlanets.options[selectPlanets.selectedIndex].value).getLocation(selectLocation.options[selectLocation.selectedIndex].value);
        document.getElementById("coordx").value = Math.round(location.x * 100) / 100;
        document.getElementById("coordy").value= Math.round(location.y * 100) / 100;
        document.getElementById("coordz").value = Math.round(location.z * 100) / 100;
    }
}






function onClickCalculate(){
    let selectPlanets = document.getElementById("planet-list");
    let selectLocations = document.getElementById("location-list");
    if(selectPlanets.value == ""){
            document.getElementById("output-text-area").value = "Please select planet!";
    } else if(selectPlanets.value == "Hurston" || selectPlanets.value == "Arccorp"){
            document.getElementById("output-text-area").value = "Hurston and Arccorp are currently bugged, the OM's can't be seen, so the navigation system won't work. Please choose a different planet!";
    } else {
        if(!checkbox.checked){       
            if(selectLocations.value == ""){
                document.getElementById("output-text-area").value = "Please select location!";
            } else{

                let planet = findPlanet(selectPlanets.options[selectPlanets.selectedIndex].value)
                let target = planet.getLocation(selectLocations.options[selectLocations.selectedIndex].value);
                let result = calculateRoute(target, planet);

                document.getElementById("output-text-area").value = resultToString(planet, target.name, result);
            }
        } else {
            if(document.getElementById("coordx").value == "" || document.getElementById("coordy").value == "" || document.getElementById("coordx").value == ""){
                document.getElementById("output-text-area").value = "Please enter coordinates!";
            } else {
                let planet = findPlanet(selectPlanets.options[selectPlanets.selectedIndex].value)
                let target = new Point(document.getElementById("coordx").value, document.getElementById("coordy").value, document.getElementById("coordz").value);
                let result = calculateRoute(target, planet);

                if(typeof result[2] == "undefined"){
                    document.getElementById("output-text-area").value = "Route to that coordinate not found!";
                } else {
                    document.getElementById("output-text-area").value = resultToString(planet, "Target point", result);
                }
            }
        }
    }
}






function onClickConvert(){
    
    if(document.getElementById("convert-planet-list").value == ""){
        document.getElementById("output-text-area").value = "Please select a planet!";
    } else if(document.getElementById("convert-planet-list").value == "Hurston" || document.getElementById("convert-planet-list").value == "Arccorp"){
        document.getElementById("output-text-area").value = "Hurston and Arccorp are currently bugged, the OM's can't be seen, so the navigation system won't work. Please choose a different planet!";
    } else {
        let planet = findPlanet(document.getElementById("convert-planet-list").value);
        let om1 = document.getElementById("om1").value;
        let om2 = document.getElementById("om2").value;
        let om3 = document.getElementById("om3").value;
        let om4 = document.getElementById("om4").value;
        let om5 = document.getElementById("om5").value;
        let om6 = document.getElementById("om6").value;
        if(om1 == "" || om2 == "" || om3 == "" || om4 == "" || om5 == "" || om6 == ""){
            document.getElementById("output-text-area").value = "Please enter distances!";
        } else{ 
            let omd = [om1, om2, om3, om4, om5, om6];

            let target = distancesToPoint(planet, omd);

            if(typeof target == "undefined"){
                document.getElementById("output-text-area").value = "No point at those distances!";
            } else {
                document.getElementById("output-text-area").value = "Location coordinate:\n\n" + Math.round(target.x * 100) / 100 + " | "  + Math.round(target.y * 100) / 100 + " | " + Math.round(target.z * 100) / 100;
            }
        }
    }
}






function checkBoxChange(){
    
    let checkbox = document.getElementById("checkbox");
    if(checkbox.checked){
        document.getElementById("coordx").readOnly = false;
        document.getElementById("coordy").readOnly = false;
        document.getElementById("coordz").readOnly = false;

        document.getElementById("coordx").value = "";
        document.getElementById("coordy").value = "";
        document.getElementById("coordz").value = "";
    } else{
        document.getElementById("coordx").readOnly = true;
        document.getElementById("coordy").readOnly = true;
        document.getElementById("coordz").readOnly = true;

        let selectLocation = document.getElementById("location-list");
        let selectPlanets = document.getElementById("planet-list");
        if(!selectPlanets.value == "" && !selectLocation == ""){
            let location = findPlanet(selectPlanets.options[selectPlanets.selectedIndex].value).getLocation(selectLocation.options[selectLocation.selectedIndex].value);
            document.getElementById("coordx").value = Math.round(location.x * 100) / 100;
            document.getElementById("coordy").value= Math.round(location.y * 100) / 100;
            document.getElementById("coordz").value = Math.round(location.z * 100) / 100;
        }
    }
    
}






