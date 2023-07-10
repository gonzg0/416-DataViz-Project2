usa_vehicles = [];
japanese_vehicles = [];
europe_vehicles = [];
full_vehicles = [];
displaying = 0;
WIDTH = 500
HEIGHT = 500
FIFTY = 50
margin = 50

function year_filter() {
    const year_1 = Number(document.getElementById('start_year').value);
    const year_2 = Number(document.getElementById('end_year').value);

    let greaterThanYear1 = full_vehicles.filter(car => car.year >= year_1);
    return greaterThanYear2 = greaterThanYear1.filter(car => car.year <= year_2);
}

function name_search(previous_filtration) {
    const value = document.getElementById('name_search').value;
    if (previous_filtration) {
        return previous_filtration.filter(car => car.name.toLowerCase().indexOf(value.toLowerCase()) >= 0);
    } else {
        return full_vehicles.filter(car => car.name.toLowerCase().indexOf(value.toLowerCase()) >= 0);
    }
}

function filtration(filtrations) {
    let temp_filtration = null;
    let filtration_result = null;

    if (filtrations.length === 1) {
        if (filtrations[0] === 'year') {
            filtration_result = year_filter();
        }
        else if (filtrations[0] === 'name') {
            filtration_result = name_search();
        }
    } else {
        filtrations.forEach(filtration_type => {
            if (filtration_type === 'year') {
                temp_filtration = year_filter();
            } else if (filtration_type === 'name') {
                filtration_result = name_search(temp_filtration);
            }
        });
    }

    d3.selectAll("svg > *").remove();
    generateSVG(filtration_result);
}

function clearInput(ids) {
    ids.forEach(id => {
        document.getElementById(id).value = '';
    });
}

function updateSelfExplore(type) {
    let filtration_types = [];

    if (document.getElementById('start_year').value && document.getElementById('end_year').value) {
        filtration_types.push('year');
    }
    if (document.getElementById('name_search').value) {
        filtration_types.push('name');
    }

    if (type === 'filtration') {
        filtration(filtration_types);
    }

    if (type == 'reset') {
        d3.selectAll("svg > *").remove();
        generateSVG(full_vehicles);
        clearInput(['name_search', 'start_year', 'end_year']);
    }
}

function generateNationBlurb(index) {
    var nationText;
    var blurb;
    if (index === 0) {
        nationText = 'USA Vehicles';
        blurb = "<p>American cars during the era of 1970 to 1982 tended to have higher fuel consumption. Displayed as lower miles per gallon.</p>" +
            "<p>They also tended to weigh a lot more than their counterparts in europe and japan. We also note a clear tend of less weight relating to higher miles per gallon, but we also see some road tanks with abysmal fuel efficiency of 9 MPG.</p>" +
            "<p>Also of important note is the disel vehicle displaying better fuel efficiency than its simiarly weighted gasoline counterparts. One downside of the diesel efficiency is emissions, which are higher than gasoline vehicles.</p>";
    } else if (index === 1) {
        nationText = 'Europe Vehicles';
        blurb = "<p>European cars of the era seem to have more diesel vehicles available.</p>" +
            "<p>They also tended to weigh less than their counterparts in europe and japan. Overall, they have a broader spread of fuel efficiency when compared to American vehicles.</p>" +
            "<p>We notice that the European vehicles tend to have more base fuel efficiency and higher top fuel efficiency. Overall across multiple weight categories diesels outperform gasoline vehicles.</p>";
    } else if (index === 2) {
        nationText = 'Japanese Vehicles';
        blurb = "<p>Japanese cars of the era seem to be more fuel efficient when compared against European and American cars. With the majority clustered aronud the 30MPG mark.</p>" +
            "<p>They also tended to weigh less than their counterparts in Europe and America. The heaviest Japanese car of the era was 2930 LBS. A low weight for an American vehicle and an average weight for a European car.</p>" +
            "<p>We notice that the Japanese vehicles tend to have similar fuel efficiency ranges like the European cars. Unfortunately I was unable to determine efficiently if the Japanese vehicles were diesel powered.</p>";
    } else if (index === 3) {
        nationText = 'Full explore';
        blurb = "<p>Welcome to the full explore! Explore the data to your heart's content!</p><p>Red American, Blue European, Green Japanese</p><p>Filter using the year selectors or search names with the searchbox.</p>";
    }

    document.getElementById('nation').textContent = nationText;
    document.getElementById('blurb').innerHTML = blurb;
}

function updateBackground(index) {
    var backgroundImg = [
        "./images/car1.webp",
        "./images/europe-car.jpg",
        "./images/mitsubushi-delica.jpg",
        "./images/soviet-carvolga-gaz-241.jpg"
    ];

    document.getElementById('body').style.backgroundImage = "url('" + backgroundImg[index] + "')";
}

