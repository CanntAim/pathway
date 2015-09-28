<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>jQuery UI Tabs - Default functionality</title>
  <link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
  <script src="//code.jquery.com/jquery-1.10.2.js"></script>
  <script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
  <link rel="stylesheet" href="/resources/demos/style.css">
  <script>
  $(function() {
    $( "#tabs" ).tabs();
  });
  </script>
  <style>
	#tabs {
		min-height: 1000px;
	}
  </style>
</head>
<body>
<?php
/**
 * Created by PhpStorm.
 * User: thamhoang
 * Date: 9/4/15
 * Time: 12:10 PM
 */

$servername = "137.99.11.122:3306";
$username = "root";
$password = "root";
$dbname = "pathway";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$vars = $_POST['variable'];
//echo '<pre>'; print_r($vars); echo '</pre>';
$params = explode (" " , $vars);
array_pop($params);

$gene_name = array_unique($params);
$cnt_gene = count($gene_name);
$count_genes = array_count_values($params);

//echo '<pre>'; print_r($gene_name); echo '</pre>';
//echo '<pre>'; print_r($count_genes); echo '</pre>';
$count = 0;
$ori_result = array();

$coding_arr = array(
	'1' => 'down-regulated',
	'2' => 'up-regulated',
	'3' => 'cnv loss and down-regulated',
	'4' => 'cnv loss and up-regulated',
	'5' => 'cnv gain and down-regulated',
	'6' => 'cnv gain and up-regulated',
	'7' => 'mutation',
	'8' => 'tumor-suppressor',
	'9' => 'oncogene'
);

