planets = [];

class Point{
    constructor(x,y,z){
        this.x = x;
        this.y = y;
        this.z = z;
    }

    xcord(){
        return this.x;
    }

    ycord(){
        return this.y;
    }

    zcord(){
        return this.z;
    }

    sub(p) {
        return new Point(this.x - p.x, this.y - p.y, this.z - p.z);
    }

    add(p){
        return new Point(this.x + p.x, this.y + p.y, this.z + p.z);
    }

    invert(){
        return new Point(-this.x, -this.y, -this.z);
    }

    distance(p){
        return Math.sqrt(Math.pow(this.x - p.x, 2) + Math.pow(this.y - p.y, 2) + Math.pow(this.z - p.z, 2));
    }

    magnitude(){
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
    }

    normalize(){
        var length = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
        return new Point(this.x / length, this.y / length, this.z / length);
    }

    scale(s){
        return new Point(this.x * s, this.y * s, this.z * s);
    }
    
    crossProduct(p){
        return new Point(this.y * p.z - p.y * this.z, this.z * p.x - p.z * this.x, this.x * p.y - p.x * this.y);
    }
    
    vectorTo(p){
        return this.sub(p).invert();
    }

    scalarProduct(p){
        return (this.x * p.x + this.y * p.y + this.z * p.z);
    }

    bArePointsEqual(p){
        if(this.x == p.x){
            if(this.y == p.y){
                if(this.z == p.z){
                    return true;
                }
            }
        } 
        return false;
    }

    intersectLines(v1, p, v2){
        var vector1 = v1.normalize(); 
        var vector2 = v2.normalize();
        var scalar = (p.sub(this).crossProduct(vector2)).magnitude() / (vector1.crossProduct(vector2)).magnitude();
        
        let temp = this;
        return this.add(vector1.scale(scalar));
    }
}






class Plane{
    constructor(p, n){
        this.point = p;
        this.normal = n;

    }

    intersectPlaneLine(startpoint, vector){
        var difference = startpoint.sub(this.point);
        var prod1 = difference.scalarProduct(this.normal);
        var prod2 = vector.scalarProduct(this.normal);
        var prod3 = prod1 / prod2;
        return startpoint.sub(vector.scale(prod3));
    }
}








class Circle{
    constructor(c, r, n){
        this.centre = c;
        this.radius = r;
        this.normal = n;
    }

    bIsPointInCircle(p){
        if(new Plane(this.centre, this.normal).intersectPlaneLine(p, this.normal).distance(this.centre) <= this.radius){
            return true;
        } else {
            return false;
        }
    }

    intersectCircles(c){ //intersect 2 circles
        var distance = this.centre.distance(c.centre);
        var t = this.centre.sub(c.centre).crossProduct(this.normal).normalize();
        if(this.radius + c.radius < distance){
            return [];
        } else if(this.radius + c.radius == distance){
            return [this.centre.vectorTo(c.centre).normalize().scale(this.radius)];
        } else {
            var h = 0.5 + (Math.pow(this.radius, 2) - Math.pow(c.radius, 2)) / (2 * Math.pow(this.centre.distance(c.centre), 2));
            var c_i = this.centre.add(c.centre.sub(this.centre).scale(h));
            var r_i = Math.sqrt(Math.pow(this.radius, 2) - Math.pow(h, 2) * Math.pow(this.centre.distance(c.centre), 2));
            return [c_i.sub(t.scale(r_i)), c_i.add(t.scale(r_i))];
        }
    }
}






class Sphere{
    constructor(c, r){
        this.centre = c;
        this.radius = r;
    }

