<html>
<head>
	<link href="style.css" rel="stylesheet"/>
	<link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
	<meta charset=utf-8/>
	<title content="Json pathway file reader">Json pathway file reader</title>
	<script src="http://danml.com/js/download.js"></script>
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
	<input id="deleteEdges" value="Delete Selected Edge(s)" type="button"/></input>
	<input id="deleteNodes" value="Delete Selected Node(s)" type="button"/></input>
	<input id="bundle" value="Bundle" type="button"/></input>
	<input id="produceJSON" value="Export JSON" type="button"/></input>
	
	<form id="form-data" method="post" action="http://137.99.11.122/pathway2/get.php" target="_blank">
		<input type="hidden" name="variable" id="variable"><br>
		<!--<input type="hidden" name="rna" id="rna"><br>
		<input type="hidden" name="cnv" id="cnv"><br>
		<input type="hidden" name="mut" id="mut"><br>
		<input type="hidden" name="ts_gene" id="ts_gene"><br>
		<input type="hidden" name="onco_gene" id="onco_gene"><br>-->
	<input type="submit" value="Submit">
	
	<div id="dialog-form-edge" title="Edit edge">
 		<form>
    		<fieldset>
      			<label for="direction">change direction:</label>
      			<input type="checkbox" name="direction" id="direction" value="Yes">
      			
      			<label for="type-edge">type:</label>
      			<select style="width: 150px" id="type-edge" name="type-edge">
  					<option selected="">Please Select</option>
  					<option>TBar</option>
  					<option>Arrow</option>
  					<option>Line</option>
				</select>
 
 			    <input type="submit" tabindex="-1" style="position:absolute; top:-1000px">
    		</fieldset>
  		</form>
	</div>
	
	<div id="dialog-form-node" title="Edit node">
 		<form>
    		<fieldset>
      			<label for="name">name:</label>
      			<input type="text" name="name" id="name" value="" class="text ui-widget-content ui-corner-all">
      			
      			<label for="height">height:</label>
      			<input type="text" name="height" id="height" value="" class="text ui-widget-content ui-corner-all">
      			
      			<label for="width">width:</label>
      			<input type="text" name="width" id="width" value="" class="text ui-widget-content ui-corner-all">
      			
      			<label for="type">type:</label>
      			<select style="width: 150px" id="type" name="type">
  					<option selected="">Please Select</option>
  					<option>1</option>
  					<option>2</option>
  					<option>3</option>
  					<option>4</option>
  					<option>5</option>
  					<option>6</option>
  					<option>7</option>
  					<option>8</option>
  					<option>9</option>
  					<option>10</option>
				</select>
 
 			    <input type="submit" tabindex="-1" style="position:absolute; top:-1000px">
    		</fieldset>
  		</form>
	</div>
	<div id="cy"></div>
</body>
<script>
	function clone(obj) {
    	if (null == obj || "object" != typeof obj) return obj;
    	var copy = obj.constructor();
    	for (var attr in obj) {
    	    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    	}
    	return copy;
	}


	function editEdge() {
		var direction = document.getElementById("direction").value;
		var type = document.getElementById("type-edge").value;
		target.data('StartArrow',type);
		target.data('EndArrow',type);
		if(document.getElementById('direction').checked){
			var edge = [];
		
    		edge.push({ 
				group: "edges",
				data : {
        		   	id : target.data('id'),
            		SUID : target.data('SUID'),
            		LineThickness:target.data('LineThickness'),
            		EndArrow: target.data('EndArrow'),
           		 	Coords: target.data('Coords'),
           		 	GraphId: target.data('GraphId'),
           	 		ZOrder: target.data('ZOrder'),
            		source: target.data('target'),
            		target: target.data('source'), 
            		StartArrow : target.data('StartArrow'),
        			selected : target.data('Selected')
      			},
      			selected : false
    		})
    		target.remove();
  			window.cy.add(edge);	
		}
		dialogEdge.dialog( "close" );
	}
	
	function editNode() {
		var name = document.getElementById("name").value;
		var width = document.getElementById("width").value;
		var height = document.getElementById("height").value;
		target.data('name', name);
		target.data('Width', width);
		target.data('Height', height);
		
		var node_name = target.data("shared_name");
		selectedForQueryNodes.push(node_name);
		var node_id = target.data("id");
		var count = document.getElementById("type").value;
					
		// RNA
		if (count == 1) {						
			target.addClass('green_bg');
			$('#variable').val($('#variable').val() + node_name + " ");
		} 
					
		if (count == 2) {
			target.removeClass('green_bg');
			target.addClass('red_bg');
			$('#variable').val($('#variable').val() + node_name + " ");
		}
					
		// CNV Added
		if (count == 3) {
			target.addClass('purple_border');
			target.addClass('green_bg');
			target.removeClass('red_bg');
			$('#variable').val($('#variable').val() + node_name + " ");
		}
					
		if (count == 4) {
			target.addClass('purple_border');
			target.addClass('red_bg');
			target.removeClass('green_bg');
			$('#variable').val($('#variable').val() + node_name + " ");
		}
					
		if (count == 5) {
			target.addClass('red_border');
			target.addClass('green_bg');
			target.removeClass('red_bg');
			target.removeClass('purple_border');
			$('#variable').val($('#variable').val() + node_name + " ");
		}
					
		if (count == 6) {
			target.addClass('red_border');
			target.addClass('red_bg');
			target.removeClass('green_bg');
			target.removeClass('purple_border');
			$('#variable').val($('#variable').val() + node_name + " ");
		}
					
		if (count == 7) {
			target.addClass('red_shadow');
			target.addClass('red_bg');
			target.addClass('purple_border');
						
			target.removeClass('green_bg');
			target.removeClass('red_border');
			$('#variable').val($('#variable').val() + node_name + " ");
		}
					
		if (count == 8) {
			target.addClass('red_shadow');
			target.addClass('red_bg');
			target.addClass('red_border');
						
			target.removeClass('green_bg');
			target.removeClass('purple_border');
			$('#variable').val($('#variable').val() + node_name + " ");
		}
					
		if (count == 9) {
			target.addClass('red_shadow');
			target.addClass('green_bg');
			target.addClass('red_border');
						
			target.removeClass('red_bg');
			target.removeClass('purple_border');
			$('#variable').val($('#variable').val() + node_name + " ");
		}
					
		if (count == 10) {
			target.addClass('red_shadow');
			target.addClass('green_bg');
			target.addClass('purple_border');
						
			target.removeClass('red_bg');
			target.removeClass('red_border');
			$('#variable').val($('#variable').val() + node_name + " ");
		}
		dialogNode.dialog( "close" );
	}

 	dialogNode = $( "#dialog-form-node" ).dialog({
    	autoOpen: false,
    	height: 300,
    	width: 350,
    	buttons: {
    		"submit": editNode,
    	    Cancel: function() {
    	    	dialogNode.dialog( "close" );
    	   	}
    	},
    	close: function() {
    	}
    });
    
    dialogEdge = $( "#dialog-form-edge" ).dialog({
    	autoOpen: false,
    	height: 300,
    	width: 350,
    	buttons: {
    		"submit": editEdge,
    	    Cancel: function() {
    	    	dialogEdge.dialog( "close" );
    	   	}
    	},
    	close: function() {
    	}
    });
    
</script>
</html>
