export class Point{ //vector used for calculations
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

    sub(p) { //vector subtraction
        return new Point(this.x - p.x, this.y - p.y, this.z - p.z);
    }

    add(p){ //vector addition
        return new Point(this.x + p.x, this.y + p.y, this.z + p.z);
    }

    invert(){ //invert vector
        return new Point(-this.x, -this.y, -this.z);
    }

    distance(p){ //distance between two points
        return Math.sqrt(Math.pow(this.x - p.x, 2) + Math.pow(this.y - p.y, 2) + Math.pow(this.z - p.z, 2));
    }

    magnitude(){ //length of vector
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
    }

    normalize(){ //set vector length to 1
        var length = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
        return new Point(this.x / length, this.y / length, this.z / length);
    }

    scale(s){ //scale the vector by scalar
        return new Point(this.x * s, this.y * s, this.z * s);
    }
    
    crossProduct(p){ //crossproduct of two vectors
        return new Point(this.y * p.z - p.y * this.z, this.z * p.x - p.z * this.x, this.x * p.y - p.x * this.y);
    }
    
    vectorTo(p){ //vector from one point to the other
        return this.sub(p).invert();
    }

    scalarProduct(p){ //dotproduct of two vectors
        return (this.x * p.x + this.y * p.y + this.z * p.z);
    }

    bArePointsEqual(p){ //check if two vectors are equal
        if(this.x == p.x){
            if(this.y == p.y){
                if(this.z == p.z){
                    return true;
                }
            }
        } 
        return false;
    }

    intersectLines(v1, p, v2){ //check if two lines intersect and return intersection point
        var vector1 = v1.normalize(); 
        var vector2 = v2.normalize();
        var scalar = (p.sub(this).crossProduct(vector2)).magnitude() / (vector1.crossProduct(vector2)).magnitude();
        
        let temp = this;
        return this.add(vector1.scale(scalar));
    }
}

export class Plane{ //plane in 3d space
    constructor(p, n){
        this.point = p;
        this.normal = n;

    }

    intersectPlaneLine(startpoint, vector){ //return intersection point between two vectors 
        var difference = startpoint.sub(this.point);
        var prod1 = difference.scalarProduct(this.normal);
        var prod2 = vector.scalarProduct(this.normal);
        var prod3 = prod1 / prod2;
        return startpoint.sub(vector.scale(prod3));
    }
}

export class Circle{ //circle in 3d space
    constructor(c, r, n){
        this.centre = c;
        this.radius = r;
        this.normal = n;
    }

    bIsPointInCircle(p){ //check if point is inside the cylinder with the base of the circle
        if(new Plane(this.centre, this.normal).intersectPlaneLine(p, this.normal).distance(this.centre) <= this.radius){
            return true;
        } else {
            return false;
        }
    }

    intersectCircles(c){ //return the intersection between 2 circles in the same plane in 3d space
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

export class Sphere{  //sphere in 3d space
    constructor(c, r){
        this.centre = c;
        this.radius = r;
    }

    intersectSpheres(s){ //return the intersection circle of 2 spheres
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

    intersectSpherePlane(p){ //return the intersection circle of a sphere and a plane
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

    intersectSphereCircle(c){ //return the intersectionpoints of a sphere and a circle
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