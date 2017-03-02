/*SERVER FOR Finance APP 
 BY : RITABAN CHOWDHURY
*/
var path        = require('path');
var express     = require('express');
var bodyParser  = require('body-parser');
var app   = express();
app.use(express.static('Public'));
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
/*HR APU  */




app.get('/some_data2', (req, res) => {
    console.log("\n input:", req.query);
    req.query['start'] = parseInt(req.query['start']);
    req.query['length'] = parseInt(req.query['length']);
    var sql = 'SELECT COUNT(*) FROM `hr_apu`; SELECT id as ID,  DATE_FORMAT(`date`, "%Y-%m-%d") as Date, dpt_name as Department, shift_nb as Shift, hdct as Headcount, totabs as total_absent, reason as reason FROM `hr_apu` LIMIT {start}, {length}'.formatSQL(req.query);
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



// /*SELECT * FROM `finance` WHERE `date` >= DATE_ADD( CURDATE(), INTERVAL -10 DAY) */
app.post('/insert_cell',(req,res)=>{
  console.log(req.body);
  var insertsql = "INSERT INTO `alex`.`hr_apu` ( `date`, `dpt_name`,`shift_nb`,`hdct`,`totabs`,`pcabs`,`reason`) VALUES ({date}, {department}, {shift}, {headcount}, {total_absent},{pcabs},{reason});".formatSQL(req.body);
  db.query(insertsql, function(err, data){
        if(err) throw err;
        console.log( data );
       // res.send( JSON.stringify(data));
    })
})

app.post("/update_cell", (req,res)=>{
    console.log("UPDATE:", req.body);
     var updatesql ="UPDATE `alex`.`hr_apu` SET `date` = {date}, `dpt_name` = {department}, `shift_nb` = {shift}, `hdct`={headcount}, `totabs`={totalabsent}, `reason`={reason} WHERE `hr_apu`.`id` = {id};".formatSQL(req.body);
     db.query(updatesql, function(err){if (err) throw err;});
})
/* END OF HR APU */

app.get('/some_data_finance', (req, res) => {
    console.log("\n input:", req.query);
    req.query['start'] = parseInt(req.query['start']);
    req.query['length'] = parseInt(req.query['length']);
    var sql = 'SELECT COUNT(*) FROM `finance`; SELECT id as ID,  DATE_FORMAT(`date`, "%Y-%m-%d") as Date, sales as Sales, scrap as Scrap, forecast as Forcast, inventory as Inventory, forecast_pc as Forecast_PC, scrap_pc as Scrap_PC, doh as DOH FROM `finance` LIMIT {start}, {length}'.formatSQL(req.query);
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



app.get('/last_ten_days_finance', (req,res) => {
 console.log("\n input:", req.query);
 var sql = 'SELECT DATE_FORMAT(`date`, "%Y-%m-%d") as Date, `sales` as "sales" FROM `finance` ORDER BY `date` DESC LIMIT 10;'
/*SELECT `date` as 'date', `sales` as 'sales' FROM `finance` ORDER BY `date` DESC LIMIT 10; */
 db.query(sql, function(err, data){
        if(err) throw err;
        console.log( data );
        res.send( JSON.stringify(data));
    })
 
 })

/*SELECT * FROM `finance` WHERE `date` >= DATE_ADD( CURDATE(), INTERVAL -10 DAY) */
app.post('/insert_cell_finance',(req,res)=>{
  console.log(req.body);
  var x = req.body.date;
  var y =req.body.sales;
  var w = req.body.scrap;
  var p= req.body.forecast;
  var z =req.body.inventory;
  var m =req.body.forecast_pc;
  var q = req.body.scrap_pc;
  var l =req.body.doh;
  var insertsql = "INSERT INTO `alex`.`finance` ( `date`, `sales`,`scrap`,`forecast`,`inventory`,`forecast_pc`,`scrap_pc`,`doh`) VALUES ({date}, {sales}, {scrap}, {forecast}, {inventory},{forecast_pc},{scrap_pc},{doh});".formatSQL(req.body);
  db.query(insertsql, function(err, data){
        if(err) throw err;
        console.log( data );
       // res.send( JSON.stringify(data));
    })
})

app.post("/update_cell_finance", (req,res)=>{
    console.log("UPDATE:", req.body);
     var updatesql ="UPDATE `alex`.`finance` SET `date` = {date}, `sales` = {sales}, `scrap` = {scrap}, `forecast`={forecast}, `inventory`={inventory}, `forecast_pc`={forecast_pc}, `scrap_pc`={scrap_pc}, `doh` ={doh} WHERE `finance`.`id` = {id};".formatSQL(req.body);
     db.query(updatesql, function(err){if (err) throw err;});
})

app.get('/some_data_labor', (req, res) => {
    console.log("\n input:", req.query);
    req.query['start'] = parseInt(req.query['start']);
    req.query['length'] = parseInt(req.query['length']);

    var sql = 'SELECT COUNT(*) FROM `labor`; SELECT id as ID,  DATE_FORMAT(`date`, "%Y-%m-%d") as Date, dpt_code as Code, dpt_name as Name, hours_worked as Hours FROM `labor` LIMIT {start}, {length}'.formatSQL(req.query);

    
    console.log( sql )
    db.query(sql, function(err, data){

       


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


app.post("/update_cell_labor", (req,res)=>{
    console.log("UPDATE:", req.body);
    var updatesql ="UPDATE `alex`.`labor` SET `date` = {newdateid}, `dpt_code` = {newcodeid}, `dpt_name` = {newnameid}, `hours_worked`={newhoursid} WHERE `labor`.`id` = {id};".formatSQL(req.body);
    db.query(updatesql, function(err){if (err) throw err;});
})

 app.post("/insert_cell_labor", (req,res)=> {
        console.log("INPUT********:" , req.body);
        res.send((req.body));
        var x= req.body.code;
        var y=req.body.date;
        var z =req.body.name;
        var w =req.body.hours;
        y="'"+y+"'"
        console.log(y);
        //console.log(formatSQL(req.body));
        //var insertsql= "INSERT INTO `alex`.`labor` (`id`, `date`, `dpt_code`, `dpt_name`, `hours_worked`) VALUES (NULL, '2017-01-31', '', '', '');"     
         var insertsql = "INSERT INTO `alex`.`labor` ( `date`, `dpt_code`,`dpt_name`,`hours_worked`) VALUES("+y+",'" +x[0]+"','"+z[0]+"','"+w[0]+"'),"
         insertsql+="("+y+",'" +x[1]+"','"+z[1]+"','"+w[1]+"'),"
         insertsql+="("+y+",'" +x[2]+"','"+z[2]+"','"+w[2]+"'),"
         insertsql+="("+y+",'" +x[3]+"','"+z[3]+"','"+w[3]+"'),"
         insertsql+="("+y+",'" +x[4]+"','"+z[4]+"','"+w[4]+"'),"
         insertsql+="("+y+",'" +x[5]+"','"+z[5]+"','"+w[5]+"'),"
         insertsql+="("+y+",'" +x[6]+"','"+z[6]+"','"+w[6]+"'),"
         insertsql+="("+y+",'" +x[7]+"','"+z[7]+"','"+w[7]+"'),"
         insertsql+="("+y+",'" +x[8]+"','"+z[8]+"','"+w[8]+"');"
         // var insertsql = "INSERT INTO `alex`.`labor` ( `date`) VALUES (STR_TO_DATE(" +y+ ")"+ ");"
            db.query(insertsql, function(err){if (err) throw err;});

})


app.get('/some_data_mixeff', (req, res) => {
    console.log("\n input:", req.query);
    req.query['start'] = parseInt(req.query['start']);
    req.query['length'] = parseInt(req.query['length']);
    var sql = 'SELECT COUNT(*) FROM `mixing_efficiency`; SELECT id as ID,  DATE_FORMAT(`date`, "%Y-%m-%d") as Date, shift_nb as Shift, batches as Batches, weight as Weight, hr_worked as Hours_Worked, kgmanhr as Kg_Man_Hr, comments as Comments FROM `mixing_efficiency` LIMIT {start}, {length}'.formatSQL(req.query);
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


/*SELECT * FROM `finance` WHERE `date` >= DATE_ADD( CURDATE(), INTERVAL -10 DAY) */
app.post('/insert_cell_mixeff',(req,res)=>{
  console.log(req.body);
  
  var insertsql = "INSERT INTO `alex`.`mixing_efficiency` ( `date`, `shift_nb`,`batches`,`weight`,`hr_worked`,`kgmanhr`,`comments`) VALUES ({date}, {shift}, {batches}, {weight}, {hours_worked},{kg_man_hr},{comments});".formatSQL(req.body);
  db.query(insertsql, function(err, data){
        if(err) throw err;
        console.log( data );
       // res.send( JSON.stringify(data));
    })
})

app.post("/update_cell_mixeff", (req,res)=>{
    console.log("UPDATE:", req.body);
     var updatesql ="UPDATE `alex`.`mixing_efficiency` SET `date` = {date}, `shift_nb` = {shift}, `batches` = {batches}, `weight`={weight}, `hr_worked`={hours_worked}, `kgmanhr`={kgmanhour}, `comments`={comments} WHERE `mixing_efficiency`.`id` = {id};".formatSQL(req.body);
    db.query(updatesql, function(err){if (err) throw err;});
})


app.get('/some_data_mixscrap', (req, res) => {
    console.log("\n input:", req.query);
    req.query['start'] = parseInt(req.query['start']);
    req.query['length'] = parseInt(req.query['length']);
    var sql = 'SELECT COUNT(*) FROM `mixing_scrap_nc`; SELECT id as ID,  DATE_FORMAT(`date`, "%Y-%m-%d") as Date, shift_nb as Shift, category as Category, havs_part_nb as Code, scrap_nc_code as part_no, batches as bathches, weight as Weight, report_nb as Report_no, comments as Comments FROM `mixing_scrap_nc` LIMIT {start}, {length}'.formatSQL(req.query);
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


app.post('/insert_cell_mixscrap',(req,res)=>{
  console.log(req.body);
  var insertsql = "INSERT INTO `alex`.`mixing_scrap_nc` ( `date`, `shift_nb`,`category`,`havs_part_nb`,`scrap_nc_code`,`batches`,`weight`,`report_nb`,`comments`) VALUES ({date}, {shift}, {category},{code},{part_no},{batches},{weight},{report_no},{comments});".formatSQL(req.body);
  db.query(insertsql, function(err, data){
        if(err) throw err;
        console.log( data );
      
    })
})

app.post("/update_cell_mixscrap", (req,res)=>{
    console.log("UPDATE:", req.body);
      var updatesql ="UPDATE `alex`.`mixing_scrap_nc` SET `date` = {date}, `shift_nb` = {shift}, `category` = {category}, `havs_part_nb`={code}, `scrap_nc_code`={part_no}, `batches`={batches}, `weight`={weight}, `report_nb` ={report_no}, `comments`={comments} WHERE `mixing_scrap_nc`.`id` = {id};".formatSQL(req.body);
     db.query(updatesql, function(err){if (err) throw err;});
})
app.get("/addnewdata_mixscrap",(req,res)=>{
var sql = 'SELECT * FROM `code_scrap_nc`;'
db.query(sql, function(err,data){if (err) throw err; res.send( JSON.stringify(data));});



})
app.get('/some_data_delivery', (req, res) => {
    console.log("\n input:", req.query);
    req.query['start'] = parseInt(req.query['start']);
    req.query['length'] = parseInt(req.query['length']);

    var sql = 'SELECT COUNT(*) FROM `delivery_apu`; SELECT id as ID,  DATE_FORMAT(`date`, "%Y-%m-%d") as Date, plant_name as plantname, dpt_name as dpt_name, customer as customer, havs_part_nb as havs_part_nb,quantity as quantity, expedite_nb as expedite, Time as time,comments as reason FROM `delivery_apu` LIMIT {start}, {length}'.formatSQL(req.query);

    
    console.log( sql )
    db.query(sql, function(err, data){

        


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


app.post("/update_cell_delivery", (req,res)=>{
    console.log("UPDATE:", req.body);
     var updatesql ="UPDATE `alex`.`delivery_apu` SET `date` = {newdateid}, `plant_name` = {plant}, `dpt_name` = {dept}, `customer`={cust}, `havs_part_nb`={part},`quantity`={qty}, `expedite_nb`={expedite},`Time` ={timein}, `comments`={reason} WHERE `delivery_apu`.`id` = {id};".formatSQL(req.body);
    db.query(updatesql, function(err){if (err) throw err;});
})

 app.post("/insert_cell_delivery", (req,res)=> {
        console.log("INPUT********:" , req.body);
        // res.send((req.body));
       
 var insertsql = "INSERT INTO `alex`.`delivery_apu` ( `date`, `plant_name`, `dpt_name`, `customer`, `havs_part_nb` ,`quantity`,`expedite_nb`,`Time`,`comments`) VALUES ({date}, {plant}, {department}, {customer}, {partno},{quantity},{expedite},{time},{reason});".formatSQL(req.body);    
 //var insertsql= "INSERT INTO `alex`.`delivery` ( `date`, `plant_name`, `dpt_name`, `customer`, `havs_part_nb` ,`quantity`,`expedite_nb`, `shuttle_time`,`comments`) VALUES ();"     
         
           db.query(insertsql, function(err){if (err) throw err;});

})

app.get("/addnewdata_delivery",(req,res)=>{
var sql = 'SELECT * FROM `customer`;'
db.query(sql, function(err,data){if (err) throw err; res.send( JSON.stringify(data));});



})


app.get('/some_data_dwt', (req, res) => {
    console.log("\n input:", req.query);
    req.query['start'] = parseInt(req.query['start']);
    req.query['length'] = parseInt(req.query['length']);

    var sql = 'SELECT COUNT(*) FROM `downtime`; SELECT id as ID,  DATE_FORMAT(`date`, "%Y-%m-%d") as Date, plant_name as plant, dpt_name as dept, shift_nb as shift, cell as cell,downtime as downtime, code_upd as code,duration as duration, comments as comments FROM `downtime` LIMIT {start}, {length}'.formatSQL(req.query);

    
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


app.post("/update_cell_dwt", (req,res)=>{
    console.log("UPDATE:", req.body);
    var updatesql ="UPDATE `alex`.`downtime` SET `date` = {datein}, `plant_name` = {plantin}, `dpt_name` = {deptin}, `shift_nb`={shiftin}, `cell`={cellin},`downtime`={downtimein},`code_upd`={codein}, `duration`={durationin},`comments`={commentsin} WHERE `downtime`.`id` = {idin};".formatSQL(req.body);
    db.query(updatesql, function(err){if (err) throw err;});
})

 app.post("/insert_cell_dwt", (req,res)=> {
         console.log(req.body);
         
         var insertsql = "INSERT INTO `alex`.`downtime` ( `date`, `plant_name`,`dpt_name`,`shift_nb`,`cell`,`downtime`,`code_upd`,`duration`,`comments`) VALUES ({date}, {plant}, {dept}, {shift}, {cell},{downtime},{code},{duration},{comments});".formatSQL(req.body);
         // // var insertsql = "INSERT INTO `alex`.`labor` ( `date`) VALUES (STR_TO_DATE(" +y+ ")"+ ");"
            db.query(insertsql, function(err){if (err) throw err;});
})

app.get("/addnewdata_dwt",(req,res)=>{
var sql = 'SELECT * FROM `cell`;'
db.query(sql, function(err,data){if (err) throw err; res.send( JSON.stringify(data));});
})
app.get("/addnewdata_dwt_code",(req,res)=>{
var sql = 'SELECT * FROM `code_upd`;'
db.query(sql, function(err,data){if (err) throw err; res.send( JSON.stringify(data));});
})

 app.get('/some_data_qualityapu', (req, res) => {
    console.log("\n input:", req.query);
    req.query['start'] = parseInt(req.query['start']);
    req.query['length'] = parseInt(req.query['length']);

    var sql = 'SELECT COUNT(*) FROM `quality_apu`; SELECT id as ID,  DATE_FORMAT(`date`, "%Y-%m-%d") as Date, plant_name as plant, dpt_name as dept, customer as customer, qa_nb as qa_nb, havs_part_nb as havs, qty_reject as rejected,  issue_description as issue,  DATE_FORMAT(`date_closed`, "%Y-%m-%d") as Date_closed   FROM `quality_apu` LIMIT {start}, {length}'.formatSQL(req.query);

    
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

app.get("/addnewdata_quality",(req,res)=>{
var sql = 'SELECT * FROM `customer`;'
db.query(sql, function(err,data){if (err) throw err; res.send( JSON.stringify(data));});
})

app.post("/insert_cell_quality", (req,res)=> {
        console.log("INPUT********:" , req.body);
        // res.send((req.body));
 var insertsql = "INSERT INTO `alex`.`quality_apu` ( `date`, `plant_name`, `dpt_name`, `customer`,`qa_nb`, `havs_part_nb` ,`qty_reject`,`issue_description`,`date_closed`) VALUES ({date}, {plant}, {dept}, {cust}, {qlity},{havs},{rejected},{issue},{dateclosed});".formatSQL(req.body);    
 db.query(insertsql, function(err){if (err) throw err;});

})

app.post("/update_cell_quality", (req,res)=>{
    console.log("UPDATE:", req.body);
    var updatesql ="UPDATE `alex`.`quality_apu` SET `date` = {dateboxin}, `plant_name` = {plantin}, `dpt_name` = {deptin}, `customer`={custin},`qa_nb`={qlityain}, `havs_part_nb`={havsin}, `qty_reject`={rejectedin},`issue_description`={issuein},`date_closed`={dateclosedin} WHERE `quality_apu`.`id` = {idin};".formatSQL(req.body);
    db.query(updatesql, function(err){if (err) throw err;});
})
app.get('/some_data_safety', (req, res) => {
    console.log("\n input:", req.query);
    req.query['start'] = parseInt(req.query['start']);
    req.query['length'] = parseInt(req.query['length']);

    var sql = 'SELECT COUNT(*) FROM `safety`; SELECT id as ID, incident_report_id as report_id,  DATE_FORMAT(`date`, "%Y-%m-%d") as Date_posted, alert_severity as alert_severity, plant as plant, dpt_name as department, shift as shift, area as area, injury_type as injury_type,  DATE_FORMAT(`date_closed`, "%Y-%m-%d") as date_closed FROM `safety` LIMIT {start}, {length}'.formatSQL(req.query);

    
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
    var updatesql ="UPDATE `alex`.`safety` SET `incident_report_id`={reportin},`date` = {date_postedin}, `dpt_name` = {deptin},`shift`={shiftin} ,`area`={areain},`injury_type`={injuryin},`date_closed`={date_closedin} WHERE `safety`.`id` = {idin};".formatSQL(req.body);
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
  var insertsql = "INSERT INTO `alex`.`safety` ( `date`, `plant`, `dpt_name`, `shift`,`category`, `incident_report_id`, `injury_type` ,`issue`,`area`,`alert_severity`,`osha_report`,`correction`,`submitted`,`comments`,`date_closed`) VALUES ({date_posted}, {plant}, {department}, {shift},{category},{report_id}, {injury},{issue},{area},{alertsev},{osha},{corrective},{alert},{comments},{date_closed});".formatSQL(req.body);    
  db.query(insertsql, function(err){if (err) throw err;});

})



/*#########################################################################################################*/
var dir_path = 'Public/';
var each = ["Images", "CSS", "js"];
for (var i = 0; i < each.length; i++){
        app.use('/' + each[i], express.static(path.join(__dirname, dir_path + '/' + each[i])));
}

//app.use(favicon(path.join(__dirname, dir_path + '/images' + '/favicon.ico')));
app.get('/', (req, res, next) => {
    console.log(req.body)
    if(req.path == '/')
    {
        res.locals.query = req.query;
        res.sendFile(path.join(__dirname, dir_path + '/index.html'));    
    }
    else
    {
        res.sendFile(path.join(__dirname, dir_path + req.path));
    }   
});
