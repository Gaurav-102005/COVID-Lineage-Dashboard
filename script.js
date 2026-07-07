const stateCodes = {
    "Andhra Pradesh": "IN-AP",
    "Arunachal Pradesh": "IN-AR",
    "Assam": "IN-AS",
    "Bihar": "IN-BR",
    "Chandigarh": "IN-CH",
    "Chhattisgarh": "IN-CT",
    "Dadra and Nagar Haveli and Daman and Diu": "IN-DH",
    "Delhi": "IN-DL",
    "Goa": "IN-GA",
    "Gujarat": "IN-GJ",
    "Haryana": "IN-HR",
    "Himachal Pradesh": "IN-HP",
    "Jammu and Kashmir": "IN-JK",
    "Jharkhand": "IN-JH",
    "Karnataka": "IN-KA",
    "Kerala": "IN-KL",
    "Ladakh": "IN-LA",
    "Madhya Pradesh": "IN-MP",
    "Maharashtra": "IN-MH",
    "Manipur": "IN-MN",
    "Meghalaya": "IN-ML",
    "Mizoram": "IN-MZ",
    "Nagaland": "IN-NL",
    "Odisha": "IN-OR",
    "Puducherry": "IN-PY",
    "Punjab": "IN-PB",
    "Rajasthan": "IN-RJ",
    "Sikkim": "IN-SK",
    "Tamil Nadu": "IN-TN",
    "Telangana": "IN-TG",
    "Tripura": "IN-TR",
    "Uttar Pradesh": "IN-UP",
    "Uttarakhand": "IN-UT",
    "West Bengal": "IN-WB",
    "Andaman and Nicobar Islands": "IN-AN"
};

let selectedState = "";

fetch("map_data.php")
.then(response => response.json())
.then(data => {

    const mapData = [];

    data.forEach(row => {

        if(stateCodes[row.state]) {

            mapData.push({
                id: stateCodes[row.state],
                value: row.samples,
                state: row.state
            });

        }

    });

    createMap(mapData);

});

function createMap(mapData) {

    am5.ready(function () {

        let root = am5.Root.new("chartdiv");

        root.setThemes([
            am5themes_Animated.new(root)
        ]);

        let chart = root.container.children.push(
            am5map.MapChart.new(root, {
                projection: am5map.geoMercator()
            })
        );

        let polygonSeries = chart.series.push(
            am5map.MapPolygonSeries.new(root, {
                geoJSON: am5geodata_indiaLow
            })
        );

        polygonSeries.mapPolygons.template.setAll({
            tooltipText: "{name}\nSamples: {value}",
            interactive: true
        });

        polygonSeries.set("heatRules", [{
            target: polygonSeries.mapPolygons.template,
            dataField: "value",
            min: am5.color(0xd6e685),
            max: am5.color(0x1e6823),
            key: "fill"
        }]);

        polygonSeries.data.setAll(mapData);

        polygonSeries.events.on("datavalidated", function() {

    console.log("DATA VALIDATED");

    polygonSeries.mapPolygons.each(function(polygon) {

        polygon.events.on("click", function() {

            const dataItem = polygon.dataItem;

            if (!dataItem) return;

            const id = dataItem.get("id");

            console.log("Clicked ID:", id);

            const stateInfo = mapData.find(function(item) {
                return item.id === id;
            });

            console.log("State Info:", stateInfo);

            if (!stateInfo) {
                alert("State not found");
                return;
            }

            selectedState = stateInfo.state;

            console.log("Selected State:", selectedState);

            resetPieChart();

            loadYearChart(selectedState);

        });

    });

});

        polygonSeries.set("valueField", "value");
polygonSeries.set("idField", "id");

        console.log("Polygon count:",
    polygonSeries.mapPolygons.length
);

        console.log("MAP DATA");
console.log(mapData);

        polygonSeries.mapPolygons.template.setAll({
    interactive: true,
    cursorOverStyle: "pointer",
    tooltipText: "{name}\nSamples: {value}"
});
    });

}

function resetPieChart() {

    am5.array.each(am5.registry.rootElements, function(root) {

        if(root.dom && root.dom.id === "piechartdiv") {
            root.dispose();
        }

    });

    document.getElementById("piechartdiv").innerHTML = "";
}

