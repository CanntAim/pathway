<?php
/**
 * Created by PhpStorm.
 * User: thamhoang
 * Date: 8/26/15
 * Time: 3:27 PM
 */
?>
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
	<style>
		#dragandrophandler {
			border: 2px dotted #0B85A1;
			width: 150px;
			color: #92AAB0;
			text-align: left;
			vertical-align: middle;
			padding: 10px 10px 10px 10px;
			margin-bottom: 10px;
			font-size: 100%;
		}

		.progressBar {
			width: 200px;
			height: 22px;
			border: 1px solid #ddd;
			border-radius: 5px;
			overflow: hidden;
			display: inline-block;
			margin: 0px 10px 5px 5px;
			vertical-align: top;
		}

		.progressBar div {
			height: 100%;
			color: #fff;
			text-align: right;
			line-height: 22px; /* same as #progressBar height if we want text middle aligned */
			width: 0;
			background-color: #0ba1b5;
			border-radius: 3px;
		}

		.statusbar {
			border-top: 1px solid #A9CCD1;
			min-height: 25px;
			width: 700px;
			padding: 10px 10px 0px 10px;
			vertical-align: top;
		}

		.statusbar:nth-child(odd) {
			background: #EBEFF0;
		}

		.filename {
			display: inline-block;
			vertical-align: top;
			width: 250px;
		}

		.filesize {
			display: inline-block;
			vertical-align: top;
			color: #30693D;
			width: 100px;
			margin-left: 10px;
			margin-right: 5px;
		}

		.abort {
			background-color: #A8352F;
			-moz-border-radius: 4px;
			-webkit-border-radius: 4px;
			border-radius: 4px;
			display: inline-block;
			color: #fff;
			font-family: arial;
			font-size: 13px;
			font-weight: normal;
			padding: 4px 15px;
			cursor: pointer;
			vertical-align: top
		}
	</style>
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
<input id="delete" value="Delete" type="button"/></input>
<form action="get.php" method="post" id="pathway">
	<textarea id="params" name="params" rows="10" cols="10"></textarea>
	<input type="submit" id="submit" value="Save and Query">
</form>
<br/>

<div id="cy"></div>
<br/>
<!--<div id="information"></div>
<br/>-->
<div id="result"></div>
<!--
<div style="width:200px; float:left" id="image">
	<p style="float:left">Image: </p>
</div>
<div style="float:left;margin-top: 120px;" class="return-data">
-->
</body>
</html>
