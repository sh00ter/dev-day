// the magic goes here :)
function getJsonData(offset)
{
    var api = "http://aznitro-silver-test4.awsdev.telegraph.co.uk/content/sections/portal/subsections?limit=20&offset="+offset;
    $.ajax({
        url: api,
        beforeSend: setHeader
    }).done(function( data ) {
        console.log(data);
        window.test = data;
        var data = data['@graph'][0];
        var lastOffset = parseInt(data.last['@id'].split('offset=')[1], 10);
//        lastOffset = parseInt(offset,10);
        if($('.pagination').is(':empty')){
            var pages = Math.ceil(lastOffset/20);
            getPagination(pages,lastOffset);
        }
        $(".js_json_data").empty().attr('start',offset);
        var links = data.contains['@list'];
        $.each(links,function( index, value ){
            $(".js_json_data").append("<li title='"+index+"'><a onclick='getSubSections('"+value.subsections['@id']+"')' href='avascript:void(0);'>"+value.label+"</a></li>");
        });
        $('.js_data_btn').hide();
    });
}

function getPagination(pages,lastOffset) {
    var offset;
    for(i=0;i<pages;i++){
        offset = 10*(2*i) + 1;
        if(offset > lastOffset){
            offset = lastOffset;
        }
        $(".pagination").append("<li><a onclick='getJsonData("+offset+")' href='#'>"+(i+1)+"</a></li>");
    };
}

function getSubSections(url){
    $.ajax({
        url: url,
        beforeSend: setHeader
    }).done(function( data ) {
        console.log(data);
    });
}

function setHeader(xhr) {
    xhr.setRequestHeader('accept', 'application/vnd.tcuk.content+core+ld+json');
}