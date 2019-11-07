const fs = require("fs");
const router = require("express").Router();
const connection = require("../../db");
const path = require('path');
let json_response = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../response_format.json"), 'utf8'));

router.get('/', (req, res) => {
    let id = req.params['id'];
    let data = {};
    connection.query("select id, first_name, last_name, email, contact_no from customer where id = ?", id,
        (error, results, fields) => {
            if (error) {
                console.error("error: ", error);
                json_response['success'] = false;
                json_response['message'] = error;
                res.json(json_response);
            } else {
                //console.log(results);
                results = results[0];
                // data['id'] = results['id'];
                // data['first_name'] = results['first_name'];
                // data['last_name'] = results['last_name'];
                // data['email'] = results['email'];
                // data['contact_no'] = results['contact_no'];
                // json_response['data'].push(data);
                res.json(json_response);
            }
        });
});

router.get('/popular',(req,res)=>{

});