const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const XLSX = require('xlsx');
const mysql = require('mysql2');
const Cors = require("cors");

const utils = require('./utils.js');

const PORT = 5050;

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'mysql123',
    database: 'darsak8',
    waitForConnections: true,
    // connectionLimit: 10,
    // queueLimit: 0
}).promise();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(Cors());

function getExcelData() {
    const workbook = XLSX.readFile(__dirname + '/files/public_students.xlsx'); // FILE path to insert

    const sheet_name_list = workbook.SheetNames;
    const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {
        raw: false,
        blankrows: true,
    });

    return xlData;
}

function getColumns(row, reqBody) {
    return {
        table_name: reqBody.table_name.trim(),
        type: reqBody.type.trim(), // student/ teacher
        edu_type: reqBody.edu_type.trim(), // public, un, private,
        read_announcements: '[]', // default value (empty)
        first_name: row.first_name,
        middle_name: row.middle_name,
        third_name: row.third_name,
        last_name: row.last_name,
        national_id: row.national_id && row.national_id !== 'NULL' ? row.national_id : null,
        emis_id: row.emis_id,
        school_id: row.school_id,
        grade_id: row.grade_id,
        nationality: row.nationality ? utils.formatNationality(row.nationality) : null,
        gender: row.gender ? utils.formatGender(row.gender): 'unknown',
        section: row.section ? utils.formatSection(row.section) : null,
        birthdate: row.date_of_birth ? utils.formatDate(row.date_of_birth) : row.date_of_birth,
        district_id: row.district ? utils.formatDistrict(row.district) : null // for unraw alwasy 5000
    };
}

function getFetchQuery(row, reqBody) {
    const columns = getColumns(row, reqBody);

    const fetch_query = `
        SELECT * FROM ${columns.table_name}
        WHERE emis_id = '${columns.emis_id}'
    `;

    return fetch_query;
}

function getInsertQuery(row, reqBody) {
    const columns = getColumns(row, reqBody);

    const insert_query = `
        INSERT INTO ${columns.table_name} 
        (   
            first_name, middle_name, third_name, last_name, 
            national_id, type, birthdate, emis_id, 
            district_id, school_id, grade_id, 
            gender, read_announcements, edu_type,
            section, nationality
        )
        VALUES
        (
            '${columns.first_name}', '${columns.middle_name}', '${columns.third_name}', '${columns.last_name}', 
            '${columns.national_id}', '${columns.type}', '${columns.birthdate}', '${columns.emis_id}', 
             ${columns.district_id}, ${columns.school_id}, ${columns.grade_id}, 
            '${columns.gender}', '${columns.read_announcements}', '${columns.edu_type}',
             ${columns.section}, ${columns.nationality}
        );
    `;

    return insert_query;
}

function getUpdateQuery(row, reqBody) {
    const columns = getColumns(row, reqBody);
    
    const update_query = `
        UPDATE ${columns.table_name}
        SET 
            first_name = '${columns.first_name}', 
            middle_name = '${columns.middle_name}', 
            third_name = '${columns.third_name}',
            last_name = '${columns.last_name}',
            national_id = '${columns.national_id}', 
            type = '${columns.type}',
            birthdate = '${columns.birthdate}',
            emis_id = '${columns.emis_id}',
            district_id = ${columns.district_id}, 
            school_id = ${columns.school_id}, 
            grade_id = ${columns.grade_id}, 
            gender = '${columns.gender}', 
            edu_type = '${columns.edu_type}',
            section = ${columns.section}, 
            nationality = ${columns.nationality}

        WHERE emis_id = ${columns.emis_id};
    `;

    return update_query;
}

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/', async function (req, res) {
    let updated_records = 0;
    let inserted_records = 0;
    const xlData = getExcelData();

    for(let row_index = 0; row_index < xlData.length; row_index++) {
        const row = xlData[row_index];
        const fetch_query = getFetchQuery(row, req.body);
        
        try  {
            const [fetch_rows] = await pool.query(fetch_query);
            
            if(fetch_rows.length === 0) {
                // Insert New Record
                const insert_query = getInsertQuery(row, req.body);
                const [insert_rows] = await pool.query(insert_query);

                inserted_records += insert_rows.affectedRows;

                console.log('INSERTED ROW (id): ', insert_rows.insertId)
            }
            else if(fetch_rows.length === 1) {
                // Update Existed Record
                const update_query = getUpdateQuery(row, req.body);
                const [update_rows] = await pool.query(update_query);
                
                updated_records += update_rows.affectedRows;

                console.log('UPDATED ROW (emis_id): ', fetch_rows[0].emis_id);
            } else {
                console.log('CAUTION: some records have a common emis_id', rows)
            }

        } 
        catch (e) {
            console.log('ERROR', e);
        }
    }

    console.log('\n\n\nFINISHED: _____________________________________________________');
    console.log('UPDATED RECORDS COUNT:\t\t', updated_records);
    console.log('INSERTED RECORDS COUNT:\t\t', inserted_records);
    console.log('TOTAL TRANSACTIONS COUNT:\t', inserted_records + updated_records);

    return res.json({message: 'FINISHED', inserted: inserted_records, updated: updated_records});
});


const server = app.listen(PORT, function () {
    console.log(`app listening at http://localhost:${PORT}`);
});

server.timeout = 150000;
