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
<!--    <input type=button onclick="load()" value="load">
        <input type=button onclick="spray()" value="spray">
		<input type=button onclick="setPersonId()" value="set Person id">
        <input type=button onclick="print()" value="print">
		<input type=button onclick="save()" value="save">
		<input id="file" type=file value="spray from file">
-->
        <div id="parent"></div>
        <!--<script src="VQI_Observable.js"></script>-->
        <script src="VQI_PathwayEditorGUI.js"></script>
		<script src="VQI_PathwayEditorNoGUI.js"></script>
        <script>
		
            var objVQI_PathwayEditorGUI = new VQI_PathwayEditorGUI("parent");
			var objVQI_PathwayEditorNoGUI = new VQI_PathwayEditorNoGUI();
            
			function load() {
                objVQI_PathwayEditorNoGUI.loadPathwayExternalNoGUI(334);
            }
			function setPersonId() {
                var data = "Hello!";
                objVQI_PathwayEditorGUI.setPersonId(data);
            }

            function spray() {
                var data = [["n91", 1, 2, 3], ["n7", 1, 2, 3]];
                objVQI_PathwayEditorNoGUI.sprayColorExternalNoGUI(data);
            }
			function sprayFromFile() {
				var data = [];
				var lines = [];
				var file = this.files[0];
				var reader = new FileReader();
				reader.onload = function(progressEvent) {
				// By lines
				var list = this.result.split('\n');
					for(var line = 0; line < list.length; line++) {
						lines[line] = list[line].split('\t');
					}	
					objVQI_PathwayEditorNoGUI.sprayColorExternalNoGUI(lines);
				}
				reader.readAsText(file);
            }			
            function print() {
                objVQI_PathwayEditorNoGUI.printGraphNoGUI();
            }
			function save() {
                objVQI_PathwayEditorNoGUI.produceJSONExternalNoGUI();
            }
			
//			document.getElementById("file").addEventListener("change", sprayFromFile); 
        </script>
    </body>
</html>
