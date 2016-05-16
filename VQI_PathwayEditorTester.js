var VQI_PathwayEditorTester = function() {
	self = this;

	function assert(a, b) {
		if (a != b)
			return false;
		else
			return true;
	}


	self.GUI = function() {
		var container;
		var objVQI_PathwayEditor;
		var available = {
			functions : {},
			objects : {}
		};

		function setup(type, test) {
			var callback = test || null;
			container = document.createElement('div');
			container.id = 'parent';

			objVQI_PathwayEditor = new VQI_PathwayEditor("test");
			objVQI_PathwayEditor.GUI("parent", (function() {
				var json = '{"format_version":"1.0","generated_by":"cytoscape-3.2.1","target_cytoscapejs_version":"~2.1","data":{"shared_name":"Pathway","ID":"342","BOARDWIDTH":"1131","BOARDHEIGHT":"858","LICENSE":"CC BY 2.0","ORGANISM":"Homo sapiens","NAME":"EMT","INSTRUCTION":"P53 is not a lonely genome guardian, it operates with the assistance of p73 and p63 within a complex network including distinct but complementary pathways. This protein family presents a      high level of sequence homology in its DNA binding domain. The complexity of the family has been enriched by the alternatively spliced forms of the genes. At present pathway, the alternatively spliced forms of p63 and p73 and how they interact with p53 are shown . However, little is known about the transcriptional regulation of p53 family members. Further studies will tell us whether the three genes of the family also share others regulatory activities.","AUTHOR":"","VERSION":"","PATHWAY_TYPE":"original","SUID":342,"__Annotations":[],"selected":true},"elements":{"nodes":[{"data":{"id":"n13","SUID":"n13","dbId":"34023","shared_name":"","name":"","Type":"bundleone","Height":10,"Width":10,"LabelSize":10,"GraphId":"n13","Valign":"Middle","zIndex":"0","selected":false,"BackgroundImage":"","ZIndex":0,"Rna":0,"Cnv":0,"Mut":0,"oldPositionX":0,"oldPositionY":0},"position":{"x":2082.6793338364,"y":241.97831605503498},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"classes":""},{"data":{"id":"n14","SUID":"n14","dbId":"34024","shared_name":"PTK2","name":"PTK2","Type":"ellipse","Height":20,"Width":35,"LabelSize":10,"GraphId":"n14","Valign":"Middle","zIndex":"0","selected":false,"BackgroundImage":"","ZIndex":0,"Rna":0,"Cnv":0,"Mut":0,"oldPositionX":0,"oldPositionY":0},"position":{"x":2159.2718434958,"y":273.96705866372},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"classes":""},{"data":{"id":"n0","SUID":"n0","dbId":"34068","shared_name":"IGF","name":"IGF","Type":"ligand","Height":25,"Width":50,"LabelSize":10,"GraphId":"n0","Valign":"Middle","zIndex":"0","selected":false,"BackgroundImage":"","ZIndex":0,"Rna":0,"Cnv":0,"Mut":0,"oldPositionX":0,"oldPositionY":0},"position":{"x":2080.5769479934,"y":111.21978147615},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"classes":""},{"data":{"id":"n1","SUID":"n1","dbId":"34069","shared_name":"IGF1R","name":"IGF1R","Type":"receptor","Height":25,"Width":50,"LabelSize":10,"GraphId":"n1","Valign":"Middle","zIndex":"0","selected":false,"BackgroundImage":"","ZIndex":0,"Rna":0,"Cnv":0,"Mut":0,"oldPositionX":0,"oldPositionY":0},"position":{"x":2080.5604246648,"y":156.17991338186},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"classes":""},{"data":{"id":"n2","SUID":"n2","dbId":"34070","shared_name":"","name":"","Type":"bundleone","Height":10,"Width":10,"LabelSize":10,"GraphId":"n2","Valign":"Middle","zIndex":"0","selected":false,"BackgroundImage":"","ZIndex":0,"Rna":0,"Cnv":0,"Mut":0,"oldPositionX":0,"oldPositionY":0},"position":{"x":1994.5939005576502,"y":240.368611207855},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"classes":""},{"data":{"id":"n3","SUID":"n3","dbId":"34071","shared_name":"NRAS","name":"NRAS","Type":"ellipse","Height":20,"Width":40,"LabelSize":10,"GraphId":"n3","Valign":"Middle","parent":"n2","zIndex":"0","selected":false,"BackgroundImage":"","ZIndex":0,"Rna":0,"Cnv":0,"Mut":0,"oldPositionX":0,"oldPositionY":0},"position":{"x":1986.3985233624,"y":232.8477550274},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"classes":""},{"data":{"id":"n12","SUID":"n12","dbId":"34077","shared_name":"PTEN","name":"PTEN","Type":"ellipse","Height":20,"Width":35,"LabelSize":10,"GraphId":"n12","Valign":"Middle","parent":"n13","zIndex":"0","selected":false,"BackgroundImage":"","ZIndex":0,"Rna":0,"Cnv":0,"Mut":0,"oldPositionX":0,"oldPositionY":0},"position":{"x":2066.8863333828,"y":253.34641181286},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"classes":""},{"data":{"id":"n4","SUID":"n4","dbId":"34078","shared_name":"PIK3CA","name":"PIK3CA","Type":"ellipse","Height":20,"Width":45,"LabelSize":10,"GraphId":"n4","Valign":"Middle","parent":"n13","zIndex":"0","selected":false,"BackgroundImage":"","ZIndex":0,"Rna":0,"Cnv":0,"Mut":0,"oldPositionX":0,"oldPositionY":0},"position":{"x":2091.47233429,"y":230.61022029721},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"classes":""},{"data":{"id":"n5","SUID":"n5","dbId":"34121","shared_name":"SRC","name":"SRC","Type":"ellipse","Height":20,"Width":35,"LabelSize":10,"GraphId":"n5","Valign":"Middle","zIndex":"0","selected":false,"BackgroundImage":"","ZIndex":0,"Rna":0,"Cnv":0,"Mut":0,"oldPositionX":0,"oldPositionY":0},"position":{"x":2139.4268370232,"y":225.52515665361},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"classes":""},{"data":{"id":"n6","SUID":"n6","dbId":"34123","shared_name":"ZHX2","name":"ZHX2","Type":"nType15","Height":20,"Width":35,"LabelSize":10,"GraphId":"n6","Valign":"Middle","parent":"n2","zIndex":"0","selected":false,"BackgroundImage":"","ZIndex":0,"Rna":0,"Cnv":0,"Mut":0,"oldPositionX":0,"oldPositionY":0},"position":{"x":2004.7892777529,"y":247.88946738831},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"classes":""}],"edges":[{"data":{"id":"e36","SUID":"e36","dbId":"19217","LineThickness":1,"Type":"solid","EndArrow":"activate","Coords":[{"x":0,"y":0},{"x":0,"y":0}],"GraphId":"e36","ZOrder":"12288","source":"n1","target":"n13","StartArrow":"Line","selected":false},"position":{},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"classes":""},{"data":{"id":"e8","SUID":"e8","dbId":"19218","LineThickness":1,"Type":"solid","EndArrow":"activate","Coords":[{"x":0,"y":0},{"x":0,"y":0}],"GraphId":"e8","ZOrder":"12288","source":"n5","target":"n14","StartArrow":"Line","selected":false},"position":{},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"classes":""},{"data":{"id":"e0","SUID":"e0","dbId":"19254","LineThickness":1,"Type":"solid","EndArrow":"line","Coords":[{"x":0,"y":0},{"x":0,"y":0}],"GraphId":"e0","ZOrder":"12288","source":"n0","target":"n1","StartArrow":"Line","selected":false},"position":{},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"classes":""},{"data":{"id":"e1","SUID":"e1","dbId":"19255","LineThickness":1,"Type":"solid","EndArrow":"activate","Coords":[{"x":0,"y":0},{"x":0,"y":0}],"GraphId":"e1","ZOrder":"12288","source":"n1","target":"n2","StartArrow":"Line","selected":false},"position":{},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"classes":""},{"data":{"id":"e35","SUID":"e35","dbId":"19261","LineThickness":1,"Type":"solid","EndArrow":"activate","Coords":[{"x":0,"y":0},{"x":0,"y":0}],"GraphId":"e35","ZOrder":"12288","source":"n4","target":"n12","StartArrow":"Line","selected":false},"position":{},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"classes":""},{"data":{"id":"e34","SUID":"e34","dbId":"19262","LineThickness":1,"Type":"solid","EndArrow":"activate","Coords":[{"x":0,"y":0},{"x":0,"y":0}],"GraphId":"e34","ZOrder":"12288","source":"n12","target":"n4","StartArrow":"Line","selected":false},"position":{},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"classes":""},{"data":{"id":"e2","SUID":"e2","dbId":"19283","LineThickness":1,"Type":"elType1","EndArrow":"alType2","Coords":[{"x":0,"y":0},{"x":0,"y":0}],"GraphId":"e2","ZOrder":"12288","source":"n1","target":"n5","StartArrow":"Line","selected":false},"position":{},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"classes":""}]}}'
				if (type == "partial") {
					this.GUI.loadPathwayExternalFromJSON(json);
					available.functions = this.GUI.expose();
					available.objects = this.GUI.refresh();
				} else if (type == "complete") {
					this.GUI.loadPathwayExternalFromJSON(json);
					var data = [["gene", "RNA", "PA"], ["IGF", 0, 0], ["IGF1R", .5, 0], ["NRAS", .25, .25], ["ZHX2", -.25, .5], ["PTEN", -2, -2], ["PIK3CA", -2.5, 1], ["SRC", 1, 0], ["PTK2", -1, -1]];
					this.GUI.sprayColorExternal(data);
					available.functions = this.GUI.expose();
					available.objects = this.GUI.refresh();
				}
				if (callback !== null) {
					callback();
				}
			}).bind(objVQI_PathwayEditor));
		};

		function teardown(remaining) {
			var callback = remaining || null;

			objVQI_PathwayEditor = null;
			container = null;
			available.functions = null;
			available.objects = null;

			if (callback !== null) {
				callback();
			}
		};

		function editPersonIdUnderTestAssertPersonIdChanged(remaining) {
			setup("complete", (function() {
				//execute
				testId = 10;
				document.getElementById(available.objects.parent + "-configure-person-id").value = testId;
				available.functions.editPersonId(testId);

				//refresh - acertain current state
				available.objects = objVQI_PathwayEditor.GUI.refresh();

				//assert a condition
				expectedId = testId;
				actualId = available.objects.personId;
				console.log(assert(expectedId, actualId));

				teardown(remaining);
			}));
		};

		function editPersonIdUnderTestAssertTitleMatchesPersonIdChanged(remaining) {
			setup("complete", (function() {
				//execute
				testId = 10;
				document.getElementById(available.objects.parent + "-configure-person-id").value = testId;
				available.functions.editPersonId(testId);

				//refresh - acertain current state
				available.objects = objVQI_PathwayEditor.GUI.refresh();

				//assert a condition
				var expectedTitle = available.objects.pathName + " <small>" + available.objects.personId + "</small>"
				var actualTitle = document.getElementById(available.objects.parent + "-pathway-title");
				console.log(assert(actualTitle, expectedTitle));

				teardown(remaining);
			}));
		};

		function run(tests) {
			var current = tests[0];
			tests.shift();
			if (tests.length > 0)
				current((function() {
					run(tests)
				}));
			else
				current((function() {
				}));
		}


		self.GUI.runTests = function() {
			var tests = [editPersonIdUnderTestAssertTitleMatchesPersonIdChanged, editPersonIdUnderTestAssertPersonIdChanged];
			run(tests);
		}
	}

	self.NoGUI = function() {
		function setup() {
		};

		function teardown() {
		};

		self.NoGUI.runTests = function() {
		}
	}
}
