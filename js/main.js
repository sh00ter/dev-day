// the magic goes here :)
function getJsonData(offset) {
    var api = "http://aznitro-silver-test4.awsdev.telegraph.co.uk/content/sections/portal/subsections?limit=10&offset=" + offset;
    $.ajax({
        url: api,
        beforeSend: setHeader
    }).done(function( data ) {
        var data = data['@graph'][0];
        var lastOffset = parseInt(data.last['@id'].split('offset=')[1], 10);
        if($('.pagination').is(':empty')){
            var pages = Math.ceil(lastOffset/10);
            getPagination(pages,lastOffset);
        }
        $(".js_json_data").empty().attr('start',offset);
        var links = data.contains['@list'];
        $.each(links,function( index, value ){
            console.log(index, value);
            var url = value.subsections['@id'].toString();
            // console.log(getSubSections(url));
            $(".js_json_data").append("<li  onclick='getSubSections(\""+url+"\")' class='list-group-item' title='"+(offset+index)+"'><span class='badge'>"+(offset+index)+"</span><span>"+value.label+"</span></li>");
           //$(".js_json_data").append("<li title='"+index+"'><span data-url='"+url+"'>"+value.label+"</span></li>");
        });
        $('.js_data_btn').hide();
    });
}

function getPagination(pages,lastOffset) {
    var offset;
    for(i=0;i<pages;i++){
        offset = 10*i + 1;
        if(offset > lastOffset){
            offset = lastOffset;
        }
        $(".pagination").append("<li><a onclick='getJsonData("+offset+")' href='#'>"+(i+1)+"</a></li>");
    };
}

function getSubSections(url){
    $.ajax({
        url: url.toString(),
        beforeSend: setHeader
    }).done(function(data) {
        var data = data['@graph'][0],
            subs = data.contains['@list'];
        $(".sub-section-list").show();
        $(".js_json_subs").empty();
        if(subs.length > 0){
            $.each(subs, function(index,value){
                $('.js_json_subs').append("<li class='list-group-item' title='"+index+"'><span class='badge'>"+index+"</span><span onclick='getSubSections(\""+url+"\")'>"+value.label+"</span></li>");
            });
        }else{
             $('.js_json_subs').append("<li class='list-group-item'>No SubSections</li>");
        }
    });
}

function setHeader(xhr) {
    xhr.setRequestHeader('accept', 'application/vnd.tcuk.content+core+ld+json');
}

// getSubSections('http://aznitro-silver-test4.awsdev.telegraph.co.uk/content/sections/0c127206-4dcc-4b0b-b30e-fb8bf4c95c82/subsections ');