const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const XLSX = require('xlsx');
const mysql = require('mysql2');
const Cors = require("cors");

const utils = require('./utils.js');

const PORT = 5050;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql123',
    database: 'darsak8'
});

connection.query('SELECT * FROM users WHERE id < 10', (err, result, fields) => {
    if(err) {
        console.log('connecting to db failed');
        throw err;
    }
    console.log('connected to db successfuly');
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(Cors());


app.get('/', function (req, res) {
    const workbook = XLSX.readFile(__dirname + '/files/unrwa _students.xlsx');
    // const workbook = XLSX.readFile(__dirname + '/files/test.xlsx');
    const sheet_name_list = workbook.SheetNames;
    const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {
        raw: false,
        blankrows: true,
    });


    for(let row_index = 0; row_index < xlData.length; row_index++) {
        const row = xlData[row_index];

        /**
         * district id - 5000 
         * type = student
         * 
         */

        let first_name = row.first_name;
        let middle_name = row.middle_name;
        let third_name = row.third_name;
        let last_name = row.last_name;
        let national_id = row.national_id;
        let type = 'student';
        let emis_id = row.emis_id;
        let district_id = 5000;
        let school_id = row.school_id;
        let grade_id = row.grade_id;
        let nationality = row.nationality;
        let gender = row.gender ? row.gender.toLowerCase(): row.gender;
        let section = row.section ? row.section.split('').pop(): row.section;
        let birthdate = row.date_of_birth ? utils.getFormatedDate(row.date_of_birth) : row.date_of_birth;
        let read_announcements = '[]';


        const sql = `
            INSERT INTO darsak8.users 
            (   
                first_name, middle_name, third_name, last_name, 
                national_id, type, birthdate, emis_id, 
                district_id, school_id, grade_id, nationality, 
                gender, section, read_announcements
            )
            VALUES
            (
                '${first_name}', '${middle_name}', '${third_name}', '${last_name}', 
                '${national_id}', '${type}', '${birthdate}', '${emis_id}', 
                 ${district_id}, ${school_id}, ${grade_id}, '${nationality}', 
                '${gender}', '${section}', '${read_announcements}'
            );
        `;
        
        try  {
            connection.query(sql);
        } 
        catch {
            console.log('ERROR AT RAW NUMBER:', row_index);
            console.log('SQL QUERY', sql);
        }
    }

    return res.json('DONE');
    return res.json(arr);
    return res.json(xlData);
});


app.listen(PORT, function () {
    console.log(`app listening at http://localhost:${PORT}`);
});
