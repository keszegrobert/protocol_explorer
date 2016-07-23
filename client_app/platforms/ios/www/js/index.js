var protocol_table = {};
var current_protocol = -1;

$(document).ready(function(){
    jQuery.getJSON("protocols.json", function(data){
        elements = '';
        protocol_table = data
        for (counter in protocol_table)
        {
            p = protocol_table[counter];
            console.log(p);
            elements += '<li>'
                +'<a href="#pagetwo" data-transition="slide" '
                +'rel="'+counter+'" class="protocol_item">'
                +p.name
                +'</a></li>';
        }
        $('#lst_protocol').html(elements).listview("refresh");
    });

    $(document).on(
        "click",
        "a.protocol_item",
        function(){ // When entering pagetwo
            current_protocol = parseInt(jQuery(this).attr('rel'));
        }
    );

    $(document).on("pagebeforeshow","#pagetwo",
        function(){ // When entering pagetwo
            console.log(current_protocol);

    });


});