$(function () { // on dom ready

	function onChange(event) {
		var reader = new FileReader();
		reader.onload = onReaderLoad;
		reader.readAsText(event.target.files[0]);
	}

	function onReaderLoad(event) {
		console.log(event.target.result);
		var obj = JSON.parse(event.target.result);
		visual_pathway(obj);
	}

	/*
	 function sendFileToServer(formData, status) {
	 var uploadURL = "http://localhost/pathway/cy_v1/index.php"; //Upload URL
	 var extraData = {}; //Extra Data.
	 var jqXHR = $.ajax({
	 xhr: function () {
	 var xhrobj = $.ajaxSettings.xhr();
	 if (xhrobj.upload) {
	 xhrobj.upload.addEventListener('progress', function (event) {
	 var percent = 0;
	 var position = event.loaded || event.position;
	 var total = event.total;
	 if (event.lengthComputable) {
	 percent = Math.ceil(position / total * 100);
	 }
	 //Set progress
	 status.setProgress(percent);
	 }, false);
	 }
	 return xhrobj;
	 },
	 url: uploadURL,
	 type: "POST",
	 contentType: false,
	 processData: false,
	 cache: false,
	 data: formData,
	 success: function (data) {
	 status.setProgress(100);
	 $("#information").html(data);
	 $("#status1").append("File upload Done<br>");
	 }
	 });

	 status.setAbort(jqXHR);
	 }

	 var rowCount = 0;

	 function createStatusbar(obj) {
	 rowCount++;
	 var row = "odd";
	 if (rowCount % 2 == 0) row = "even";
	 this.statusbar = $("<div class='statusbar " + row + "'></div>");
	 this.filename = $("<div class='filename'></div>").appendTo(this.statusbar);
	 this.size = $("<div class='filesize'></div>").appendTo(this.statusbar);
	 this.progressBar = $("<div class='progressBar'><div></div></div>").appendTo(this.statusbar);
	 this.abort = $("<div class='abort'>Abort</div>").appendTo(this.statusbar);
	 obj.after(this.statusbar);

	 this.setFileNameSize = function (name, size) {
	 var sizeStr = "";
	 var sizeKB = size / 1024;
	 if (parseInt(sizeKB) > 1024) {
	 var sizeMB = sizeKB / 1024;
	 sizeStr = sizeMB.toFixed(2) + " MB";
	 }
	 else {
	 sizeStr = sizeKB.toFixed(2) + " KB";
	 }

	 this.filename.html(name);
	 this.size.html(sizeStr);
	 }
	 this.setProgress = function (progress) {
	 var progressBarWidth = progress * this.progressBar.width() / 100;
	 this.progressBar.find('div').animate({width: progressBarWidth}, 10).html(progress + "% ");
	 if (parseInt(progress) >= 100) {
	 this.abort.hide();
	 }
	 }
	 this.setAbort = function (jqxhr) {
	 var sb = this.statusbar;
	 this.abort.click(function () {
	 jqxhr.abort();
	 sb.hide();
	 });
	 }
	 }

	 function handleFileUpload(files, obj) {
	 for (var i = 0; i < files.length; i++) {
	 var fd = new FormData();
	 fd.append('file', files[i]);

	 var status = new createStatusbar(obj); //Using this we can set progress.
	 status.setFileNameSize(files[i].name, files[i].size);
	 sendFileToServer(fd, status);

	 }
	 }

	 var obj = $("#dragandrophandler");
	 obj.on('dragenter', function (e) {
	 e.stopPropagation();
	 e.preventDefault();
	 $(this).css('border', '2px solid #0B85A1');
	 });
	 obj.on('dragover', function (e) {
	 e.stopPropagation();
	 e.preventDefault();
	 });
	 obj.on('drop', function (e) {

	 $(this).css('border', '2px dotted #0B85A1');
	 e.preventDefault();
	 var files = e.originalEvent.dataTransfer.files;

	 //We need to send dropped files to Server
	 handleFileUpload(files, obj);
	 });
	 $(document).on('dragenter', function (e) {
	 e.stopPropagation();
	 e.preventDefault();
	 });
	 $(document).on('dragover', function (e) {
	 e.stopPropagation();
	 e.preventDefault();
	 obj.css('border', '2px dotted #0B85A1');
	 });
	 $(document).on('drop', function (e) {
	 e.stopPropagation();
	 e.preventDefault();
	 });

	 function addCircle(nodeId, circleText) {
	 console.log(nodeId, circleText);
	 var parentNode = cy.$('#' + nodeId);
	 if (parentNode.data('isCircle') || parentNode.data('circleId'))
	 return;
	 parentNode.lock();
	 var px = parentNode.position('x') + 10;
	 var py = parentNode.position('y') - 10;
	 var circleId = (cy.nodes().size() + 1).toString();
	 parentNode.data('circleId', circleId);
	 cy.add({
	 group: 'nodes',
	 data: {weight: 75, id: circleId, name: circleText, isCircle: true},
	 position: {x: px, y: py},
	 locked: true
	 }).css({
	 'background-color': 'yellow',
	 'shape': 'ellipse',
	 'background-opacity': 0.5
	 }).unselectify();
	 }
	 */


	//dCircle('1', 'Bubble A');

	function visual_pathway(obj) {
		$('#cy').cytoscape({
			style: cytoscape.stylesheet()
			
				// node elements default css (unselected state)
				.selector('node').css({
					'content': 'data(name)',
					'text-valign': 'center',
					'color': 'black',
					'padding-left': 2,
					'padding-right': 2,
					'font-family': 'data(LabelSize)',
					'background-color': 'white'
				})
				.selector('node[Type="GeneProduct"]').css({
					'shape': 'rectangle',
					'width': 'data(Width)',
					'height': 'data(Height)',
					'text-valign': 'middle',
					'background-color': 'white',
					'border-color': 'black',
					'border-width': 1
				})
				.selector('node[Type="Protein"]').css({
					'shape': 'rectangle',
					'width': 'data(Width)',
					'height': 'data(Height)',
					'background-color': 'white',
					'color': '#ff3333',
					'border-color': '#ff3333',
					'border-style': 'solid',
					'border-width': 1
				})
				.selector('node[Shape="Brace"]').css({
					'shape': 'rectangle',
					'width': '1',
					'height': 'data(Width)',
					'background-color': 'black',
					'color': 'black',
					'border-color': 'black',
					'border-style': 'solid',
					'border-width': 1
				})
				.selector('node[FillColor="ffffff"]').css({
					'background-color': 'white',
					'color': 'blue',
					'text-halign': 'center',
					'text-valign': 'top'
				})
				
				// edge elements default css (unselected)
				.selector('edge').css({
					'line-color': 'black',
					'line-style': 'solid',
					'width': 1
				})
				.selector('edge[LineStyle="Dashed"]').css({
					'line-style': 'dashed',
					'line-color': 'black',
					'background-color': 'black',
					'color': 'black'
				})
				.selector('edge[EndArrow="Arrow"]').css({
					'target-arrow-shape': 'triangle',
					'target-arrow-color': 'black',
					'target-arrow-fill': 'filled'
				})
				.selector('edge[EndArrow="TBar"]').css({
					'target-arrow-shape': 'tee',
					'target-arrow-color': 'black',
					'target-arrow-fill': 'filled'
				})
				.selector('edge[ConnectorType="Elbow"]').css({
					'line-color': 'yellow',
					'line-style': 'solid'
				})
				
				// node & edge elements (selected state)
				.selector('edge:selected').css({
					'background-color': 'black',
					'line-color': 'black',
					'target-arrow-color': 'black',
					'source-arrow-color': 'black'
				})
				.selector('node:selected').css({
					'background-color': 'yellow'
				})
				
				// misc
				.selector('.faded').css({
					'opacity': 1,
					'text-opacity': 0
				})
				.selector('.green').css({
					'background-color': 'green',
					'color': 'black'
				})
				.selector('.red').css({
					'background-color': 'red',
					'color': 'white'
				}),

			elements: obj.elements,

			layout: {
				name: 'preset',
				padding: 10
			},
			//style: {
			//    name: 'WikiPathways'
			//},

			// on graph initial layout done (could be async depending on layout...)


			ready: function () {
				window.cy = this;

				//cy.elements().unselectify();

				var selectedForQueryNodes = [];
				var selectedForEditNodes = [];
				var counts = {};
				var str_info;

				//$('#information').append("You have selected:" + "<br>");

				// custom event handlers
				cy.off('click', 'node').on('click', 'node', function (e) {
					e.preventDefault();

					var node = this;

					var node_name = node.data("shared_name");
					var node_id = node.data("id");
					//console.log(node_name);

					if ($.inArray(node_name, selectedForQueryNodes) !== -1) {
						node.addClass('red');
						var old_html = $('#params').text;
						console.log(old_html);
						$('#params').append(node_name + ":" + "high" + "\n");
					} else {
						selectedForQueryNodes.push(node_name);
						node.addClass('green');
						$('#params').append(node_name + ":" + "low" + "\n");
					}
				});
				
				cy.on('select', 'node', function(event){
			    	selectedForEditNodes = cy.$('node:selected');
				});
			},

  			// initial viewport state:
  			zoom: 1,
  			pan: { x: 0, y: 0 },
			
			// interaction options:
  			minZoom: 1e-50,
  			maxZoom: 1e50,
  			zoomingEnabled: true,
  			userZoomingEnabled: true,
  			panningEnabled: true,
  			userPanningEnabled: true,
 	 		boxSelectionEnabled: true,
  			selectionType: 'single',
  			touchTapThreshold: 8,
  			desktopTapThreshold: 4,
  			autolock: false,
  			autoungrabify: false,
  			autounselectify: false,

  			// rendering options:
  			headless: false,
  			styleEnabled: true,
  			hideEdgesOnViewport: false,
  			hideLabelsOnViewport: false,
  			textureOnViewport: false,
  			motionBlur: false,
  			motionBlurOpacity: 0.2,
  			wheelSensitivity: 1,
  			pixelRatio: 1,
  			initrender: function(evt){ /* ... */ },
  			renderer: { /* ... */ }
		});	
	}

	document.getElementById('file').addEventListener('change', onChange);
}); // on dom ready
