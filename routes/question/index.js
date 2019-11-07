const fs = require("fs");
const router = require("express").Router();
const connection = require("../../db");
const path = require('path');

let json_response = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../response_format.json"), 'utf8'));

//get all questions
router.get('/', (req, res) => {
    connection.query("select post_id, user_id, topic, content ,date from post",
        (error, results) => {
            if (error) {
                console.error("error: ", error);
                json_response['success'] = false;
                json_response['message'] = error;
                json_response['data'] = [];
                res.json(json_response);
            } else {
                json_response['data'] = results;
                json_response['success'] = true;
                json_response['message'] = 'All the posts';
                res.json(json_response);
            }
        });
});

//get answered questions
router.get('/answered', (req, res) => {
    connection.query(
        "select post_id, user_id, content, type from post where type='QUESTION' and marked=1 order by date desc ",
        (error, results) => {
            if (error) {
                console.error("error: ", error);
                json_response['success'] = false;
                json_response['message'] = error;
                json_response['data'] = [];
                res.json(json_response);
            } else {
                json_response['data'] = results;
                json_response['success'] = true;
                json_response['message'] = 'All the posts';
                res.json(json_response);
            }
        });
});


//unanswered
router.get('/unanswered', (req, res) => {
    connection.query(
        "select post_id, user_id, content, type from post where type='QUESTION' and marked=1 order by date desc ",
        (error, results) => {
            if (error) {
                console.error("error: ", error);
                json_response['success'] = false;
                json_response['message'] = error;
                json_response['data'] = [];
                res.json(json_response);
            } else {
                json_response['data'] = results;
                json_response['success'] = true;
                json_response['message'] = 'All the posts';
                res.json(json_response);
            }
        });
});

router.post('/', (req, res) => {
    let req_body = req.body;
    connection.query("insert into post(user_id, content, type, topic, date, marked) values (?,?,?)",
        [req_body['name'], req_body['description'], req_body['price']],
        (error, results) => {
            if (error) {
                console.error("error: ", error);
                json_response['success'] = false;
                json_response['message'] = error;
                res.json(json_response);
            } else {
                let affected_rows = results.affectedRows;
                json_response['message'] = 'Affected Rows: ' + affected_rows;
                res.json(json_response);
            }
        })
});






router.put('/:id', (req, res) => {
    let request_body = req.body;
    let id = req.params['id'];
    console.log(request_body);
    connection.query("update item set name=?, price=?, description=? where id=?",
        [request_body['name'], request_body['price'], request_body['description'], id],
        (error, results, fields) => {
            if (error) {
                console.error("error: ", error);
                json_response['success'] = false;
                json_response['message'] = error;
                res.json(json_response);
            } else {
                let affected_rows = results.affectedRows;
                json_response['message'] = 'Affected Rows: ' + affected_rows;
                res.json(json_response);
            }
        })
});

router.delete('/:id', (req, res) => {
    let id = req.params['id'];
    connection.query("delete from item where id=?", [id],
        (error, results) => {
            if (error) {
                console.error("error: ", error);
                json_response['success'] = false;
                json_response['message'] = error;
                res.json(json_response);
            } else {
                let affected_rows = results.affectedRows;
                json_response['message'] = 'Affected Rows: ' + affected_rows;
                res.json(json_response);
            }
        })
});
module.exports = router;