const fs = require("fs");
const router = require("express").Router();
const connection = require("../../db");
const path = require('path');
const Filter = require('bad-words');

let json_response = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../response_format.json"), 'utf8'));


router.get('/:post_id', (req, res) => {
    let id = req.params['post_id'];
    let data = {};
    connection.query("select answer_id, post_id, description, user_id,email from qa.answer natural join qa.user where post_id = ?", id,
        (error, results, fields) => {
            if (error) {
                console.error("error: ", error);
                json_response['success'] = false;
                json_response['message'] = error;
                res.json(json_response);
            } else if (results.length === 0) {
                json_response['success'] = false;
                json_response['message'] = "No matching post found";
                json_response['data'] = [];
                res.json(json_response);
            } else {
                json_response['data'] = results;
                json_response['success'] = true;
                json_response['message'] = 'answer of post  by post id';
                res.json(json_response);
            }
        });
});


let filter = new Filter();
router.post('/', (req, res) => {
    let req_body = req.body;
    let cleaned = filter.clean(req_body['description']);
    if (cleaned === req_body['description']) {

        connection.query("insert into answer(post_id, description,user_id) values (?,?,?)",
            [ req_body['post_id'], req_body['description'],req_body['user_id']],
            (error, results) => {
                if (error) {
                    console.error("error: ", error);
                    json_response['success'] = false;
                    json_response['message'] = error;
                    res.json(json_response);
                } else {
                    let affected_rows = results.affectedRows;
                    if (affected_rows === 0) {
                        console.log("affected rows 0");
                        json_response['message'] = 'Error';
                        json_response['data'] = [];
                        json_response['success'] = false;
                        res.json(json_response);
                    } else {
                        json_response['success'] = true;
                        json_response['message'] = 'Added ok';
                        json_response['data'] = [];
                        res.json(json_response);
                    }
                }
            })

    } else {
        json_response['message'] = 'BAD_WORDS';
        json_response['data'] = [];
        json_response['success'] = false;
        res.json(json_response);
    }
});

module.exports =router;