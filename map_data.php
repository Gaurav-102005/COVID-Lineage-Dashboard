<?php

include "db.php";

$sql = "
SELECT
    l.Statename,
    COUNT(*) AS TotalSamples
FROM Lineages l
JOIN Lineage_Group lg
    ON l.Lineage = lg.Lineage
WHERE l.Date IS NOT NULL
AND RIGHT(l.Date,4) REGEXP '^[0-9]{4}$'
AND l.Statename NOT IN ('Unknown', 'Kathmandu', 'Trashigang')
GROUP BY l.Statename
ORDER BY TotalSamples DESC
";

$result = $conn->query($sql);

if (!$result) {
    die("SQL Error: " . $conn->error);
}

$data = [];

while ($row = $result->fetch_assoc()) {

    $data[] = [
        "state" => $row["Statename"],
        "samples" => (int)$row["TotalSamples"]
    ];

}

header("Content-Type: application/json");
echo json_encode($data);

$conn->close();

?>