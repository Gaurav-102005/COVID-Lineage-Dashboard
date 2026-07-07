<?php

include "db.php";

$state = $_GET['state'] ?? '';
$state = $conn->real_escape_string($state);

$sql = "
SELECT
    RIGHT(l.Date,4) AS Year,
    COUNT(*) AS TotalSamples
FROM Lineages l
JOIN Lineage_Group lg
    ON l.Lineage = lg.Lineage
WHERE l.Statename = '$state'
AND l.Date IS NOT NULL
AND RIGHT(l.Date,4) REGEXP '^[0-9]{4}$'
GROUP BY RIGHT(l.Date,4)
ORDER BY Year
";

$result = $conn->query($sql);

if (!$result) {
    die("SQL Error: " . $conn->error);
}

$data = [];

while ($row = $result->fetch_assoc()) {

    $data[] = [
        "year" => $row["Year"],
        "samples" => (int)$row["TotalSamples"]
    ];

}

header("Content-Type: application/json");
echo json_encode($data);

$conn->close();

?>