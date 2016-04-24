var VQI_PathwayEditor = function () {
    // Web services
    var services = {};
    services = web_services['VQI_PATHWAY_EDITOR'];
    
	// Globals
    var self = this;
    var definitionHub = {}

    definitionHub.nodeTypes = {nType1: ["bundleone", "ntype1"], nType2: ["bundletwo", "ntype2"], nType3: ["gene", "ntype3"], nType4: ["geneproduct", "ntype4"], nType5: ["protein", "ntype5"],
        nType6: ["rna", "ntype6"], nType7: ["microrna", "ntype7"], nType8: ["kinase", "ntype8"], nType9: ["ligand", "ntype9"], nType10: ["receptor", "ntype10"], nType11: ["biologicalprocess", "ntype11"],
        nType12: ["triangle", "ntype12"], nType13: ["rectangle", "ntype13"], nType14: ["circle", "ntype14"], nType15: ["ellipse", "ntype15"], nType16: ["pentagon", "ntype16"], nType17: ["hexagon", "ntype17"],
        nType18: ["heptagon", "ntype18"], nType19: ["octagon", "ntype19"], nType20: ["star", "ntype20"], nType21: ["diamond", "ntype21"], nType22: ["vee", "ntype22"], nType23: ["rhomboid", "ntype23"], nType24: ["label", "ntype24"], nType25: ["transcriptionfactor", "ntype25"]};
    definitionHub.edgeLineTypes = {elType1: ["solid", "eltype1"], elType2: ["dashed", "eltype2"], elType3: ["dotted", "eltype3"]};   
	definitionHub.arrowLineTypes = {
        alType1: ["line", "altype1", "1", "rType1"]
        , alType2: ["activate", "altype2", "2", "rType2"]
        , alType3: ["inhibit", "tbar", "altype3", "3", "rType3"]
        , alType4: ["regulate", "altype4", "4", "rType4"]};
		
	var nodeCounter = 0;
    var edgeCounter = 0;
	
	function mapReverseDictionary() {
        var reverseLookup = {};
        for (var i in definitionHub.nodeTypes) {
            for (var j = 0, innerLen = definitionHub.nodeTypes[i].length; j < innerLen; j++) {
                reverseLookup[definitionHub.nodeTypes[i][j].toLowerCase()] = i;
            }
        }
        for (var i in definitionHub.arrowLineTypes) {
            for (var j = 0, innerLen = definitionHub.arrowLineTypes[i].length; j < innerLen; j++) {
                reverseLookup[definitionHub.arrowLineTypes[i][j].toLowerCase()] = i;
            }
        }
        for (var i in definitionHub.edgeLineTypes) {
            for (var j = 0, innerLen = definitionHub.edgeLineTypes[i].length; j < innerLen; j++) {
                reverseLookup[definitionHub.edgeLineTypes[i][j].toLowerCase()] = i;
            }
        }
        return reverseLookup;
    }
	
	function preAddProcessing(obj) {
		var reverseLookup = mapReverseDictionary();
		for (var i = 0; i < obj.elements.nodes.length; i++) {
			if (obj.elements.nodes[i].data.id.substring(0, 1) == "n") {
				var number = parseInt(obj.elements.nodes[i].data.id.substring(1, obj.elements.nodes.length - 1));
				if (number > nodeCounter)
					nodeCounter = number + 1;
			}

			if (typeof (obj.elements.nodes[i].data.BackgroundImage) == "undefined") {
				obj.elements.nodes[i].data.BackgroundImage = "";
			}

			if (typeof (obj.elements.nodes[i].data.ZIndex) == "undefined") {
				obj.elements.nodes[i].data.ZIndex = 0;
			}
			
			if (typeof (obj.elements.nodes[i].data.Type) == "undefined" || typeof (reverseLookup[obj.elements.nodes[i].data.Type.toLowerCase()]) == "undefined") {
				obj.elements.nodes[i].data.Type = "nType15";
			} else {
				obj.elements.nodes[i].data.Type = reverseLookup[obj.elements.nodes[i].data.Type.toLowerCase()];
			}
			
			if (typeof (obj.elements.nodes[i].data.Rna) == "undefined" || isNaN(obj.elements.nodes[i].data.Rna)) {
				obj.elements.nodes[i].data.Rna = 0;
			}
			
			if (typeof (obj.elements.nodes[i].data.Cnv) == "undefined" || isNaN(obj.elements.nodes[i].data.Cnv)) {
				obj.elements.nodes[i].data.Cnv = 0;
			}
			
			if (typeof (obj.elements.nodes[i].data.Mut) == "undefined" || isNaN(obj.elements.nodes[i].data.Mut)) {
				obj.elements.nodes[i].data.Mut = 0;
			}
			
			if (typeof (obj.elements.nodes[i].data.oldPositionX) == "undefined" || isNaN(obj.elements.nodes[i].data.oldPositionX)) {
				obj.elements.nodes[i].data.oldPositionX = 0;
			}
			
			if (typeof (obj.elements.nodes[i].data.oldPositionY) == "undefined" || isNaN(obj.elements.nodes[i].data.oldPositionY)) {
				obj.elements.nodes[i].data.oldPositionY = 0;
			}
			
			if (typeof (obj.elements.nodes[i].data.Width) == "undefined" || isNaN(obj.elements.nodes[i].data.Width)) {
				obj.elements.nodes[i].data.Width = 50;
			}
			
			if (typeof (obj.elements.nodes[i].data.Height) == "undefined" || isNaN(obj.elements.nodes[i].data.Height)) {
				obj.elements.nodes[i].data.Height = 30;
			}
		}

        for (var i = 0; i < obj.elements.edges.length; i++) {
			if (obj.elements.edges[i].data.id.substring(0, 1) == "e") {
				var number = parseInt(obj.elements.edges[i].data.id.substring(1, obj.elements.edges.length - 1));
				if (number > edgeCounter)
					edgeCounter = number + 1;
			}
				
			if (typeof (obj.elements.edges[i].data.Type) == "undefined" || typeof (reverseLookup[obj.elements.edges[i].data.Type.toLowerCase()]) == "undefined") {
				obj.elements.edges[i].data.Type = "elType1";
			} else {
				obj.elements.edges[i].data.Type = reverseLookup[obj.elements.edges[i].data.Type.toLowerCase()];
			}
				
			if (typeof (obj.elements.edges[i].data.EndArrow) == "undefined" || typeof (reverseLookup[obj.elements.edges[i].data.EndArrow.toLowerCase()]) == "undefined") {
				obj.elements.edges[i].data.EndArrow = "alType1";
			} else {
				obj.elements.edges[i].data.EndArrow = reverseLookup[obj.elements.edges[i].data.EndArrow.toLowerCase()];
			}
		}
	}
	
	self.NoGUI = function () {
		function sprayColor(lines, obj) {
			var lookup = {};
			for (var i = 0, len = obj.elements.nodes.length; i < len; i++) {
				if (typeof (lookup[obj.elements.nodes[i].data.name]) != "undefined")
					lookup[obj.elements.nodes[i].data.name].push(obj.elements.nodes[i].data);
				else
					lookup[obj.elements.nodes[i].data.name] = [obj.elements.nodes[i].data];
			}

			var header = {};
			for (var i = 0; i < lines[0].length; i++) {
				var value = lines[0][i].toLowerCase().trim();
				header[value] = i;
			}

			for (var line = 1; line < lines.length; line++) {
				var target = lines[line][header["gene"]];
				if (typeof (lookup[target]) != "undefined") {
					for (entry in lookup[target]) {
						if (typeof (header["mut"]) != "undefined") {
							mut = lines[line][header["mut"]];
							if (!isNaN(mut))
								lookup[target][entry].mut = mut;
							else
								lookup[target][entry].mut = "0";
						}
						if (typeof (header["cnv"]) != "undefined") {
							cnv = lines[line][header["cnv"]];
							if (!isNaN(cnv))
								lookup[target][entry].cnv = cnv;
							else
								lookup[target][entry].cnv = "0";
						}
						if (typeof (header["rna"]) != "undefined") {
							rna = lines[line][header["rna"]];
							if (!isNaN(rna))
								lookup[target][entry].rna = rna;
							else
								lookup[target][entry].rna = "0";
						}
						if (typeof (header["p"]) != "undefined") {
							p = lines[line][header["p"]];
							if (!isNaN(p))
								lookup[target][entry].p = p;
							else
								lookup[target][entry].p = "0";
						}
						if (typeof (header["m"]) != "undefined") {
							m = lines[line][header["m"]];
							if (!isNaN(m))
								lookup[target][entry].m = m;
							else
								lookup[target][entry].m = "0";
						}
						if (typeof (header["pa"]) != "undefined") {
							pa = lines[line][header["pa"]];
							if (!isNaN(pa))
								lookup[target][entry].pa = pa;
							else
								lookup[target][entry].pa = "0";
						}
					}
				}
			}
		}

		function setElements(obj) {
			preAddProcessing(obj);
		}

		function define(key) {
			var definition = "";
			for (var i in definitionHub.nodeTypes) {
				if (i == key)
					definition = definitionHub.nodeTypes[i][0];
			}
			for (var i in definitionHub.arrowLineTypes) {
				if (i == key)
					definition = definitionHub.arrowLineTypes[i][0];

			}
			for (var i in definitionHub.edgeLineTypes) {
				if (i == key)
					definition = definitionHub.edgeLineTypes[i][0];
			}
			return definition;
		}

		function mapForExport(obj) {
			for (var i = 0; i < obj.elements.nodes.length - 1; i++) {
				obj.elements.nodes[i].data.Type = defineNoGUI(obj.elements.nodes[i].data.Type);
			}
			for (var i = 0; i < obj.elements.edges.length - 1; i++) {
				obj.elements.edges[i].data.Type = defineNoGUI(obj.elements.edges[i].data.Type);
				obj.elements.edges[i].data.EndArrow = defineNoGUI(obj.elements.edges[i].data.EndArrow);
			}
		}

		self.NoGUI.printGraphExternal = function () {
			console.log(self.json);
		}

		self.NoGUI.produceJSONExternal = function () {
			mapForExportNoGUI(self.json)
			download(JSON.stringify(self.json), "data.txt", "text/plain");
		}

		self.NoGUI.setPersonId = function (id) {
			self.personId = id;
		}

		self.NoGUI.getPersonId = function () {
			return self.personId;
		}

		self.NoGUI.sprayColorExternal = function (list) {
			sprayColorNoGUI(list, self.json);
		}

		self.NoGUI.getJSON = function () {
			var obj = JSON.parse(JSON.stringify(self.json));
			mapForExport(obj);
			return obj;
		}

		self.NoGUI.loadPathwayExternal = function (id, f) {
			var callback = f || null;
			$.post(services['GET_PATHWAY'], {
				pid: id
			}, function (data) {
				self.json = JSON.parse(data);
				setElementsNoGUI(self.json);
				if (callback !== null) {
					callback();
				}
			});
		}

		self.NoGUI.findPathExternal = function (sid, vid, f) {
			var callback = f || null;
			mapForExportNoGUI(self.json);
			$.post(services['FIND_PATH'], {
				s: sid,
				d: vid,
				json: JSON.stringify(self.json),
				p: self.personId
			}, function (yue_data) {
				var result = JSON.parse(yue_data);
				if (callback !== null) {
					callback(result);
				}
				return result;
			});
		};
	};

	self.GUI = function (parent) {
		var personId = "";
		var pathName = "";
		var states = [];
		var stateRecycle = [];
		var selectedForQueryNodes = [];
		var selectedForEditNodes = [];
		var selectedForEditEdges = [];
		var orderedSelectedNodes = [];
		var grabbedCollapsedForEditNodes = [];
		var coloredNodes = [];
		var dupCounter = 0;
		var loadCounts = 0;
		var target = 0;
		var header = "";
		var counts = {};
		var strInfo;
		var highestZOrder = 999;

		var strVar = "";
		strVar += " <nav class=\"navbar navbar-default\">";
		strVar += " <div class=\"container-fluid\">";
		strVar += " <div class=\"navbar-header\">";
		strVar += " 	<a id=\"" + parent + "-pathway-title\" class=\"navbar-brand\" href=\"#\">Pathway name</a>";
		strVar += " <\/div>";
		strVar += " <ul class=\"nav navbar-nav\">";
		strVar += " 	<li style=\"margin: 2px\">";
		strVar += " 		<label for=\"" + parent + "-file-pathway\">Local Pathway File:<\/label>";
		strVar += "			<input id=\"" + parent + "-file-pathway\" value=\"Pick Pathway File\" type=\"file\"><\/input>";
		strVar += " 	<\/li>";
		strVar += " 	<li style=\"margin: 2px\">";
		strVar += " 		<label for=\"" + parent + "-file-coloring\">Local Pathway Coloring:<\/label>";
		strVar += "			<input id=\"" + parent + "-file-coloring\" value=\"Pick Spray File\" type=\"file\"><\/input>";
		strVar += " 	<\/li>";
		strVar += " 	<li style=\"margin: 2px\">";
		strVar += " 		<label for=\"" + parent + "-pathway-selector\">Pathway:<\/label>";
		strVar += " 		<select style=\"width: 150px\" id=\"" + parent + "-pathway-selector\" name=\"" + parent + "-pathway-selector\">";
		strVar += "  			<option selected=\"\">Please Select<\/option>";
		strVar += "			<\/select>";
		strVar += " 	<\/li>";
		strVar += " 	<li style=\"margin: 2px\">";
		strVar += "			<div class=\"dropdown\">";
		strVar += "  			<button class=\"btn btn-primary dropdown-toggle\" type=\"button\" data-toggle=\"dropdown\">Edit<span class=\"caret\"><\/span><\/button>";
		strVar += "				<ul class=\"dropdown-menu\">";
		strVar += "					<li><input id=\"" + parent + "-add-node\" value=\"Add Node\" type=\"button\" class=\"btn btn-link disabled\"><\/input><\/li>";
		strVar += "					<li><input id=\"" + parent + "-add-edge\" value=\"Add Edge\" type=\"button\" class=\"btn btn-link disabled\"><\/input><\/li>";
		strVar += " 				<li><input id=\"" + parent + "-delete-elements\" value=\"Delete Selected Element(s)\" type=\"button\" class=\"btn btn-link disabled\"><\/input><\/li>";
		strVar += " 				<li role=\"separator\" class=\"divider\"></li>";
		strVar += "					<li><input id=\"" + parent + "-bundle\" value=\"Bundle\" type=\"button\" class=\"btn btn-link disabled\"><\/input><\/li>";
		strVar += "					<li><input id=\"" + parent + "-unbundle\" value=\"Unbundle\" type=\"button\" class=\"btn btn-link disabled\"><\/input><\/li>";
		strVar += "					<li><input id=\"" + parent + "-expand\" value=\"Expand\" type=\"button\" class=\"btn btn-link disabled\"><\/input><\/li>";
		strVar += "					<li><input id=\"" + parent + "-collapse\" value=\"Collapse\" type=\"button\" class=\"btn btn-link disabled\"><\/input><\/li>";
		strVar += "					<li><input id=\"" + parent + "-expand-informative\" value=\"Expand Informative\" type=\"button\" class=\"btn btn-link disabled\"><\/input><\/li>";
		strVar += "					<li><input id=\"" + parent + "-collapse-informative\" value=\"Collapse Informative\" type=\"button\" class=\"btn btn-link disabled\"><\/input><\/li>";
		strVar += "					<li><input id=\"" + parent + "-duplicate-nodes\" value=\"Duplicate Nodes\" type=\"button\" class=\"btn btn-link disabled\"><\/input><\/li>";
		strVar += " 				<li role=\"separator\" class=\"divider\"></li>";
		strVar += "					<li><input id=\"" + parent + "-config-pathway\" value=\"Configure\" type=\"button\" class=\"btn btn-link disabled\"><\/input><\/li>";
		strVar += "				<\/ul>";
		strVar += "			</div>";
		strVar += " 	<\/li>";
		strVar += " 	<li style=\"margin: 2px\">";
		strVar += "			<div class=\"dropdown\">";
		strVar += "  			<button class=\"btn btn-primary dropdown-toggle\" type=\"button\" data-toggle=\"dropdown\">Process<span class=\"caret\"><\/span><\/button>";
		strVar += "				<ul class=\"dropdown-menu\">";
		strVar += "					<li><input id=\"" + parent + "-findpath\" value=\"Find Pathway\" type=\"button\" class=\"btn btn-link disabled\"><\/input><\/li>";
		strVar += "					<li><input id=\"" + parent + "-find-paths-all-drop\" value=\"Find All Pathways\" type=\"button\" class=\"btn btn-link disabled\"><\/input><\/li>";
		strVar += "					<li><input id=\"" + parent + "-find-object\" value=\"Find Object\" type=\"button\" class=\"btn btn-link disabled\"><\/input><\/li>";
		strVar += "				<\/ul>";
		strVar += "			</div>";
		strVar += " 	<\/li>";
		strVar += " 	<li style=\"margin: 2px\">";
		strVar += "			<div class=\"dropdown\">";
		strVar += "  			<button class=\"btn btn-primary dropdown-toggle\" type=\"button\" data-toggle=\"dropdown\">Archive<span class=\"caret\"><\/span><\/button>";
		strVar += "				<ul class=\"dropdown-menu\">";
		strVar += "					<li><input id=\"" + parent + "-pathway-save\" value=\"Save\" type=\"button\" class=\"btn btn-link disabled\"><\/input><\/li>";
		strVar += "					<li><input id=\"" + parent + "-pathway-saveAs\" value=\"SaveAs\" type=\"button\" class=\"btn btn-link disabled\"><\/li>";
		strVar += " 				<li><input id=\"" + parent + "-produce-JSON\" value=\"Export JSON\" type=\"button\" class=\"btn btn-link disabled\"><\/li>";
		strVar += "				<\/ul>";
		strVar += "			<\/div>";
		strVar += " 	<li\">";
		strVar += " 	<li style=\"margin: 2px\">";
		strVar += "			<input id=\"" + parent + "-undo\" value=\"Undo\" type=\"button\" class=\"btn btn-primary disabled\"><\/input>";
		strVar += " 	<\/li>";
		strVar += " 	<li style=\"margin: 2px\">";
		strVar += "			<input id=\"" + parent + "-redo\" value=\"Redo\" type=\"button\" class=\"btn btn-primary disabled\"><\/input>";
		strVar += " 	<\/li>";
		strVar += " 	<li style=\"margin: 2px\">";
		strVar += "      	<input type=\"text\" style=\"width: 150px\" id=\"" + parent + "-search-node-name\" placeholder=\"Search\" class=\"form-control\" name=\"" + parent + "-search-node-name\">";
		strVar += " 	<\/li>";
		strVar += " <\/ul>";
		strVar += " <\/div>";
		strVar += " <\/nav>";
		strVar += " <div id=\"" + parent + "-dialog-table\" title=\"Result\">";
		strVar += "		<table id=\"" + parent + "-inner-table\" class=\"table table-hover table-condensed\">";
		strVar += "			<tr>";
		strVar += "         	<td>name<\/td>";
		strVar += "				<td>percentage<\/td>";
		strVar += "				<td>Rna distance<\/td>";
		strVar += "				<td>Cnv distance<\/td>";
		strVar += "				<td>Mut distance<\/td>";
		strVar += "			<\/tr>";
		strVar += "		<\/table>";
		strVar += "	<\/div>";
		strVar += " <div id=\"" + parent + "-dialog-form-save-as-pathway\" title=\"SaveAs\">";
		strVar += " 		<form role=\"form\">";
		strVar += "    		<fieldset>";
		strVar += "      			<label for=\"" + parent + "-pathway-name\">pathway-name:<\/label>";
		strVar += " 				<input type=\"text\" class=\"form-control\" name=\"" + parent + "-pathway-name\" id=\"" + parent + "-pathway-name\"><br>";
		strVar += " 				<input type=\"submit\" class=\"btn btn-default\" tabindex=\"-1\" style=\"position:absolute; top:-1000px\"><\/input>";
		strVar += "    		<\/fieldset>";
		strVar += " 		<\/form>";
		strVar += "	<\/div>";
		strVar += " <div id=\"" + parent + "-dialog-form-new-pathway\" title=\"New Pathway\">";
		strVar += " 		<form role=\"form\">";
		strVar += "    		<fieldset>";
		strVar += "      			<label for=\"" + parent + "-new-pathway-name\">pathway-name:<\/label>";
		strVar += " 				<input type=\"text\" class=\"form-control\" name=\"" + parent + "-new-pathway-name\" id=\"" + parent + "-new-pathway-name\"><br>";
		strVar += " 				<input type=\"submit\" class=\"btn btn-default\" tabindex=\"-1\" style=\"position:absolute; top:-1000px\"><\/input>";
		strVar += "    		<\/fieldset>";
		strVar += " 		<\/form>";
		strVar += "	<\/div>";
		strVar += " <div id=\"" + parent + "-dialog-form-configure-pathway\" title=\"Configure Pathway\">";
		strVar += " 		<form role=\"form\">";
		strVar += "    			<div class =\"form-group\">";
		strVar += "      			<label for=\"" + parent + "-configure-person-id\">person-id:<\/label>";
		strVar += " 				<input type=\"text\" class=\"form-control\" name=\"" + parent + "-configure-person-id\" id=\"" + parent + "-configure-person-id\"><br>";
		strVar += " 				<input id=\"" + parent + "-apply-configure-person-id\" value=\"Apply\" type=\"button\" class=\"btn btn-link\"><\/input>";
		strVar += "    			</div>";
		strVar += " 		<\/form>";
		strVar += "	<\/div>";
		strVar += " <div id=\"" + parent + "-dialog-bundle\" title=\"Bundle\">";
		strVar += " 		<form role=\"form\">";
		strVar += "    			<fieldset>";
		strVar += "      			<label for=\"" + parent + "-type-bundle\">type:<\/label>";
		strVar += "      			<select style=\"width: 150px\" id=\"" + parent + "-type-bundle\" name=\"" + parent + "-type-bundle\">";
		strVar += "  					<option selected=\"\">bundleone<\/option>";
		strVar += "  					<option>bundletwo<\/option>";
		strVar += "					<\/select>";
		strVar += "    			<\/fieldset>";
		strVar += " 		<\/form>";
		strVar += "	<\/div>";
		strVar += " <div id=\"" + parent + "-dialog-form-find-path\" title=\"Find path\">";
		strVar += " 		<form role=\"form\">";
		strVar += "    			<div class =\"form-group\">";
		strVar += "      			<label for=\"" + parent + "-sid\">sid:<\/label>";
		strVar += " 				<input type=\"text\" class=\"form-control\" name=\"" + parent + "-sid\" id=\"" + parent + "-sid\"><br>";
		strVar += "      			<label for=\"" + parent + "-vid\">vid:<\/label>";
		strVar += " 				<input type=\"text\" class=\"form-control\" name=\"" + parent + "-vid\" id=\"" + parent + "-vid\"><br>";
		strVar += " 				<input id=\"" + parent + "-find-paths-all\" value=\"Find All\" type=\"button\" class=\"btn btn-link\"><\/input>";
		strVar += " 				<input id=\"" + parent + "-find-paths-one\" value=\"Find\" type=\"button\" class=\"btn btn-link\"><\/input>";
		strVar += "    			</div>";
		strVar += " 		<\/form>";
		strVar += "	<\/div>";
		strVar += "	<div id=\"" + parent + "-dialog-form-edge\" title=\"Edit edge(s)\">";
		strVar += " 		<form>";
		strVar += "    			<div class =\"form-group row\">";
		strVar += "      			<label class=\"col-md-4\" for=\"" + parent + "-arrow-type-edge\">arrow type:<\/label>";
		strVar += "      			<select style=\"width: 150px\" class=\"form-control col-md-4\" id=\"" + parent + "-arrow-type-edge\" name=\"" + parent + "-arrow-type-edge\">";
		strVar += "  					<option value=\"alType1\" selected=\"\">" + definitionHub.arrowLineTypes.alType1[0] + "<\/option>";
		strVar += "  					<option value=\"alType2\">" + definitionHub.arrowLineTypes.alType2[0] + "<\/option>";
		strVar += "  					<option value=\"alType3\">" + definitionHub.arrowLineTypes.alType3[0] + "<\/option>";
		strVar += "  					<option value=\"alType4\">" + definitionHub.arrowLineTypes.alType4[0] + "<\/option>";
		strVar += "					<\/select>";
		strVar += " 				<input id=\"" + parent + "-arrow-type-edge-apply\" value=\"Apply\" type=\"button\" class=\"btn btn-link col-md-4\"><\/input>";
		strVar += "    			</div>";
		strVar += "    			<div class =\"form-group row\">";
		strVar += "      			<label class=\"col-md-4\" for=\"" + parent + "-line-type-edge\">line type:<\/label>";
		strVar += "      			<select style=\"width: 150px\" class=\"form-control col-md-4\" id=\"" + parent + "-line-type-edge\" name=\"" + parent + "-line-type-edge\">";
		strVar += "  					<option value=\"elType1\" selected=\"\">" + definitionHub.edgeLineTypes.elType1[0] + "<\/option>";
		strVar += "  					<option value=\"elType2\">" + definitionHub.edgeLineTypes.elType2[0] + "<\/option>";
		strVar += "  					<option value=\"elType3\">" + definitionHub.edgeLineTypes.elType3[0] + "<\/option>";
		strVar += "					<\/select>";
		strVar += " 				<input id=\"" + parent + "-line-type-edge-apply\" value=\"Apply\" type=\"button\" class=\"btn btn-link col-md-4\"><\/input>";
		strVar += "    			</div>";
		strVar += "    			<div class =\"form-group row\">";
		strVar += "      			<label class=\"col-md-4\" for=\"" + parent + "-direction\">change direction:<\/label>";
		strVar += "      			<input style=\"width: 150px\" type=\"checkbox\" class=\"form-control col-md-4\" name=\"" + parent + "-direction\" id=\"" + parent + "-direction\" value=\"Yes\"><\/input>";
		strVar += " 				<input id=\"" + parent + "-direction-apply\" value=\"Apply\" type=\"button\" class=\"btn btn-link col-md-4\"><\/input>";
		strVar += "    			</div>";
		strVar += "    			<div class =\"form-group row\">";
		strVar += "      			<label for=\"" + parent + "-segment-distances\">Segment Distances:(e.g. -20 20 -20)<\/label>";
		strVar += "      			<input type=\"text\" style=\"width: 150px\" id=\"" + parent + "-segment-distances\" class=\"form-control\" name=\"" + parent + "-segment-distances\">";
		strVar += "      			<label for=\"" + parent + "-segment-weights\">Segment Weights:(e.g. 0.25 0.5 0.75)<\/label>";
		strVar += "      			<input type=\"text\" style=\"width: 150px\" id=\"" + parent + "-segment-weights\" class=\"form-control\" name=\"" + parent + "-segment-weights\">";
		strVar += "      			<label for=\"" + parent + "-segment-enable-disable\">Enable Segmented<\/label>";
		strVar += "      			<select style=\"width: 150px\" class=\"form-control\" id=\"" + parent + "-segmented-enable-disable\" name=\"" + parent + "-segmented-enable-disable\">";
		strVar += "  					<option selected=\"\">enable<\/option>";
		strVar += "  					<option\>disable<\/option>";
		strVar += "					<\/select>";
		strVar += " 				<input id=\"" + parent + "-apply-curve-changes\" value=\"Apply\" type=\"button\" class=\"btn btn-link col-md-4 col-md-offset-8\"><\/input>";
		strVar += "    			</div>";
		strVar += "    			<div class =\"form-group row\">";
		strVar += "    				<label class=\"col-md-4\" for=\"" + parent + "-edge-move-to-background\">Move to Background:<\/label>";
		strVar += "    				<input id=\"" + parent + "-edge-move-to-background\" value=\"Move\" type=\"button\" class=\"btn btn-link col-md-4 col-md-offset-8\"><\/input>";
		strVar += "    			</div>";
		strVar += "    			<div class =\"form-group row\">";
		strVar += "    				<label class=\"col-md-4\" for=\"" + parent + "-edge-move-to-foreground\">Move to Foreground:<\/label>";
		strVar += "    				<input id=\"" + parent + "-edge-move-to-foreground\" value=\"Move\" type=\"button\" class=\"btn btn-link col-md-4 col-md-offset-8\"><\/input>";
		strVar += "    			</div>";
		strVar += "  		<\/form>";
		strVar += "	<\/div>";
		strVar += "<div id=\"" + parent + "-intro-hero-unit\" class=\"container\"style=\"margin-top: 100px\">";
		strVar += "		<div class=\"jumbotron\">";
		strVar += "			<h1>Pathway Editor</h1>";
		strVar += "			<p><i>Pre-alpha version of the pathway editor. You can either start a new pathway or load an existing one...</i></p>";
		strVar += " 		<input id=\"" + parent + "-new-pathway\" value=\"New Pathway\" type=\"button\" class=\"btn btn-success\"><\/input>";
		strVar += " 		<a id=\"" + parent + "-link-github\" type=\"button\" class=\"btn btn-success\" href=\"https://github.uconn.edu/ivp08001/pathway\">Github Source<\/a>";
		strVar += "     </div>";
		strVar += " </div>";
		strVar += "	<div id=\"" + parent + "-dialog-form-node\" title=\"Edit node(s)\">";
		strVar += " 		<form>";
		strVar += "    			<div class =\"form-group row\">";
		strVar += "      			<label class=\"col-md-4\" for=\"" + parent + "-node-name\">node-name:<\/label>";
		strVar += "      			<input type=\"text\" style=\"width: 150px\" name=\"" + parent + "-node-name\" class=\"form-control col-md-4\" id=\"" + parent + "-node-name\" value=\"\"><\/input>";
		strVar += " 			<div col-md-4><input id=\"" + parent + "-node-name-apply\" value=\"Apply\" type=\"button\" class=\"btn btn-link\"><\/input><input id=\"" + parent + "-node-name-cbio\" value=\"cBio Portal\" type=\"button\" class=\"btn btn-default btn-xs\"><\/input></div>";
		strVar += "    			</div>";
		strVar += "    			<div class =\"form-group row\">";
		strVar += "      			<label class=\"col-md-4\" for=\"" + parent + "-height\">height:<\/label>";
		strVar += "      			<input type=\"text\" style=\"width: 150px\" name=\"" + parent + "-height\" id=\"" + parent + "-height\" class=\"form-control col-md-4\" value=\"\"><\/input>";
		strVar += " 				<input id=\"" + parent + "-height-apply\" value=\"Apply\" type=\"button\" class=\"btn btn-link col-md-4\"><\/input>";
		strVar += "    			</div>";
		strVar += "    			<div class =\"form-group row\">";
		strVar += "      			<label class=\"col-md-4\" for=\"" + parent + "-width\">width:<\/label>";
		strVar += "      			<input type=\"text\" style=\"width: 150px\" name=\"" + parent + "-width\" id=\"" + parent + "-width\" class=\"form-control col-md-4\" value=\"\"><\/input>";
		strVar += " 				<input id=\"" + parent + "-width-apply\" value=\"Apply\" type=\"button\" class=\"btn btn-link col-md-4\"><\/input>";
		strVar += "    			</div>";
		strVar += "    			<div class =\"form-group row\">";
		strVar += "      			<label class=\"col-md-4\" for=\"" + parent + "-type-node\">type:<\/label>";
		strVar += "      			<select style=\"width: 150px\" id=\"" + parent + "-type-node\" class=\"form-control col-md-4\" name=\"" + parent + "-type-node\">";
		strVar += "  					<option id=\"" + parent + "-select-bundleOne\" value=\"nType1\" selected=\"\">" + definitionHub.nodeTypes.nType1[0] + "<\/option>";
		strVar += "  					<option id=\"" + parent + "-select-bundleTwo\" value=\"nType2\">" + definitionHub.nodeTypes.nType2[0] + "<\/option>";
		strVar += "  					<option id=\"" + parent + "-select-gene\" value=\"nType3\">" + definitionHub.nodeTypes.nType3[0] + "<\/option>";
		strVar += "  					<option id=\"" + parent + "-select-geneProduct\" value=\"nType4\">" + definitionHub.nodeTypes.nType4[0] + "<\/option>";
		strVar += "  					<option id=\"" + parent + "-select-protein\" value=\"nType5\">" + definitionHub.nodeTypes.nType5[0] + "<\/option>";
		strVar += "  					<option id=\"" + parent + "-select-rna\" value=\"nType6\">" + definitionHub.nodeTypes.nType6[0] + "<\/option>";
		strVar += "  					<option id=\"" + parent + "-select-mircoRna\" value=\"nType7\">" + definitionHub.nodeTypes.nType7[0] + "<\/option>";
		strVar += "  					<option id=\"" + parent + "-select-kinase\" value=\"nType8\">" + definitionHub.nodeTypes.nType8[0] + "<\/option>";
		strVar += "  					<option id=\"" + parent + "-select-ligand\" value=\"nType9\">" + definitionHub.nodeTypes.nType9[0] + "<\/option>";
		strVar += "  					<option id=\"" + parent + "-select-receptor\" value=\"nType10\">" + definitionHub.nodeTypes.nType10[0] + "<\/option>";
		strVar += "  					<option id=\"" + parent + "-select-biologicalProcess\" value=\"nType11\">" + definitionHub.nodeTypes.nType11[0] + "<\/option>";
		strVar += "  					<option id=\"" + parent + "-select-triangle\" value=\"nType12\">" + definitionHub.nodeTypes.nType12[0] + "<\/option>";
		strVar += "  					<option id=\"" + parent + "-select-rectangle\" value=\"nType13\">" + definitionHub.nodeTypes.nType13[0] + "<\/option>";
		strVar += "  					<option id=\"" + parent + "-select-circle\" value=\"nType14\">" + definitionHub.nodeTypes.nType14[0] + "<\/option>";
		strVar += "  					<option id=\"" + parent + "-select-ellipse\" value=\"nType15\">" + definitionHub.nodeTypes.nType15[0] + "<\/option>";
		strVar += "  					<option id=\"" + parent + "-select-pentagon\" value=\"nType16\">" + definitionHub.nodeTypes.nType16[0] + "<\/option>";
		strVar += "  					<option id=\"" + parent + "-select-hexagon\" value=\"nType17\" >" + definitionHub.nodeTypes.nType17[0] + "<\/option>";
		strVar += "  					<option id=\"" + parent + "-select-heptagon\" value=\"nType18\">" + definitionHub.nodeTypes.nType18[0] + "<\/option>";
		strVar += "  					<option id=\"" + parent + "-select-octagon\" value=\"nType19\">" + definitionHub.nodeTypes.nType19[0] + "<\/option>";
		strVar += "  					<option id=\"" + parent + "-select-star\" value=\"nType20\">" + definitionHub.nodeTypes.nType20[0] + "<\/option>";
		strVar += "  					<option id=\"" + parent + "-select-diamond\" value=\"nType21\">" + definitionHub.nodeTypes.nType21[0] + "<\/option>";
		strVar += "  					<option id=\"" + parent + "-select-vee\" value=\"nType22\">" + definitionHub.nodeTypes.nType22[0] + "<\/option>";
		strVar += "  					<option id=\"" + parent + "-select-rhomboid\" value=\"nType23\">" + definitionHub.nodeTypes.nType23[0] + "<\/option>";
		strVar += "  					<option id=\"" + parent + "-select-label\" value=\"nType24\">" + definitionHub.nodeTypes.nType24[0] + "<\/option>";
		strVar += "  					<option id=\"" + parent + "-select-transcriptionFactor\" value=\"nType25\">" + definitionHub.nodeTypes.nType25[0] + "<\/option>";
		strVar += "					<\/select>";
		strVar += " 				<input id=\"" + parent + "-type-node-apply\" value=\"Apply\" type=\"button\" class=\"btn btn-link col-md-4\"><\/input>";
		strVar += "    			</div>";
		strVar += "    			<div class =\"form-group row\">";
		strVar += "      			<label class=\"col-md-4\" for=\"" + parent + "-rna\">Rna:<\/label>";
		strVar += "      			<input type=\"text\" style=\"width: 150px\" id=\"" + parent + "-rna\" class=\"form-control col-md-4\" name=\"" + parent + "-rna\">";
		strVar += " 				<input id=\"" + parent + "-rna-apply\" value=\"Apply\" type=\"button\" class=\"btn btn-link col-md-4\"><\/input>";
		strVar += "    			</div>";
		strVar += "    			<div class =\"form-group row\">";
		strVar += "					<label class=\"col-md-4\" for=\"" + parent + "-cnv\">Cnv:<\/label>";
		strVar += "      			<input type=\"text\" style=\"width: 150px\" id=\"" + parent + "-cnv\" class=\"form-control col-md-4\" name=\"" + parent + "-cnv\">";
		strVar += " 				<input id=\"" + parent + "-cnv-apply\" value=\"Apply\" type=\"button\" class=\"btn btn-link col-md-4\"><\/input>";
		strVar += "    			</div>";
		strVar += "    			<div class =\"form-group row\">";
		strVar += "					<label class=\"col-md-4\" for=\"" + parent + "-mut\">Mut:<\/label>";
		strVar += "      			<input type=\"text\" style=\"width: 150px\" id=\"" + parent + "-mut\" class=\"form-control col-md-4\" name=\"" + parent + "-mut\">";
		strVar += " 				<input id=\"" + parent + "-mut-apply\" value=\"Apply\" type=\"button\" class=\"btn btn-link col-md-4\"><\/input>";
		strVar += "    			</div>";
		strVar += "    			<div class =\"form-group row\">";
		strVar += "					<label class=\"col-md-4\" for=\"" + parent + "-p\">P:<\/label>";
		strVar += "      			<input type=\"text\" style=\"width: 150px\" id=\"" + parent + "-p\" class=\"form-control col-md-4\" name=\"" + parent + "-p\">";
		strVar += " 				<input id=\"" + parent + "-p-apply\" value=\"Apply\" type=\"button\" class=\"btn btn-link col-md-4\"><\/input>";
		strVar += "    			</div>";
		strVar += "    			<div class =\"form-group row\">";
		strVar += "					<label class=\"col-md-4\" for=\"" + parent + "-m\">M:<\/label>";
		strVar += "      			<input type=\"text\" style=\"width: 150px\" id=\"" + parent + "-m\" class=\"form-control col-md-4\" name=\"" + parent + "-m\">";
		strVar += " 				<input id=\"" + parent + "-m-apply\" value=\"Apply\" type=\"button\" class=\"btn btn-link col-md-4\"><\/input>";
		strVar += "    			</div>";
		strVar += "    			<div class =\"form-group row\">";
		strVar += "					<label class=\"col-md-4\" for=\"" + parent + "-pa\">Pa:<\/label>";
		strVar += "      			<input type=\"text\" style=\"width: 150px\" id=\"" + parent + "-pa\" class=\"form-control col-md-4\" name=\"" + parent + "-pa\">";
		strVar += " 				<input id=\"" + parent + "-pa-apply\" value=\"Apply\" type=\"button\" class=\"btn btn-link col-md-4\"><\/input>";
		strVar += "    			</div>";
		strVar += "    			<div class =\"form-group row\">";
		strVar += "    				<label class=\"col-md-4\" for=\"" + parent + "-background-image\">Local Image File:<\/label>";
		strVar += "					<input id=\"" + parent + "-background-image\" value=\"Pick an Image File\" type=\"file\"><\/input>";
		strVar += "    			</div>";
		strVar += "    			<div class =\"form-group row\">";
		strVar += "    				<label class=\"col-md-4\" for=\"" + parent + "-background-image-remove\">Remove Background image:<\/label>";
		strVar += "					<input id=\"" + parent + "-background-image-remove\" value=\"Remove\" type=\"button\" class=\"btn btn-link col-md-4\"><\/input>";
		strVar += "    			</div>";
		strVar += "    			<div class =\"form-group row\">";
		strVar += "    				<label class=\"col-md-4\" for=\"" + parent + "-node-move-to-background\">Move to Background:<\/label>";
		strVar += "    				<input id=\"" + parent + "-node-move-to-background\" value=\"Move\" type=\"button\" class=\"btn btn-link col-md-4\"><\/input>";
		strVar += "    			</div>";
		strVar += "    			<div class =\"form-group row\">";
		strVar += "    				<label class=\"col-md-4\" for=\"" + parent + "-node-move-to-foreground\">Move to Foreground:<\/label>";
		strVar += "    				<input id=\"" + parent + "-node-move-to-foreground\" value=\"Move\" type=\"button\" class=\"btn btn-link col-md-4\"><\/input>";
		strVar += "    			</div>";
		strVar += "  		<\/form>";
		strVar += "	<\/div>";
		strVar += "	<div id=\"" + parent + "-cy\" style=\"height: 100%;width: 100%;position: absolute; left: 0;\"><\/div>";

		document.getElementById(parent).innerHTML = strVar;

		$(function () {
			function removeHeroUnit() {
				var heroUnit = document.getElementById(parent + "-intro-hero-unit");
				if (heroUnit != null)
					heroUnit.parentNode.removeChild(heroUnit);
			}

			function newPathway(event) {
				var name = document.getElementById(parent + "-new-pathway-name").value;
				var data = '{"format_version" : "1.0","generated_by" : "cytoscape-3.2.1","target_cytoscapejs_version" : "~2.1","data" :{"shared_name":"","ID":"","BOARDWIDTH":"","BOARDHEIGHT":"","LICENSE":"CC BY 2.0","ORGANISM":"","NAME":"","INSTRUCTION":"","AUTHOR":"","VERSION":"","PATHWAY_TYPE":"original","SUID":205,"__Annotations":[],"selected":true},"elements" : {"nodes" :[],"edges" :[]}}'
				var obj = JSON.parse(data);
				var title = document.getElementById(parent + "-pathway-title");
				pathName = name;
				title.innerHTML = pathName + " <small>" + personId + "</small>";
				removeHeroUnit();
				setElements(obj);
				save(obj, name);
				dialogNewPathway.dialog("close");
			}

			function focus(name) {
				var cy = $('#' + parent + '-cy').cytoscape('get');
				cy.elements("node[name *= \"" + name + "\"]").select();
				cy.$('node').addClass('unfocused');
				cy.$('edge').addClass('unfocused');
				cy.$('node:selected').addClass('focused');
				cy.$('edge:selected').addClass('focused');
			}

			function unFocus() {
				var cy = $('#' + parent + '-cy').cytoscape('get');
				cy.$('node').unselect();
				cy.$('edge').unselect();
				cy.$('node').removeClass('unfocused').removeClass('focused');
				cy.$('edge').removeClass('unfocused').removeClass('focused');
			}

			function search(event) {
				var cy = $('#' + parent + '-cy').cytoscape('get');
				var name = document.getElementById(parent + "-search-node-name").value;
				unFocus();
				if (name != "") {
					focus(name);
				} else {
					unFocus();
				}
			}

			function exitSearch(event) {
				var cy = $('#' + parent + '-cy').cytoscape('get');
				unFocus();
			}

			function onChangePathwayFile(event) {
				var reader = new FileReader();
				reader.onload = onPathwayReaderLoad;
				reader.readAsText(event.target.files[0]);
				removeHeroUnit();
			}

			function collapseBundleInformative(event) {
				var cy = $('#' + parent + '-cy').cytoscape('get');
				for (var i = 0; i < selectedForEditNodes.size(); i++) {
					if (selectedForEditNodes[i].isParent() && !selectedForEditNodes[i].descendants()[0].hasClass('collapsed_informative')) {
						var staticOldPosX = selectedForEditNodes[i].position('x');
						var staticOldPosY = selectedForEditNodes[i].position('y');
						selectedForEditNodes[i].descendants().addClass('collapsed_informative');
						selectedForEditNodes[i].descendants().unselectify();
						var xGap = 0;
						var yGap = 0;
						for (var j = 0; selectedForEditNodes[i].descendants().length > j; j++) {
							if (j % 5 == 0) {
								xGap = 0
								yGap += 10
							} else {
								xGap += 10
							}
							var newPositionX = staticOldPosX + xGap;
							var newPositionY = staticOldPosY + yGap;
							selectedForEditNodes[i].descendants()[j].data('oldPositionX', selectedForEditNodes[i].descendants()[j].position('x'));
							selectedForEditNodes[i].descendants()[j].data('oldPositionY', selectedForEditNodes[i].descendants()[j].position('y'));
							selectedForEditNodes[i].descendants()[j].position({
								x: newPositionX,
								y: newPositionY
							});
						}
					}
				}
				saveState();
			}

			function expandBundleInformative(event) {
				var cy = $('#' + parent + '-cy').cytoscape('get');
				for (var i = 0; i < selectedForEditNodes.size(); i++) {
					if (selectedForEditNodes[i].isParent() && selectedForEditNodes[i].descendants()[0].hasClass('collapsed_informative')) {
						selectedForEditNodes[i].descendants().removeClass('collapsed_informative');
						selectedForEditNodes[i].descendants().selectify();
						for (var j = 0; selectedForEditNodes[i].descendants().length > j; j++) {
							selectedForEditNodes[i].descendants()[j].position('x', selectedForEditNodes[i].descendants()[j].data('oldPositionX'));
							selectedForEditNodes[i].descendants()[j].position('y', selectedForEditNodes[i].descendants()[j].data('oldPositionY'));
						}
					}
				}
				saveState();
			}

			function collapseBundle(event) {
				var cy = $('#' + parent + '-cy').cytoscape('get');
				for (var i = 0; i < selectedForEditNodes.size(); i++) {
					if (selectedForEditNodes[i].isParent() && !selectedForEditNodes[i].descendants()[0].hasClass('collapsed')) {
						selectedForEditNodes[i].descendants().addClass('collapsed');
						selectedForEditNodes[i].descendants().unselectify();
						for (var j = 0; selectedForEditNodes[i].descendants().length > j; j++) {
							selectedForEditNodes[i].descendants()[j].data('oldPositionX', selectedForEditNodes[i].descendants()[j].position('x'));
							selectedForEditNodes[i].descendants()[j].data('oldPositionY', selectedForEditNodes[i].descendants()[j].position('y'));
						}
						selectedForEditNodes[i].descendants().positions({
							x: selectedForEditNodes[i].position('x') + selectedForEditNodes[i].width() / 2,
							y: selectedForEditNodes[i].position('y') + selectedForEditNodes[i].height() / 2
						});
					}
				}
				saveState();
			}

			function expandBundle(event) {
				var cy = $('#' + parent + '-cy').cytoscape('get');
				for (var i = 0; i < selectedForEditNodes.size(); i++) {
					if (selectedForEditNodes[i].isParent() && selectedForEditNodes[i].descendants()[0].hasClass('collapsed')) {
						selectedForEditNodes[i].descendants().removeClass('collapsed');
						selectedForEditNodes[i].descendants().selectify();
						for (var j = 0; selectedForEditNodes[i].descendants().length > j; j++) {
							selectedForEditNodes[i].descendants()[j].position('x', selectedForEditNodes[i].descendants()[j].data('oldPositionX'));
							selectedForEditNodes[i].descendants()[j].position('y', selectedForEditNodes[i].descendants()[j].data('oldPositionY'));
						}
					}
				}
				saveState();
			}

			function onChangeColoringFile(event) {
				var reader = new FileReader();
				reader.onload = onColoringReaderLoad;
	//			personId = event.target.files[0].name.substring(0,event.target.files[0].name.indexOf("."))
				personId = event.target.files[0].name;
				var title = document.getElementById(parent + "-pathway-title");
				title.innerHTML = pathName + " <small>" + personId + "</small>";
				reader.readAsText(event.target.files[0]);
				saveState();
			}

			function postAddProcessing() {
				var cy = $('#' + parent + '-cy').cytoscape('get');

				for (var i = 0; i < cy.$("node").length; i++) {
					if (typeof (cy.$("node")[i].data("BackgroundImage")) != "undefined" && cy.$("node")[i].data("BackgroundImage") != "") {
						cy.$("node")[i].style("BackgroundImage", cy.$("node")[i].data("BackgroundImage"));
						cy.$("node")[i].data("Type", "image");
					}

					if (typeof (cy.$("node")[i].data("ZIndex")) != "undefined") {
						cy.$("node")[i].style("z-index", cy.$("node")[i].data("ZIndex"));
					}

					if (cy.$("node")[i].isParent() && (cy.$("node")[i].data("Type") != "1" || cy.$("node")[i].data("Type") != "2")) {
						cy.$("node")[i].data("Type", "nType1");
					}
				}

				for (var i = 0; i < cy.$("edge").length; i++) {
					if (typeof (cy.$("edge")[i].data("CurveStyle")) != "undefined") {
						cy.$("edge")[i].style("curve-style", cy.$("edge")[i].data("CurveStyle"));
					}

					if (typeof (cy.$("edge")[i].data("zOrder")) != "undefined") {
						cy.$("edge")[i].style("z-index", cy.$("edge")[i].data("zOrder"));
					}

					if (typeof (cy.$("edge")[i].data("SegmentDistances")) != "undefined") {
						cy.$("edge")[i].style("segment-distances", cy.$("edge")[i].data("SegmentDistances"));
					}

					if (typeof (cy.$("edge")[i].data("SegmentWeights")) != "undefined") {
						cy.$("edge")[i].style("segment-weights", cy.$("edge")[i].data("SegmentWeights"));
					}
				}
			}

			function define(key) {
				var definition = "";
				for (var i in definitionHub.nodeTypes) {
					if (i == key)
						definition = definitionHub.nodeTypes[i][0];
				}
				for (var i in definitionHub.arrowLineTypes) {
					if (i == key)
						definition = definitionHub.arrowLineTypes[i][0];

				}
				for (var i in definitionHub.edgeLineTypes) {
					if (i == key)
						definition = definitionHub.edgeLineTypes[i][0];
				}
				return definition;
			}

			function setElements(obj) {
				if (loadCounts == 0) {
					header = obj.data;
					visualPathway(obj);
				} else {

					// Pre-Add process (but we do this specific step only here!!!)
					var cy = $('#' + parent + '-cy').cytoscape('get');
					for (var i = 0; i < obj.elements.nodes.length; i++) {
						obj.elements.nodes[i].position.x = obj.elements.nodes[i].position.x + 1000 * loadCounts;
					}

					preAddProcessing(obj);

					cy.add(obj.elements);
					cy.center();
					cy.fit();

					postAddProcessing();

				}
				loadCounts++;
				saveState();
			}

			function loadPathway(id) {
				$.post(services['GET_PATHWAY'], {
					pid: id
				}, function (data) {
					removeHeroUnit();
					var obj = JSON.parse(data);
					var title = document.getElementById(parent + "-pathway-title");
					pathName = obj.data.NAME;
					title.innerHTML = pathName + " <small>" + personId + "</small>";
					setElements(obj);
				});
			}

			function onSelect(event) {
				var id = event.target.value;
				loadPathway(id);
			}

			function save(obj, name) {
				obj.data.NAME = name;
				$.post(services['SAVE_PATHWAY'], {
					insertPathway: JSON.stringify(obj)
				}, function (data) {
					if (data != "Success!") {
						obj.data.ID = data;
						$.post(services['SAVE_PATHWAY'], {
							updatePathway: JSON.stringify(obj)
						}, function (data) {
							dialogPathwaySaveAs.dialog("close");
						});
					} else {
						refreshPathwayList();
						dialogPathwaySaveAs.dialog("close");
					}
				});
			}

			function saveAsPathway(event) {
				var obj = JSON.parse(states[states.length - 1]);
				mapForExport(obj);
				var name = document.getElementById(parent + "-pathway-name").value;
				save(obj, name);
			}

			function savePathway(event) {
				var obj = JSON.parse(states[states.length - 1]);
				mapForExport(obj);
				$.post(services['SAVE_PATHWAY'], {
					updatePathway: JSON.stringify(obj)
				}, function (data) {
					dialogPathwaySaveAs.dialog("close");
				});
			}

			function onPathwayReaderLoad(event) {
				var obj = JSON.parse(event.target.result);
				var title = document.getElementById(parent + "-pathway-title");
				pathName = obj.data.NAME;
				title.innerHTML = pathName + " <small>" + personId + "</small>";
				setElements(obj);
			}

			function onColoringReaderLoad(event) {
				var list = this.result.split('\n');
				var lines = [];

				for (var line = 0; line < list.length; line++) {
					lines[line] = list[line].split('\t');
				}
				sprayColor(lines);
			}

			function sprayColor(lines) {
				var cy = $('#' + parent + '-cy').cytoscape('get');
				var header = {};
				for (var i = 0; i < lines[0].length; i++) {
					var value = lines[0][i].toLowerCase().trim();
					header[value] = i;
				}

				for (var line = 1; line < lines.length; line++) {
					var target = cy.elements("node[name = \"" + lines[line][header["gene"]] + "\"]");
					if (typeof (header["mut"]) != "undefined") {
						Mut = lines[line][header["mut"]];
						if (!isNaN(Mut))
							target.data('Mut', Mut);
						else
							target.data('Mut', '0');
					}
					if (typeof (header["cnv"]) != "undefined") {
						Cnv = lines[line][header["cnv"]];
						if (!isNaN(Cnv))
							target.data('Cnv', Cnv);
						else
							target.data('Cnv', '0');
					}
					if (typeof (header["rna"]) != "undefined") {
						Rna = lines[line][header["rna"]];
						if (!isNaN(Rna))
							target.data('Rna', Rna);
						else
							target.data('Rna', '0');
					}
					if (typeof (header["p"]) != "undefined") {
						P = lines[line][header["p"]];
						if (!isNaN(P)) {
							target.data('P', P);
						} else {
							target.data('P', '0');
						}
					}
					if (typeof (header["m"]) != "undefined") {
						M = lines[line][header["m"]];
						if (!isNaN(M)) {
							target.data('M', M);
						} else {
							target.data('M', '0');
						}
					}
					if (typeof (header["pa"]) != "undefined") {
						PA = lines[line][header["pa"]];
						if (!isNaN(PA)) {
							target.data('PA', PA);
						} else {
							target.data('PA', '0');
						}
					}
				}
				saveState();
			}

			function removeElements(event) {
				if (selectedForEditNodes.length > 0)
					selectedForEditNodes.remove();
				if (selectedForEditEdges.length > 0)
					selectedForEditEdges.remove();
				saveState();
			}

			function addDuplicateNodes(event) {
				var cy = $('#' + parent + '-cy').cytoscape('get');
				var node = [];
				var edge = [];

				var lookupDuplicatedNodes = [];
				var lookupDuplicatedEdges = [];

				for (var i = 0; i < selectedForEditNodes.length; i++) {
					node.push({
						group: "nodes",
						data: {
							LabelSize: selectedForEditNodes[i].data('LabelSize'),
							Type: selectedForEditNodes[i].data('Type'),
							Valign: selectedForEditNodes[i].data('Valign'),
							Width: selectedForEditNodes[i].data('Width'),
							Height: selectedForEditNodes[i].data('Height'),
							id: "dup" + dupCounter.toString() + selectedForEditNodes[i].data('id'),
							name: selectedForEditNodes[i].data('name'),
							selected: false,
							BackgroundImage: selectedForEditNodes[i].data('BackgroundImage'),
							ZIndex: selectedForEditNodes[i].data('ZIndex'),
							parent: "dup" + dupCounter.toString() + selectedForEditNodes[i].data('parent')
						},
						position: {
							x: selectedForEditNodes[i].position('x') + 100,
							y: selectedForEditNodes[i].position('y') + 100
						}
					})
					lookupDuplicatedNodes.push("dup" + dupCounter.toString() + selectedForEditNodes[i].data('id'));
				}
				for (var i = 0; i < selectedForEditNodes.length; i++) {
					for (var j = 0; j < selectedForEditNodes[i].connectedEdges().length; j++) {
						if (lookupDuplicatedNodes.indexOf("dup" + dupCounter.toString() + selectedForEditNodes[i].connectedEdges()[j].data('source')) != -1 &&
								lookupDuplicatedNodes.indexOf("dup" + dupCounter.toString() + selectedForEditNodes[i].connectedEdges()[j].data('target')) != -1 &&
								lookupDuplicatedEdges.indexOf("dup" + dupCounter.toString() + selectedForEditNodes[i].connectedEdges()[j].data('id')) == -1
								) {
							edge.push({
								group: "edges",
								data: {
									id: "dup" + dupCounter.toString() + selectedForEditNodes[i].connectedEdges()[j].data('id'),
									Type: selectedForEditNodes[i].connectedEdges()[j].data('Type'),
									LineThickness: selectedForEditNodes[i].connectedEdges()[j].data('LineThickness'),
									EndArrow: selectedForEditNodes[i].connectedEdges()[j].data('EndArrow'),
									Coords: selectedForEditNodes[i].connectedEdges()[j].data('Coords'),
									ZOrder: selectedForEditNodes[i].connectedEdges()[j].data('ZOrder'),
									source: "dup" + dupCounter.toString() + selectedForEditNodes[i].connectedEdges()[j].data('source'),
									target: "dup" + dupCounter.toString() + selectedForEditNodes[i].connectedEdges()[j].data('target'),
									StartArrow: selectedForEditNodes[i].connectedEdges()[j].data('StartArrow'),
									CurveStyle: selectedForEditNodes[i].connectedEdges()[j].data('CurveStyle'),
									SegmentDistances: selectedForEditNodes[i].connectedEdges()[j].data('SegmentDistances'),
									SegmentWeights: selectedForEditNodes[i].connectedEdges()[j].data('SegmentWeights'),
									selected: selectedForEditNodes[i].connectedEdges()[j].data('selected')
								}
							})
							lookupDuplicatedEdges.push("dup" + dupCounter.toString() + selectedForEditNodes[i].connectedEdges()[j].data('id'));
						}
					}
				}
				dupCounter++;
				cy.add(node.concat(edge));
				postAddProcessing();
				saveState();
			}

			function addNode(event) {
				var cy = $('#' + parent + '-cy').cytoscape('get');
				var name = "n" + nodeCounter;
				var node = [];

				var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
				var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
				var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
				var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
				var left = ((width / 2) - (100 / 2)) + dualScreenLeft;
				var top = ((height / 2) - (25 / 2)) + dualScreenTop;

				node.push({
					group: "nodes",
					data: {
						LabelSize: 10,
						Type: "nType15",
						Valign: "Middle",
						Width: 100,
						Height: 25,
						id: "n" + nodeCounter,
						name: name,
						selected: false,
						BackgroundImage: "",
						ZIndex: 0
					},
					renderedPosition: {
						x: left,
						y: top
					}
				})

				nodeCounter++;
				cy.add(node);
				postAddProcessing();
				saveState();
			}

			function addEdge(event) {
				var cy = $('#' + parent + '-cy').cytoscape('get');
				for (var i = 0; i < selectedForEditNodes.length - 1; i++) {
					var sourceE = selectedForEditNodes[i].data('id');
					var targetE = selectedForEditNodes[i + 1].data('id');

					var edge = [];

					edge.push({
						group: "edges",
						data: {
							id: "e" + edgeCounter,
							Type: "Solid",
							LineThickness: 1.0,
							EndArrow: "Line",
							Coords: [{
									"x": 0,
									"y": 0
								}, {
									"x": 0,
									"y": 0
								}],
							ZOrder: "12288",
							source: sourceE,
							target: targetE,
							StartArrow: "Line",
							selected: false
						}
					})

					edgeCounter++;
					cy.add(edge);
					postAddProcessing();
					saveState();
				}
			}

			function unbundleRecursive(node, parents, edges, nodes, rCounter) {
				rCounter++;
				if (rCounter == 1 && node.isParent()) {
					parents.push(node);
					for (var x = 0; x < node.children().size(); x++) {
						if (node.parent().length != 0) {
							nodes.push({
								group: "nodes",
								data: {
									LabelSize: node.children()[x].data('LabelSize'),
									Type: node.children()[x].data('Type'),
									Valign: node.children()[x].data('Valign'),
									Width: node.children()[x].data('Width'),
									Height: node.children()[x].data('Height'),
									id: node.children()[x].data('id'),
									name: node.children()[x].data('name'),
									selected: node.children()[x].data('selected'),
									Cnv: node.children()[x].data('Cnv'),
									Rna: node.children()[x].data('Rna'),
									Mut: node.children()[x].data('Mut'),
									parent: node.parent().data('id'),
									BackgroundImage: node.children()[x].data('BackgroundImage'),
									ZIndex: node.children()[x].data('ZIndex')
								},
								position: {
									x: node.children()[x].position('x'),
									y: node.children()[x].position('y')
								}
							});
						} else {
							nodes.push({
								group: "nodes",
								data: {
									LabelSize: node.children()[x].data('LabelSize'),
									Type: node.children()[x].data('Type'),
									Valign: node.children()[x].data('Valign'),
									Width: node.children()[x].data('Width'),
									Height: node.children()[x].data('Height'),
									id: node.children()[x].data('id'),
									name: node.children()[x].data('name'),
									selected: node.children()[x].data('selected'),
									Cnv: node.children()[x].data('Cnv'),
									Rna: node.children()[x].data('Rna'),
									Mut: node.children()[x].data('Mut'),
									BackgroundImage: node.children()[x].data('BackgroundImage'),
									ZIndex: node.children()[x].data('ZIndex')
								},
								position: {
									x: node.children()[x].position('x'),
									y: node.children()[x].position('y')
								}
							});
						}
						for (var j = 0; j < node.children()[x].connectedEdges().size(); j++) {
							edges.push({
								group: "edges",
								data: {
									id: node.children()[x].connectedEdges()[j].data('id'),
									Type: node.children()[x].connectedEdges()[j].data('Type'),
									LineThickness: node.children()[x].connectedEdges()[j].data('LineThickness'),
									EndArrow: node.children()[x].connectedEdges()[j].data('EndArrow'),
									Coords: node.children()[x].connectedEdges()[j].data('Coords'),
									ZOrder: node.children()[x].connectedEdges()[j].data('ZOrder'),
									source: node.children()[x].connectedEdges()[j].data('source'),
									target: node.children()[x].connectedEdges()[j].data('target'),
									StartArrow: node.children()[x].connectedEdges()[j].data('StartArrow'),
									CurveStyle: node.children()[x].connectedEdges()[j].data('CurveStyle'),
									SegmentDistances: node.children()[x].connectedEdges()[j].data('SegmentDistances'),
									SegmentWeights: node.children()[x].connectedEdges()[j].data('SegmentWeights'),
									selected: node.children()[x].connectedEdges()[j].data('selected')
								}
							})
						}
						unbundleRecursive(node.children()[x], parents, edges, nodes, rCounter);
					}
				} else if (rCounter > 1 && node.isParent()) {
					for (var x = 0; x < node.children().size(); x++) {
						if (node.length != 0) {
							nodes.push({
								group: "nodes",
								data: {
									LabelSize: node.children()[x].data('LabelSize'),
									Type: node.children()[x].data('Type'),
									Valign: node.children()[x].data('Valign'),
									Width: node.children()[x].data('Width'),
									Height: node.children()[x].data('Height'),
									id: node.children()[x].data('id'),
									name: node.children()[x].data('name'),
									selected: node.children()[x].data('selected'),
									Cnv: node.children()[x].data('Cnv'),
									Rna: node.children()[x].data('Rna'),
									Mut: node.children()[x].data('Mut'),
									parent: node.data('id'),
									BackgroundImage: node.children()[x].data('BackgroundImage'),
									ZIndex: node.children()[x].data('ZIndex')
								},
								position: {
									x: node.children()[x].position('x'),
									y: node.children()[x].position('y')
								}
							});
						} else {
							nodes.push({
								group: "nodes",
								data: {
									LabelSize: node.children()[x].data('LabelSize'),
									Type: node.children()[x].data('Type'),
									Valign: node.children()[x].data('Valign'),
									Width: node.children()[x].data('Width'),
									Height: node.children()[x].data('Height'),
									id: node.children()[x].data('id'),
									name: node.children()[x].data('name'),
									selected: node.children()[x].data('selected'),
									Cnv: node.children()[x].data('Cnv'),
									Rna: node.children()[x].data('Rna'),
									Mut: node.children()[x].data('Mut'),
									BackgroundImage: node.children()[x].data('BackgroundImage'),
									ZIndex: node.children()[x].data('ZIndex')
								},
								position: {
									x: node.children()[x].position('x'),
									y: node.children()[x].position('y')
								}
							});
						}

						for (var j = 0; j < node.children()[x].connectedEdges().size(); j++) {
							edges.push({
								group: "edges",
								data: {
									id: node.children()[x].connectedEdges()[j].data('id'),
									Type: node.children()[x].connectedEdges()[j].data('Type'),
									LineThickness: node.children()[x].connectedEdges()[j].data('LineThickness'),
									EndArrow: node.children()[x].connectedEdges()[j].data('EndArrow'),
									Coords: node.children()[x].connectedEdges()[j].data('Coords'),
									ZOrder: node.children()[x].connectedEdges()[j].data('ZOrder'),
									source: node.children()[x].connectedEdges()[j].data('source'),
									target: node.children()[x].connectedEdges()[j].data('target'),
									StartArrow: node.children()[x].connectedEdges()[j].data('StartArrow'),
									CurveStyle: node.children()[x].connectedEdges()[j].data('CurveStyle'),
									SegmentDistances: node.children()[x].connectedEdges()[j].data('SegmentDistances'),
									SegmentWeights: node.children()[x].connectedEdges()[j].data('SegmentWeights'),
									selected: node.children()[x].connectedEdges()[j].data('selected')
								}
							})
						}
						unbundleRecursive(node.children()[x], parents, edges, nodes, rCounter);
					}
				}
			}

			function recursiveBundle(node, edges, nodes) {
				nodes.push({
					group: "nodes",
					data: {
						LabelSize: node.data('LabelSize'),
						Type: node.data('Type'),
						Valign: node.data('Valign'),
						Width: node.data('Width'),
						Height: node.data('Height'),
						id: node.data('id'),
						name: node.data('name'),
						selected: node.data('selected'),
						Cnv: node.data('Cnv'),
						Rna: node.data('Rna'),
						Mut: node.data('Mut'),
						parent: node.data('parent'),
						BackgroundImage: node.data('BackgroundImage'),
						ZIndex: node.data('ZIndex')
					},
					position: {
						x: node.position('x'),
						y: node.position('y')
					}
				});
				for (var j = 0; j < node.connectedEdges().size(); j++) {
					edges.push({
						group: "edges",
						data: {
							id: node.connectedEdges()[j].data('id'),
							Type: node.connectedEdges()[j].data('Type'),
							LineThickness: node.connectedEdges()[j].data('LineThickness'),
							EndArrow: node.connectedEdges()[j].data('EndArrow'),
							Coords: node.connectedEdges()[j].data('Coords'),
							ZOrder: node.connectedEdges()[j].data('ZOrder'),
							source: node.connectedEdges()[j].data('source'),
							target: node.connectedEdges()[j].data('target'),
							StartArrow: node.connectedEdges()[j].data('StartArrow'),
							CurveStyle: node.connectedEdges()[j].data('CurveStyle'),
							SegmentDistances: node.connectedEdges()[j].data('SegmentDistances'),
							SegmentWeights: node.connectedEdges()[j].data('SegmentWeights'),
							selected: node.connectedEdges()[j].data('selected')
						}
					})
				}
				for (var i = 0; i < node.children().size(); i++) {
					recursiveBundle(node.children()[i], edges, nodes);
				}
			}

			function unbundle(event) {
				var cy = $('#' + parent + '-cy').cytoscape('get');
				var parents = [];
				var nodes = [];
				var edges = [];
				var rCounter = 0;

				for (var i = 0; i < selectedForEditNodes.size(); i++) {
					unbundleRecursive(selectedForEditNodes[i], parents, edges, nodes, rCounter);
				}

				// Remove parents (in the instance that they haven't been removed!)
				for (var i = 0; i < parents.length; i++) {
					parents[i].remove();
				}

				// Add new nodes
				cy.add(nodes.concat(edges));
				postAddProcessing();
				saveState();
			}

			function bundle(event) {
				var cy = $('#' + parent + '-cy').cytoscape('get');
				var type = document.getElementById(parent + "-type-bundle").value;
				var nodes = [];
				var edges = [];
				// Create new parent
				nodes.push({
					group: "nodes",
					data: {
						LabelSize: 10,
						Type: type,
						Valign: "Middle",
						Width: 80.75,
						Height: 100,
						id: "n" + nodeCounter,
						name: "n" + nodeCounter,
						selected: false,
						BackgroundImage: "",
						ZIndex: 0
					},
					position: {
						x: 500,
						y: 500
					}
				})

				// Create copies of old nodes
				for (var i = 0; i < selectedForEditNodes.size(); i++) {
					if (!selectedForEditNodes[i].isChild()) {
						nodes.push({
							group: "nodes",
							data: {
								LabelSize: selectedForEditNodes[i].data('LabelSize'),
								Type: selectedForEditNodes[i].data('Type'),
								Valign: selectedForEditNodes[i].data('Valign'),
								Width: selectedForEditNodes[i].data('Width'),
								Height: selectedForEditNodes[i].data('Height'),
								id: selectedForEditNodes[i].data('id'),
								name: selectedForEditNodes[i].data('name'),
								selected: selectedForEditNodes[i].data('selected'),
								Cnv: selectedForEditNodes[i].data('Cnv'),
								Rna: selectedForEditNodes[i].data('Rna'),
								Mut: selectedForEditNodes[i].data('Mut'),
								parent: "n" + nodeCounter,
								BackgroundImage: selectedForEditNodes[i].data('BackgroundImage'),
								ZIndex: selectedForEditNodes[i].data('ZIndex')

							},
							position: {
								x: selectedForEditNodes[i].position('x'),
								y: selectedForEditNodes[i].position('y')
							}
						});
						for (var j = 0; j < selectedForEditNodes[i].connectedEdges().size(); j++) {
							edges.push({
								group: "edges",
								data: {
									id: selectedForEditNodes[i].connectedEdges()[j].data('id'),
									Type: selectedForEditNodes[i].connectedEdges()[j].data('Type'),
									LineThickness: selectedForEditNodes[i].connectedEdges()[j].data('LineThickness'),
									EndArrow: selectedForEditNodes[i].connectedEdges()[j].data('EndArrow'),
									Coords: selectedForEditNodes[i].connectedEdges()[j].data('Coords'),
									ZOrder: selectedForEditNodes[i].connectedEdges()[j].data('ZOrder'),
									source: selectedForEditNodes[i].connectedEdges()[j].data('source'),
									target: selectedForEditNodes[i].connectedEdges()[j].data('target'),
									StartArrow: selectedForEditNodes[i].connectedEdges()[j].data('StartArrow'),
									CurveStyle: selectedForEditNodes[i].connectedEdges()[j].data('CurveStyle'),
									SegmentDistances: selectedForEditNodes[i].connectedEdges()[j].data('SegmentDistances'),
									SegmentWeights: selectedForEditNodes[i].connectedEdges()[j].data('SegmentWeights'),
									selected: selectedForEditNodes[i].connectedEdges()[j].data('selected')
								}
							})
						}
					}
					if (selectedForEditNodes[i].isParent() || selectedForEditNodes[i].isChild()) {
						recursiveBundle(selectedForEditNodes[i], edges, nodes);
					}
				}

				selectedForEditNodes.remove();

				cy.add(nodes.concat(edges));
				postAddProcessing();

				if (!cy.elements("node[id = \"n" + nodeCounter + "\"]").isParent())
					cy.elements("node[id = \"n" + nodeCounter + "\"]").remove();

				nodeCounter++;

				dialogBundle.dialog("close");
				saveState();
			}

			// eventually can set unique mappings based on who client is (use some form of assigned signature?).
			function mapForExport(obj) {
				for (var i = 0; i < obj.elements.nodes.length - 1; i++) {
					obj.elements.nodes[i].data.Type = define(obj.elements.nodes[i].data.Type);
				}
				for (var i = 0; i < obj.elements.edges.length - 1; i++) {
					obj.elements.edges[i].data.Type = define(obj.elements.edges[i].data.Type);
					obj.elements.edges[i].data.EndArrow = define(obj.elements.edges[i].data.EndArrow);
				}
			}

			function produceJSON(event) {
				var obj = JSON.parse(states[states.length - 1]);
				mapForExport(obj);
				download(JSON.stringify(obj), "data.txt", "text/plain");
			}

			function refreshPathwayList() {
				var select = document.getElementById(parent + "-pathway-selector");

				while (select.firstChild) {
					select.removeChild(select.firstChild);
				}

				$.post(services['GET_PATHWAY'], {
//					pathwayList: '1'
				}, function (data) {
					var obj = JSON.parse(data);
					var el = document.createElement("option");
					el.textContent = "Select pathway";
					select.appendChild(el);
					for (var i = 0; i < obj.length; i++) {
						var opt = obj[i].NAME;
						var val = obj[i].ID;
						var el = document.createElement("option");
						el.textContent = opt;
						el.value = val;
						select.appendChild(el);
					}
				});

			}

			function findPath(sid, vid) {
				var cy = $('#' + parent + '-cy').cytoscape('get');
				var obj = JSON.parse(states[states.length - 1]);
				mapForExport(obj);
				$.post(services['FIND_PATH'], {
					s: sid,
					d: vid,
					data_json: JSON.stringify(obj),
					p: personId
				}, function (yue_data) {
					var result = JSON.parse(yue_data);
					var table = document.getElementById(parent + "-inner-table");
					var length = document.getElementById(parent + "-inner-table").rows.length;
					
					console.log(yue_data)
					
					for (var n = 0; n < length; n++) {
						table.deleteRow(0);
					}
					table.deleteTHead();

					for (var n = 0; n <= result.length; n++) {
						var row = table.insertRow();
						
						columns = [row.insertCell(0)]
						if(n == 0){
							columns[0].innerHTML = "<i><h5><small>paths</small></h5></i>";
						} else {
							var btn = document.createElement("button");
							var t = document.createTextNode((n - 1).toString());
							btn.className = "btn btn-link";
							btn.appendChild(t);
							btn.addEventListener('click', function (event) {
								var k = parseInt(event.currentTarget.innerHTML);
								cy.$('node').removeClass('focused');
								cy.$('edge').removeClass('focused');
								cy.$('node').addClass('unfocused');
								cy.$('edge').addClass('unfocused');
								for (var j = 0; j < result[k].edges.length; j++) {
									cy.elements("edge[id = \"" + result[k].edges[j] + "\"]").addClass('focused');
									var sourceNode = cy.elements("edge[id = \"" + result[k].edges[j] + "\"]").data('source');
									var targetNode = cy.elements("edge[id = \"" + result[k].edges[j] + "\"]").data('target');
									if (cy.elements("node[id = \"" + sourceNode + "\"]").isParent())
										cy.elements("node[id = \"" + sourceNode + "\"]").descendants().addClass('focused');
									if (cy.elements("node[id = \"" + sourceNode + "\"]").isParent())
										cy.elements("node[id = \"" + sourceNode + "\"]").descendants().addClass('focused');
									cy.elements("node[id = \"" + sourceNode + "\"]").addClass('focused');
									cy.elements("node[id = \"" + targetNode + "\"]").addClass('focused');
								}
							});
							columns[0].appendChild(btn);				
						}
						count = 1
						for(entry in result[0]){
							if(entry != "edges"){
								columns.push(row.insertCell(count));
								count++;
								if(n == 0){
									columns[columns.length-1].innerHTML = "<i><h5><small>"+entry+"</small></h5></i>";
								} else {
									columns[columns.length-1].innerHTML = "<h5><small>" + result[n - 1][entry] + "</small></h5>";
								}
							}
						}
						console.log(columns)
					}
					sorttable.makeSortable(table);
					dialogTable.dialog("open");
					dialogPathfind.dialog("close");
				});
			}

			function findPathsAll() {
				findPath(null, null);
			}

			function findPathOne() {
				var sid = orderedSelectedNodes[0]._private.data['id'];
				var vid = orderedSelectedNodes[1]._private.data['id'];
				findPath(sid, vid);
			}

			function saveState() {
				var cy = $('#' + parent + '-cy').cytoscape('get');
				var nodes = cy.$('node');
				var edges = cy.$('edge');
				var data = '{"format_version" : "1.0","generated_by" : "cytoscape-3.2.1","target_cytoscapejs_version" : "~2.1","data" :' + JSON.stringify(header) + ',"elements" : {"nodes" :' + JSON.stringify(nodes.jsons()) + ',"edges" :' + JSON.stringify(edges.jsons()) + '}}';
				states.push(data);
			}

			function undo() {
				if (states.length > 1) {
					var cy = $('#' + parent + '-cy').cytoscape('get');
					cy.$('node').remove();
					cy.$('edge').remove();
					stateRecycle.push(states.pop());
					var obj = JSON.parse(states[states.length - 1]);
					cy.add(obj.elements);
					postAddProcessing();
				}
			}

			function redo() {
				var cy = $('#' + parent + '-cy').cytoscape('get');
				if (stateRecycle.length > 1) {
					cy.$('node').remove();
					cy.$('edge').remove();
					states.push(stateRecycle.pop());
					var obj = JSON.parse(states[states.length - 1]);
					cy.add(obj.elements)
					postAddProcessing();
				}
			}

			function clone(obj) {
				if (null == obj || "object" != typeof obj)
					return obj;
				var copy = obj.constructor();
				for (var attr in obj) {
					if (obj.hasOwnProperty(attr))
						copy[attr] = obj[attr];
				}
				return copy;
			}

			function editEdgeArrowType() {
				var arrowType = document.getElementById(parent + "-arrow-type-edge").value;
				selectedForEditEdges.data('StartArrow', arrowType);
				selectedForEditEdges.data('EndArrow', arrowType);
				saveState();
			}

			function editEdgeLineType() {
				var lineType = document.getElementById(parent + "-line-type-edge").value;
				selectedForEditEdges.data('Type', lineType);
				saveState();
			}

			function editEdgeDirection() {
				var cy = $('#' + parent + '-cy').cytoscape('get');
				if (document.getElementById(parent + '-direction').checked) {
					var edges = [];
					for (var i = 0; i < selectedForEditEdges.length; i++) {
						edges.push({
							group: "edges",
							data: {
								id: selectedForEditEdges[i].data('id'),
								Type: selectedForEditEdges[i].data('Type'),
								LineThickness: selectedForEditEdges[i].data('LineThickness'),
								EndArrow: selectedForEditEdges[i].data('EndArrow'),
								Coords: selectedForEditEdges[i].data('Coords'),
								ZOrder: selectedForEditEdges[i].data('ZOrder'),
								source: selectedForEditEdges[i].data('target'),
								target: selectedForEditEdges[i].data('source'),
								StartArrow: selectedForEditEdges[i].data('StartArrow'),
								selected: selectedForEditEdges[i].data('Selected')
							}
						})
					}
					selectedForEditEdges.remove();
					cy.add(edges)
					postAddProcessing();
				}
				dialogEdge.dialog("close");
				saveState();
			}

			function toggleEdgeStyle() {
				if (document.getElementById(parent + '-segmented-enable-disable').value == "enable")
					edgeEnableSegmentedStyle();
				else
					edgeDisableSegmentedStyle();
			}

			function edgeEnableSegmentedStyle() {
				var SegmentDistances = document.getElementById(parent + "-segment-distances").value;
				var SegmentWeights = document.getElementById(parent + "-segment-weights").value;
				selectedForEditEdges.style('curve-style', 'segments');
				selectedForEditEdges.style('segment-distances', SegmentDistances);
				selectedForEditEdges.style('segment-weights', SegmentWeights);
				selectedForEditEdges.data('CurveStyle', 'segments');
				selectedForEditEdges.data('SegmentDistances', SegmentDistances);
				selectedForEditEdges.data('SegmentWeights', SegmentWeights);
				saveState();
			}

			function edgeDisableSegmentedStyle() {
				selectedForEditEdges.style('curve-style', 'bezier');
				selectedForEditEdges.data('CurveStyle', 'bezier');
				saveState();
			}

			function moveElementtoBackground(event) {
				selectedForEditNodes.style("z-index", 0);
				selectedForEditNodes.data("ZIndex", 0);
				selectedForEditEdges.style("z-index", 0);
				selectedForEditEdges.data("zOrder", 0);
				saveState();
			}

			function moveElementtoForeground(event) {
				highestZOrder++;
				selectedForEditNodes.style("z-index", highestZOrder);
				selectedForEditNodes.data("ZIndex", highestZOrder);
				selectedForEditEdges.style("z-index", highestZOrder);
				selectedForEditEdges.data("zOrder", highestZOrder);
				saveState();
			}

			function removeBackgroundImageOnNode(event) {
				selectedForEditNodes.removeStyle("background-image");
				selectedForEditNodes.data("BackgroundImage", "");
				saveState();
			}

			function onChangeBackgroundImageOnNode(event) {
				var reader = new FileReader();
				reader.onload = onBackgroundImageReaderLoad;
				reader.readAsDataURL(event.target.files[0]);
				saveState();
			}

			function onBackgroundImageReaderLoad() {
				var img = event.target.result;
				selectedForEditNodes.data('Type', "image");
				selectedForEditNodes.data("BackgroundImage", img);
				selectedForEditNodes.style("background-image", img);
				saveState();
			}

			function editNodeWidth() {
				var width = document.getElementById(parent + "-width").value;
				selectedForEditNodes.data('Width', width);
				saveState();
			}

			function editNodeHeight() {
				var height = document.getElementById(parent + "-height").value;
				selectedForEditNodes.data('Height', height);
				saveState();
			}

			function editNodeType() {
				var type = document.getElementById(parent + "-type-node").value;
				selectedForEditNodes.data('Type', type);
				saveState();
			}

			function cBioPortal() {
				var name = document.getElementById(parent + "-node-name").value;
				var link = "http://www.cbioportal.org/cross_cancer.do?cancer_study_id=all&data_priority=0&patient_case_select=sample&gene_set_choice=user-defined-list&gene_list="
						+ name + "&clinical_param_selection=null&tab_index=tab_visualize&Action=Submit&Action=Submit#crosscancer/overview/0/" + name
						+ "/sarc_mskcc,sarc_tcga,thyroid_mskcc_2016,acc_tcga,chol_jhu_2013,chol_nccs_2013,chol_nus_2012,chol_tcga,gbc_shanghai_2014,blca_bgi,blca_dfarber_mskcc_2014,blca_mskcc_solit_2012,blca_mskcc_solit_2014,blca_tcga,blca_tcga_pub,mm_broad,es_dfarber_broad_2014,es_iocurie_2014,coadread_genentech,coadread_mskcc,coadread_tcga,coadread_tcga_pub,brca_bccrc,brca_bccrc_xenograft_2014,brca_broad,brca_sanger,brca_tcga,brca_tcga_pub,brca_tcga_pub2015,cesc_tcga,lgg_tcga,lgg_ucsf_2014,lgggbm_tcga_pub,pcpg_tcga,escc_icgc,escc_ucla_2014,egc_tmucih_2015,hnsc_broad,hnsc_jhu,hnsc_tcga,hnsc_tcga_pub,npc_nusingapore,lihc_amc_prv,lihc_riken,lihc_tcga,paac_jhu_2014,paad_icgc,paad_tcga,paad_utsw_2015,panet_jhu_2011,meso_tcga,nepc_wcm,prad_broad,prad_broad_2013,prad_mich,prad_mskcc,prad_mskcc_2014,prad_mskcc_cheny1_organoids_2014,prad_su2c_2015,prad_tcga,prad_tcga_pub,cscc_dfarber_2015,rms_nih_2014,tgct_tcga,tet_nci_2014,thca_tcga,thca_tcga_pub,ucec_tcga,ucec_tcga_pub,all_stjude_2015,laml_tcga,laml_tcga_pub,nbl_amc_2012,mbl_broad_2012,mbl_icgc,mbl_pcgp,esca_broad,esca_tcga,stad_pfizer_uhongkong,stad_tcga,stad_tcga_pub,stad_uhongkong,stad_utokyo,uvm_tcga,acyc_mskcc,ccrcc_irc_2014,ccrcc_utokyo_2013,kirc_bgi,kirc_tcga,kirc_tcga_pub,nccrcc_genentech_2014,sclc_clcgp,sclc_jhu,sclc_ucologne_2015,luad_broad,luad_mskcc_2015,luad_tcga,luad_tcga_pub,luad_tsp,lusc_tcga,lusc_tcga_pub,cellline_ccle_broad,cellline_nci60,scco_mskcc,mpnst_mskcc,skcm_broad,skcm_broad_dfarber,skcm_tcga,skcm_yale,desm_broad_2015,thym_tcga,ucs_jhu_2014,ucs_tcga,gbm_tcga,gbm_tcga_pub,gbm_tcga_pub2013,kich_tcga,kich_tcga_pub,kirp_tcga,dlbc_tcga,pcnsl_mayo_2015,ov_tcga,ov_tcga_pub";
				window.open(link, "_blank");

			}
			function editNodeName() {
				var cy = $('#' + parent + '-cy').cytoscape('get');
				var name = document.getElementById(parent + "-node-name").value;
				if (name.indexOf(',') === -1){
					selectedForEditNodes.data('name', name);
				}
				else {
					var node = [];
					var names = name.split(',');
					for (var i = 0; selectedForEditNodes.length > i; i++) {
						selectedForEditNodes[i].data("Type", "bundleOne");
						var xGap = 0;
						var yGap = 0;
						for (var j = 0; names.length > j; j++) {
							if (j % 5 == 0) {
								xGap = 0
								yGap += 10
							} else {
								xGap += 10
							}
							var newPositionX = selectedForEditNodes[i].position("x") + xGap;
							var newPositionY = selectedForEditNodes[i].position("y") + yGap;
							node.push({
								group: "nodes",
								data: {
									LabelSize: 10,
									Type: "circle",
									Valign: "Middle",
									Width: 10,
									Height: 10,
									id: "n" + nodeCounter,
									name: names[j],
									selected: false,
									BackgroundImage: "",
									ZIndex: 0,
									parent: selectedForEditNodes[i].data("id")

								},
								position: {
									x: newPositionX,
									y: newPositionY
								}
							})
							nodeCounter++;
						}
						cy.add(node);
						postAddProcessing();
						selectedForEditNodes[i].descendants().ungrabify();
						
					}
				}
				saveState();
			}

			function editNodeMut() {
				var Mut = document.getElementById(parent + "-mut").value;
				selectedForEditNodes.data('Mut', Mut);
				saveState();
			}

			function editNodeCnv() {
				var Cnv = document.getElementById(parent + "-cnv").value;
				selectedForEditNodes.data('Cnv', Cnv);
				saveState();
			}

			function editNodeRna() {
				var Rna = document.getElementById(parent + "-rna").value;
				selectedForEditNodes.data('Cnv', Rna);
				saveState();
			}

			function editPersonId() {
				id = document.getElementById(parent + "-configure-person-id").value;
				setPersonId(id);
			}

			function setPersonId(id) {
				personId = id;
				var title = document.getElementById(parent + "-pathway-title")
				title.innerHTML = pathName + " <small>" + personId + "</small>";
			}

			function dialogNewPathwayOpen(event) {
				dialogNewPathway.dialog("open");
			}

			function dialogBundleOpen(event) {
				dialogBundle.dialog("open");
			}

			function dialogPathfindOpen(event) {
				dialogPathfind.dialog("open");
			}

			function dialogPathwaySaveAsOpen(event) {
				dialogPathwaySaveAs.dialog("open");
			}

			function dialogPathwayConfigureOpen(event) {
				dialogPathwayConfigure.dialog("open");
			}

			function findObject(event) {
				var val = event.target.value;
				$.post(services['objectFinder'], {
					pattern: JSON.stringify(coloredNodes)
				}, function (data) {
					if (data == "[]")
						data = '{"X1":{"percentage":0.66667,"Rna_distance":0,"Cnv_distance":0,"Mut_distance":0},"X2":{"percentage":0.33333,"Rna_distance":30.44444,"Cnv_distance":0,"Mut_distance":0},"X9":{"percentage":0.66667,"Rna_distance":0,"Cnv_distance":0,"Mut_distance":0},"X29":{"percentage":0.66667,"Rna_distance":0,"Cnv_distance":0,"Mut_distance":0},"X24":{"percentage":0.33333,"Rna_distance":36,"Cnv_distance":0,"Mut_distance":0},"X34":{"percentage":0.66667,"Rna_distance":0,"Cnv_distance":0,"Mut_distance":0},"X38":{"percentage":0.33333,"Rna_distance":30.44444,"Cnv_distance":0,"Mut_distance":0},"X40":{"percentage":0.66667,"Rna_distance":0,"Cnv_distance":0,"Mut_distance":0},"X45":{"percentage":0.66667,"Rna_distance":36,"Cnv_distance":0,"Mut_distance":0},"X46":{"percentage":0.66667,"Rna_distance":0,"Cnv_distance":0,"Mut_distance":0},"X48":{"percentage":1,"Rna_distance":36,"Cnv_distance":0,"Mut_distance":0},"X53":{"percentage":1,"Rna_distance":0,"Cnv_distance":0,"Mut_distance":0},"X59":{"percentage":0.66667,"Rna_distance":36,"Cnv_distance":0,"Mut_distance":0},"X156":{"percentage":0.33333,"Rna_distance":0,"Cnv_distance":0,"Mut_distance":0},"X15":{"percentage":0.33333,"Rna_distance":0,"Cnv_distance":0,"Mut_distance":2},"X22":{"percentage":0.33333,"Rna_distance":0,"Cnv_distance":0,"Mut_distance":0}}'
					var array = data.split("},");
					for (var i = 0; i < array.length; i++) {
						array[i] = array[i].split(":{");
						array[i][1] = array[i][1].split(",");
						array[i][0] = array[i][0].replace(/\W/g, '');
						for (var j = 0; j < array[i][1].length; j++) {
							array[i][1][j] = array[i][1][j].replace(/[^\d.-]/g, '');
						}
					}

					var table = document.getElementById(parent + "-inner-table");
					var length = document.getElementById(parent + "-inner-table").rows.length;
					for (var n = 0; n < length; n++) {
						table.deleteRow(0);
					}
					for (var n = 0; n <= array.length; n++) {
						var row = table.insertRow();

						var name = row.insertCell(0)
						var percentage = row.insertCell(1);
						var RnaDistance = row.insertCell(2);
						var CnvDistance = row.insertCell(3);
						var MutDistance = row.insertCell(4);

						// Add some text to the new cells:

						if (n == 0) {
							name.innerHTML = "<i><h3>name</h3></i>";
							percentage.innerHTML = "<i><h3>percentage</h3></i>";
							RnaDistance.innerHTML = "<i><h3>Rna</h3></i>";
							CnvDistance.innerHTML = "<i><h3>Cnv</h3></i>";
							MutDistance.innerHTML = "<i><h3>Mut</h3></i>";
						} else {
							name.innerHTML = array[n - 1][0];
							percentage.innerHTML = array[n - 1][1][0];
							RnaDistance.innerHTML = array[n - 1][1][1];
							CnvDistance.innerHTML = array[n - 1][1][2];
							MutDistance.innerHTML = array[n - 1][1][3];
						}
					}
					//document.getElementById(parent + "-dialog-table").innerHTML = data;
					dialogTable.dialog("open")
				});
			}

			function visualPathway(obj) {
				$('#' + parent + '-cy').cytoscape({
					style: cytoscape.stylesheet()
							// node elements default css (unselected state)
							.selector('node').css({
						'content': 'data(name)',
						'padding-left': 2,
						'padding-right': 2,
						'font-family': 'data(LabelSize)',
						'background-image-opacity': .9,
						'opacity': 0.9,
						'text-opacity': 0.9
					}).selector('node[Type="nType1"]').css({
						'shape': 'roundrectangle',
						'background-color': 'lightgray',
						'color': 'black',
						'text-valign': 'center',
						'border-color': 'black',
						'border-style': 'solid',
						'border-width': 1
					}).selector('node[Type="nType2"]').css({
						'shape': 'roundrectangle',
						'background-color': 'gray',
						'color': 'black',
						'text-valign': 'center',
						'border-color': 'black',
						'border-style': 'solid',
						'border-width': 1
					}).selector('node[Type="nType3"]').css({
						'shape': 'ellipse',
						'width': 'data(Width)',
						'height': 'data(Height)',
						'color': 'black',
						'text-valign': 'center',
						'background-color': 'white',
						'border-color': 'black',
						'border-style': 'solid',
						'border-width': 1
					}).selector('node[Type="nType4"]').css({
						'shape': 'ellipse',
						'width': 'data(Width)',
						'height': 'data(Height)',
						'color': 'black',
						'text-valign': 'center',
						'background-color': 'white',
						'border-color': 'black',
						'border-style': 'solid',
						'border-width': 1
					}).selector('node[Type="nType5"]').css({
						'shape': 'rectangle',
						'width': 'data(Width)',
						'height': 'data(Height)',
						'color': 'black',
						'text-valign': 'center',
						'background-color': 'white',
						'border-color': 'black',
						'border-style': 'solid',
						'border-width': 1
					}).selector('node[Type="nType6"]').css({
						'shape': 'circle',
						'radius': 5,
						'color': 'black',
						'text-valign': 'center',
						'background-color': 'white',
						'border-color': 'black',
						'border-style': 'dotted',
						'border-width': 1
					}).selector('node[Type="nType7"]').css({
						'shape': 'circle',
						'radius': 5,
						'color': 'black',
						'text-valign': 'center',
						'background-color': 'white',
						'border-color': 'black',
						'border-style': 'dashed',
						'border-width': 1
					}).selector('node[Type="nType8"]').css({
						'shape': 'rectangle',
						'width': 'data(Width)',
						'height': 'data(Height)',
						'color': 'black',
						'text-valign': 'center',
						'background-color': 'white',
						'border-color': 'black',
						'border-style': 'dashed',
						'border-width': 1
					}).selector('node[Type="nType9"]').css({
						'shape': 'rectangle',
						'width': 'data(Width)',
						'height': 'data(Height)',
						'color': 'black',
						'text-valign': 'center',
						'background-color': 'white',
						'border-color': 'black',
						'border-style': 'dotted',
						'border-width': 1
					}).selector('node[Type="nType10"]').css({
						'shape': 'rectangle',
						'width': 'data(Width)',
						'height': 'data(Height)',
						'color': 'black',
						'text-valign': 'center',
						'background-color': 'white',
						'border-color': 'black',
						'border-style': 'double',
						'border-width': 1
					}).selector('node[Type="nType11"]').css({
						'shape': 'roundrectangle',
						'width': 'data(Width)',
						'height': 'data(Height)',
						'color': 'black',
						'text-valign': 'center',
						'background-color': 'white',
						'border-color': 'black',
						'border-style': 'solid',
						'border-width': 1
					}).selector('node[Type="nType12"]').css({
						'shape': 'triangle',
						'width': 'data(Width)',
						'height': 'data(Height)',
						'color': 'black',
						'text-valign': 'center',
						'background-color': 'white',
						'border-color': 'black',
						'border-style': 'solid',
						'border-width': 1
					}).selector('node[Type="nType13"]').css({
						'shape': 'rectangle',
						'width': 'data(Width)',
						'height': 'data(Height)',
						'color': 'black',
						'text-valign': 'center',
						'background-color': 'white',
						'border-color': 'black',
						'border-style': 'solid',
						'border-width': 1
					}).selector('node[Type="nType14"]').css({
						'shape': 'circle',
						'width': 'data(Width)',
						'height': 'data(Height)',
						'color': 'black',
						'text-valign': 'center',
						'background-color': 'white',
						'border-color': 'black',
						'border-style': 'solid',
						'border-width': 1
					}).selector('node[Type="nType15"]').css({
						'shape': 'ellipse',
						'width': 'data(Width)',
						'height': 'data(Height)',
						'color': 'black',
						'text-valign': 'center',
						'background-color': 'white',
						'border-color': 'black',
						'border-style': 'solid',
						'border-width': 1
					}).selector('node[Type="nType16"]').css({
						'shape': 'pentagon',
						'width': 'data(Width)',
						'height': 'data(Height)',
						'color': 'black',
						'text-valign': 'center',
						'background-color': 'white',
						'border-color': 'black',
						'border-style': 'solid',
						'border-width': 1
					}).selector('node[Type="nType17"]').css({
						'shape': 'hexagon',
						'width': 'data(Width)',
						'height': 'data(Height)',
						'color': 'black',
						'text-valign': 'center',
						'background-color': 'white',
						'border-color': 'black',
						'border-style': 'solid',
						'border-width': 1
					}).selector('node[Type="nType18"]').css({
						'shape': 'heptagon',
						'width': 'data(Width)',
						'height': 'data(Height)',
						'color': 'black',
						'text-valign': 'center',
						'background-color': 'white',
						'border-color': 'black',
						'border-style': 'solid',
						'border-width': 1
					}).selector('node[Type="nType19"]').css({
						'shape': 'octagon',
						'width': 'data(Width)',
						'height': 'data(Height)',
						'color': 'black',
						'text-valign': 'center',
						'background-color': 'white',
						'border-color': 'black',
						'border-style': 'solid',
						'border-width': 1
					}).selector('node[Type="nType20"]').css({
						'shape': 'star',
						'width': 'data(Width)',
						'height': 'data(Height)',
						'color': 'black',
						'text-valign': 'center',
						'background-color': 'white',
						'border-color': 'black',
						'border-style': 'solid',
						'border-width': 1
					}).selector('node[Type="nType21"]').css({
						'shape': 'diamond',
						'width': 'data(Width)',
						'height': 'data(Height)',
						'color': 'black',
						'text-valign': 'center',
						'background-color': 'white',
						'border-color': 'black',
						'border-style': 'solid',
						'border-width': 1
					}).selector('node[Type="nType22"]').css({
						'shape': 'vee',
						'width': 'data(Width)',
						'height': 'data(Height)',
						'color': 'black',
						'text-valign': 'center',
						'background-color': 'white',
						'border-color': 'black',
						'border-style': 'solid',
						'border-width': 1
					}).selector('node[Type="nType23"]').css({
						'shape': 'rhomboid',
						'width': 'data(Width)',
						'height': 'data(Height)',
						'color': 'black',
						'text-valign': 'center',
						'background-color': 'white',
						'border-color': 'black',
						'border-style': 'solid',
						'border-width': 1
					}).selector('node[Type="nType24"]').css({
						'shape': 'rectangle',
						'width': 'data(Width)',
						'height': 'data(Height)',
						'color': 'black',
						'text-valign': 'center',
						'background-color': 'white',
						'border-color': 'white',
						'border-style': 'solid',
						'border-width': 1
					}).selector('node[Type="nType25"]').css({
						'shape': 'diamond',
						'width': 'data(Width)',
						'height': 'data(Height)',
						'color': 'black',
						'text-valign': 'center',
						'background-color': 'white',
						'border-color': 'black',
						'border-style': 'solid',
						'border-width': 1
					}).selector('node[Type="image"]').css({
						'shape': 'rectangle',
						'width': 'data(Width)',
						'height': 'data(Height)',
						'color': 'black',
						'text-valign': 'center',
						'background-opacity': 0,
						'border-color': 'white',
						'border-style': 'solid',
						'border-width': 1,
						'background-fit': 'contain'
					}).selector('node[Shape="Brace"]').css({
						'shape': 'rectangle',
						'width': '1',
						'height': 'data(Width)',
						'background-color': 'black',
						'color': 'black',
						'border-color': 'black',
						'border-style': 'solid',
						'border-width': 1
					}).selector('node[Rna < 0]').css({
						'background-color': 'lightgreen',
						'color': 'black'
					}).selector('node[Rna > 0]').css({
						'background-color': 'lightsalmon',
						'color': 'black'
					}).selector('node[Cnv < 0]').css({
						'border-color': 'mediumpurple',
						'border-width': 3
					}).selector('node[Cnv > 0]').css({
						'border-color': 'red',
						'border-width': 3
					}).selector('node[Mut > 0]').css({
						'shadow-opacity': 1,
						'shadow-color': 'red',
						'border-width': 1
					}).selector('node[PA > 0]').css({
						'text-valign': 'center',
						'text-outline-color': '#ff0000',
						'text-outline-width': 1
					}).selector('node[PA < 0]').css({
						'text-valign': 'center',
						'text-outline-color': '#00ff00',
						'text-outline-width': 1
					})
							// edge elements default css (unselected)
							.selector('edge').css({
						'line-color': 'black',
						'line-style': 'solid',
						'opacity': 0.9,
						'text-opacity': 0.9,
						'width': 1
					}).selector('edge[EndArrow="alType1"]').css({
						'target-arrow-shape': 'line',
						'target-arrow-color': 'black',
						'target-arrow-fill': 'filled'
					}).selector('edge[EndArrow="alType2"]').css({
						'target-arrow-shape': 'triangle',
						'target-arrow-color': 'black',
						'target-arrow-fill': 'filled'
					}).selector('edge[EndArrow="alType3"]').css({
						'target-arrow-shape': 'tee',
						'target-arrow-color': 'black',
						'target-arrow-fill': 'filled'
					}).selector('edge[EndArrow="alType4"]').css({
						'target-arrow-shape': 'diamond',
						'target-arrow-color': 'black',
						'target-arrow-fill': 'filled'
					}).selector('edge[Type="elType1"]').css({
						'line-style': 'solid'
					}).selector('edge[Type="elType2"]').css({
						'line-style': 'dashed'
					}).selector('edge[Type="elType3"]').css({
						'line-style': 'dotted'
					})

							// node & edge elements (selected state)
							.selector('edge:selected').css({
						'background-color': 'green',
						'line-color': 'green',
						'target-arrow-color': 'green',
						'source-arrow-color': 'green',
						'opacity': 1.0,
						'text-opacity': 1.0
					}).selector('node:selected').css({
						'background-color': 'green',
						'opacity': 1.0,
						'text-opacity': 1.0
					})

							// query purpose
							.selector('.green_bg').css({
						'background-color': 'lightgreen',
						'color': 'black'
					}).selector('.red_bg').css({
						'background-color': 'lightsalmon',
						'color': 'black'
					}).selector('.white_bg').css({
						'background-color': 'white',
						'color': 'black'
					}).selector('.purple_border').css({
						'border-color': 'mediumpurple',
						'border-width': 3
					}).selector('.red_border').css({
						'border-color': 'red',
						'border-width': 3
					}).selector('.black_border').css({
						'border-color': 'black',
						'border-width': 3
					}).selector('.red_shadow').css({
						'shadow-opacity': 1,
						'shadow-color': 'red',
						'border-width': 1
					}).selector('.no_shadow').css({
						'shadow-opacity': 0,
						'shadow-color': 'red',
						'border-width': 1
					})

					// collapse
					.selector('.collapsed').css({
						'opacity': 0.01,
						'width': .01,
						'height': .01
					}).selector('.collapsed_informative').css({
						'shape': 'circle',
						'width': 6,
						'height': 6,
						'text-opacity': 0,
						'border-color': 'black',
						'border-style': 'solid',
						'border-width': 1
					}).selector('.unfocused').css({
						'opacity': 0.2
					}).selector('.focused').css({
						'opacity': 1.0
					}),
					layout: {
						name: 'preset',
						padding: 10
					},
					ready: function () {
						var cy = $('#' + parent + '-cy').cytoscape('get');

						preAddProcessing(obj);

						$('#' + parent + '-select-bundleOne').removeClass('disabled');
						$('#' + parent + '-add-node').removeClass('disabled');
						$('#' + parent + '-add-edge').removeClass('disabled');
						$('#' + parent + '-delete-elements').removeClass('disabled');
						$('#' + parent + '-bundle').removeClass('disabled');
						$('#' + parent + '-unbundle').removeClass('disabled');
						$('#' + parent + '-collapse').removeClass('disabled');
						$('#' + parent + '-collapse-informative').removeClass('disabled');
						$('#' + parent + '-expand-informative').removeClass('disabled');
						$('#' + parent + '-expand').removeClass('disabled');
						$('#' + parent + '-findpath').removeClass('disabled');
						$('#' + parent + '-find-object').removeClass('disabled');
						$('#' + parent + '-pathway-save').removeClass('disabled');
						$('#' + parent + '-pathway-saveAs').removeClass('disabled');
						$('#' + parent + '-produce-JSON').removeClass('disabled');
						$('#' + parent + '-undo').removeClass('disabled');
						$('#' + parent + '-redo').removeClass('disabled');
						$('#' + parent + '-duplicate-nodes').removeClass('disabled');
						$('#' + parent + '-config-pathway').removeClass('disabled');
						$('#' + parent + '-find-paths-all-drop').removeClass('disabled');

						cy.add(obj.elements);
						cy.center();
						cy.fit();

						postAddProcessing();

						// custom events
						var tappedBefore = null;
						cy.on('tap', function (event) {
							var tappedNow = event.cyTarget;
							setTimeout(function () {
								tappedBefore = null;
							}, 300);
							if (tappedBefore === tappedNow) {
								tappedNow.trigger('doubleTap');
								tappedBefore = null;
							} else {
								tappedBefore = tappedNow;
							}
						});

						// custom event handlers
						cy.on('click', 'node', function (event) {
							if (orderedSelectedNodes.length < 2)
								orderedSelectedNodes.push(event.cyTarget);
							else
								orderedSelectedNodes.shift();
							orderedSelectedNodes.push(event.cyTarget);
						});

						cy.on('cxttap', 'node', function (event) {
							target = event.cyTarget;
							target.select();
							selectedForEditNodes = cy.$('node:selected');
							dialogNode.dialog("open");
							console.log(target.data('id'));
						});
						cy.on('cxttap', 'edge', function (event) {
							target = event.cyTarget;
							target.select();
							selectedForEditEdges = cy.$('edge:selected');
							dialogEdge.dialog("open");
							console.log(target.data('id'));
						});

						cy.on('doubleTap', 'node', function (event) {
						});

						cy.on('doubleTap', 'edge', function (event) {
						});

						cy.on('select', 'node', function (event) {
							selectedForEditNodes = cy.$('node:selected');
							//			    	saveState();
						});

						cy.on('unselect', 'node', function (event) {
							selectedForEditNodes = cy.$('node:selected');
							//			    	saveState();
						});

						cy.on('select', 'edge', function (event) {
							selectedForEditEdges = cy.$('edge:selected');
							//			    	saveState();
						});

						cy.on('unselect', 'edge', function (event) {
							selectedForEditEdges = cy.$('edge:selected');
							//			    	saveState();
						});

						cy.on('data', 'node', function (event) {
							//					saveState();
						});

						cy.on('style', 'node', function (event) {
							//					saveState();
						});

						cy.on('grab', 'node', function () {
							if (this.hasClass("collapsed") || this.hasClass("collapsed_informative")) {
								this.ungrabify();
							}

							if (this.isParent() && this.children().length > 0) {
								this.grabify();
							}
						});

						cy.on('free', 'node', function () {
							if (this.hasClass("collapsed") || this.hasClass("collapsed_informative")) {
								this.grabify();
							}
						});

						saveState();
						if (typeof (self.sprayData) != "undefined")
							sprayColor(self.sprayData);
					},
					// initial viewport state:
					zoom: 1,
					pan: {
						x: 0,
						y: 0
					},
					// interaction options:
					minZoom: 1e-50,
					maxZoom: 1e50,
					zoomingEnabled: true,
					userZoomingEnabled: true,
					panningEnabled: true,
					userPanningEnabled: true,
					boxSelectionEnabled: true,
					selectionType: 'additive',
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
					wheelSensitivity: 0.2,
					pixelRatio: 1,
					initrender: function (evt) {/* ... */
					},
					renderer: {/* ... */}
				});
			}

			dialogTable = $("#" + parent + "-dialog-table").dialog({
				autoOpen: false,
				height: 300,
				width: 350,
				buttons: {
					Cancel: function () {
						dialogTable.dialog("close");
						var cy = $('#' + parent + '-cy').cytoscape('get');
						cy.$('node').removeClass('unfocused');
						cy.$('edge').removeClass('unfocused');
						cy.$('node').removeClass('focused');
						cy.$('edge').removeClass('focused');
					}
				},
				close: function () {
					var cy = $('#' + parent + '-cy').cytoscape('get');
					cy.$('node').removeClass('unfocused');
					cy.$('edge').removeClass('unfocused');
					cy.$('node').removeClass('focused');
					cy.$('edge').removeClass('focused');
				}
			});

			dialogNode = $("#" + parent + "-dialog-form-node").dialog({
				open: function (event) {
					if (!target.isParent()) {
						document.getElementById(parent + "-select-bundleOne").disabled = true;
						document.getElementById(parent + "-select-bundleTwo").disabled = true;
						document.getElementById(parent + "-select-gene").disabled = false;
						document.getElementById(parent + "-select-geneProduct").disabled = false;
						document.getElementById(parent + "-select-protein").disabled = false;
						document.getElementById(parent + "-select-rna").disabled = false;
						document.getElementById(parent + "-select-mircoRna").disabled = false;
						document.getElementById(parent + "-select-kinase").disabled = false;
						document.getElementById(parent + "-select-ligand").disabled = false;
						document.getElementById(parent + "-select-receptor").disabled = false;
						document.getElementById(parent + "-select-transcriptionFactor").disabled = false;
						document.getElementById(parent + "-select-label").disabled = true;
						document.getElementById(parent + "-select-triangle").disabled = false;
						document.getElementById(parent + "-select-rectangle").disabled = false;
						document.getElementById(parent + "-select-circle").disabled = false;
						document.getElementById(parent + "-select-ellipse").disabled = false;
						document.getElementById(parent + "-select-pentagon").disabled = false;
						document.getElementById(parent + "-select-hexagon").disabled = false;
						document.getElementById(parent + "-select-heptagon").disabled = false;
						document.getElementById(parent + "-select-octagon").disabled = false;
						document.getElementById(parent + "-select-star").disabled = false;
						document.getElementById(parent + "-select-diamond").disabled = false;
						document.getElementById(parent + "-select-vee").disabled = false;
						document.getElementById(parent + "-select-rhomboid").disabled = false;
						document.getElementById(parent + "-select-label").disabled = false;
					} else {
						document.getElementById(parent + '-select-bundleOne').disabled = false;
						document.getElementById(parent + '-select-bundleTwo').disabled = false;
						document.getElementById(parent + "-select-gene").disabled = true;
						document.getElementById(parent + "-select-geneProduct").disabled = true;
						document.getElementById(parent + "-select-protein").disabled = true;
						document.getElementById(parent + "-select-rna").disabled = true;
						document.getElementById(parent + "-select-mircoRna").disabled = true;
						document.getElementById(parent + "-select-kinase").disabled = true;
						document.getElementById(parent + "-select-ligand").disabled = true;
						document.getElementById(parent + "-select-receptor").disabled = true;
						document.getElementById(parent + "-select-biologicalProcess").disabled = true;
						document.getElementById(parent + "-select-transcriptionFactor").disabled = true;
						document.getElementById(parent + "-select-triangle").disabled = true;
						document.getElementById(parent + "-select-rectangle").disabled = true;
						document.getElementById(parent + "-select-circle").disabled = true;
						document.getElementById(parent + "-select-ellipse").disabled = true;
						document.getElementById(parent + "-select-pentagon").disabled = true;
						document.getElementById(parent + "-select-hexagon").disabled = true;
						document.getElementById(parent + "-select-heptagon").disabled = true;
						document.getElementById(parent + "-select-octagon").disabled = true;
						document.getElementById(parent + "-select-star").disabled = true;
						document.getElementById(parent + "-select-diamond").disabled = true;
						document.getElementById(parent + "-select-vee").disabled = true;
						document.getElementById(parent + "-select-rhomboid").disabled = true;
						document.getElementById(parent + "-select-label").disabled = true;
					}
					document.getElementById(parent + "-node-name").value = target.data('name');
					document.getElementById(parent + "-width").value = target.data('Width');
					document.getElementById(parent + "-height").value = target.data('Height');
					document.getElementById(parent + "-type-node").value = target.data('Type');
					if (typeof (target.data('Rna')) != "undefined")
						document.getElementById(parent + "-rna").value = target.data('Rna');
					else
						document.getElementById(parent + "-rna").value = '0';

					if (typeof (target.data('Cnv')) != "undefined")
						document.getElementById(parent + "-cnv").value = target.data('Cnv');
					else
						document.getElementById(parent + "-cnv").value = '0';

					if (typeof (target.data('Mut')) != "undefined")
						document.getElementById(parent + "-mut").value = target.data('Mut');
					else
						document.getElementById(parent + "-p").value = '0';

					if (typeof (target.data('P')) != "undefined")
						document.getElementById(parent + "-p").value = target.data('P');
					else
						document.getElementById(parent + "-p").value = '0';

					if (typeof (target.data('M')) != "undefined")
						document.getElementById(parent + "-m").value = target.data('M');
					else
						document.getElementById(parent + "-m").value = '0';

					if (typeof (target.data('PA')) != "undefined")
						document.getElementById(parent + "-pa").value = target.data('PA');
					else
						document.getElementById(parent + "-pa").value = '0';
				},
				autoOpen: false,
				height: 500,
				width: 600,
				resizable: false,
				buttons: {
					Cancel: function () {
						dialogNode.dialog("close");
					}
				},
				close: function () {
				}
			});

			dialogEdge = $("#" + parent + "-dialog-form-edge").dialog({
				autoOpen: false,
				height: 500,
				width: 600,
				resizable: false,
				buttons: {
					Cancel: function () {
						dialogEdge.dialog("close");
					}
				},
				close: function () {
				}
			});

			dialogPathfind = $("#" + parent + "-dialog-form-find-path").dialog({
				open: function (event) {
					document.getElementById(parent + "-sid").value = orderedSelectedNodes[0]._private.data['name'];
					document.getElementById(parent + "-vid").value = orderedSelectedNodes[1]._private.data['name'];
				},
				autoOpen: false,
				height: 300,
				width: 350,
				buttons: {
					Cancel: function () {
						dialogPathfind.dialog("close");
						var cy = $('#' + parent + '-cy').cytoscape('get');
						cy.$('node').removeClass('unfocused');
						cy.$('edge').removeClass('unfocused');
						cy.$('node').removeClass('focused');
						cy.$('edge').removeClass('focused');
					}
				},
				close: function () {
				}
			});

			dialogPathwayConfigure = $("#" + parent + "-dialog-form-configure-pathway").dialog({
				open: function (event) {
					document.getElementById(parent + "-configure-person-id").value = personId;
				},
				autoOpen: false,
				height: 300,
				width: 350,
				buttons: {
					Cancel: function () {
						dialogPathwayConfigure.dialog("close");
					}
				},
				close: function () {
				}
			});

			dialogPathwaySaveAs = $("#" + parent + "-dialog-form-save-as-pathway").dialog({
				autoOpen: false,
				height: 300,
				width: 350,
				buttons: {
					"submit": saveAsPathway,
					Cancel: function () {
						dialogPathwaySaveAs.dialog("close");
					}
				},
				close: function () {
				}
			});

			dialogNewPathway = $("#" + parent + "-dialog-form-new-pathway").dialog({
				autoOpen: false,
				height: 300,
				width: 350,
				buttons: {
					"submit": newPathway,
					Cancel: function () {
						dialogNewPathway.dialog("close");
					}
				},
				close: function () {
				}
			});

			dialogBundle = $("#" + parent + "-dialog-bundle").dialog({
				autoOpen: false,
				height: 300,
				width: 350,
				buttons: {
					"submit": bundle,
					Cancel: function () {
						dialogBundle.dialog("close");
					}
				},
				close: function () {
				}
			});

			refreshPathwayList();

			//load data local
			document.getElementById(parent + '-file-pathway').addEventListener('change', onChangePathwayFile);
			document.getElementById(parent + '-file-coloring').addEventListener('change', onChangeColoringFile);

			//edit node(s)
			document.getElementById(parent + '-background-image').addEventListener('change', onChangeBackgroundImageOnNode);
			document.getElementById(parent + '-background-image-remove').addEventListener('click', removeBackgroundImageOnNode);
			document.getElementById(parent + '-node-move-to-background').addEventListener('click', moveElementtoBackground);
			document.getElementById(parent + '-node-move-to-foreground').addEventListener('click', moveElementtoForeground);
			document.getElementById(parent + '-node-name-apply').addEventListener('click', editNodeName);
			document.getElementById(parent + '-node-name-cbio').addEventListener('click', cBioPortal);
			document.getElementById(parent + '-height-apply').addEventListener('click', editNodeHeight);
			document.getElementById(parent + '-width-apply').addEventListener('click', editNodeWidth);
			document.getElementById(parent + '-type-node-apply').addEventListener('click', editNodeType);
			document.getElementById(parent + '-rna-apply').addEventListener('click', editNodeRna);
			document.getElementById(parent + '-cnv-apply').addEventListener('click', editNodeCnv);
			document.getElementById(parent + '-mut-apply').addEventListener('click', editNodeMut);

			//edit edge(s)
			document.getElementById(parent + '-edge-move-to-background').addEventListener('click', moveElementtoBackground);
			document.getElementById(parent + '-edge-move-to-foreground').addEventListener('click', moveElementtoForeground);
			document.getElementById(parent + '-direction-apply').addEventListener('click', editEdgeDirection);
			document.getElementById(parent + '-arrow-type-edge-apply').addEventListener('click', editEdgeArrowType);
			document.getElementById(parent + '-line-type-edge-apply').addEventListener('click', editEdgeLineType);
			document.getElementById(parent + '-apply-curve-changes').addEventListener('click', toggleEdgeStyle);

			//edit pathway settings
			document.getElementById(parent + '-apply-configure-person-id').addEventListener('click', editPersonId);

			document.getElementById(parent + '-new-pathway').addEventListener('click', dialogNewPathwayOpen);
			document.getElementById(parent + '-findpath').addEventListener('click', dialogPathfindOpen);
			document.getElementById(parent + '-find-object').addEventListener('click', findObject);
			document.getElementById(parent + '-pathway-selector').addEventListener('change', onSelect);
			document.getElementById(parent + '-pathway-saveAs').addEventListener('click', dialogPathwaySaveAsOpen);
			document.getElementById(parent + '-pathway-save').addEventListener('click', savePathway);
			document.getElementById(parent + '-delete-elements').addEventListener('click', removeElements);
			document.getElementById(parent + '-add-node').addEventListener('click', addNode);
			document.getElementById(parent + '-add-edge').addEventListener('click', addEdge);
			document.getElementById(parent + '-expand-informative').addEventListener('click', expandBundleInformative);
			document.getElementById(parent + '-collapse-informative').addEventListener('click', collapseBundleInformative);
			document.getElementById(parent + '-expand').addEventListener('click', expandBundle);
			document.getElementById(parent + '-collapse').addEventListener('click', collapseBundle);
			document.getElementById(parent + '-bundle').addEventListener('click', dialogBundleOpen);
			document.getElementById(parent + '-unbundle').addEventListener('click', unbundle);
			document.getElementById(parent + '-produce-JSON').addEventListener('click', produceJSON);
			document.getElementById(parent + '-undo').addEventListener('click', undo);
			document.getElementById(parent + '-redo').addEventListener('click', redo);
			document.getElementById(parent + '-duplicate-nodes').addEventListener('click', addDuplicateNodes);
			document.getElementById(parent + '-find-paths-all').addEventListener('click', findPathsAll);
			document.getElementById(parent + '-find-paths-all-drop').addEventListener('click', findPathsAll);
			document.getElementById(parent + '-find-paths-one').addEventListener('click', findPathOne);
			document.getElementById(parent + '-config-pathway').addEventListener('click', dialogPathwayConfigureOpen);

			//search
			document.getElementById(parent + '-search-node-name').addEventListener('keyup', search);
			document.getElementById(parent + '-search-node-name').addEventListener('focusout', exitSearch);

			//external GUI functions (need to fix this I think...)
			self.GUI.loadPathwayExternal = function (id) {
				loadPathway(id);
			}

			self.GUI.sprayColorExternal = function (list) {
				sprayColor(list);
			}

			self.GUI.setDataToSpray = function (data) {
				this.sprayData = data;
			};

			self.GUI.setPersonId = function (data) {
				setPersonId(data);
			};
		});
	};
}	

var VQI_PathwayEditorTester = function () {
	self = this;
	// test super class	
	
	// generic assert function for testing
	function assert(a, b) {
		if (a != b)
			return false;
		else
			return true;
	}
	self.GUI = function(){
		// test GUI		
		function setup(){};
	
		function teardown(){};
		
		self.GUI.runTests = function(){
			// will run through all tests and return those that failed
		}
	}
	
	self.NoGUI = function(){
		// test No GUI
		function setup(){};
	
		function teardown(){};
		
		self.NoGUI.runTests = function(){
			// will run through all tests and return those that failed
		}
	}
}