function circle_color(origin) {
    if (origin === 'usa') {
        return 'blue';
    } else if (origin === 'europe') {
        return 'red';
    } else if (origin === 'japan') {
        return 'green';
    }
}

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

function generateAnnotation(annotation_number) {
    const type = d3.annotationCalloutCircle
    const usa_annotation = {
        note: {
            label: "Oldsmobile cutlass ciera 1982 38 mpg 3015 lbs",
            title: "Diesel Vehicle"
        },
        dy: -150,
        dx: -10,
        x: 530,
        y: 365,
        subject: {
            radius: 30,
            radiusPadding: 5
        }
    }

    let annotations = []
    if (annotation_number === 0) {
        annotations.push(usa_annotation);
    } if (annotation_number === 1) {
        annotations = [
            {
                note: {
                    label: "mercedes-benz 300D 1979 25.4 MPG 3530 lbs",
                    title: "Diesel Vehicle"
                },
                dy: -30,
                dx: -20,
                x: 210,
                y: 125,
                subject: {
                    radius: 25,
                    radiusPadding: 3
                }
            },
            {
                note: {
                    label: "Multiple diesel vehicles exhibit the same trend.",
                    title: "Diesel Vehicles"
                },
                dy: -50,
                dx: 0,
                x: 295,
                y: 200,
                subject: {
                    radius: 35,
                    radiusPadding: 3
                }
            },
            {
                note: {
                    label: "audi 5000s 1980 36.4 mpg 2950 lbs",
                    title: "Diesel Vehicle"
                },
                dy: -50,
                dx: 10,
                x: 410,
                y: 270,
                subject: {
                    radius: 30,
                    radiusPadding: 5
                }
            }
            ,
            {
                note: {
                    label: "VW dasher 1980 43.4 mpg 2335 lbs",
                    title: "Diesel Vehicle"
                },
                dy: -50,
                dx: -10,
                x: 535,
                y: 420,
                subject: {
                    radius: 30,
                    radiusPadding: 5
                }
            }
        ]
    }

    const makeAnnotations = d3.annotation()
        .editMode(false)
        .notePadding(5)
        .type(type)
        .annotations(annotations)

    d3.select("svg")
        .append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations)
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
    var mouseleave = function () {
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
        .attr("fill", function (d, i) { return circle_color(d.origin) })
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
    if (direction === "forward") {
        displaying++;
    } else if (direction === "backward") {
        displaying--;
    } else {
        displaying = 0;
    }

    if (displaying > 3) {
        displaying = 3;
    } else if (displaying < 0) {
        displaying = 0;
    }

    updateBackground(displaying);
    display = [usa_vehicles, europe_vehicles, japanese_vehicles];

    if (displaying === 3) {
        document.getElementById('tools').style.display = 'block';
        document.getElementById('btn_forward').style.display = 'none';
        generateSVG(full_vehicles);
    } else {
        document.getElementById('tools').style.display = 'none';
        document.getElementById('btn_forward').style.display = 'inline-block';
        generateSVG(display[displaying]);
        generateAnnotation(displaying);
    }

    generateNationBlurb(displaying);
    console.log("this code was built by Gerardo Gonzalez Moctezuma");
}

async function init() {
    d3.csv("https://gonzg0.github.io/416-DataViz-Project2/Automobile.csv").then(function (data) {
        const car = car => ({ origin: car.origin, acceleration: car.acceleration, name: car.name, mpg: Number(car.mpg), weight: Number(car.weight), year: Number(19 + car.model_year) });

        this.usa_vehicles = data.filter(car => car.origin === 'usa').map(car);
        this.japanese_vehicles = data.filter(car => car.origin === 'japan').map(car);
        this.europe_vehicles = data.filter(car => car.origin === 'europe').map(car);
        full_vehicles = usa_vehicles.concat(europe_vehicles).concat(japanese_vehicles);

        generateSVG(usa_vehicles);
        generateAnnotation(0);
        generateNationBlurb(0)

        document.querySelector("#btn_forward").addEventListener("click", (event) => {
            updateDisplay("forward");
        });

        document.querySelector("#btn_backward").addEventListener("click", (event) => {
            updateDisplay("backward");
        });

        document.querySelector("#btn_restart").addEventListener("click", (event) => {
            if (displaying === 3) {
                updateSelfExplore('reset');
            } else {
                updateDisplay("reset");
            }
        });

        document.querySelector("#btn_year").addEventListener("click", (event) => {
            updateSelfExplore('filtration');
        });

        document.querySelector("#btn_name").addEventListener("click", (event) => {
            updateSelfExplore('filtration');
        });
    });
}