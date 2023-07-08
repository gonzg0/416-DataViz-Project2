usa_vehicles = [];
japanese_vehicles = [];
europe_vehicles = [];
displaying = 0;
WIDTH = 500
HEIGHT = 500
FIFTY = 50
margin = 50

function generate_vehicle_tooltip(car) {
    return car.name + " " + car.year + "<br>MPG: " + car.mpg + "<br>Acceleration: " + car.acceleration + "<br>" + car.weight + " lbs";
}

function mpg_weight_ranges(cars) {
    weight_min = Math.min(...cars.map(o => o.weight));
    weight_max = Math.max(...cars.map(o => o.weight));

    mpg_min = Math.min(...cars.map(o => o.mpg));
    mpg_max = Math.max(...cars.map(o => o.mpg));

    return {
        weight: {
            max: weight_max,
            min: weight_min
        },
        mpg: {
            max: mpg_max,
            min: mpg_min
        }
    }
}

function generateSVG(vehicles) {
    var tooltip = d3.select("#svg_container")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("position", "absolute");


    var mouseover = function (d) {
        tooltip
            .style("opacity", 1)
    }
    
    var mousemove = function (d) {
        tooltip
            .html(generate_vehicle_tooltip(d))
            .style("left", (d3.event.pageX + 16) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
            .style("top", (d3.event.pageY + 16) + "px")
    }
    
    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    var mouseleave = function (d) {
        tooltip
            .transition()
            .duration(200)
            .style("opacity", 0)
    }

    ranges = mpg_weight_ranges(vehicles);
    var mpg = d3.scaleLinear().domain([ranges.mpg.min, ranges.mpg.max]).range([0, 500]);
    var weight = d3.scaleLinear().domain([ranges.weight.min, ranges.weight.max]).range([500, 0]);

    d3.select("svg")
        .attr("width", WIDTH + 2 * FIFTY)
        .attr("height", HEIGHT + 2 * FIFTY)
        .append("g")
        .attr("transform", "translate(" + margin + "," + margin + ")")
        .selectAll("circle")
        .data(vehicles)
        .enter().append("circle")
        .attr("cy", function (d, i) { return weight(d.weight); })
        .attr("cx", function (d, i) { return mpg(d.mpg); })
        .attr("r", function (d, i) { return Number(d.acceleration); })
        .attr("id", function (d, i) { return "usa_vehicle" + i; })
        .attr("fill", "blue")
        .attr("stroke", "red")
        .attr("border", "6px solid blue")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);

        d3.select("svg")
        .append("g")
        .attr("transform", "translate(" + 50 + "," + 50 + ")")
        .call(d3.axisLeft(weight).tickFormat(d3.format('~s')));

    d3.select("svg")
        .append("g")
        .attr("transform", "translate(" + 50 + "," + 550 + ")")
        .call(d3.axisBottom(mpg).tickFormat(d3.format('~s')));


    d3.select("svg").append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", 20)
        .attr("x", -margin - 200)
        .text("Weight (lbs)");

    d3.select("svg").append("text")
        .attr("text-anchor", "end")
        .attr("x", 325)
        .attr("y", 590)
        .text("MPG");

}

function updateDisplay(direction) {
    d3.selectAll("svg > *").remove();
    if(direction === "forward"){
        displaying++;
    }else if(direction === "backward") {
        displaying--;
    }else {
        displaying = 0;
    }

    display = [usa_vehicles, europe_vehicles, japanese_vehicles];
    generateSVG(display[displaying]);
}

async function init() {
    d3.csv("https://gonzg0.github.io/416-DataViz-Project2/Automobile.csv").then(function (data) {
        const car = car => ({ acceleration: car.acceleration, name: car.name, mpg: Number(car.mpg), weight: Number(car.weight), year: Number(19 + car.model_year) });

        this.usa_vehicles = data.filter(car => car.origin === 'usa').map(car);
        this.japanese_vehicles = data.filter(car => car.origin === 'japan').map(car);
        this.europe_vehicles = data.filter(car => car.origin === 'europe').map(car);

        generateSVG(usa_vehicles);
        document.querySelector("#btn_forward").addEventListener("click", (event) => {
            updateDisplay("forward");
        });

        document.querySelector("#btn_backward").addEventListener("click", (event) => {
            updateDisplay("backward");
        });

        document.querySelector("#btn_reset").addEventListener("click", (event) => {
            updateDisplay("reset");
        });
    });
}