    intersectSpheres(s){ //intersect 2 spheres
        let distance = this.centre.distance(s.centre);
        if(this.radius + s.radius < distance){
            return null;
        } else if (this.radius + s.radius == distance){
            return null;
        } else {
            distance = this.centre.distance(s.centre);
            var h = 0.5 + (Math.pow(this.radius, 2) - Math.pow(s.radius, 2)) / (2 * Math.pow(distance, 2));
            var c_i = this.centre.add(s.centre.sub(this.centre).scale(h));
            var r_i = Math.sqrt(Math.pow(this.radius, 2) - Math.pow(h, 2) * Math.pow(distance, 2));

            return new Circle (c_i, r_i, this.centre.vectorTo(s.centre).normalize());
        }
    }

    intersectSpherePlane(p){
        var distance = p.normal.normalize().scalarProduct(p.point.sub(this.centre));
        var new_centre;
        var new_radius;
        if(Math.abs(distance) > this.radius){
            return null;
        } else {
            var new_centre = this.centre.add(p.normal.normalize().invert().scale(distance));
            if(Math.abs(distance == this.radius)){
                return null;
            } else {
                var new_radius = Math.sqrt(Math.pow(this.radius, 2) - Math.pow(distance, 2));
                return new Circle(new_centre, new_radius, p.normal);
            }
        }
    }

    intersectSphereCircle(c){
        var distance = c.normal.normalize().scalarProduct(this.centre.sub(c.centre));
        var new_centre;
        var new_radius;
        if(Math.abs(distance > this.radius)){
            return null;
        } else {
            var new_centre = this.centre.add(c.normal.normalize().invert().scale(distance));
            if(Math.abs(distance == this.radius)){
                return [new_centre];
            } else {
                var new_radius = Math.sqrt(Math.pow(this.radius, 2) - Math.pow(distance, 2));
                return c.intersectCircles(new Circle(new_centre, new_radius, c.normal));
            }
        }
    }
}






class Location extends Point{
    constructor(n, x, y, z){
        super(x, y, z);
        this.name = n;
    }
}





class Planet extends Sphere{
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

    addLocation(n, coord){
        var location = new Location(n, coord.x, coord.y, coord.z);
        this.locations.push(location);
    }

    removeLocation(n){
        for(var i = 0; i < this.locations.length; i++){
            if(locations[i].name == n){
                this.locations.splice(i, 1);
            }
        }
    }

    getLocation(n){
        for(var i = 0; i < this.locations.length; i++){
            if(this.locations[i].name == n){
                return this.locations[i];
            }
        }
    }
}

function sortArrayByDistance(a, t){
    //TODO
}

function getCorrectPoint(array, distance, helper4){
    var temp = Math.abs(array[0].distance(helper4) - distance);
    var result;
    if(Math.abs(array[1].distance(helper4) - distance) <temp){
        return array[1];
    } else {
        return array[0];
    }

}

