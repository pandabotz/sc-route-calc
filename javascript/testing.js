

var planets = ["cellin", "daymar"];

var select = document.getElementById("planetsList");

for(var i = 0; i < planets.length; i++){
    var opt = planets[i];
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = 1;
    select.appendChild(el);
}