foreach($gene_name as $key=>$value) {
	
	if ($count_genes[$value] == 1) {
		$sql = "SELECT DISTINCT a.ID, a.NAME AS OBJECT_NAME, c.NAME AS GENE_NAME, b.RNA AS RNA_VALUE, b.CNV AS CNV_VALUE, b.SNP AS SNP_VALUE
					FROM OBJECTS a, GENE_VALUES b, GENES c
					WHERE a.ID = b.OBJECT_ID
					AND b.GENE_ID = c.ID
					AND c.NAME = '" . $value . "' AND b.RNA < 0 LIMIT 0 , 30";
					
	} else if ($count_genes[$value] == 2) {
		$sql = "SELECT DISTINCT a.ID, a.NAME AS OBJECT_NAME, c.NAME AS GENE_NAME, b.RNA AS RNA_VALUE, b.CNV AS CNV_VALUE, b.SNP AS SNP_VALUE
					FROM OBJECTS a, GENE_VALUES b, GENES c
					WHERE a.ID = b.OBJECT_ID
					AND b.GENE_ID = c.ID
					AND c.NAME = '" . $value . "' AND b.RNA > 0 LIMIT 0 , 30";
					
	} else if ($count_genes[$value] == 3) {
		$sql = "SELECT DISTINCT a.ID, a.NAME AS OBJECT_NAME, c.NAME AS GENE_NAME, b.RNA AS RNA_VALUE, b.CNV AS CNV_VALUE, b.SNP AS SNP_VALUE
					FROM OBJECTS a, GENE_VALUES b, GENES c
					WHERE a.ID = b.OBJECT_ID
					AND b.GENE_ID = c.ID
					AND c.NAME = '" . $value . "' AND b.RNA > 0 AND CNV < 0 LIMIT 0 , 30";
					
	} else if ($count_genes[$value] == 4) {
		$sql = "SELECT DISTINCT a.ID, a.NAME AS OBJECT_NAME, c.NAME AS GENE_NAME, b.RNA AS RNA_VALUE, b.CNV AS CNV_VALUE, b.SNP AS SNP_VALUE
					FROM OBJECTS a, GENE_VALUES b, GENES c
					WHERE a.ID = b.OBJECT_ID
					AND b.GENE_ID = c.ID
					AND c.NAME = '" . $value . "' AND b.RNA < 0 AND CNV < 0 LIMIT 0 , 30";
		
	} else if ($count_genes[$value] == 5) {
		$sql = "SELECT DISTINCT a.ID, a.NAME AS OBJECT_NAME, c.NAME AS GENE_NAME, b.RNA AS RNA_VALUE, b.CNV AS CNV_VALUE, b.SNP AS SNP_VALUE
					FROM OBJECTS a, GENE_VALUES b, GENES c
					WHERE a.ID = b.OBJECT_ID
					AND b.GENE_ID = c.ID
					AND c.NAME = '" . $value . "' AND b.RNA < 0 AND CNV > 0 LIMIT 0 , 30";
					
	} else if ($count_genes[$value] == 6) {
		$sql = "SELECT DISTINCT a.ID, a.NAME AS OBJECT_NAME, c.NAME AS GENE_NAME, b.RNA AS RNA_VALUE, b.CNV AS CNV_VALUE, b.SNP AS SNP_VALUE
					FROM OBJECTS a, GENE_VALUES b, GENES c
					WHERE a.ID = b.OBJECT_ID
					AND b.GENE_ID = c.ID
					AND c.NAME = '" . $value . "' AND b.RNA > 0 AND CNV > 0 LIMIT 0 , 30";
					
	} else if ($count_genes[$value] == 7) {
		$sql = "SELECT DISTINCT a.ID, a.NAME AS OBJECT_NAME, c.NAME AS GENE_NAME, b.RNA AS RNA_VALUE, b.CNV AS CNV_VALUE, b.SNP AS SNP_VALUE
					FROM OBJECTS a, GENE_VALUES b, GENES c
					WHERE a.ID = b.OBJECT_ID
					AND b.GENE_ID = c.ID
					AND c.NAME = '" . $value . "' AND b.RNA < 0 AND CNV < 0 and MUT != 0 LIMIT 0 , 30";
					
	} 
	/*
	else if ($count_genes[$value] == 8) {
		$sql = "SELECT DISTINCT a.ID, a.NAME AS OBJECT_NAME, c.NAME AS GENE_NAME, b.RNA AS VALUE
					FROM OBJECTS a, GENE_VALUES b, GENES c
					WHERE a.ID = b.OBJECT_ID
					AND b.GENE_ID = c.ID
					AND c.NAME = '" . $value . "' AND b.RNA < 0 AND CNV < 0 LIMIT 0 , 30";
					
	} else if ($count_genes[$value] == 9) {
		$sql = "SELECT DISTINCT a.ID, a.NAME AS OBJECT_NAME, c.NAME AS GENE_NAME, b.RNA AS VALUE
					FROM OBJECTS a, GENE_VALUES b, GENES c
					WHERE a.ID = b.OBJECT_ID
					AND b.GENE_ID = c.ID
					AND c.NAME = '" . $value . "' AND b.RNA < 0 AND CNV < 0 LIMIT 0 , 30";
					
	} 
	*/
	else {
		$sql = "SELECT DISTINCT a.ID, a.NAME AS OBJECT_NAME, c.NAME AS GENE_NAME, b.RNA AS RNA_VALUE, b.CNV AS CNV_VALUE, b.SNP AS SNP_VALUE
					FROM OBJECTS a, GENE_VALUES b, GENES c
					WHERE a.ID = b.OBJECT_ID
					AND b.GENE_ID = c.ID
					AND c.NAME = '" . $value . "' LIMIT 0 , 30";
	}
	
	
	$result = $conn->query($sql);

	if ($result->num_rows > 0) {
		$count++;
	
		// output data by OBJECT_ID
		while($row = $result->fetch_assoc()) {
			$data = array(
				'ID' => $row["ID"],
				'OBJECT_NAME' => $row["OBJECT_NAME"],
				'GENE_NAME' => $row["GENE_NAME"],
				'RNA_VALUE' => $row["RNA_VALUE"],
				'CNV_VALUE' => $row["CNV_VALUE"],
				'SNP_VALUE' => $row["SNP_VALUE"]
			);
			//echo '<pre>'; print_r($data); echo '</pre>';
			$ori_result [] = $data;
		}
	}
}

$sortedData = array();
foreach ($ori_result as $element) {
    $obj_name = $element['OBJECT_NAME'];
    if ( ! isSet($sortedData[$obj_name]) ) { 
        $sortedData[$obj_name] = array($element);
    } else { 
        $sortedData[$obj_name][] = $element;
    }
}