function calculateRoute(target, planet){
    let OMPoints = planet.OMPoints;

    var startPoint;
    var helper1;
    var helper2;
    var helper3;

    var startPointIndex;
    var helper1Index;
    var helper2Index;
    var helper3Index;

    var firstTurn;
    var SecondTurn;

    var untilFirstTurn;
    var untilSecondTurn;
    var untilTarget;

    startPoint = OMPoints[0];
    startPointIndex = 0;
    for(let i = 0; i < OMPoints.length; i++){
        if(OMPoints[i].distance(target) < startPoint.distance(target)){
            startPoint = OMPoints[i];
            startPointIndex = i;
        }
    }
    helper1 = new Point(10000, 10000, 10000);
    for(let i = 0; i < OMPoints.length; i++){
        if(OMPoints[i].distance(target) > startPoint.distance(target) && OMPoints[i].distance(target) < helper1.distance(target)){
            helper1 = OMPoints[i];
            helper1Index = i;
        }
    }
    helper2 = new Point(10000, 10000, 10000);
    for(let i = 0; i < OMPoints.length; i++){
        if(OMPoints[i].distance(target) > helper1.distance(target) && OMPoints[i].distance(target) < helper2.distance(target)){
            helper2 = OMPoints[i];
            helper2Index = i;
        }
    }
    helper3 = new Point(10000, 10000, 10000);
    for(let i = 0; i < OMPoints.length; i++){
        if(OMPoints[i].distance(target) > helper2.distance(target) && OMPoints[i].distance(target) < helper3.distance(target)){
            helper3 = OMPoints[i];
            helper3Index = i;
        }
    }

    if (planet.intersectSpherePlane(new Plane(startPoint, startPoint.vectorTo(helper1).crossProduct(startPoint.vectorTo(helper2)))).bIsPointInCircle(target)){
        secondTurn = new Plane(startPoint, startPoint.vectorTo(helper1).crossProduct(startPoint.vectorTo(helper3))).intersectPlaneLine(helper2, helper2.vectorTo(target));
        firstTurn = startPoint.intersectLines(startPoint.vectorTo(helper1), helper3, helper3.vectorTo(secondTurn));

        untilFirstTurn = firstTurn.distance(helper1);
        untilSecondTurn = helper3.distance(secondTurn);
        untilTarget = target.distance(helper2);
        return [startPointIndex, helper1Index, helper3Index, helper2Index, untilFirstTurn, untilSecondTurn, untilTarget];
    } else {
        secondTurn = new Plane(startPoint, startPoint.vectorTo(helper1).crossProduct(startPoint.vectorTo(helper2))).intersectPlaneLine(planet.centre, planet.centre.vectorTo(target));
        firstTurn = startPoint.intersectLines(startPoint.vectorTo(helper1), helper2, helper2.vectorTo(secondTurn));


        untilFirstTurn = firstTurn.distance(helper1);
        untilSecondTurn = secondTurn.distance(helper2);
        untilTarget = target.distance(planet.centre);

        return [startPointIndex, helper1Index, helper2Index, 7, untilFirstTurn, untilSecondTurn, untilTarget];

    }
}

function distancesToPoint(planet, OMP){


    var intersectionCircle;
    var intersectionPoints;

    var helper1d = OMP[0];
    var helper2d = 100000000;
    var helper3d = 100000000;
    var helper4d = 100000000;

    var helper1 = 0;
    var helper2 = 0;
    var helper3 = 0;
    var helper4 = 0;


    for(let i = 0; i < OMP.length; i++){
        if(OMP[i] < helper1d){
            helper1d = OMP[i];
            helper1 = i;
        } 
    }

    for(let j = 0; j < OMP.length; j++){
        if(OMP[j] > helper1d && OMP[j] < helper2d){
            helper2d = OMP[j];
            helper2 = j;
        }
    }

    for(let k = 0; k < OMP.length; k++){
        if(OMP[k] > helper2d && OMP[k] < helper3d){
            helper3d = OMP[k];
            helper3 = k;
        }
    }

    for(let k = 0; k < OMP.length; k++){
        if(OMP[k] > helper3d && OMP[k] < helper4d){
            helper4d = OMP[k];
            helper4 = k;
        }
    }


    intersectionCircle = new Sphere(planet.OMPoints[helper1], OMP[helper1]).intersectSpheres(new Sphere(planet.OMPoints[helper2], OMP[helper2]));
    intersectionPoints = new Sphere(planet.OMPoints[helper3], OMP[helper3]).intersectSphereCircle(intersectionCircle);


    if(typeof intersectionPoints == null){
        return null;
    }
    if(intersectionPoints.length > 1){
        return getCorrectPoint(intersectionPoints, OMP[helper4], planet.OMPoints[helper4]);
    } else {
        return intersectionPoints[0];
    }
}


