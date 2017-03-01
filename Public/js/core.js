$(document).ready(function () {
 $('#myTable').DataTable({
          rowCallback : function( row, data, index ) {
                        $(row).click(function(row, data, index){
                          var myModalIDs = ["idin","dateboxin", "departmentin", "shiftin", "headcountin" ,"absentin", "reasonin"];
                          for (var i=0; i<data.length; i++)
                          {
                              $('#' + myModalIDs[i]).val(data[i])
                          }

                          $("#myModal2").modal("show");
                        }.bind(this, row, data, index));
                        },
           processing :   true,
           ordering   :   false,
           serverSide :   true,
           pageLength :   10,
           paginate   :   true,
           searching  :   true,
           ajax       :"/some_data2"
     });

    
    $("#edit").click(function(){
        var id   =$("#idin").val();
        var date = $("#dateboxin").val();
        var department =$("#departmentin").val();
        var shift = $("#shiftin").val();
        var headcount =$("#headcountin").val();
        var totalabsent = $("#absentin").val();
        var pcabs   =  totalabsent/headcount;
        var reason =$("#reasonin").val();
          var update_data = {id,date,department,shift,headcount, totalabsent, pcabs,reason};
        
         $.ajax({
          url         :"/update_cell",
          type        : "POST",
          contentType : "application/json",
          data        : JSON.stringify(update_data),
          processData : false
        }); 
    });
  $("#submit").click(function(){
              var date = $("#datebox").val();
              var department =$("#department").val();
              var shift = $("#shift").val();
              var headcount =$("#headcount").val();
              var total_absent = $("#absent").val();
              var pcabs =total_absent/headcount;
              var reason =$("#reason").val()
              var insert_data = {date,department,shift,headcount,total_absent, pcabs,reason};

              console.log(insert_data);
               $.ajax({
                url         :"/insert_cell",
                type        : "POST",
                contentType : "application/json",
                data        : JSON.stringify(insert_data),
                processData : false
              }); 
            })

 $('#myTable_finance').DataTable({
        rowCallback : function( row, data, index ) {
                      $(row).click(function(row, data, index){
                        var myModalIDs = ["idin","datein", "salesin", "scrapin", "forecastin" ,"inventoryin", "forecastpcin","scrappcin", "dohin"];
                        for (var i=0; i<data.length; i++)
                        {
                            $('#' + myModalIDs[i]).val(data[i])
                        }

                        $("#myModal2").modal("show");
                      }.bind(this, row, data, index));
                      },
         processing :   true,
         ordering   :   false,
         serverSide :   true,
         pageLength :   10,
         paginate   :   true,
         searching  :   true,
         ajax       :"/some_data_finance"
   });

  
  $("#edit_finance").click(function(){
      $.ajax({
        url         :"/last_ten_days_finance",
        type        :"GET",
        contentType :"application/json",
        complete    : function(data){
          console.log(data);
          var new_data = JSON.parse(data.responseText);
          console.log(new_data.length);
          var average_sales =0;
          for(var i=0 ;i<new_data.length;i++ ){
            average_sales += new_data[i].sales; 
            console.log(average_sales);
          } 
          average_sales = average_sales/(new_data.length);
          console.log("AVERAGE:"+ average_sales );
          
            var id   =$("#idin").val();
            var date = $("#datein").val();
            var sales =$("#salesin").val();
            var scrap = $("#scrapin").val();
            var forecast =$("#forecastin").val();
            var inventory = $("#inventoryin").val();
            var forecast_pc =sales/forecast;
            var scrap_pc = scrap/sales;
            var doh =inventory/average_sales;
            var insert_data = {id,date,sales,scrap,forecast, inventory,forecast_pc,scrap_pc,doh};

            console.log(insert_data);
             $.ajax({
              url         :"/update_cell_finance",
              type        : "POST",
              contentType : "application/json",
              data        : JSON.stringify(insert_data),
              processData : false
            }); 
          
        }.bind(this)
      })
    });



  $("#addNewData_finance").click(function(){
    $.ajax({
        url         :"/last_ten_days_finance",
        type        :"GET",
        contentType :"application/json",
        complete    : function(data){
          console.log(data);
          var new_data = JSON.parse(data.responseText);
          console.log(new_data.length);
          var average_sales =0;
          for(var i=0 ;i<new_data.length;i++ ){
            average_sales += new_data[i].sales; 
            console.log(average_sales);
          } 
          average_sales = average_sales/(new_data.length);
          console.log("AVERAGE:"+ average_sales );
          
          $("#submit_finance").click(function(){
            var date = $("#datebox").val();
            var sales =$("#sales").val();
            var scrap = $("#scrap").val();
            var forecast =$("#forecast").val();
            var inventory = $("#inventory").val();
            var forecast_pc =sales/forecast;
            var scrap_pc = scrap/sales;
            var doh =inventory/average_sales;
            var insert_data = {date,sales,scrap,forecast, inventory,forecast_pc,scrap_pc,doh};

            console.log(insert_data);
             $.ajax({
              url         :"/insert_cell_finance",
              type        : "POST",
              contentType : "application/json",
              data        : JSON.stringify(insert_data),
              processData : false
            }); 
          })
        }
      })
    
  })
 $('#myTable_labor').DataTable({
        rowCallback : function( row, data, index ) {
                      $(row).click(function(row, data, index){
                        var myModalIDs = ["idin","datein", "codein", "namein" ,"hoursin"];
                        for (var i=0; i<data.length; i++)
                        {
                            $('#' + myModalIDs[i]).val(data[i])
                        }

                        $("#myModal2").modal("show");
                      }.bind(this, row, data, index));
                      },
         processing :   true,
         ordering   :   false,
         serverSide :   true,
         pageLength :   10,
         paginate   :   true,
         searching  :   true,
         ajax       :"/some_data_labor"
         
        });
    $("#edit_labor").click(function(){
       var id               = $("#idin").val();
       var newdateid        = $("#datein").val();
       var newcodeid        = $("#codein").val();
       var newnameid        = $("#namein").val();
       var newhoursid       = $("#hoursin").val();
    
       
       var updated_data  = {id,newdateid,newcodeid,newnameid,newhoursid};
       console.log(updated_data);
         $.ajax({
               url         :"/update_cell_labor",
               type        : "POST",
               contentType : "application/json",
               data        : JSON.stringify(updated_data),
               processData : false
             });
    });

    $("#submit_labor").click(function(){
        var date =$("#datebox").val();
        
        console.log(typeof(date));
        var code   = [];
        var name   = [];
        var hours  = [];
        for (var i=0;i<9;i++){
          code.push($("#code_"+i).text());
          name.push($("#name_"+i).text());
          hours.push($("#hour_"+i).val());
        }
         
    
        var new_data  = {date, code,name,hours};
        
        $.ajax({
                url         :"/insert_cell_labor",
                type        : "POST",
                contentType : "application/json",
                data        : JSON.stringify(new_data),
                processData : false
        });
    

    });

  $('#myTable_mixeff').DataTable({
    rowCallback : function( row, data, index ) {
                      $(row).click(function(row, data, index){
                        var myModalIDs = ["idin","datein","shiftin","batchesin","weightin","hoursin","kgmanhour","commentsin"];
                        for (var i=0; i<data.length; i++)
                        {
                            $('#' + myModalIDs[i]).val(data[i])
                        }

                        $("#myModal2").modal("show");
                      }.bind(this, row, data, index));
                      },
         processing :   true,
         ordering   :   false,
         serverSide :   true,
         pageLength :   10,
         paginate   :   true,
         searching  :   true,
         ajax       :"/some_data_mixeff"
  });

  
  $("#edit_mixeff").click(function(){
  
            var id   =$("#idin").val();
            var date = $("#datein").val();
            var shift =$("#shiftin").val();
            var batches =$("#batchesin").val();
            var weight = $("#weightin").val();
            var hours_worked =$("#hoursin").val();
            var kgmanhour = $("#kgmanhour").val();
            var comments = $("#commentsin").val();
            var update_data = {id,date,shift,batches,weight,hours_worked,kgmanhour,comments};

            console.log(update_data);
             $.ajax({
              url         :"/update_cell_mixeff",
              type        : "POST",
              contentType : "application/json",
              data        : JSON.stringify(update_data),
              processData : false
            }); 
  });
$("#submit_mixeff").click(function(){
            var date = $("#datebox").val();
            var shift =$("#shift").val();
            var batches = $("#batches").val();
            var weight =$("#weight").val();
            var hours_worked = $("#hours_worked").val();
            var kg_man_hr = (weight/2.2)/hours_worked;
            var comments =$("#comments").val();
            
            var insert_data = {date,  shift,batches,weight,hours_worked,kg_man_hr,comments};

            console.log(insert_data);
             $.ajax({
              url         :"/insert_cell_mixeff",
              type        : "POST",
              contentType : "application/json",
              data        : JSON.stringify(insert_data),
              processData : false
            }); 
          })

  $('#myTable_mixscrap').DataTable({
        rowCallback : function( row, data, index ) {
                      $(row).click(function(row, data, index){
                        var myModalIDs = ["idin","dateboxin","shiftin","categoryin","codein","partnoin","batchesin","weightin","reportnoin","commentsin" ];
                        for (var i=0; i<data.length; i++)
                        {
                            $('#' + myModalIDs[i]).val(data[i])
                        }

                        $("#myModal2").modal("show");
                      }.bind(this, row, data, index));
                      },
         processing :   true,
         ordering   :   false,
         serverSide :   true,
         pageLength :   10,
         paginate   :   true,
         searching  :   true,
         ajax       :"/some_data_mixscrap"
   });

  
  $("#edit_mixscrap").click(function(){
    var id   =$("#idin").val();
    var date = $("#dateboxin").val();
    var shift =$("#shiftin").val();
    var category = $("#categoryin").val();
    var code= $("#codein").val();
    var part_no =$("#partnoin").val();
    var batches= $("#batchesin").val();
    var weight =$("#weightin").val();
    var report_no =$("#reportnoin").val();
    var comments =$("#commentsin").val();
    var insert_data = {id,date,shift,category,code,part_no,batches,weight,report_no,comments};

    console.log(insert_data);
     $.ajax({
      url         :"/update_cell_mixscrap",
      type        : "POST",
      contentType : "application/json",
      data        : JSON.stringify(insert_data),
      processData : false
    }); 
  });



  
  $("#submit_mixscrap").click(function(){
    var date = $("#datebox").val();
    var shift =$("#shift").val();
    var category = $("#category").val();
    var code =$("#code").val();
    var part_no = $("#partno").val();
    var batches =$("#batches").val();
    var weight =$("#weight").val();
    var report_no =$("#reportno").val();
    var comments = $("#comments").val();
    var insert_data = {date,shift,category,code,part_no,batches,weight,report_no,comments};

    console.log(insert_data);
     $.ajax({
      url         :"/insert_cell_mixscrap",
      type        : "POST",
      contentType : "application/json",
      data        : JSON.stringify(insert_data),
      processData : false
    }); 
  })


  $("#addNewData_mixscrap").click(function(){
      $.ajax({
            url  : "/addnewdata_mixscrap",
            type : "GET",
            contentType: "application/json",
            processData: false,
            complete : function(data){
              var data= JSON.parse(data.responseText);
              console.log(data);
              var st="<option></option>";
              for(var i=0;i<data.length;i++){
                st+= "<option>" + data[i].scrap_nc_code + "</option>";
              }
              $("#code").html(st);

            }
        })


  })
   
  $('#myTable_delivery').DataTable({
        rowCallback : function( row, data, index ) {
                      $(row).click(function(row, data, index){
                        var myModalIDs = ["idin","dateboxin", "plantin","deptin","custin","partnoin","qtyin","expeditein","timein","reasonin"];
                      for (var i=0; i<data.length; i++)
                        {
                            $('#' + myModalIDs[i]).val(data[i])
                        }

                        $("#myModal2").modal("show");
                      }.bind(this, row, data, index));
                      },
         processing :   true,
         ordering   :   false,
         serverSide :   true,
         pageLength :   10,
         paginate   :   true,
         searching  :   true,
         ajax       :"/some_data_delivery"
         
        });
    $("#edit_delivery").click(function(){
       var id               = $("#idin").val();
       var newdateid        = $("#dateboxin").val();
       var plant            = $("#plantin").val();
       var dept             = $("#deptin").val();
       var cust             = $("#custin").val();
       var part             = $("#partnoin").val();
       var qty              = $("#qtyin").val();
       var expedite         = $("#expeditein").val();
       var reason           = $("#reasonin").val(); 
    
       
       var updated_data  = {id,newdateid,plant,dept,cust,part,qty,expedite,reason};
       console.log(updated_data);
         $.ajax({
               url         :"/update_cell_delivery",
               type        : "POST",
               contentType : "application/json",
               data        : JSON.stringify(updated_data),
               processData : false
             });
    });

  $("#addnewdata_delivery").click(function(){
         $("#plant").change(function(){

        var st="";

        if($("#plant").val()=="Grand Rapids"){
          st+= "<option> Mixing</option>";
          st+="<option>Cementing</option>";
          st+="<option>Automation</option>"
        }else {
          st+="<option>Cementing</option>";
          st+="<option>Assembly </option>";
          st+="<option>Molding</option>";
          st+="<option>Automation</option>";
        }
        $("#dept").html(st);


         })

        
        $.ajax({
            url  : "/addnewdata_delivery",
            type : "GET",
            contentType: "application/json",
            processData: false,
            complete : function(data){
              var customers= JSON.parse(data.responseText);
              var cust_name=[]
              for (var i = 1; i < customers.length; i++) {
                cust_name[i] =customers[i].name 
              } 
              var st="";
              for (var i = 1; i < customers.length; i++) {
                 st += "<option>" + cust_name[i]+ "</option>";
                
              }
              $("#cust").html( st );  
            }
          })
    })
$("#submit_delivery").click(function(){
        var date =$("#datebox").val();
        var plant =$("#plant").val();
        var department=$("#dept").val();
        var customer =$("#cust").val();
        var partno=$("#partno").val();
        var quantity =$("#qty").val();
        var expedite=$("#expedite").val();
        
        var reason =$("#reason").val();
       
         
    
        var new_data  = {date,plant,department,customer,partno, quantity,expedite,reason};
        console.log(new_data);
        $.ajax({
                url         :"/insert_cell_delivery",
                type        : "POST",
                contentType : "application/json",
                data        : JSON.stringify(new_data),
                processData : false
        });
      })

       $('#myTable_dwt').DataTable({
        rowCallback : function( row, data, index ) {
                      $(row).click(function(row, data, index){
                        var myModalIDs = ["idin","datein", "plantin", "deptin" , "shiftin", "cellin", "downtimein", "codein","durationin", "commentsin"];
                        for (var i=0; i<data.length; i++)
                        {
                            $('#' + myModalIDs[i]).val(data[i])
                        }

                        $("#myModal2").modal("show");
                      }.bind(this, row, data, index));
                      },
         processing :   true,
         ordering   :   false,
         serverSide :   true,
         pageLength :   10,
         paginate   :   true,
         searching  :   true,
         ajax       :"/some_data_dwt"
         
        });
    $("#edit_dwt").click(function(){
      var idin = $("#idin").val(),
      datein   = $("#datein").val(),
      plantin  = $("#plantin").val(),
      deptin   = $("#deptin").val(),
      shiftin  = $("#shiftin").val(),
      cellin   = $("#cellin").val(),
      downtimein = $("#downtimein").val(),
      codein  =$("#codein").val()
      durationin =$("#durationin").val(),
      commentsin =$("#commentsin").val();
    
       
       var updated_data  = {idin,datein,plantin,deptin,shiftin,cellin,downtimein,codein,durationin,commentsin};
       console.log(updated_data);
         $.ajax({
               url         :"/update_cell_dwt",
               type        : "POST",
               contentType : "application/json",
               data        : JSON.stringify(updated_data),
               processData : false
             });
    });

    $("#submit_dwt").click(function(){
        var date =$("#datebox").val();
        var plant =$("#plant").val();
        var dept =$("#department").val();
        var shift =$("#shift").val();
        var cell = $("#cell").val();
        var code= $("#code_upd").val();
        var downtime =$("#downtime").val();
        var duration =$("#duration").val();
        var comments= $("#comments").val();
        var new_data  = {date,plant,dept,shift,cell,downtime,code,duration,comments};
        
        $.ajax({
                url         :"/insert_cell_dwt",
                type        : "POST",
                contentType : "application/json",
                data        : JSON.stringify(new_data),
                processData : false
        });
    

    });

    $("#addNewData_dwt").click(function(){
         $.ajax({
            url  : "/addnewdata_dwt_code",
            type : "GET",
            contentType: "application/json",
            processData: false,
            complete : function(data){
              var code= JSON.parse(data.responseText);
              //console.log(code);
               $("#downtime").change(function(){
                  var st1="";
                  var st2="";
                  for(var i=0;i<code.length;i++){
                    if(code[i].downtime =="planned"){
                       st1+="<option>"+code[i].code+ "</option>";
                     }else if(code[i].downtime =="unplanned"){
                       st2+="<option>"+code[i].code+ "</option>";
                     }
                   
                  }
                 //console.log("STRING1:",st1,"STRING2:",st2);
                  //
                  if($("#downtime").val()=="planned"){
                    $("#code_upd").html(st1);
                  }else{
                    $("#code_upd").html(st2);
                  }
                  //console.log(code);
                })
                
              


          }
        })


        $("#plant").change(function(){
            var st="<option></option>"
            if($("#plant").val()=="Grand Rapids"){
                st+="<option>Mixing</option>";
                st+="<option>Cementing</option>";
                st+="<option>Automation</option>";
              }else{
                st+="<option>Cementing</option>";
                st+="<option>Automation</option>";
                st+="<option>Assembly</option>";
                st+="<option>Moulding</option>";
              }

              $("#department").html(st);

        })

        $("#department").change(function(){
          $.ajax({
            url  : "/addnewdata_dwt",
            type : "GET",
            contentType: "application/json",
            processData: false,
            complete : function(data){
                 var data =JSON.parse(data.responseText)
                 //console.log(data);
                 var cell_name =[];
                 var dpt_mixing  =[];
                 var dpt_cementing=[];
                 var dpt_auto=[];
                 var st1="";
                 for(var i=0;i<data.length;i++){
                   if(data[i].dpt_name == "Mixing"){
                    dpt_mixing[i] = data[i].cell_name;

                   }else if(data[i].dpt_name == "Cementing"){
                    dpt_cementing[i] =data[i].cell_name;
                   }else if(data[i].dpt_name =="Automation"){
                    dpt_auto[i]=data[i].cell_name;
                   }
                 }
                 
                  st2="";
                 console.log(dpt_auto,dpt_cementing,dpt_mixing,$("#department").val());
                 if($("#department").val()=="Mixing"){
                  for(var i=0;i<dpt_mixing.length;i++){
                    st2 += "<option>";
                    st2+= dpt_mixing[i];
                    st2+= "</option>";
                  }
                   $("#cell").html(st2)
                 }
                 else if($("#department").val()=="Cementing"){
                  for(var i=1;i<dpt_cementing.length;i++){
                    st2 += "<option>";
                    st2+= dpt_cementing[i];
                    st2+= "</option>";
                  }
                  $("#cell").html(st2);
                 }
                 else if($("#department").val()=="Automation"){
                    for(var i=6;i<dpt_auto.length;i++){
                    st2 += "<option>";
                    st2+= dpt_auto[i];
                    st2+= "</option>";

                  }
                  $("#cell").html(st2);

                 }

               
                 
                 
                
            } 
                    
          })
        })



        
    })

    $('#myTable_qualityapu').DataTable({
        createdRow  : function(row,data,index){
             console.log(data[9]);
             
            if(data[9] == "0000-00-00"){

              $(row).css('color','red')
            }
        },
        rowCallback : function( row, data, index ) {
                      $(row).click(function(row, data, index){
                        var myModalIDs = ["idin","dateboxin", "plantin", "deptin" ,"custin", "qlityain","havsin","rejectedin","issuein","dateclosedin"];
                        for (var i=0; i<data.length; i++)
                        {
                            $('#' + myModalIDs[i]).val(data[i])
                        }

                        $("#myModal2").modal("show");
                      }.bind(this, row, data, index));
                      },
         processing :   true,
         ordering   :   false,
         serverSide :   true,
         pageLength :   10,
         paginate   :   true,
         searching  :   true,
         ajax       :"/some_data_qualityapu"
         
        });
     $("#edit_quality").click(function(){
         
        var idin =$("#idin").val(),
        dateboxin=$("#dateboxin").val(),
        plantin =$("#plantin").val(),
        deptin =$("#deptin").val(),
        custin =$("#custin").val(),
        qlityain=$("#qlityain").val(),
        havsin=$("#havsin").val(),
        rejectedin=$("#rejectedin").val(),
        issuein=$("#issuein").val(),
        dateclosedin=$("#dateclosedin").val();

          var update_data = {idin,dateboxin,plantin,deptin,custin,qlityain,havsin,rejectedin,issuein,dateclosedin};
        
         $.ajax({
          url         :"/update_cell_quality",
          type        : "POST",
          contentType : "application/json",
          data        : JSON.stringify(update_data),
          processData : false
        }); 
    });



   $("#addNewData_quality").click(function(){
        $.ajax({
            url  : "/addnewdata_quality",
            type : "GET",
            contentType: "application/json",
            processData: false,
            complete : function(data){
              $("#plant").change(function(){
            var st="<option></option>"
            if($("#plant").val()=="Grand Rapids"){
                st+="<option>Mixing</option>";
                st+="<option>Cementing</option>";
                st+="<option>Automation</option>";
              }else{
                st+="<option>Cementing</option>";
                st+="<option>Automation</option>";
                st+="<option>Assembly</option>";
                st+="<option>Moulding</option>";
              }

              $("#department").html(st);

        })
              var customers= JSON.parse(data.responseText);
              var cust_name=[]
              for (var i = 1; i < customers.length; i++) {
                cust_name[i] =customers[i].name 
              } 
              var st="";
              for (var i = 1; i < customers.length; i++) {
                 st += "<option>" + cust_name[i]+ "</option>";
                
              }
              $("#cust").html( st );  
            }
          })
    })
       

  $("#submit_quality").click(function(){
        var date= $("#datebox").val(),
        plant=$("#plant").val(),
        dept =$("#department").val(),
        cust =$("#cust").val(),
        qlity=$("#qltyno").val(),
        havs=$("#havs").val(),
        rejected=$("#rejected").val(),
        issue=$("#issue").val(),
        dateclosed=$("#dateclosedbox").val();
        console.log(dateclosed);
        if(dateclosed==""){

        }
        var new_data  = {date,plant,dept,cust,qlity,havs,rejected,issue,dateclosed};
        console.log(new_data);
        $.ajax({
                url         :"/insert_cell_quality",
                type        : "POST",
                contentType : "application/json",
                data        : JSON.stringify(new_data),
                processData : false
        });
      })

 $('#myTable_safety').DataTable({
         createdRow  : function(row,data,index){
             console.log(data[9]);
             
            if(data[9] == "0000-00-00"){

              $(row).css('color','red')
            }
        },
         rowCallback : function( row, data, index ) {
                      $(row).click(function(row, data, index){
                        var myModalIDs = ["idin", "reportin","date_postedin","alertsevin","plantin","deptin","Shiftin","areain","injuryin","date_closedin"];
                      for (var i=0; i<data.length; i++)
                        {
                            $('#' + myModalIDs[i]).val(data[i])
                        }

                        $("#myModal2").modal("show");
                      }.bind(this, row, data, index));
                      },
         processing :   true,
         ordering   :   true,
         serverSide :   true,
         pageLength :   10,
         paginate   :   true,
         searching  :   true,
         ajax       :"/some_data_safety"
    });

     $("#edit_safety").click(function(){
         var idin=$("#idin").val(), 
         reportin =$("#reportin").val(),
         date_postedin=$("#date_postedin").val(),
         alertsevin=$("#alertsevin").val(),
         plantin=$("#plantin").val(),
         deptin=$("#deptin").val(),
         shiftin=$("#Shiftin").val(),
         areain=$("#areain").val(),
         injuryin=$("#injuryin").val(),
         date_closedin=$("#date_closedin").val();
        

          var update_data = {idin,reportin,date_postedin,alertsevin,plantin,deptin,shiftin,areain,injuryin,date_closedin};
        
         $.ajax({
          url         :"/update_cell_safety",
          type        : "POST",
          contentType : "application/json",
          data        : JSON.stringify(update_data),
          processData : false
        }); 
    });
    $("#addNewData_safety").click(function(){
         $.ajax({
           
            url: "/alert_severity",
            type:"GET",
            contentType:"application/json",
            processData: false,
            complete:function(data){
                var alert =[];
                var data = JSON.parse(data.responseText);
                console.log(data);
                for (var i = 0; i < data.length; i++) {
                    alert[i] =data[i].alert_sev; 
                } 
                var st="";
                for (var i = 0; i < alert.length; i++) {
                  st += "<option>" + alert[i]+ "</option>";
                }
                $("#alertsev").html( st );  

            }
         })
          $.ajax({
            url: "/injury_type",
            type:"GET",
            contentType:"application/json",
            processData: false,
            complete:function(data){
                var injury =[];
                var data = JSON.parse(data.responseText);
                console.log(data);
                for (var i = 1; i < data.length; i++) {
                    injury[i] =data[i].injury_type; 
                } 
                var st="";
                for (var i = 1; i < injury.length; i++) {
                  st += "<option>" + injury[i]+ "</option>";
                }
                $("#injury").html( st );  

            }
         })
        $("#plant").change(function(){
         var st="";
         if($("#plant").val()=="GR"){
           console.log($("#plant").val())
           st+= "<option> Mixing</option>";
           st+="<option>Cementing</option>";
           st+="<option>Automation</option>"
          }else {
           st+="<option>Cementing</option>";
           st+="<option>Assembly </option>";
           st+="<option>Molding</option>";
           st+="<option>Automation</option>";
          }
         $("#department").html(st);
        })
    })
    $("#submit_safety").click(function(){
        var date_posted =$("#date_posted").val(),
        report_id   =$("#report_id").val(),
        plant   =$("#plant").val(),
        department=$("#department").val(),
        shift=$("#shift").val(),
        area =$("#area").val(),
        alertsev=$("#alertsev").val(),
        category=$("#category").val(),
        injury =$("#injury").val(),
        osha =$("#osha").val(),
        alert =$("#alert").val(),
        issue =$("#issue").val(),
        corrective =$("#corrective").val(),
        comments=$("#comments").val(),
        date_closed=$("#date_closed").val();
        var new_data  = {date_posted,report_id,plant,department, shift,area,alertsev,category,injury,osha,alert,issue,corrective,comments,date_closed};
        console.log(new_data);
        $.ajax({
                url         :"/insert_cell_safety",
                type        : "POST",
                contentType : "application/json",
                data        : JSON.stringify(new_data),
                processData : false
        });
      })
   


}) //DOC.READY