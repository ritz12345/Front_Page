/*SERVER FOR LABOR APP 
 BY : RITABAN CHOWDHURY
*/
var path        = require('path');
var express     = require('express');
var bodyParser  = require('body-parser');
var app   = express();
app.use(express.static('public'));
var mysql = require('mysql');
var db;
function DatabaseConnect(){
   db = mysql.createConnection({
        host                : '172.24.253.4',
        user                : 'Alex',
        password            : 'Paulstra1',
        multipleStatements  :  true,
        database            : 'alex'
    });

    //Establish connection
    db.connect((err) => {
        if(err){
            throw err;
            console.log("DB Connection Error - Retrying", err);
            setTimeout(DatabaseConnect(), 2000);
        } else {

            console.log('connected to MySQL database')
        }
    });

    db.on('error', (err) => {
        console.log('DB Error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST')
            DatabaseConnect();
        else 
            throw err;
    });

}
DatabaseConnect();
//************************************************************************
// Deploy the webserver to listen to webpage requests
//************************************************************************
app.use(bodyParser.json()); // for parsing application/json
var myPort = 9000;
var server = app.listen(myPort,  function (){
    var host = server.address().address;
    var port = server.address().port;
    console.log("App listening at http://%s:%s", host, port)
});


String.prototype.formatSQL = function() {
  /*   var str = 'pass arg0 = {0} {1} {2} {foo}'.format('arg0', 1, 2, {foo:'foo'})  */

  var args = arguments;         //arguemens is a keyword
  this.unkeyed_index = 0;
  return this.replace(/\{(\w*)\}/g, function(match, key) {
    if (key === '') {
        key = this.unkeyed_index;
        this.unkeyed_index++
    }
    if (key == +key) {
        return args[key] !== 'undefined'
          ? mysql.escape(args[key]) 
          : match;
    } else {
        for (var i = 0; i < args.length; i++) {
          if (typeof args[i] === 'object' && typeof args[i][key] !== 'undefined') {
            return mysql.escape(args[i][key]) ;
          }
        }
        return match;
    }
  }.bind(this));

}

/***********************************************************************************************************************************************************/
app.get('/some_data_safety', (req, res) => {
    console.log("\n input:", req.query);
    req.query['start'] = parseInt(req.query['start']);
    req.query['length'] = parseInt(req.query['length']);

    var sql = 'SELECT COUNT(*) FROM `safety`; SELECT id as ID, incident_report_id as report_id,  DATE_FORMAT(`date`, "%Y-%m-%d") as Date_posted, alert_severity as alert_severity, plant as plant, dpt_name as department, area as area, injury_type as injury_type,  DATE_FORMAT(`date_closed`, "%Y-%m-%d") as date_closed FROM `safety` LIMIT {start}, {length}'.formatSQL(req.query);

    
    console.log( sql )
    db.query(sql, function(err, data){

        // retruned row 
        // [
        //     {
        //     Item: 'H63733A',
        //     Warehouse: 'GR',
        //     PostDate: Sun Nov 20 2016 00:00:00 GMT-0500 (Eastern Standard Time),
        //     TransCode: 'RC' },
        //     ...
        // ]


        if(err) throw err;
        console.log( data );

           var ret = {
          'draw' : parseInt(req.query['draw']),
          "recordsTotal": data[0][0]['COUNT(*)'],
          "recordsFiltered":data[0][0]['COUNT(*)'], //data[1].length,

         };
        var d = [];
        for(var i = 0; i < data[1].length; i++){
            var item = []
            var keys = Object.keys(data[1][i])
            for (var j = 0; j < keys.length; j++){
                item.push(data[1][i][keys[j]])
            }
            //console.log("ITEM",item);
            d.push(item)
       }

       ret['data']=d;
       //console.log("RET",ret);
        res.send( JSON.stringify(ret));
    })

    
});


app.post("/update_cell_safety", (req,res)=>{
    console.log("UPDATE:", req.body);
    var updatesql ="UPDATE `alex`.`safety` SET `incident_report_id`={reportin},`date` = {date_postedin}, `dpt_name` = {deptin}, `area`={areain},`injury_type`={injuryin},`date_closed`={date_closedin} WHERE `safety`.`id` = {idin};".formatSQL(req.body);
    db.query(updatesql, function(err){if (err) throw err;});
})



app.get("/alert_severity",(req,res)=>{
  var sql = 'SELECT * FROM `alert_severity`;'
  db.query(sql, function(err,data){if (err) throw err; res.send( JSON.stringify(data));});
})
app.get("/injury_type",(req,res)=>{
  var sql = 'SELECT * FROM `injury`;'
  db.query(sql, function(err,data){if (err) throw err; res.send( JSON.stringify(data));});
})
app.post("/insert_cell_safety", (req,res)=> {
  //console.log("INPUT********:" , req.body);
  var insertsql = "INSERT INTO `alex`.`safety` ( `date`, `plant`, `dpt_name`, `incident_report_id`, `injury_type` ,`issue`,`area`,`alert_severity`,`osha_report`,`correction`,`submitted`,`comments`,`date_closed`) VALUES ({date_posted}, {plant}, {department}, {report_id}, {injury},{issue},{area},{alertsev},{osha},{corrective},{alert},{comments},{date_closed});".formatSQL(req.body);    
  db.query(insertsql, function(err){if (err) throw err;});

})

