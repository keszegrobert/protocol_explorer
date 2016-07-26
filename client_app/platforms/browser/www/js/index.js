var protocol_table = {};
var current_protocol = -1;
var procedures = [];
var stack = [];

function get_procedure_page(header,question,answerlist){
    return '<div data-role="page">'+
     '<div data-role="header">'+
        '<a data-role="button" class="step_back">Back</a>'+
        '<h1 id="protocol_title">'+header+'</h1>'+
      '</div>'+
      '<div data-role="main" class="ui-content">'+
            '<h2 id="question">'+question+'</h2>'+
        '<ul data-role="listview" id="answer_list">'+
        answerlist+
        '</ul>'+
      '</div>'+
    '</div>';
}

function flatten_procedure(root)
{
    var result = procedures.length;
    var newproc = {
        q:root.question,
        a:[]
    };
    procedures.push(newproc);
    for (var i = 0; i < root.answers.length; i++) {
        var a = root.answers[i];
        var p = flatten_procedure(a.procedure);
        newproc.a.push({'a':a.answer,'p':p});
    }
    return result;
}

function loadJSON(jsonpath,callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', jsonpath, true); 
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }

$(document).ready(function(){
    $.mobile.defaultPageTransition = 'slide';
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
        procedures = []
        elements = ''
        for (index in protocol.sections)
        {
            var section = protocol.sections[index];
            elements += '<h1>'+section.name+'</h1><p>'+section.content+'</p>';
        }
        $('#protocol_content').html(elements);
        $('#protocol_title').html(protocol.name);
        if (protocol.procedure == null)
        {
            $('#protocol_steps').hide();
            procedures = [];
        }
        else
        {
            $('#protocol_steps').show();
            $('#protocol_steps').html('Steps');
            flatten_procedure(protocol.procedure);
            console.log(procedures);
        }
    });

    $(document).on('click','.protocol_steps',function(){
        var clickedon = parseInt($(this).attr('rel'));
        console.log('clicked on:' + clickedon);
        var proc = procedures[clickedon];
        var answers = '';
        for (var i = proc.a.length - 1; i >= 0; i--) {
            answers += '<li><a class="protocol_steps" '
                + 'rel="' + proc.a[i].p + '">' 
                + proc.a[i].a + '</a></li>';
        }
        var newPage = $(get_procedure_page(
            'Proba',
            proc.q,
            answers
        ));
        stack.push(newPage);
        newPage.appendTo($.mobile.pageContainer);
        $.mobile.changePage(newPage);
    });

    $(document).on('click','.step_back',function(){
        stack.pop();
        if (stack.length)
            $.mobile.changePage(stack[stack.length-1],{transition:'slide',reverse:true});
        else
            $.mobile.changePage($('#pagetwo'),{transition:'slide',reverse:true});
    });
});
