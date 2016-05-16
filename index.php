<html>
	<head>
		<meta charset=utf-8/>
		<link rel="stylesheet" href="style.css"/>
		<link rel="stylesheet" href="dependencies/jquery-ui-1.11.4/jquery-ui.css"/>
		<link rel="stylesheet" href="dependencies/bootstrap-3.3.5-dist/css/bootstrap.min.css">
		<script src="dependencies/download.js"></script>
		<script src="dependencies/sorttable.js"></script>
		<script src="dependencies/jquery-1.11.3.min.js"></script>
		<script src="dependencies/jquery-ui-1.11.4/jquery-ui.js"></script>
		<script src="dependencies/d3/d3.min.js"></script>
		<script src="dependencies/bootstrap-3.3.5-dist/js/bootstrap.min.js"></script>
		<script src="dependencies/cytoscape.js-2.5.4/cytoscape.js"></script>
	</head>
	<body>

		<div id="parent"></div>
		<script src="conf/ws-development.js"></script>
		<script src="VQI_PathwayEditor.js"></script>
		<script>
			if (mode != "test") {
				var objVQI_PathwayEditor = new VQI_PathwayEditor();
				objVQI_PathwayEditor.GUI("parent");
				objVQI_PathwayEditor.NoGUI();
			} else {
				var objVQI_PathwayEditorTester = new VQI_PathwayEditorTester();
				objVQI_PathwayEditorTester.GUI();
				objVQI_PathwayEditorTester.GUI.runTests();
			}
		</script>
	</body>
</html>