function loadYearChart(stateName) {

    console.log("Loading chart for:", stateName);

    fetch(
        "year_data.php?state=" +
        encodeURIComponent(stateName)
    )
    .then(response => response.json())
    .then(data => {

        console.log("Year Data:", data);

        renderLineChart(data, stateName);

    })
    .catch(error => {
        console.error(error);
    });

}

function renderLineChart(data, stateName) {

    am5.array.each(am5.registry.rootElements, function(root) {
        if(root.dom.id === "linechartdiv") {
            root.dispose();
        }
    });

    let root = am5.Root.new("linechartdiv");


    root.setThemes([
        am5themes_Animated.new(root)
    ]);

    root.container.children.push(
    am5.Label.new(root, {
        text: stateName + " - Total Samples Year Wise",
        fontSize: 22,
        fontWeight: "500",
        centerX: am5.percent(50),
        x: am5.percent(50),
        paddingBottom: 15
    })
);

    let chart = root.container.children.push(
        am5xy.XYChart.new(root, {
            panX: true,
            panY: true,
            wheelX: "panX",
            wheelY: "zoomX"
        })
    );

    chart.setAll({
    paddingTop: 30
});

    let xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
            categoryField: "year",
            renderer: am5xy.AxisRendererX.new(root, {
                minGridDistance: 10
            })
        })
    );

    let yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererY.new(root, {})
        })
    );

    xAxis.data.setAll(data);

    let series = chart.series.push(
        am5xy.LineSeries.new(root, {
            name: stateName,
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "samples",
            categoryXField: "year",
            tooltip: am5.Tooltip.new(root, {
                labelText: "{categoryX}: {valueY}"
            })
        })
    );

    series.data.setAll(data);
    series.strokes.template.setAll({
    strokeWidth: 2
});


    series.bullets.push(function(root, series, dataItem) {

    let circle = am5.Circle.new(root, {
        radius: 6,
        fill: series.get("fill"),
        cursorOverStyle: "pointer"
    });

    circle.events.on("click", function() {

        let year = dataItem.dataContext.year;

        loadPieChart(
            selectedState,
            year
        );

    });

    return am5.Bullet.new(root, {
        sprite: circle
    });

});

    chart.set("cursor",
        am5xy.XYCursor.new(root, {})
    );

    series.appear(1000);
    chart.appear(1000, 100);

}

function loadPieChart(stateName, year) {

    fetch(
        "lineage_data.php?state=" +
        encodeURIComponent(stateName) +
        "&year=" +
        encodeURIComponent(year)
    )
    .then(response => response.json())
    .then(data => {

        renderPieChart(data, stateName, year);

    });

}

function renderPieChart(data, stateName, year) {

    am5.array.each(am5.registry.rootElements, function(root) {
        if(root.dom.id === "piechartdiv") {
            root.dispose();
        }
    });

    let root = am5.Root.new("piechartdiv");

    root.setThemes([
        am5themes_Animated.new(root)
    ]);

    root.container.children.push(
    am5.Label.new(root, {
        text:
            stateName +
            " (" +
            year +
            ") - Lineage Group Distribution",
        fontSize: 22,
        fontWeight: "500",
        centerX: am5.percent(50),
        x: am5.percent(50),
        paddingBottom: 15
    })
);

    let chart = root.container.children.push(
        am5percent.PieChart.new(root, {
            radius: am5.percent(50),
            layout: root.verticalLayout
        })
    );

    let series = chart.series.push(
        am5percent.PieSeries.new(root, {
            valueField: "samples",
            categoryField: "group"
        })
    );

    series.labels.template.setAll({
    text: "{value}",
    fontSize: 15
});

series.ticks.template.set("visible", true);

series.slices.template.setAll({
    tooltipText: "{category}\nSamples: {value}"
});

    series.data.setAll(data);

    let legend = chart.children.push(
        am5.Legend.new(root, {
            centerX: am5.percent(50),
            x: am5.percent(50)
        })
    );

    legend.data.setAll(series.dataItems);

    series.appear(1000, 100);

}

window.addEventListener("load", function () {

    const btn = document.getElementById("resetBtn");

    if (btn) {

        btn.addEventListener("click", function () {

            location.reload();

        });

    }

});