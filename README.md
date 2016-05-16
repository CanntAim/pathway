<h1>VQI Pathway Editor</h1>
<h2>Introduction</h2>
<h3>Overview</h3>
The VQI Pathway editor is a standard pathway viewer, editor, and analyzer that enriches biologists understanding of the underlying biological process involved in the interaction of proteins, genes, etc. Pathways are visual networks that represent entity interaction in graph form. There are many other pathway editors/analyzers, this specific one aims at being a web-based application that handles editing on the front-end with analysis being delegated to remote services through requests. For additional reference on existing tools and how they might compare to this editor refer to the list below.

<h3>Other tools</h3>
*Pathway Common* - The first tool that will be looked at is Pathway Commons (PC) which has multiple components that add up to the overall package. Firstly PC serves as a pathway database; It’s supportive of typical query functionality such as extraction and publication, it aims to offer clear author attribution and also provide end-users tools for analysis. It uses the BioPAX as the representational standard when storing, passing and receiving pathway information. It pulls in pathway data from source databases but avoids duplicating some of the more advanced databasing features of those databases. On the user-end Pathway Commons offers tools for visualization and analysis. On the web it offers PCViz for simple visualization, primarily as a way to see genes in the context of a pathway. Secondly it offers ChiBE as a slightly more powerful visualization tool that can be downloaded as a Java application. Finally there is the CyPath2 tool which can be used for querying and analysis. This is much more of a studio suite that utilizes flash based cytoscape at the core of it’s design.

*Wikipathways* - Is complementary to the efforts of PC and just the same offers a place to facilitate the contribution and maintenance of pathways. The website is built on MediaWiki software and provides an interface that most people are familiar with. It offers an embedded editor that can be used to alter existing pathways or create new ones. Version history is kept so that changes can be reverted. Pathways can be downloaded and used in a variety of formats including object oriented (JSON,XML, etc) or images (JPG,PNG,etc). Exported files can be used with other tools that handle analysis.

*Pathway Studio* - Pathway Studio is proprietary owned software with associated use charges through licensing. It is available both through web and can be downloaded. Being that it is closed source there is no access to internal design of the application. Thusly the study will look at it in terms of its available features on the user end. Being that this is company owned software the natural expectation going into this survey study is that it’s the most powerful in terms of the features it offers and overall production quality.

<h3>Feature List</h3>
* Editing
  * Add/Remove/Update entities
  * Add/Remove/Update interactions
  * Bundle/Unbundle Entities
  * Collapse/Uncollapse Bundles
  * Save Remote/Download locally pathway
  * Maintain history of edits
  * Spray data over entities
  * Load multiple pathways on one canvas
  * Searching for entities
  * Duplicate entities 
* Analysis
  * Display found paths & scores (external service)
* Design
  * API (integerate with other services)
  * None-GUI Application (fallback)
  * Self-Documenting Code
  * Test framework

<h2>Design</h2>
The following section will go over the application at it's design level. Starting with how the project is currently formatted. This may very well change in the future thusly this section of the document **needs** to be kept up to date, to avoid confusion. Since this application uses Cytoscape.js as the design base this section will include a high level explaination of how Cytoscape is structured, including the purpose of the core and collection.

<h3>Project Structure</h3>
*VQI_PathwayEditor* - Overarching superclass, can be instantiated to run in 'test' or 'regular' modes. When running in test mode the internal functions and objects are exposed. The class maintains the service list, definitionHub, and other globals that are necessary in both GUI and NoGUI versions of the applications as well as functions that are used universally.

*VQI_PathwayEditor.NoGUI* - This subclass maintains the code for the NoGUI version of the application. This subclass can be instantiated easily, in the sense that it's dependency free. This means that it doesn't use cytoscape.js or any other external library since it doesn't require rendering. Despite being very lightweight the NoGUI editor still has useful functionality including the ability to load in pathways into memory, spray data over the pathways, print json representation of graph, download a json representation of the graph, get/set person ID, and call the find & score path service.

*VQI_PathwayEditor.GUI* - This subclass is where the bulk of the application is located. The high level overview of the subclasses structure is as followed.

* Globals (strVar maintains the applications view)
* Set the innerHTML of the parent container
* Code to execute once HTML loaded
 * Internal functions
 * Visual pathway (Initialize cytoscape graph)
 * ---Set type styling properties
 * ---Set layout
 * ---Code to excute once cytoscape graph loaded
 * ------This includes setting listeners and setting the view's state
* Setting the functionality on the dialog boxes
* Load in the remote pathway list
* Set listeners on the GUI
* API (external methods to call)
* Callback

