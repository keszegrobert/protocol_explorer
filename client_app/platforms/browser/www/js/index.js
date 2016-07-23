var protocol_table = {};
var current_protocol = -1;

function loadJSON(jsonpath,callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', jsonpath, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }

$(document).ready(function(){
    console.log('document is ready')
    loadJSON("protocols.json", function(data){
        console.log('json file is loaded');
        elements = '';
        protocol_table = eval('('+data+')');
        console.log('the version of the json file is: '+protocol_table.version);
        console.log('the count of protocols is: '+protocol_table.protocols.length);
        for (counter in protocol_table.protocols)
        {
            var p = protocol_table.protocols[counter];
            console.log(p);
            elements += '<li>'
                +'<a href="#pagetwo" data-transition="slide" '
                +'rel="'+counter+'" class="protocol_item">'
                +p.name
                +'</a></li>';
        }
        $('#protocol_list').html(elements).listview("refresh");
    });

    $(document).on(
        "click",
        "a.protocol_item",
        function(){ // When entering pagetwo
            current_protocol = parseInt(jQuery(this).attr('rel'));
        }
    );

    $(document).on("pagebeforeshow","#pagetwo",function(){ 
        console.log('selected protocol:'+ current_protocol);
        protocol = protocol_table.protocols[current_protocol];
        elements = ''
        for (index in protocol.sections)
        {
            var section = protocol.sections[index];
            elements += '<h1>'+section.name+'</h1><p>'+section.content+'</p>';
        }
        $('#protocol_content').html(elements);
        $('#protocol_title').html(protocol.name);
    });
});