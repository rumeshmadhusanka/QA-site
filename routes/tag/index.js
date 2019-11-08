const fs = require("fs");
const router = require("express").Router();
const connection = require("../../db");
const path = require('path');
let json_response = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../response_format.json"), 'utf8'));
const multer = require('multer');

//get all tags
router.get('/', (req, res) => {

    let data = {};

    connection.query("select tag_name from tag",
        (error, results, fields) => {
            if (error) {
                console.log(results);
                console.error("error: ", error);
                json_response['success'] = false;
                json_response['message'] = error;
                json_response['data'] =[];
                res.json(json_response);
            } else if(results.length===0){
                json_response['success'] = false;
                json_response['message'] = "No tags found";
                json_response['data'] =[];
                res.json(json_response);
            }
            else {
                results = results[0];
                data['tag_name'] = results['tag_name'];
                json_response['data'] =[];
                json_response['data'].push(data);
                json_response['success'] = true;
                json_response['message'] = 'All tags';
                res.json(json_response);
            }
        });


});

router.post('/', (req, res) => {
    let request_body = req.body;
    console.log(request_body);
    connection.query("insert into tag(post_id, tag_name) values (?,?)",
        [request_body['post_id'],request_body['tag_name']], (error, results, fields) => {
            if (error) {
                console.error("error: ", error);
                json_response['success'] = false;
                json_response['message'] = error;
                json_response['data'] =[];
                res.json(json_response);
            } else if (results.length === 0) {
                json_response['success'] = false;
                json_response['message'] = "No matching post found";
                json_response['data'] = [];
                res.json(json_response);
            }else{
                let affected_rows = results.affectedRows;
                json_response['success'] = true;
                json_response['message'] = 'Affected Rows: ' + affected_rows;
                json_response['data'] =[];
                res.json(json_response);
            }
        });

});
module.exports=router;