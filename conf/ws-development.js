/**
 * @file ws-development.js
 * @author Pujan Joshi
 * @date April 22, 2016
 * 
 * 'ws-development.js' file is just a template. 
 * Make a copy of 'ws-development.js' file and name it as 'ws.js'and use 'ws.js' file to customize web service calls.
 * All other files should refer to 'ws.js' file. 
 * Do not commit 'ws.js' file into Git. 'ws.js' file should be ignored while syncing with the repository.
 * 
 */

if (typeof web_services === 'undefined') {
    web_services = {};
}

/* Services */
web_services['VQI_PATHWAY_EDITOR'] = {};
web_services['VQI_PATHWAY_EDITOR']["FIND_PATH"] = "http://magellan.engr.uconn.edu/puj07001/web_services/find_path_and_score/find_path_and_score.php";
web_services['VQI_PATHWAY_EDITOR']['GET_PATHWAY'] = 'http://magellan.engr.uconn.edu/puj07001/web_services/vqi_pathway/get_pathway.php';
web_services['VQI_PATHWAY_EDITOR']['SAVE_PATHWAY'] = 'http://magellan.engr.uconn.edu/puj07001/web_services/vqi_pathway/save_pathway.php';