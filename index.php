<html>
<head>
	<link href="style.css" rel="stylesheet"/>
	<meta charset=utf-8/>
	<title content="Json pathway file reader">Json pathway file reader</title>
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>
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
	<input id="add" value="Add" type="button"/></input>
	<input id="delete" value="Delete Selected Node(s)" type="button"/></input>
	<input id="bundle" value="Bundle" type="button"/></input>
	<input id="produceJSON" value="Export JSON" type="button"/></input>
	<input id="add_neighbor" value="add another neighbor" type="button"/>
	<table class="dd" id="data">
		<tr>
			<td>Element name:</td>
			<td><input name="name" id="name" type="text" /></td>
			<td>Type:</td>
			<td><select name="element_type" id="type">
  				<option value="1">Rectangle</option>
  			</select></td>
		</tr>
	</table>
	</br>
	</br>
	</br>
	<div id="cy"></div>
	<div id="result"></div>
</body>
<script>
	var currentItem = 1;
	$('#add_neighbor').click(function(){
		currentItem++;
		$('#items').val(currentItem);
		var strToAdd = '<tr><td>Neighbor</td><td><input name="name_n'+currentItem+'" id="name_n'+currentItem+'" type="text"></td><td>Type</td><td><select name="edge_type_n'+currentItem+'" id="edge_type_n'+currentItem+'"><option value="1">Outgoing</option><option value="2">Incoming</option></select></td></tr>';
  		$('#data').append(strToAdd);
 	});
</script>
</html>
