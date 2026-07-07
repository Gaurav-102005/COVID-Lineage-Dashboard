<?php

include "db.php";

$state = $_GET['state'] ?? '';
$year = $_GET['year'] ?? '';

$state = $conn->real_escape_string($state);
$year = $conn->real_escape_string($year);

$sql = "
SELECT
    lg.LineageGroup,
    COUNT(*) AS TotalSamples
FROM Lineages l
JOIN Lineage_Group lg
    ON l.Lineage = lg.Lineage
WHERE l.Statename = '$state'
AND RIGHT(l.Date,4) = '$year'
GROUP BY lg.LineageGroup
ORDER BY TotalSamples DESC
";

$result = $conn->query($sql);

if (!$result) {
    die('SQL Error: ' . $conn->error);
}

$data = [];

while ($row = $result->fetch_assoc()) {

    $data[] = [
        "group" => $row["LineageGroup"],
        "samples" => (int)$row["TotalSamples"]
    ];

}

header("Content-Type: application/json");
echo json_encode($data);

$conn->close();

?>