*VQI_PathwayEditorTester* - This is the VQI_PathwayEditor tester. This class maintains the assert function, which is a simple condition checker. The GUI and NoGUI versions maintain their own setup and teardown functions along with a runTests function which maintains a list of tests that it runs through. The details of the Test Framework are outlined below. Any unit tests will be written here.

<h3>Underlying Architecture</h3>
The foundation of this application is based on cytoscape.js. Cytoscape.js, is a graph library that offers many features that would be difficult to reproduce from just pure D3 code. On top of that it follows good design principles and practices. The code is optimized internally and the library is dependency free. Just like in d3, cytoscape makes use of set-theory, functional patterns, and chaining that goes towards making code readable. Graph data can be passed to and from cytoscape applications via JSON. Cytoscape specification is extended towards graph theory so architecturally speaking cytoscape.js gravitates towards being representative of graphs. Similarly to d3, cytoscape.js has separation between the visual component and the data component.

*Core* - Is a given graph instance. The core is the main interface to the graph and can be used to manipulate the viewport, set listeners for elements, set styles for elements, add elements, issue batch jobs, trigger animations, data exports, or do retrieval of collections.

*Collection* - Is the node and edge data separate of the visualization, although it does store styling and attribute data that are or may be reflective visually. The collection is an underlying representation of the graph in terms of nodes and edges. Changes to the object attributes will be reflective in the graph instance as there is a one to one mapping to the visual object and the collection object. 

Operations on the collection are non destructive. The framework rather employs a binding mechanism, meaning the old versions of nodes or edges is preserved in a limbo like state for the duration of the application's lifetime. Since the core can handle initial bindings, as an example, for styling on the initial render; Any actions applied to the styling within the context of collection are considered overrides of this initial bindings. The same can be done for listeners. Aside from a coherent data/function architecture, cytoscape also provides graph theory operations ranging from centrality measurements and various types of traversals.

<h3>Test Framework</h3>
The project utilizes a custom made testing framework that is completely dependency free. The framework is simple but should meet the testing requirements of our program. Testing is based completely on asserts, or the checking of expected vs. actual conditions. We currently can do this on objects. Because Javascript is functional we could easily check whether the execution of our code matches the expectation. For this, we need a capture method to catch the actual execution, this should be considered as a future feature. 

We breakdown our tester into two seperate subclasses of the tester for GUI and NoGUI. Both of these subclasses have their own setup and teardown functions. These functions re-initiates the pathway editor for every test we run. For the setup phase of the GUI tester we can either do a "complete" or "partial" setup. For a complete setup we initiate the editor, load in a pathway, and spray data over it. For the partial we only initiate the editor. The teardown method simply sets the objects we're testing on to null

The idea of unit-tests is to test the smallest testable parts of an application. This means each test checks only one thing. Here is the template/procedure for writing tests, for actual examples check the code.

```javascript
// Test
function ATestForX(remaining){
   //either include "complete" or "partial"
			setup("complete",(function(){			
				//execute X
				
				// TO-DO - Input your execution
				//
				//
				//
				
				//refresh - acertain current state
				available.objects = objVQI_PathwayEditor.GUI.refresh();
				
				//assert that the expected condition matches the actual
				// TO-DO - Set your expectation and capture your actual
				
				var expected;
				var actual;
				console.log(console.log("aTestForX: " + assert(actual,expected).toString());
				
				teardown(remaining);
			}));
		};

self.GUI.runTests = function(){
	//TO-DO - Include the test(s) written above in the array below
	var tests = [AtestForX];
	run(tests);
}
```
<h2>Dependencies</h2>

```html
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
        <script src="VQI_PathwayEditorGUI.js"></script>
</head>
```
    
<h2>Use/Interface</h2>
This section will show examples of how to run the application					

To initiate a new PathwayEditor we run the line below
```javascript
var objVQI_PathwayEditor = new VQI_PathwayEditor();
```

To run the GUI version we excute the following line where "parent" is the id of the DOM container that will house the GUI.
```javascript
objVQI_PathwayEditor.GUI("parent");
```

If want to run the No GUI version we execute the following line. 
```javascript
objVQI_PathwayEditor.NoGUI();
```

We can then call the exposed methods of the NoGUI Editor as followed.
```javascript
var data = "Hello!";
objVQI_PathwayEditorNoGUI.setPersonIdNoGUI(data);

var result = objVQI_PathwayEditorNoGUI.getPersonIdNoGUI();
console.log(result);

objVQI_PathwayEditorNoGUI.loadPathwayExternalNoGUI(334);
```
This is how to initiate the tester and run it.
```javascript
var objVQI_PathwayEditorTester = new VQI_PathwayEditorTester();
objVQI_PathwayEditorTester.GUI();
objVQI_PathwayEditorTester.GUI.runTests();
```
                    
<h2>Reporting Bugs</h2>
Bugs should be filed in the issues section.
