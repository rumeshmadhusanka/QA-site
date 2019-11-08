const fs = require("fs");
const router = require("express").Router();
const connection = require("../../db");
const path = require('path');
let json_response = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../response_format.json"), 'utf8'));
const multer = require('multer');

//get user profile
router.get('/:post_id', (req, res) => {
    let id = req.params['post_id'];
    let data = {};

    connection.query("select sum(vote) as vote1 from question_votes where post_id = ? ", id,
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
                json_response['message'] = "No matching user id found";
                json_response['data'] =[];
                res.json(json_response);
            }
            else {

                results = results[0];
                data['vote1'] = results['vote1'];
                json_response['data'] =[];
                json_response['data'].push(data);
                json_response['success'] = true;
                json_response['message'] = 'success';
                res.json(json_response);
            }
        });


});

router.post('/vote', (req, res) => {
    let request_body = req.body;
    console.log(request_body);
    connection.query("replace into question_votes( post_id,user_id, vote) values (?,?,?)",
        [request_body['post_id'],request_body['user_id'],request_body['vote']], (error, results, fields) => {
            if (error) {
                console.error("error: ", error);
                json_response['success'] = false;
                json_response['message'] = error;
                json_response['data'] =[];
                res.json(json_response);
            } else {
                let affected_rows = results.affectedRows;
                json_response['success'] = true;
                json_response['message'] = 'Affected Rows: ' + affected_rows;
                json_response['data'] =[];
                res.json(json_response);
            }
        });

});

module.exports =router;