<!DOCTYPE html>
<html>
<head>

    <meta charset="UTF-8">
    <title>COVID-19 Lineage Dashboard</title>

    <script src="https://cdn.amcharts.com/lib/5/index.js"></script>
    <script src="https://cdn.amcharts.com/lib/5/map.js"></script>
    <script src="https://cdn.amcharts.com/lib/5/xy.js"></script>
    <script src="https://cdn.amcharts.com/lib/5/percent.js"></script>
    <script src="https://cdn.amcharts.com/lib/5/themes/Animated.js"></script>
    <script src="https://cdn.amcharts.com/lib/5/geodata/indiaLow.js"></script>

    <link rel="stylesheet" href="style.css">

</head>

<body>

    <h1>COVID-19 Lineage Dashboard</h1>

    
    <!-- <div id="chartdiv"></div>

    <div id="linechartdiv"></div>

    <div id="piechartdiv"></div> -->

    <div class="dashboard">

        <div id="chartdiv"></div>

        <div id="linechartdiv"></div>

        <!-- <div id="piechartdiv"></div> -->

        <div id="piechartdiv">
    <div style="
        text-align:center;
        margin-top:200px;
        color:#666;
        font-size:18px;
    ">
        Select a year from the line graph
    </div>
</div>

    </div>

    <script src="script.js"></script>

    <footer>
    © India Biological Data Centre (IBDC) | COVID-19 Lineage Dashboard
</footer>

    <button id="resetBtn">Reset Dashboard</button>

</body>
</html>