/*
foreach($sortedData as $obj=>$detail) {
	echo $obj;
	echo '<br>';
	echo 'Percentage matched: ' . (count($detail) / $cnt_gene) * 100 . ' %';
	echo '<br>';
}
*/

$conn->close();
?>
<div id="tabs">
  <ul>
	<? 
		$count = 0;
		foreach($sortedData as $obj=>$detail) { 
			$count++;
	?>
			<li><a href="#tabs-<?=$count?>"><? echo $obj . " - " . round((count($detail) / $cnt_gene) * 100,2) . '%';?></a></li>
	<? 	} ?>
  </ul>
  <? 
		$count = 0;
		foreach($sortedData as $obj=>$detail) { 
			$count++;
	?>
	
		<div id="tabs-<?=$count?>">
			<?php
			$filename = './images/' . $obj . '.png';
			if (file_exists($filename)) {
				echo "<img src='$filename' />";
			} else {
				echo "Image is not available";
			}
			?>
			<div id="detail" style="float: right; width: 20%;">
				Pattern:
				<br/>
				<br/>
				<?php 
					foreach($detail as $item) {
						//echo '<pre>'; print_r($item); echo '</pre>';
						$style = $count_genes[$item['GENE_NAME']];
						if($style == 1) {
							//echo '<div style="width:150px;height:20px; background: LightGreen; text-align:center; v-align:middle;color:white;padding:3px;">' . $item['GENE_NAME'] . '(' . $item['RNA_VALUE'] . ')' . '</div>';
							echo '<div style="width:150px;height:20px; background: LightGreen; text-align:center; v-align:middle;color:white;padding:3px;">' . $item['GENE_NAME'] . '</div>';
							echo '<br>';
						}		
						if($style == 2){
							echo '<div style="width:150px;height:20px; background: LightSalmon; text-align:center; v-align:middle;color:white;padding:3px;">' . $item['GENE_NAME'] . '</div>';
							echo '<br>';
						}
						if($style == 3){
							echo '<div style="width:150px;height:20px; background: LightSalmon; border: 3px solid MediumPurple; text-align:center; v-align:middle;color:white;padding:3px;">' . $item['GENE_NAME'] . '</div>';
							echo '<br>';
						}
						if($style == 4){
							echo '<div style="width:150px;height:20px; background: LightGreen; border: 3px solid MediumPurple; text-align:center; v-align:middle;color:white;padding:3px;">' . $item['GENE_NAME'] . '</div>';
							echo '<br>';
						}
						if($style == 5){
							echo '<div style="width:150px;height:20px; background: LightSalmon; border: 3px solid MediumPurple; text-align:center; v-align:middle;color:white;padding:3px;">' . $item['GENE_NAME'] . '</div>';
							echo '<br>';
						}
						if($style == 6){
							echo '<div style="width:150px;height:20px; background: LightGreen; border: 3px solid MediumPurple; text-align:center; v-align:middle;color:white;padding:3px;">' . $item['GENE_NAME'] . '</div>';
							echo '<br>';
						}
						if($style == 7){
							echo '<div style="width:150px;height:20px; background: LightSalmon; border: 3px solid MediumPurple; text-align:center; v-align:middle;color:white;padding:3px;">' . $item['GENE_NAME'] . '</div>';
							echo '<br>';
						}
						if($style == 8){
							echo '<div style="
								width:150px;
								height: 20px; 
								background: LightGreen; 
								text-align: center; 
								v-align: middle;
								color:white;
								padding:3px;
								border: 1px solid MediumPurple;
								-webkit-box-shadow: 0px -4px 3px red;
								-moz-box-shadow:    0px -4px 3px red;
								box-shadow:         0px -4px 3px red;
							">' . $item['GENE_NAME'] . '</div>';
							echo '<br>';
						}
						
						echo "RNA " . $item['RNA_VALUE'];
						echo '<br>';
						echo "CNV " . $item['CNV_VALUE'];
						echo '<br>';
						echo "SNP " . $item['SNP_VALUE'];
						echo '<br><br>';
					}
				?>
			</div>
		</div>
	<? 	} ?>
</div>
 
 
</body>
</html>


