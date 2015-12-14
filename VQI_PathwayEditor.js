var VQI_PathwayEditor = function (parent) {

    var self = this;

    //Web services
//	var serverURL = "http://cardinal3.engr.uconn.edu/pathwayVisual/";
    var services = {};

    /* Yue's Local Server*/
    services['pathwayFinder'] = 'http://cardinal3.engr.uconn.edu/pathwayVisual/PathwayParser/ajaxJSON.php';
    services['pathwaySaver'] = 'http://cardinal3.engr.uconn.edu/pathwayVisual/PathwayParser/updateDB_json.php';
    services['pathwayScorer'] = 'http://cardinal3.engr.uconn.edu/pathwayVisual/ScoreSystem/getScore.php';
    /* Yue's local server URLs end here */

    /* Tham's local server */
    services['pathwayWeightedScorer'] = 'http://137.99.11.122/pathway2/pathwayweightedscorer.php';
    services['objectFinder'] = 'http://137.99.11.122/pathway2/qsys_json.php';
    /* Tham's local server URL end here */

    /* BIBCI Server */
//    services['pathwayFinder'] = 'http://bibci.engr.uconn.edu/yuz12012/pathwayVisual//PathwayParser/ajaxJSON.php';
//    services['pathwaySaver'] = 'http://bibci.engr.uconn.edu/yuz12012/pathwayVisual//PathwayParser/updateDB_json.php';
//    services['pathwayScorer'] = 'http://bibci.engr.uconn.edu/yuz12012/pathwayVisual/ScoreSystem/getScore.php';
//    services['pathwayWeightedScorer'] = 'http://bibci.engr.uconn.edu/thh13003/pathway2/pathwayweightedscorer.php';
//    services['objectFinder'] = 'http://bibci.engr.uconn.edu/thh13003/pathway2/qsys_json.php';


    // Globals
    var states = [];
    var types = ["bundleOne", "bundleTwo", "gene", "geneProduct", "protein", "rna", "microRNA", "kinase", "ligand", "receptor", "biologicalProcess", "triangle", "ellipse", "pentagon", "hexagon", "heptagon", "octagon", "star", "diamond", "vee", "rhomboid", "label"];
    var stateRecycle = [];
    var lastEvent = 0;
    var selectedForQueryNodes = [];
    var selectedForEditNodes = [];
    var selectedForEditEdges = [];
    var orderedSelectedNodes = [];
    var grabbedCollapsedForEditNodes = [];
    var coloredNodes = [];
    var edgeCounter = 0;
    var nodeCounter = 0;
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
    strVar += " 	<a class=\"navbar-brand\" href=\"#\">Pathway name</a>";
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
    strVar += "					<li><input id=\"" + parent + "-collapse\" value=\"Collapse\" type=\"button\" class=\"btn btn-link disabled\"><\/input><\/li>";
    strVar += "					<li><input id=\"" + parent + "-expand\" value=\"Expand\" type=\"button\" class=\"btn btn-link disabled\"><\/input><\/li>";
    strVar += "				<\/ul>";
    strVar += "			</div>";
    strVar += " 	<\/li>";
    strVar += " 	<li style=\"margin: 2px\">";
    strVar += "			<div class=\"dropdown\">";
    strVar += "  			<button class=\"btn btn-primary dropdown-toggle\" type=\"button\" data-toggle=\"dropdown\">Process<span class=\"caret\"><\/span><\/button>";
    strVar += "				<ul class=\"dropdown-menu\">";
    strVar += "					<li><input id=\"" + parent + "-findpath\" value=\"Find Pathway\" type=\"button\" class=\"btn btn-link disabled\"><\/input><\/li>";
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
    strVar += " <\/ul>";
    strVar += " <\/div>";
    strVar += " <\/nav>";
    strVar += " <div id=\"" + parent + "-dialog-table\" title=\"Result\">";
    strVar += "	<table id=\"" + parent + "-inner-table\" class=\"table table-hover\">";
    strVar += "		<tr>";
    strVar += "         <td>name</td>";
    strVar += "			<td>percentage</td>";
    strVar += "			<td>rna distance</td>";
    strVar += "			<td>cnv distance</td>";
    strVar += "			<td>mut distance</td>";
    strVar += "	</table>";
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
    strVar += " <div id=\"" + parent + "-dialog-bundle\" title=\"Bundle\">";
    strVar += " 		<form role=\"form\">";
    strVar += "    		<fieldset>";
    strVar += "      			<label for=\"" + parent + "-type-bundle\">type:<\/label>";
    strVar += "      			<select style=\"width: 150px\" id=\"" + parent + "-type-bundle\" name=\"" + parent + "-type-bundle\">";
    strVar += "  					<option selected=\"\">bundleOne<\/option>";
    strVar += "  					<option>bundleTwo<\/option>";
    strVar += "				<\/select>";
    strVar += "    		<\/fieldset>";
    strVar += " 		<\/form>";
    strVar += "	<\/div>";
    strVar += " <div id=\"" + parent + "-dialog-form-find-path\" title=\"Find path\">";
    strVar += " 		<form role=\"form\">";
    strVar += "    		<fieldset>";
    strVar += "      			<label for=\"" + parent + "-sid\">sid:<\/label>";
    strVar += " 				<input type=\"text\" class=\"form-control\" name=\"" + parent + "-sid\" id=\"" + parent + "-sid\"><br>";
    strVar += "      			<label for=\"" + parent + "-vid\">vid:<\/label>";
    strVar += " 				<input type=\"text\" class=\"form-control\" name=\"" + parent + "-vid\" id=\"" + parent + "-vid\"><br>";
    strVar += " 				<input type=\"submit\" tabindex=\"-1\" style=\"position:absolute; top:-1000px\"><\/input>";
    strVar += "    		<\/fieldset>";
    strVar += " 		<\/form>";
    strVar += "	<\/div>";
    strVar += "	<div id=\"" + parent + "-dialog-form-edge\" title=\"Edit edge\">";
    strVar += " 		<form role=\"form\">";
    strVar += "    		<fieldset>";
    strVar += "      			<label for=\"" + parent + "-direction\">change direction:<\/label>";
    strVar += "      			<input type=\"checkbox\" class=\"form-control\" name=\"" + parent + "-direction\" id=\"" + parent + "-direction\" value=\"Yes\"><\/input>";
    strVar += "      			<label for=\"" + parent + "-arrow-type-edge\">arrow type:<\/label>";
    strVar += "      			<select style=\"width: 150px\" class=\"form-control\" id=\"" + parent + "-arrow-type-edge\" name=\"" + parent + "-arrow-type-edge\">";
    strVar += "  					<option selected=\"\">TBar<\/option>";
    strVar += "  					<option>Arrow<\/option>";
    strVar += "  					<option>Line<\/option>";
    strVar += "					<\/select>";
    strVar += "      			<label for=\"" + parent + "-line-type-edge\">line type:<\/label>";
    strVar += "      			<select style=\"width: 150px\" class=\"form-control\" id=\"" + parent + "-line-type-edge\" name=\"" + parent + "-line-type-edge\">";
    strVar += "  					<option selected=\"\">Solid<\/option>";
    strVar += "  					<option>Dotted<\/option>";
    strVar += "  					<option>Dashed<\/option>";
    strVar += "					<\/select>";
    strVar += "    				<label for=\"" + parent + "-edge-move-to-background\">Move to Background:<\/label>";
    strVar += "    				<input id=\"" + parent + "-edge-move-to-background\" value=\"Move\" type=\"button\" class=\"btn btn-link\"><\/input>";
    strVar += "    				<label for=\"" + parent + "-edge-move-to-foreground\">Move to Foreground:<\/label>";
    strVar += "    				<input id=\"" + parent + "-edge-move-to-foreground\" value=\"Move\" type=\"button\" class=\"btn btn-link\"><\/input>";
    strVar += " 			<input type=\"submit\" tabindex=\"-1\" style=\"position:absolute; top:-1000px\"><\/input>";
    strVar += "    		<\/fieldset>";
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
    strVar += "	<div id=\"" + parent + "-dialog-form-node\" title=\"Edit node\">";
    strVar += " 		<form role=\"form\">";
    strVar += "    		<fieldset>";
    strVar += "      			<label for=\"" + parent + "-gene-name\">gene-name:<\/label>";
    strVar += "      			<input type=\"text\" name=\"" + parent + "-gene-name\" class=\"form-control\" id=\"" + parent + "-gene-name\" value=\"\" class=\"text ui-widget-content ui-corner-all\"><\/input>";
    strVar += "      			<label for=\"" + parent + "-height\">height:<\/label>";
    strVar += "      			<input type=\"text\" name=\"" + parent + "-height\" id=\"" + parent + "-height\" class=\"form-control\" value=\"\" class=\"text ui-widget-content ui-corner-all\"><\/input>";
    strVar += "      			<label for=\"" + parent + "-width\">width:<\/label>";
    strVar += "      			<input type=\"text\" name=\"" + parent + "-width\" id=\"" + parent + "-width\" class=\"form-control\" value=\"\" class=\"text ui-widget-content ui-corner-all\"><\/input>";
    strVar += "      			<label for=\"" + parent + "-type-node\">type:<\/label>";
    strVar += "      			<select style=\"width: 150px\" id=\"" + parent + "-type-node\" class=\"form-control\" name=\"" + parent + "-type-node\">";
    strVar += "  					<option id=\"" + parent + "-select-bundleOne\" selected=\"\">bundleOne<\/option>";
    strVar += "  					<option id=\"" + parent + "-select-bundleTwo\">bundleTwo<\/option>";
    strVar += "  					<option id=\"" + parent + "-select-gene\">gene<\/option>";
    strVar += "  					<option id=\"" + parent + "-select-geneProduct\">geneProduct<\/option>";
    strVar += "  					<option id=\"" + parent + "-select-protein\">protein<\/option>";
    strVar += "  					<option id=\"" + parent + "-select-rna\">rna<\/option>";
    strVar += "  					<option id=\"" + parent + "-select-mircoRNA\">microRNA<\/option>";
    strVar += "  					<option id=\"" + parent + "-select-kinase\">kinase<\/option>";
    strVar += "  					<option id=\"" + parent + "-select-ligand\">ligand<\/option>";
    strVar += "  					<option id=\"" + parent + "-select-receptor\">receptor<\/option>";
    strVar += "  					<option id=\"" + parent + "-select-biologicalProcess\">biologicalProcess<\/option>";
    strVar += "  					<option id=\"" + parent + "-select-triangle\">triangle<\/option>";
    strVar += "  					<option id=\"" + parent + "-select-ellipse\">ellipse<\/option>";
    strVar += "  					<option id=\"" + parent + "-select-pentagon\">pentagon<\/option>";
    strVar += "  					<option id=\"" + parent + "-select-hexagon\">hexagon<\/option>";
    strVar += "  					<option id=\"" + parent + "-select-heptagon\">heptagon<\/option>";
    strVar += "  					<option id=\"" + parent + "-select-octagon\">octagon<\/option>";
    strVar += "  					<option id=\"" + parent + "-select-star\">star<\/option>";
    strVar += "  					<option id=\"" + parent + "-select-diamond\">diamond<\/option>";
    strVar += "  					<option id=\"" + parent + "-select-vee\">vee<\/option>";
    strVar += "  					<option id=\"" + parent + "-select-rhomboid\">rhomboid<\/option>";
    strVar += "  					<option id=\"" + parent + "-select-label\">label<\/option>";
    strVar += "					<\/select>";
    strVar += "      			<label for=\"" + parent + "-rna\">RNA:<\/label>";
    strVar += "      			<input type=\"text\" style=\"width: 150px\" id=\"" + parent + "-rna\" class=\"form-control\" name=\"" + parent + "-rna\">";
    strVar += "					<label for=\"" + parent + "-cnv\">CNV:<\/label>";
    strVar += "      			<input type=\"text\" style=\"width: 150px\" id=\"" + parent + "-cnv\" class=\"form-control\" name=\"" + parent + "-cnv\">";
    strVar += "					<label for=\"" + parent + "-mut\">MUT:<\/label>";
    strVar += "      			<input type=\"text\" style=\"width: 150px\" id=\"" + parent + "-mut\" class=\"form-control\" name=\"" + parent + "-mut\">";
    strVar += " 			    <input type=\"submit\" tabindex=\"-1\" style=\"position:absolute; top:-1000px\"><\/input>";
    strVar += "    				<label for=\"" + parent + "-background-image\">Local Image File:<\/label>";
    strVar += "					<input id=\"" + parent + "-background-image\" value=\"Pick an Image File\" type=\"file\"><\/input>";
    strVar += "    				<label for=\"" + parent + "-background-image-remove\">Remove Background image:<\/label>";
    strVar += "					<input id=\"" + parent + "-background-image-remove\" value=\"Remove\" type=\"button\" class=\"btn btn-link\"><\/input>";
    strVar += "    				<label for=\"" + parent + "-node-move-to-background\">Move to Background:<\/label>";
    strVar += "    				<input id=\"" + parent + "-node-move-to-background\" value=\"Move\" type=\"button\" class=\"btn btn-link\"><\/input>";
    strVar += "    				<label for=\"" + parent + "-node-move-to-foreground\">Move to Foreground:<\/label>";
    strVar += "    				<input id=\"" + parent + "-node-move-to-foreground\" value=\"Move\" type=\"button\" class=\"btn btn-link\"><\/input>";
    strVar += "				<\/fieldset>";
    strVar += "  		<\/form>";
    strVar += "	<\/div>";
    strVar += "	<div id=\"" + parent + "-cy\" style=\"height: 100%;width: 100%;position: absolute; left: 0;\"><\/div>";

    document.getElementById(parent).innerHTML = strVar;

    $(function () {// on dom ready

        function removeHeroUnit() {
            var heroUnit = document.getElementById(parent + "-intro-hero-unit");
            if (heroUnit != null)
                heroUnit.parentNode.removeChild(heroUnit);
        }

        function newPathway(event) {
            var name = document.getElementById(parent + "-new-pathway-name").value;
            var data = '{"format_version" : "1.0","generated_by" : "cytoscape-3.2.1","target_cytoscapejs_version" : "~2.1","data" :{"shared_name":"","ID":"","BOARDWIDTH":"","BOARDHEIGHT":"","LICENSE":"CC BY 2.0","ORGANISM":"","NAME":"","INSTRUCTION":"","AUTHOR":"","VERSION":"","PATHWAY_TYPE":"original","SUID":205,"__Annotations":[],"selected":true},"elements" : {"nodes" :[],"edges" :[]}}'
            var obj = JSON.parse(data);
            removeHeroUnit();
            setElements(obj);
            dialogNewPathway.dialog("close");
        }

        function onChangePathwayFile(event) {
            var reader = new FileReader();
            reader.onload = onPathwayReaderLoad;
            reader.readAsText(event.target.files[0]);
            removeHeroUnit();
        }

        function collapseBundle(event) {
            var cy = $('#' + parent + '-cy').cytoscape('get');
            for (var i = 0; i < selectedForEditNodes.size(); i++) {
                if (selectedForEditNodes[i].isParent()) {
                    selectedForEditNodes[i].descendants().addClass('collapsed');
                    selectedForEditNodes[i].descendants().unselectify();
                    selectedForEditNodes[i].descendants().ungrabify();
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
                if (selectedForEditNodes[i].isParent()) {
                    selectedForEditNodes[i].descendants().removeClass('collapsed');
                    selectedForEditNodes[i].descendants().selectify();
                    selectedForEditNodes[i].descendants().grabify();
                }
            }
            saveState();
        }

        function onChangeColoringFile(event) {
            var reader = new FileReader();
            reader.onload = onColoringReaderLoad;
            reader.readAsText(event.target.files[0]);
            saveState();
        }

        function postAddProcessing() {
            var cy = $('#' + parent + '-cy').cytoscape('get');

            //Post-Add Process
            for (var i = 0; i < cy.$("node").length; i++) {
                if (typeof (cy.$("node")[i].data("backgroundImage")) != "undefined" && cy.$("node")[i].data("backgroundImage") != "") {
                    cy.$("node")[i].style("backgroundImage", cy.$("node")[i].data("backgroundImage"));
                    cy.$("node")[i].data("Type", "image");
                }
            }

            for (var i = 0; i < cy.$("node").length; i++) {
                if (typeof (cy.$("node")[i].data("zIndex")) != "undefined") {
                    cy.$("node")[i].style("zIndex", cy.$("node")[i].data("zIndex"));
                }
            }
        }

        function preAddProcessing(obj) {
            for (var i = 0; i < obj.elements.nodes.length; i++) {
                if (obj.elements.nodes[i].data.id.substring(0, 1) == "n") {
                    var number = parseInt(obj.elements.nodes[i].data.id.substring(1, obj.elements.nodes.length - 1));
                    if (number > nodeCounter)
                        nodeCounter = number + 1;
                }

                if (types.indexOf(obj.elements.nodes[i].data.backgroundImage) == -1) {
                    obj.elements.nodes[i].data.backgroundImage = "";
                }

                if (types.indexOf(obj.elements.nodes[i].data.zIndex) == -1) {
                    obj.elements.nodes[i].data.zIndex = 0;
                }

                if (types.indexOf(obj.elements.nodes[i].data.Type) == -1) {
                    obj.elements.nodes[i].data.Type = "label";
                }

                if (typeof (obj.elements.nodes[i].data.rna) == "undefined") {
                    obj.elements.nodes[i].data.rna = 0;
                }

                if (typeof (obj.elements.nodes[i].data.cnv) == "undefined") {
                    obj.elements.nodes[i].data.cnv = 0;
                }

                if (typeof (obj.elements.nodes[i].data.mut) == "undefined") {
                    obj.elements.nodes[i].data.mut = 0;
                }
            }

            for (var i = 0; i < obj.elements.edges.length; i++) {
                if (obj.elements.edges[i].data.id.substring(0, 1) == "e") {
                    var number = parseInt(obj.elements.edges[i].data.id.substring(1, obj.elements.edges.length - 1));
                    if (number > edgeCounter)
                        edgeCounter = number + 1;
                }
            }
        }

        function setElements(obj) {
            if (loadCounts == 0) {
                header = obj.data;
                visualPathway(obj);
            } else {

                // Pre-Add process

                var cy = $('#' + parent + '-cy').cytoscape('get');
                for (var i = 0; i < obj.elements.nodes.length; i++) {
                    obj.elements.nodes[i].position.x = obj.elements.nodes[i].position.x + 1000 * loadCounts;
                }

                preProcessingAdd(obj);

                // Add nodes
                cy.add(obj.elements);
                cy.center();
                cy.fit();

                //Post-Add Process
                postAddProcessing();

            }
            loadCounts++;
            saveState();
        }

        function loadPathway(id) {
            $.post(services['pathwayFinder'], {
                pid: id
            }, function (data) {
                removeHeroUnit();
				fixed_data = data.replace("-.", "-0.");
                var obj = JSON.parse(fixed_data);
                setElements(obj);
            });
        }

        function onSelect(event) {
            var id = event.target.value;
            loadPathway(id);
        }

        function saveAsPathway(event) {
            var obj = JSON.parse(states[states.length - 1]);
            obj.data.NAME = document.getElementById(parent + "-pathway-name").value;
            $.post(services['pathwaySaver'], {
                insertPathway: JSON.stringify(obj)
            }, function (data) {
                if (data != "Success!") {
                    obj.data.ID = data;
                    $.post(services['pathwaySaver'], {
                        updatePathway: JSON.stringify(obj)
                    }, function (data) {
                        console.log(data)
                        dialogPathwaySaveAs.dialog("close");
                    });
                } else {
                    refreshPathwayList();
                    dialogPathwaySaveAs.dialog("close");
                }
            });
        }

        function savePathway(event) {
            var obj = JSON.parse(states[states.length - 1]);
            $.post(services['pathwaySaver'], {
                updatePathway: JSON.stringify(obj)
            }, function (data) {
                console.log(data);
                dialogPathwaySaveAs.dialog("close");
            });
        }

        function onPathwayReaderLoad(event) {
            var obj = JSON.parse(event.target.result);
            setElements(obj);
        }

        function onColoringReaderLoad(event) {
            var list = this.result.split('\n');
            var lines = [];

            for (var line = 1; line < list.length; line++) {
                lines[line] = list[line].split('\t');
            }

            sprayColor(lines);
        }

        function sprayColor(lines) {
            var cy = $('#' + parent + '-cy').cytoscape('get');
            for (var line = 1; line < lines.length; line++) {
                var target = cy.elements("node[name = \"" + lines[line][0] + "\"]");
                var mut = lines[line][1];
                var cnv = lines[line][2];
                var rna = lines[line][3];
                target.data('rna', rna);
                target.data('cnv', cnv);
                target.data('mut', mut);

                if (rna > 0) {
                    setNodeStyle(target, 'red_bg', '', '');
                } else if (rna < 0) {
                    setNodeStyle(target, 'green_bg', '', '');
                } else {
                    setNodeStyle(target, '', '', '');
                }

                if (cnv > 0) {
                    setNodeStyle(target, '', 'red_border', '');
                } else if (cnv < 0) {
                    setNodeStyle(target, '', 'purple_border', '');
                } else {
                    setNodeStyle(target, '', '', '');
                }

                if (mut > 0) {
                    setNodeStyle(target, '', '', 'red_shadow');
                } else if (mut <= 0) {
                    setNodeStyle(target, '', '', 'no_shadow');
                } else {
                    setNodeStyle(target, '', '', '');
                }
            }
        }

        function removeElements(event) {
            if (selectedForEditNodes.length > 0)
                selectedForEditNodes.remove();
            if (selectedForEditEdges.length > 0)
                selectedForEditEdges.remove();
            saveState();
        }

        function addNode(event) {
            var cy = $('#' + parent + '-cy').cytoscape('get');
            var name = "n" + nodeCounter;
            var node = [];

            // Screen Dimensions
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
                    Type: "gene",
                    Valign: "Middle",
                    Width: 100,
                    Height: 25,
                    id: "n" + nodeCounter,
                    name: name,
                    selected: false,
                    backgroundImage: "",
                    zIndex: 0
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
                                cnv: node.children()[x].data('cnv'),
                                rna: node.children()[x].data('rna'),
                                mut: node.children()[x].data('mut'),
                                parent: node.parent().data('id'),
                                backgroundImage: node.children()[x].data('backgroundImage'),
                                zIndex: node.children()[x].data('zIndex')
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
                                cnv: node.children()[x].data('cnv'),
                                rna: node.children()[x].data('rna'),
                                mut: node.children()[x].data('mut'),
                                backgroundImage: node.children()[x].data('backgroundImage'),
                                zIndex: node.children()[x].data('zIndex')
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
                                cnv: node.children()[x].data('cnv'),
                                rna: node.children()[x].data('rna'),
                                mut: node.children()[x].data('mut'),
                                parent: node.data('id'),
                                backgroundImage: node.children()[x].data('backgroundImage'),
                                zIndex: node.children()[x].data('zIndex')
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
                                cnv: node.children()[x].data('cnv'),
                                rna: node.children()[x].data('rna'),
                                mut: node.children()[x].data('mut'),
                                backgroundImage: node.children()[x].data('backgroundImage'),
                                zIndex: node.children()[x].data('zIndex')
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
                                selected: node.children()[x].connectedEdges()[j].data('selected')
                            }
                        })
                    }
                    unbundleRecursive(node.children()[x], parents, edges, nodes, rCounter);
                }
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
                    cnv: node.data('cnv'),
                    rna: node.data('rna'),
                    mut: node.data('mut'),
                    parent: node.data('parent'),
                    backgroundImage: node.data('backgroundImage'),
                    zIndex: node.data('zIndex')
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
                        selected: node.connectedEdges()[j].data('selected')
                    }
                })
            }
            for (var i = 0; i < node.children().size(); i++) {
                recursiveBundle(node.children()[i], edges, nodes);
            }
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
                    backgroundImage: "",
                    zIndex: 0
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
                            cnv: selectedForEditNodes[i].data('cnv'),
                            rna: selectedForEditNodes[i].data('rna'),
                            mut: selectedForEditNodes[i].data('mut'),
                            parent: "n" + nodeCounter,
                            backgroundImage: selectedForEditNodes[i].data('backgroundImage'),
                            zIndex: selectedForEditNodes[i].data('zIndex')

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
                                selected: selectedForEditNodes[i].connectedEdges()[j].data('selected')
                            }
                        })
                    }
                }
                if (selectedForEditNodes[i].isParent() || selectedForEditNodes[i].isChild()) {
                    recursiveBundle(selectedForEditNodes[i], edges, nodes);
                }
            }

            // Remove old nodes
            selectedForEditNodes.remove();

            // Add new nodes
            cy.add(nodes.concat(edges));
            postAddProcessing();

            if (!cy.elements("node[id = \"n" + nodeCounter + "\"]").isParent())
                cy.elements("node[id = \"n" + nodeCounter + "\"]").remove();

            // increment nodeCounter to insure unique id
            nodeCounter++;

            // Remove dialog box
            dialogBundle.dialog("close");
            saveState();
        }

        function produceJSON(event) {
            download(states[states.length - 1], "data.txt", "text/plain");
        }

        function refreshPathwayList() {
            var select = document.getElementById(parent + "-pathway-selector");

            while (select.firstChild) {
                select.removeChild(select.firstChild);
            }

            $.get(services['pathwayFinder'], {
                pathwayList: '1'
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

        function findPath(Json, sid, vid) {
            var nodes = Json['elements']['nodes'];
            nodes = nodes.filter(function (item) {
                if (item['data']['NODE_TYPE'] !== 'GROUP') {
                    return true;
                }

            });
            //console.log(nodes);
            var edges = Json['elements']['edges'];
            var result = [];
            //array of arrays containing the graphids for edges in the path
            var path = [];
            var nodeTrack = [];

            function mapLocation(x, y) {
                var deta = 1;

                for (var j = 0; j < nodes.length; j++) {
                    var x0 = nodes[j]['position']['x'];
                    var y0 = nodes[j]['position']['y'];
                    var w = nodes[j]['data']['Width'];
                    var h = nodes[j]['data']['Height'];

                    if (x > x0 - w / 2 - deta & x < x0 + w / 2 + deta & y > y0 - h / 2 - deta & y < y0 + h / 2 + deta) {
                        return nodes[j]['data']['SUID'];

                    }
                }
            }

            function findEdgeBySource(gid) {
                if (gid == undefined | gid == '0') {
                    return;
                }

                var end = true;
                for (var i = 0; i < edges.length; i++) {
                    var eid = edges[i]['data']['id'];
                    var s = (!('source' in edges[i]['data']) ? mapLocation(edges[i]['data']['Coords'][0]['x'], edges[i]['data']['Coords'][0]['y']) : edges[i]['data']['source']);

                    if (s == gid) {

                        var cl = edges[i]['data']['Coords'].length;
                        var t = (!('target' in edges[i]['data']) ? mapLocation(edges[i]['data']['Coords'][cl - 1]['x'], edges[i]['data']['Coords'][cl - 1]['y']) : edges[i]['data']['target']);

                        if (t == vid) {
                            var p = path.slice();
                            p.push(eid);
                            result.push(p);

                            continue;

                        } else if (nodeTrack.indexOf(eid) == -1 & t !== undefined & t !== '0') {
                            path.push(eid);
                            nodeTrack.push(eid);

                            findEdgeBySource(t);
                        } else {
                            continue;
                        }
                    }
                }
                if (end == true) {
                    path.pop();
                    nodeTrack.pop();

                }
                return true;
            }

            findEdgeBySource(sid);
            return result;

        }

        function getPathScore(edgeArray, scoreJSON) {
            var sum = 0;
            var max = 0;
            for (var i = 0; i < edgeArray.length; i++) {
                sum = sum + (i + 1) * scoreJSON[edgeArray[i]] / edgeArray.length;
                max = max + (i + 1) / edgeArray.length;
            }
            return parseFloat((sum / max).toFixed(5));
        }

        function convertEdgePathtoNodePath(selectedPaths) {
            var cy = $('#' + parent + '-cy').cytoscape('get');
            var nodePath = [];
            for (var n = 0; n < selectedPaths.length; n++) {
				var j = 0;
				var markerHit = false;
                nodePath.push([])
                while (j < selectedPaths[n].length && markerHit == false) {
                    if (j < selectedPaths[n].length - 1) {
                        var sourceNodeId = cy.elements("edge[id = \"" + selectedPaths[n][j] + "\"]").data('source');
                        var sourceNodeName = cy.elements("node[id = \"" + sourceNodeId + "\"]").data('name');
                        var sourceNodeCnv = cy.elements("node[id = \"" + sourceNodeId + "\"]").data('cnv');
                        var sourceNodeRna = cy.elements("node[id = \"" + sourceNodeId + "\"]").data('rna');
                        var sourceNodeMut = cy.elements("node[id = \"" + sourceNodeId + "\"]").data('mut');
						var sourceNodeType = cy.elements("node[id = \"" + sourceNodeId + "\"]").data('Type');
                        if (cy.elements("node[id = \"" + sourceNodeId + "\"]").isParent()) {
                            nodePath[n].push([]);
                            for (var k = 0; k < cy.elements("node[id = \"" + sourceNodeId + "\"]").children().length; k++) {
                                var sourceNodeName = cy.elements("node[id = \"" + sourceNodeId + "\"]").children()[k]._private.data.name
                                var sourceNodeCnv = cy.elements("node[id = \"" + sourceNodeId + "\"]").children()[k]._private.data.cnv
                                var sourceNodeRna = cy.elements("node[id = \"" + sourceNodeId + "\"]").children()[k]._private.data.rna
                                var sourceNodeMut = cy.elements("node[id = \"" + sourceNodeId + "\"]").children()[k]._private.data.mut
                                nodePath[n][j].push({"name": sourceNodeName, "cnv": sourceNodeCnv, "rna": sourceNodeRna, "mut": sourceNodeMut});
                            }
                        } else if(sourceNodeType != "diamond"){
                            nodePath[n].push([{"name": sourceNodeName, "cnv": sourceNodeCnv, "rna": sourceNodeRna, "mut": sourceNodeMut}]);
                        } else {
							markerHit = true;
						}
                    } else {
                        var sourceNodeId = cy.elements("edge[id = \"" + selectedPaths[n][j] + "\"]").data('source');
                        var targetNodeId = cy.elements("edge[id = \"" + selectedPaths[n][j] + "\"]").data('target');

                        var sourceNodeName = cy.elements("node[id = \"" + sourceNodeId + "\"]").data('name');
                        var sourceNodeCnv = cy.elements("node[id = \"" + sourceNodeId + "\"]").data('cnv');
                        var sourceNodeRna = cy.elements("node[id = \"" + sourceNodeId + "\"]").data('rna');
                        var sourceNodeMut = cy.elements("node[id = \"" + sourceNodeId + "\"]").data('mut');
						var sourceNodeType = cy.elements("node[id = \"" + sourceNodeId + "\"]").data('Type');

                        var targetNodeName = cy.elements("node[id = \"" + targetNodeId + "\"]").data('name');
                        var targetNodeCnv = cy.elements("node[id = \"" + targetNodeId + "\"]").data('cnv');
                        var targetNodeRna = cy.elements("node[id = \"" + targetNodeId + "\"]").data('rna');
                        var targetNodeMut = cy.elements("node[id = \"" + targetNodeId + "\"]").data('mut');
						var targetNodeType = cy.elements("node[id = \"" + targetNodeId + "\"]").data('Type');

                        if (cy.elements("node[id = \"" + sourceNodeId + "\"]").isParent()) {
                            nodePath[n].push([]);
                            for (var k = 0; k < cy.elements("node[id = \"" + sourceNodeId + "\"]").children().length; k++) {
                                var sourceNodeName = cy.elements("node[id = \"" + sourceNodeId + "\"]").children()[k]._private.data.name
                                var sourceNodeCnv = cy.elements("node[id = \"" + sourceNodeId + "\"]").children()[k]._private.data.cnv
                                var sourceNodeRna = cy.elements("node[id = \"" + sourceNodeId + "\"]").children()[k]._private.data.rna
                                var sourceNodeMut = cy.elements("node[id = \"" + sourceNodeId + "\"]").children()[k]._private.data.mut
                                nodePath[n][j].push({"name": sourceNodeName, "cnv": sourceNodeCnv, "rna": sourceNodeRna, "mut": sourceNodeMut});
                            }
                        } else if(sourceNodeType != "diamond") {
                            nodePath[n].push([{"name": sourceNodeName, "cnv": sourceNodeCnv, "rna": sourceNodeRna, "mut": sourceNodeMut}]);
                        } else {
							markerHit = true;
						}
                        if (cy.elements("node[id = \"" + targetNodeId + "\"]").isParent()) {
                            nodePath[n].push([]);
                            for (var k = 0; k < cy.elements("node[id = \"" + targetNodeId + "\"]").children().length; k++) {
                                var targetNodeName = cy.elements("node[id = \"" + targetNodeId + "\"]").children()[k]._private.data.name
                                var targetNodeCnv = cy.elements("node[id = \"" + targetNodeId + "\"]").children()[k]._private.data.cnv
                                var targetNodeRna = cy.elements("node[id = \"" + targetNodeId + "\"]").children()[k]._private.data.rna
                                var targetNodeMut = cy.elements("node[id = \"" + targetNodeId + "\"]").children()[k]._private.data.mut
                                nodePath[n][j].push({"name": targetNodeName, "cnv": targetNodeCnv, "rna": targetNodeRna, "mut": targetNodeMut});
                            }
                        } else if(targetNodeType != "diamond") {
                            nodePath[n].push([{"name": targetNodeName, "cnv": targetNodeCnv, "rna": targetNodeRna, "mut": targetNodeMut}]);
                        } else {
							markerHit = true;
						}
                    }
					j++;
                }
            }
            return nodePath;
        }

        function wrapperFindPath() {
            var cy = $('#' + parent + '-cy').cytoscape('get');
            var sid = orderedSelectedNodes[0]._private.data['id'];
            var vid = orderedSelectedNodes[1]._private.data['id'];
            $.post(services['pathwayScorer'], {
                data_json: JSON.stringify(JSON.parse(states[states.length - 1]))
            }, function (yue_data) {
                var selectedPaths = findPath(JSON.parse(states[states.length - 1]), sid, vid);
                var nodePaths = convertEdgePathtoNodePath(selectedPaths);
                console.log(JSON.stringify(nodePaths));
                $.post(services['pathwayWeightedScorer'], {
                    data_paths: JSON.stringify(nodePaths)
                }, function (tham_data) {
                    console.log(tham_data)
                    var scoreJSON = JSON.parse(yue_data);
                    var fdrJSON = JSON.parse(tham_data);
                    console.log(fdrJSON);
                    var table = document.getElementById(parent + "-inner-table");
                    var length = document.getElementById(parent + "-inner-table").rows.length;

                    if (typeof (selectedPaths) == "undefined") {
                        dialogPathfind.dialog("close");
                    }

                    for (var n = 0; n < length; n++) {
                        table.deleteRow(0);
                    }
                    for (var n = 0; n <= selectedPaths.length; n++) {
                        var row = table.insertRow();

                        var path = row.insertCell(0);
                        var score = row.insertCell(1);
                        var fdr = row.insertCell(2);

                        // Add some text to the new cells:

                        if (n == 0) {
                            path.innerHTML = "<i><h3>paths</h3></i>";
                            score.innerHTML = "<i><h3>scores</h3></i>"
                            fdr.innerHTML = "<i><h3>fdr</h3></i>"
                        } else {
                            var btn = document.createElement("button");
                            var t = document.createTextNode((n - 1).toString());
                            btn.className = "btn btn-link";
                            btn.appendChild(t);
                            btn.addEventListener('click', function (event) {
                                var k = parseInt(event.currentTarget.innerHTML);
                                cy.$('node').unselect();
                                cy.$('edge').unselect();
                                for (var j = 0; j < selectedPaths[k].length; j++) {
                                    cy.elements("edge[id = \"" + selectedPaths[k][j] + "\"]").select();
                                    var sourceNode = cy.elements("edge[id = \"" + selectedPaths[k][j] + "\"]").data('source');
                                    var targetNode = cy.elements("edge[id = \"" + selectedPaths[k][j] + "\"]").data('target');
                                    cy.elements("node[id = \"" + targetNode + "\"]").select();
                                    cy.elements("node[id = \"" + sourceNode + "\"]").select();
                                    cy.$('node').style("opacity", 0.2);
                                    cy.$('edge').style("opacity", 0.2);
                                    cy.$('node:selected').style("opacity", 1.0);
                                    cy.$('edge:selected').style("opacity", 1.0);
                                }
                            });
                            path.appendChild(btn);
                            score.appendChild(document.createTextNode(getPathScore(selectedPaths[n - 1], scoreJSON).toString()));
                            fdr.appendChild(document.createTextNode(fdrJSON[n - 1]));
                        }
                    }
                    dialogTable.dialog("open");
                    dialogPathfind.dialog("close");
                });
            })
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

        function setNodeStyle(target, background, border, shadow) {
            if (background != '') {
                target.removeClass('green_bg');
                target.removeClass('red_bg');
                target.removeClass('white_bg');
                target.addClass(background);
            }
            if (border != '') {
                target.removeClass('purple_border');
                target.removeClass('red_border');
                target.removeClass('black_border');
                target.addClass(border);
            }
            if (shadow != '') {
                target.removeClass('red_shadow');
                target.removeClass('no_shadow');
                target.addClass(shadow);
            }

            if (background == '' && border == '' && shadow == '') {
                target.removeClass('green_bg');
                target.removeClass('red_bg');
                target.removeClass('white_bg');
                target.removeClass('purple_border');
                target.removeClass('red_border');
                target.removeClass('black_border');
                target.removeClass('red_shadow');
                target.removeClass('no_shadow');
            }
        }

        function editEdge() {
            var cy = $('#' + parent + '-cy').cytoscape('get');
            var direction = document.getElementById(parent + "-direction").value;
            var arrowType = document.getElementById(parent + "-arrow-type-edge").value;
            var lineType = document.getElementById(parent + "-line-type-edge").value;
            target.data('StartArrow', arrowType);
            target.data('EndArrow', arrowType);
            target.data('Type', lineType);
            if (document.getElementById(parent + '-direction').checked) {
                var edge = [];

                edge.push({
                    group: "edges",
                    data: {
                        id: target.data('id'),
                        Type: target.data('Type'),
                        LineThickness: target.data('LineThickness'),
                        EndArrow: target.data('EndArrow'),
                        Coords: target.data('Coords'),
                        ZOrder: target.data('ZOrder'),
                        source: target.data('target'),
                        target: target.data('source'),
                        StartArrow: target.data('StartArrow'),
                        selected: target.data('Selected')
                    }
                })
                target.remove();
                cy.add(edge);
                postAddProcessing();
            }
            dialogEdge.dialog("close");
            saveState();
        }

        function moveElementtoBackground(event) {
            target.style("z-index", 0);
            target.data("zIndex", 0);
            saveState();
        }

        function moveElementtoForeground(event) {
            highestZOrder++;
            target.style("z-index", highestZOrder);
            target.data("zIndex", highestZOrder);
            saveState();
        }

        function removeBackgroundImageOnNode(event) {
            target.removeStyle("background-image");
            target.data("backgroundImage", "");
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
            target.data('Type', "image");
            target.data("backgroundImage", img);
            target.style("background-image", img);
            saveState();
        }

        function editNode() {
            var name = document.getElementById(parent + "-gene-name").value;
            var width = document.getElementById(parent + "-width").value;
            var height = document.getElementById(parent + "-height").value;
            var type = document.getElementById(parent + "-type-node").value;
            target.data('name', name);
            target.data('Width', width);
            target.data('Height', height);
            target.data('Type', type);

            var node_name = target.data("name");
            selectedForQueryNodes.push(node_name);
            var rna = document.getElementById(parent + "-rna").value;
            var cnv = document.getElementById(parent + "-cnv").value;
            var mut = document.getElementById(parent + "-mut").value;
            target.data('rna', rna);
            target.data('cnv', cnv);
            target.data('mut', mut);

            coloredNodes.push({
                "gene_name": node_name,
                "rna": rna,
                "cnv": cnv,
                "mut": mut
            });
            $('#' + parent + '-variable').val($('#' + parent + '-variable').val() + coloredNodes);
            dialogNode.dialog("close");
            saveState();
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

        function findObject(event) {
            var val = event.target.value;
            $.post(services['objectFinder'], {
                pattern: JSON.stringify(coloredNodes)
            }, function (data) {
                if (data == "[]")
                    data = '{"X1":{"percentage":0.66667,"rna_distance":0,"cnv_distance":0,"mut_distance":0},"X2":{"percentage":0.33333,"rna_distance":30.44444,"cnv_distance":0,"mut_distance":0},"X9":{"percentage":0.66667,"rna_distance":0,"cnv_distance":0,"mut_distance":0},"X29":{"percentage":0.66667,"rna_distance":0,"cnv_distance":0,"mut_distance":0},"X24":{"percentage":0.33333,"rna_distance":36,"cnv_distance":0,"mut_distance":0},"X34":{"percentage":0.66667,"rna_distance":0,"cnv_distance":0,"mut_distance":0},"X38":{"percentage":0.33333,"rna_distance":30.44444,"cnv_distance":0,"mut_distance":0},"X40":{"percentage":0.66667,"rna_distance":0,"cnv_distance":0,"mut_distance":0},"X45":{"percentage":0.66667,"rna_distance":36,"cnv_distance":0,"mut_distance":0},"X46":{"percentage":0.66667,"rna_distance":0,"cnv_distance":0,"mut_distance":0},"X48":{"percentage":1,"rna_distance":36,"cnv_distance":0,"mut_distance":0},"X53":{"percentage":1,"rna_distance":0,"cnv_distance":0,"mut_distance":0},"X59":{"percentage":0.66667,"rna_distance":36,"cnv_distance":0,"mut_distance":0},"X156":{"percentage":0.33333,"rna_distance":0,"cnv_distance":0,"mut_distance":0},"X15":{"percentage":0.33333,"rna_distance":0,"cnv_distance":0,"mut_distance":2},"X22":{"percentage":0.33333,"rna_distance":0,"cnv_distance":0,"mut_distance":0}}'
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
                    var rnaDistance = row.insertCell(2);
                    var cnvDistance = row.insertCell(3);
                    var mutDistance = row.insertCell(4);

                    // Add some text to the new cells:

                    if (n == 0) {
                        name.innerHTML = "<i><h3>name</h3></i>";
                        percentage.innerHTML = "<i><h3>percentage</h3></i>";
                        rnaDistance.innerHTML = "<i><h3>rna</h3></i>";
                        cnvDistance.innerHTML = "<i><h3>cnv</h3></i>";
                        mutDistance.innerHTML = "<i><h3>mut</h3></i>";
                    } else {
                        name.innerHTML = array[n - 1][0];
                        percentage.innerHTML = array[n - 1][1][0];
                        rnaDistance.innerHTML = array[n - 1][1][1];
                        cnvDistance.innerHTML = array[n - 1][1][2];
                        mutDistance.innerHTML = array[n - 1][1][3];
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
                    'background-image-opacity': .75,
                    'opacity': 0.75,
                    'text-opacity': 0.75
                }).selector('node[Type="bundleOne"]').css({
                    'shape': 'roundrectangle',
                    'background-color': 'lightgray',
                    'color': 'black',
                    'text-valign': 'center',
                    'border-color': 'black',
                    'border-style': 'solid',
                    'border-width': 1
                }).selector('node[Type="bundleTwo"]').css({
                    'shape': 'roundrectangle',
                    'background-color': 'gray',
                    'color': 'black',
                    'text-valign': 'center',
                    'border-color': 'black',
                    'border-style': 'solid',
                    'border-width': 1
                }).selector('node[Type="gene"]').css({
                    'shape': 'ellipse',
                    'width': 'data(Width)',
                    'height': 'data(Height)',
                    'color': 'black',
                    'text-valign': 'center',
                    'background-color': 'white',
                    'border-color': 'black',
                    'border-style': 'solid',
                    'border-width': 1
                }).selector('node[Type="geneProduct"]').css({
                    'shape': 'circle',
                    'radius': 5,
                    'color': 'black',
                    'text-valign': 'center',
                    'background-color': 'white',
                    'border-color': 'black',
                    'border-style': 'solid',
                    'border-width': 1
                }).selector('node[Type="protein"]').css({
                    'shape': 'rectangle',
                    'width': 'data(Width)',
                    'height': 'data(Height)',
                    'color': 'black',
                    'text-valign': 'center',
                    'background-color': 'white',
                    'border-color': 'black',
                    'border-style': 'solid',
                    'border-width': 1
                }).selector('node[Type="rna"]').css({
                    'shape': 'circle',
                    'radius': 5,
                    'color': 'black',
                    'text-valign': 'center',
                    'background-color': 'white',
                    'border-color': 'black',
                    'border-style': 'dotted',
                    'border-width': 1
                }).selector('node[Type="microRNA"]').css({
                    'shape': 'circle',
                    'radius': 5,
                    'color': 'black',
                    'text-valign': 'center',
                    'background-color': 'white',
                    'border-color': 'black',
                    'border-style': 'dashed',
                    'border-width': 1
                }).selector('node[Type="kinase"]').css({
                    'shape': 'rectangle',
                    'width': 'data(Width)',
                    'height': 'data(Height)',
                    'color': 'black',
                    'text-valign': 'center',
                    'background-color': 'white',
                    'border-color': 'black',
                    'border-style': 'dashed',
                    'border-width': 1
                }).selector('node[Type="ligand"]').css({
                    'shape': 'rectangle',
                    'width': 'data(Width)',
                    'height': 'data(Height)',
                    'color': 'black',
                    'text-valign': 'center',
                    'background-color': 'white',
                    'border-color': 'black',
                    'border-style': 'dotted',
                    'border-width': 1
                }).selector('node[Type="receptor"]').css({
                    'shape': 'rectangle',
                    'width': 'data(Width)',
                    'height': 'data(Height)',
                    'color': 'black',
                    'text-valign': 'center',
                    'background-color': 'white',
                    'border-color': 'black',
                    'border-style': 'double',
                    'border-width': 1
                }).selector('node[Type="biologicalProcess"]').css({
                    'shape': 'roundrectangle',
                    'width': 'data(Width)',
                    'height': 'data(Height)',
                    'color': 'black',
                    'text-valign': 'center',
                    'background-color': 'white',
                    'border-color': 'black',
                    'border-style': 'solid',
                    'border-width': 1
                }).selector('node[Type="triangle"]').css({
                    'shape': 'triangle',
                    'width': 'data(Width)',
                    'height': 'data(Height)',
                    'color': 'black',
                    'text-valign': 'center',
                    'background-color': 'white',
                    'border-color': 'black',
                    'border-style': 'solid',
                    'border-width': 1
                }).selector('node[Type="ellipse"]').css({
                    'shape': 'ellipse',
                    'width': 'data(Width)',
                    'height': 'data(Height)',
                    'color': 'black',
                    'text-valign': 'center',
                    'background-color': 'white',
                    'border-color': 'black',
                    'border-style': 'solid',
                    'border-width': 1
                }).selector('node[Type="pentagon"]').css({
                    'shape': 'pentagon',
                    'width': 'data(Width)',
                    'height': 'data(Height)',
                    'color': 'black',
                    'text-valign': 'center',
                    'background-color': 'white',
                    'border-color': 'black',
                    'border-style': 'solid',
                    'border-width': 1
                }).selector('node[Type="hexagon"]').css({
                    'shape': 'hexagon',
                    'width': 'data(Width)',
                    'height': 'data(Height)',
                    'color': 'black',
                    'text-valign': 'center',
                    'background-color': 'white',
                    'border-color': 'black',
                    'border-style': 'solid',
                    'border-width': 1
                }).selector('node[Type="heptagon"]').css({
                    'shape': 'heptagon',
                    'width': 'data(Width)',
                    'height': 'data(Height)',
                    'color': 'black',
                    'text-valign': 'center',
                    'background-color': 'white',
                    'border-color': 'black',
                    'border-style': 'solid',
                    'border-width': 1
                }).selector('node[Type="octagon"]').css({
                    'shape': 'octagon',
                    'width': 'data(Width)',
                    'height': 'data(Height)',
                    'color': 'black',
                    'text-valign': 'center',
                    'background-color': 'white',
                    'border-color': 'black',
                    'border-style': 'solid',
                    'border-width': 1
                }).selector('node[Type="star"]').css({
                    'shape': 'star',
                    'width': 'data(Width)',
                    'height': 'data(Height)',
                    'color': 'black',
                    'text-valign': 'center',
                    'background-color': 'white',
                    'border-color': 'black',
                    'border-style': 'solid',
                    'border-width': 1
                }).selector('node[Type="diamond"]').css({
                    'shape': 'diamond',
                    'width': 'data(Width)',
                    'height': 'data(Height)',
                    'color': 'black',
                    'text-valign': 'center',
                    'background-color': 'white',
                    'border-color': 'black',
                    'border-style': 'solid',
                    'border-width': 1
                }).selector('node[Type="vee"]').css({
                    'shape': 'vee',
                    'width': 'data(Width)',
                    'height': 'data(Height)',
                    'color': 'black',
                    'text-valign': 'center',
                    'background-color': 'white',
                    'border-color': 'black',
                    'border-style': 'solid',
                    'border-width': 1
                }).selector('node[Type="rhomboid"]').css({
                    'shape': 'rhomboid',
                    'width': 'data(Width)',
                    'height': 'data(Height)',
                    'color': 'black',
                    'text-valign': 'center',
                    'background-color': 'white',
                    'border-color': 'black',
                    'border-style': 'solid',
                    'border-width': 1
                }).selector('node[Type="rectangle"]').css({
                    'shape': 'rectangle',
                    'width': 'data(Width)',
                    'height': 'data(Height)',
                    'color': 'black',
                    'text-valign': 'center',
                    'background-color': 'white',
                    'border-color': 'black',
                    'border-style': 'solid',
                    'border-width': 1
                }).selector('node[Type="label"]').css({
                    'shape': 'rectangle',
                    'width': 'data(Width)',
                    'height': 'data(Height)',
                    'color': 'black',
                    'text-valign': 'center',
                    'background-color': 'white',
                    'border-color': 'white',
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
                }).selector('node[rna < 0]').css({
                    'background-color': 'lightgreen',
                    'color': 'black'
                }).selector('node[rna > 0]').css({
                    'background-color': 'lightsalmon',
                    'color': 'black'
                }).selector('node[cnv < 0]').css({
                    'border-color': 'mediumpurple',
                    'border-width': 3
                }).selector('node[cnv > 0]').css({
                    'border-color': 'red',
                    'border-width': 3
                }).selector('node[mut > 0]').css({
                    'shadow-opacity': 1,
                    'shadow-color': 'red',
                    'border-width': 1
                })

                        // edge elements default css (unselected)
                        .selector('edge').css({
                    'line-color': 'black',
                    'line-style': 'solid',
                    'opacity': 0.75,
                    'text-opacity': 0.75,
                    'width': 1
                }).selector('edge[EndArrow="Line"]').css({
                    'target-arrow-shape': 'line',
                    'target-arrow-color': 'black',
                    'target-arrow-fill': 'filled'
                }).selector('edge[EndArrow="Arrow"]').css({
                    'target-arrow-shape': 'triangle',
                    'target-arrow-color': 'black',
                    'target-arrow-fill': 'filled'
                }).selector('edge[EndArrow="TBar"]').css({
                    'target-arrow-shape': 'tee',
                    'target-arrow-color': 'black',
                    'target-arrow-fill': 'filled'
                }).selector('edge[Type="Solid"]').css({
                    'line-style': 'solid'
                }).selector('edge[Type="Dashed"]').css({
                    'line-style': 'dashed'
                }).selector('edge[Type="Dotted"]').css({
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
                    'opacity': 0.01
                }),
                layout: {
                    name: 'preset',
                    padding: 10
                },
                ready: function () {
                    var cy = $('#' + parent + '-cy').cytoscape('get');

                    preAddProcessing(obj);

                    //un-disable options
                    $('#' + parent + '-select-bundleOne').removeClass('disabled');
                    $('#' + parent + '-add-node').removeClass('disabled');
                    $('#' + parent + '-add-edge').removeClass('disabled');
                    $('#' + parent + '-delete-elements').removeClass('disabled');
                    $('#' + parent + '-bundle').removeClass('disabled');
                    $('#' + parent + '-unbundle').removeClass('disabled');
                    $('#' + parent + '-collapse').removeClass('disabled');
                    $('#' + parent + '-expand').removeClass('disabled');
                    $('#' + parent + '-findpath').removeClass('disabled');
                    $('#' + parent + '-find-object').removeClass('disabled');
                    $('#' + parent + '-pathway-save').removeClass('disabled');
                    $('#' + parent + '-pathway-saveAs').removeClass('disabled');
                    $('#' + parent + '-produce-JSON').removeClass('disabled');
                    $('#' + parent + '-undo').removeClass('disabled');
                    $('#' + parent + '-redo').removeClass('disabled');

                    // Add processed nodes
                    cy.add(obj.elements);
                    cy.center();
                    cy.fit();

                    // Post-Add Process
                    postAddProcessing();

                    // add custom event
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

                    cy.on('doubleTap', 'node', function (event) {
                        target = event.cyTarget;
                        dialogNode.dialog("open");
                    });

                    cy.on('doubleTap', 'edge', function (event) {
                        target = event.cyTarget;
                        dialogEdge.dialog("open");
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

                    cy.on('grab', 'node', function (event) {
                        if (cy.$('node:grabbed').isParent() && !cy.$('node:grabbed').descendants()[0].grabbable()) {
                            grabbedCollapsedForEditNodes = cy.$('node:grabbed');
                            grabbedCollapsedForEditNodes.descendants().grabify();
                        }
                        saveState();
                    });

                    cy.on('free', 'node', function (event) {
                        //			    	saveState();
                        if (grabbedCollapsedForEditNodes.constructor !== Array)
                            grabbedCollapsedForEditNodes.descendants().ungrabify();
                        grabbedCollapsedForEditNodes = [];
                    });

                    cy.on('data', 'node', function (event) {
                        //					saveState();
                    });

                    cy.on('style', 'node', function (event) {
                        //					saveState();
                    });

                    saveState();
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
                    cy.$('node').removeStyle("opacity");
                    cy.$('edge').removeStyle("opacity");
                    cy.$('node:selected').removeStyle("opacity");
                    cy.$('edge:selected').removeStyle("opacity");
                }
            },
            close: function () {
                var cy = $('#' + parent + '-cy').cytoscape('get');
                cy.$('node').removeStyle("opacity");
                cy.$('edge').removeStyle("opacity");
                cy.$('node:selected').removeStyle("opacity");
                cy.$('edge:selected').removeStyle("opacity");
            }
        });

        dialogNode = $("#" + parent + "-dialog-form-node").dialog({
            open: function (event) {
                if (!target.isParent()) {
                    document.getElementById(parent + '-select-bundleOne').disabled = true;
                    document.getElementById(parent + '-select-bundleTwo').disabled = true;
                    document.getElementById(parent + "-select-gene").disabled = false;
                    document.getElementById(parent + "-select-geneProduct").disabled = false;
                    document.getElementById(parent + "-select-protein").disabled = false;
                    document.getElementById(parent + "-select-rna").disabled = false;
                    document.getElementById(parent + "-select-mircoRNA").disabled = false;
                    document.getElementById(parent + "-select-kinase").disabled = false;
                    document.getElementById(parent + "-select-ligand").disabled = false;
                    document.getElementById(parent + "-select-receptor").disabled = false;
                    document.getElementById(parent + "-select-biologicalProcess").disabled = false;
                    document.getElementById(parent + "-select-triangle").disabled = false;
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
                    document.getElementById(parent + "-select-mircoRNA").disabled = true;
                    document.getElementById(parent + "-select-kinase").disabled = true;
                    document.getElementById(parent + "-select-ligand").disabled = true;
                    document.getElementById(parent + "-select-receptor").disabled = true;
                    document.getElementById(parent + "-select-biologicalProcess").disabled = true;
                    document.getElementById(parent + "-select-triangle").disabled = true;
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
                document.getElementById(parent + "-gene-name").value = target.data('name');
                document.getElementById(parent + "-width").value = target.data('Width');
                document.getElementById(parent + "-height").value = target.data('Height');
                document.getElementById(parent + "-type-node").value = target.data('Type');
                if (typeof (target.data('rna')) != "undefined")
                    document.getElementById(parent + "-rna").value = target.data('rna');
                else
                    document.getElementById(parent + "-rna").value = '0';

                if (typeof (target.data('cnv')) != "undefined")
                    document.getElementById(parent + "-cnv").value = target.data('cnv');
                else
                    document.getElementById(parent + "-cnv").value = '0';

                if (typeof (target.data('mut')) != "undefined")
                    document.getElementById(parent + "-mut").value = target.data('mut');
                else
                    document.getElementById(parent + "-mut").value = '0';
            },
            autoOpen: false,
            height: 300,
            width: 350,
            buttons: {
                "submit": editNode,
                Cancel: function () {
                    dialogNode.dialog("close");
                }
            },
            close: function () {
            }
        });

        dialogEdge = $("#" + parent + "-dialog-form-edge").dialog({
            autoOpen: false,
            height: 300,
            width: 350,
            buttons: {
                "submit": editEdge,
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
                "submit": wrapperFindPath,
                Cancel: function () {
                    dialogPathfind.dialog("close");
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
        document.getElementById(parent + '-new-pathway').addEventListener('click', dialogNewPathwayOpen);
        document.getElementById(parent + '-file-pathway').addEventListener('change', onChangePathwayFile);
        document.getElementById(parent + '-file-coloring').addEventListener('change', onChangeColoringFile);
        document.getElementById(parent + '-background-image').addEventListener('change', onChangeBackgroundImageOnNode);
        document.getElementById(parent + '-background-image-remove').addEventListener('click', removeBackgroundImageOnNode);
        document.getElementById(parent + '-node-move-to-background').addEventListener('click', moveElementtoBackground);
        document.getElementById(parent + '-node-move-to-foreground').addEventListener('click', moveElementtoForeground);
        document.getElementById(parent + '-edge-move-to-background').addEventListener('click', moveElementtoBackground);
        document.getElementById(parent + '-edge-move-to-foreground').addEventListener('click', moveElementtoForeground);
        document.getElementById(parent + '-new-pathway').addEventListener('click', dialogNewPathwayOpen);
        document.getElementById(parent + '-findpath').addEventListener('click', dialogPathfindOpen);
        document.getElementById(parent + '-find-object').addEventListener('click', findObject);
        document.getElementById(parent + '-pathway-selector').addEventListener('change', onSelect);
        document.getElementById(parent + '-pathway-saveAs').addEventListener('click', dialogPathwaySaveAsOpen);
        document.getElementById(parent + '-pathway-save').addEventListener('click', savePathway);
        document.getElementById(parent + '-delete-elements').addEventListener('click', removeElements);
        document.getElementById(parent + '-add-node').addEventListener('click', addNode);
        document.getElementById(parent + '-add-edge').addEventListener('click', addEdge);
        document.getElementById(parent + '-expand').addEventListener('click', expandBundle);
        document.getElementById(parent + '-collapse').addEventListener('click', collapseBundle);
        document.getElementById(parent + '-bundle').addEventListener('click', dialogBundleOpen);
        document.getElementById(parent + '-unbundle').addEventListener('click', unbundle);
        document.getElementById(parent + '-produce-JSON').addEventListener('click', produceJSON);
        document.getElementById(parent + '-undo').addEventListener('click', undo);
        document.getElementById(parent + '-redo').addEventListener('click', redo);

        //external functions

        self.loadPathwayExternal = function (id) {
            loadPathway(id);
        }

        self.sprayColorExternal = function (list) {
            sprayColor(list);
        }

        self.testExternal = function () {
            console.log(print);
        }
        self.setDataToSpray = function (data) {
            this.sprayData = data;
        };
    });
};
