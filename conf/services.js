if (typeof web_services === 'undefined') {
    web_services = {};
}
/* Pathway Editor */
web_services['VQI_PATHWAY_EDITOR'] = {};
web_services['VQI_PATHWAY_EDITOR']["pathwayFinderUrl"] = "http://bibci.engr.uconn.edu/puj07001/web_services/find_path_and_score/find_path_and_score.php";
web_services['VQI_PATHWAY_EDITOR']['pathwayFinder'] = 'http://cardinal3.engr.uconn.edu/pathwayVisual/PathwayParser/ajaxJSON.php';
web_services['VQI_PATHWAY_EDITOR']['pathwaySaver'] = 'http://cardinal3.engr.uconn.edu/pathwayVisual/PathwayParser/updateDB_json.php';
web_services['VQI_PATHWAY_EDITOR']['pathwayScorer'] = 'http://cardinal3.engr.uconn.edu/pathwayVisual/ScoreSystem/getScore.php';
web_services['VQI_PATHWAY_EDITOR']['pathwayWeightedScorer'] = 'http://137.99.11.122/pathway2/pathwayweightedscorer.php';
web_services['VQI_PATHWAY_EDITOR']['objectFinder'] = 'http://137.99.11.122/pathway2/qsys_json.php';

