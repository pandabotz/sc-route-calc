import { Point, Plane, Sphere, Circle } from './vectorMath.js';

function sortArrayByDistance(a, t){
    //TODO
}

export function getCorrectPoint(array, distance, helper4){ // return point with distance to helper4 closest to reported distance to helper4
    var temp = Math.abs(array[0].distance(helper4) - distance);
    if(Math.abs(array[1].distance(helper4) - distance) <temp){
        return array[1];
    } else {
        return array[0];
    }

}

export function calculateRoute(target, planet){ //calculate route bases on target and planet

    //find the 4 closest orbital markers to the target
    //startpoint closest
    //helper1 second closest
    //etc
    //will be reworked TODO
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
    var secondTurn;

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

    //first we check if the point is on the intersection circle of the planet sphere and the startpoint, helper1 and helper 2 plane
    if (planet.intersectSpherePlane(new Plane(startPoint, startPoint.vectorTo(helper1).crossProduct(startPoint.vectorTo(helper2)))).bIsPointInCircle(target)){

        //the second turn is where the helper2 to target ray intersects the startpoint, helper1 and helper3 plane
        secondTurn = new Plane(startPoint, startPoint.vectorTo(helper1).crossProduct(startPoint.vectorTo(helper3))).intersectPlaneLine(helper2, helper2.vectorTo(target));
        
        //the first turn is where the startpoint to helper1 line intersects the helper3 to second turn ray
        firstTurn = startPoint.intersectLines(startPoint.vectorTo(helper1), helper3, helper3.vectorTo(secondTurn));
        console.log(secondTurn);
        console.log(firstTurn);
        //calculate distances
        untilFirstTurn = firstTurn.distance(helper1);
        untilSecondTurn = helper3.distance(secondTurn);
        untilTarget = target.distance(helper2);

        //return points and distances for output
        return [startPointIndex, helper1Index, helper3Index, helper2Index, untilFirstTurn, untilSecondTurn, untilTarget];

    } else {

        //the second turn is where the planet centre to target ray intersects the startpoint, helper1 and helper2 plane
        secondTurn = new Plane(startPoint, startPoint.vectorTo(helper1).crossProduct(startPoint.vectorTo(helper2))).intersectPlaneLine(planet.centre, planet.centre.vectorTo(target));

        //first turn is where the startpoint to helper1 line intersects the helper2 to second turn ray
        firstTurn = startPoint.intersectLines(startPoint.vectorTo(helper1), helper2, helper2.vectorTo(secondTurn));

        //calculate distances
        untilFirstTurn = firstTurn.distance(helper1);
        untilSecondTurn = secondTurn.distance(helper2);
        untilTarget = target.distance(planet.centre);

        //return points and distances for output
        return [startPointIndex, helper1Index, helper2Index, 7, untilFirstTurn, untilSecondTurn, untilTarget];

    }
}

export function distancesToPoint(planet, OMP){  //convert distances to orbital markers to coordinate
    
    //find the 4 closest orbital markers to the target
    //helper1 closest
    //helper2 second closest
    //etc
    //will be reworked TODO

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


    //first we get the intersection circle of the helper1 sphere and the helper2 sphere
    intersectionCircle = new Sphere(planet.OMPoints[helper1], OMP[helper1]).intersectSpheres(new Sphere(planet.OMPoints[helper2], OMP[helper2]));

    //next we get the intersection points of the previous circle and the helper3 sphere
    intersectionPoints = new Sphere(planet.OMPoints[helper3], OMP[helper3]).intersectSphereCircle(intersectionCircle);


    //we check if 2 or 1 point got returned
    if(typeof intersectionPoints == null){
        return null;
    }
    if(intersectionPoints.length > 1){

        //if it's 2 points return the points where the distance to helper4 is closest to the recorded distance to helper4
        return getCorrectPoint(intersectionPoints, OMP[helper4], planet.OMPoints[helper4]);
    } else {
        return intersectionPoints[0];
    }
}