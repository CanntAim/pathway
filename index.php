<html>
<head>
	<link href="style.css" rel="stylesheet"/>
	<link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
	<meta charset=utf-8/>
	<title content="Json pathway file reader">Json pathway file reader</title>
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>
	<script src="//code.jquery.com/jquery-1.10.2.js"></script>
  	<script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
	<script src="http://cytoscape.github.io/cytoscape.js/api/cytoscape.js-latest/cytoscape.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.min.js" charset="utf-8"></script>
	<script src="code.js"></script>
	<script src="html2canvas.js"></script>
</head>
<script language="javascript">
	html2canvas([document.getElementById('cy')], {
		onrendered: function (cy) {
			document.getElementById('cy').appendChild(cy);
			var data = cy.toDataURL('image/png');
			//display 64bit imag
			var image = new Image();
			image.src = data;
			document.getElementById('image').appendChild(image);
			// AJAX call to send `data` to a PHP file that creates an PNG image from the dataURI string and saves it to a directory on the server

			var file = dataURLtoBlob(data);

			// Create new form data
			var fd = new FormData();
			fd.append("pattern", file);

			$.ajax({
				url: "index.php",
				type: "POST",
				data: fd,
				processData: false,
				contentType: false,
			}).done(function (respond) {

				$(".return-data").html("Uploaded Canvas image link: <a href=" + respond + ">" + respond + "</a>").hide().fadeIn("fast");
			});
		}
	});

	function dataURLtoBlob(dataURL) {
		// Decode the dataURL
		var binary = atob(dataURL.split(',')[1]);
		
		// Create 8-bit unsigned array
		var array = [];
		for (var i = 0; i < binary.length; i++) {
			array.push(binary.charCodeAt(i));
		}
		
		// Return our Blob object
		return new Blob([new Uint8Array(array)], {type: 'image/png'});
	}
</script>
<body>
	<input id="file" type="file"/>
	<input id="addNode" value="Add Node" type="button"/></input>
	<input id="addEdge" value="Add Edge" type="button"/></input>
	<input id="delete" value="Delete Selected Node(s)" type="button"/></input>
	<input id="bundle" value="Bundle" type="button"/></input>
	<input id="produceJSON" value="Export JSON" type="button"/></input>
	
	<div id="dialog-form-node" title="Edit node">
 		<form>
    		<fieldset>
      			<label for="name">name:</label>
      			<input type="text" name="name" id="name" value="" class="text ui-widget-content ui-corner-all">
      			
      			<label for="height">height:</label>
      			<input type="text" name="height" id="height" value="" class="text ui-widget-content ui-corner-all">
      			
      			<label for="width">width:</label>
      			<input type="text" name="width" id="width" value="" class="text ui-widget-content ui-corner-all">
 
 			    <input type="submit" tabindex="-1" style="position:absolute; top:-1000px">
    		</fieldset>
  		</form>
	</div>
	<div id="cy"></div>
</body>
<script>
	function edit() {
		name = document.getElementById("name").value;
		width = document.getElementById("width").value;
		height = document.getElementById("height").value;
		target.data('name', name);
		target.data('Width', width);
		target.data('Height', height);
		dialogNode.dialog( "close" );
	}

 	dialogNode = $( "#dialog-form-node" ).dialog({
    	autoOpen: false,
    	height: 300,
    	width: 350,
    	buttons: {
    		"submit": edit,
    	    Cancel: function() {
    	    	dialogNode.dialog( "close" );
    	   	}
    	},
    	close: function() {
    	}
    });
    
</script>
</html>
