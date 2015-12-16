<html>
<head>
	<meta charset=utf-8/>
	<link rel="stylesheet" href="style.css"/>
	<link rel="stylesheet" href="dependencies/jquery-ui-1.11.4/jquery-ui.css"/>
	<link rel="stylesheet" href="dependencies/bootstrap-3.3.5-dist/css/bootstrap.min.css">
	<script src="dependencies/download.js"></script>
	<script src="dependencies/jquery-1.11.3.min.js"></script>
  	<script src="dependencies/jquery-ui-1.11.4/jquery-ui.js"></script>
	<script src="dependencies/d3/d3.min.js"></script>
	<script src="dependencies/bootstrap-3.3.5-dist/js/bootstrap.min.js"></script>
	<script src="dependencies/cytoscape.js-2.4.9/dist/cytoscape.js"></script>
</head>
<body>
	<input type=button onclick="load()" value="load">
	<input type=button onclick="findYue()" value="find Yue">
	<input type=button onclick="findTham()" value="find Tham">
	<input type=button onclick="spray()" value="spray">
	<input type=button onclick="print()" value="print">
	<div id="parent"></div>
	<script src="VQI_Observable.js"></script>
	<script src="VQI_PathwayEditor.js"></script>
	<script>
        var objVQI_PathwayEditor = new VQI_PathwayEditor("parent");
        function load(){
            objVQI_PathwayEditor.loadPathwayExternalNoGUI(302);
        }
        function findYue(){
			objVQI_PathwayEditor.findPathAndScoreExternalYueNoGUI("n0","n22");
        }
		
		function findTham(){
			objVQI_PathwayEditor.findPathAndScoreExternalThamNoGUI("n0","n22");
        }
		function spray(){
			var data = [["AKT1", 1,2,3],["AKT1", 1,2,3]];
			objVQI_PathwayEditor.sprayColorExternalNoGUI(data);
        }
		function print(){
			objVQI_PathwayEditor.printGraph();
        }
        </script>
</body>
</html>