function resultToString(planet, target, result){
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














function findPlanet(n){
    for(let i = 0; i < planets.length; i++){
        if(planets[i].name == n){
            return planets[i];
        }
    }
}

function setUpData(){
    planets.push(new Planet("Cellin", 260, 380));
    planets.push(new Planet("Daymar", 295, 430.9));
    planets.push(new Planet("Yela", 313, 454));
    planets.push(new Planet("Hurston", 1000, 1438)); //Update
    planets.push(new Planet("Arial", 344.494, 501));
    planets.push(new Planet("Aberdeen", 274, 402.7));
    planets.push(new Planet("Magda", 340.826, 494.8));
    planets.push(new Planet("Ita", 325, 472.4));
    planets.push(new Planet("Arccorp", 800, 1151)); //Update
    planets.push(new Planet("Lyria", 223, 328.2));
    planets.push(new Planet("Wala", 283, 413));
    planets.push(new Planet("Microtech", 1000, 1439));
    planets.push(new Planet("Delamar", 75, 118.9));


    var OMD = [];
    OMD.push({planetname: "Yela", locationname: "Stash house", OM1: 318.2, OM2: 714.1, OM3: 610.9, OM4: 487.8, OM5: 702.1, OM6: 343.8});
    OMD.push({planetname: "Yela", locationname: "Jumptown", OM1: 699.6, OM2: 349.3, OM3: 541.0, OM4: 564.5, OM5: 723.8, OM6: 295.8});
    OMD.push({planetname: "Daymar", locationname: "Stash house", OM1: 496.2, OM2: 547.1, OM3: 143.2, OM4: 724.6, OM5: 539.8, OM6: 504.1});
    OMD.push({planetname: "Wala", locationname: "Samson & son's salvage center", OM1: 500.4, OM2: 500.6, OM3: 135.4, OM4: 694.7, OM5: 524.9, OM6: 474.8});
    OMD.push({planetname: "Daymar", locationname: "Brio's braker yard", OM1: 350.1, OM2: 651, OM3: 541.2, OM4: 367.7, OM5: 652.5, OM6: 347.3});
    OMD.push({planetname: "Hurston", locationname: "Reclamation & disposal Orinth", OM1: 1058, OM2: 2241, OM3: 2225, OM4: 1091, OM5: 1447, OM6: 2011});
    OMD.push({planetname: "Lyria", locationname: "The orphanage", OM1: 183, OM2: 531.3, OM3: 313.6, OM4: 466.3, OM5: 457, OM6: 326.9});
    OMD.push({planetname: "Lyria", locationname: "Paradise cove", OM1: 441.6, OM2: 347.3, OM3: 166.4, OM4: 436.6, OM5: 463.7, OM6: 317.2});
    OMD.push({planetname: "Cellin", locationname: "Stash house", OM1: 283.1, OM2: 588.5, OM3: 587.3, OM4: 285.6, OM5: 381.4, OM6: 530.1});
    OMD.push({planetname: "Aberdeen", locationname: "Cave 1", OM1: 440, OM2: 531, OM3: 667.4, OM4: 173.5, OM5: 418.1, OM6: 548.4});
    OMD.push({planetname: "Daymar", locationname: "Javelin wreck", OM1: 577.2, OM2: 461.1, OM3: 205.3, OM4: 709.7, OM5: 428.9, OM6: 601.5});

    //OMD.push({planetname: , locationname: , OM1: , OM2: , OM3: , OM4: , OM5: , OM6: });


    for(let i = 0; i < OMD.length; i++){
        let planet = findPlanet(OMD[i].planetname);
        let targetName = OMD[i].locationname;
        let distances = [OMD[i].OM1, OMD[i].OM2, OMD[i].OM3, OMD[i].OM4, OMD[i].OM5, OMD[i].OM6];
        planet.addLocation(targetName, distancesToPoint(planet, distances));
    }



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

function addData(){
    let planet;
    let location;
    let distances;
    planet.addLocation(location, distancesToPoint(planet, distances));
}









function removeAllSelection(select){
    for(i = select.options.length - 1 ; i >= 0 ; i--)
    {
        select.remove(i);
    }
}


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
        console.log("test");
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



setUpData();