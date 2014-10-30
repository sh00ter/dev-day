console.log('test');
var offset = 0;
function getArticles(sectionID) {
  var sectionID = '64931391-9b75-458d-8ea2-6f4ae4ecc40f';
  var api = "http://aznitro-silver-test4.awsdev.telegraph.co.uk/content/sections/" + sectionID + "/articles?limit=20&offset=" + offset;
  api = 'http://aznitro-silver-test4.awsdev.telegraph.co.uk/content/cartoonArticles?order=desc';
  // api = 'http://aznitro-silver-test4.awsdev.telegraph.co.uk/content/articles?sort=views';
  $.ajax({
    url: api,
    beforeSend: setBasicHeader
  }).done(function(data) {
    var data = data['@graph'][0];
    console.log(data);
    var list = data.contains['@list'];
    var listOfURLs = _.pluck(list, '@id');
    $('.blog-overview').html('');
    _.each(listOfURLs, function(value) {
      console.log(value);
      $.ajax({
        url: value,
        beforeSend: setFullHeader
      }).done(function(data) {
        var data = data['@graph'][0];
        console.log(data);
        console.log(data.image);
        var img = data.image['@list'][0].url['@id'];
        var title = data.headline || 'Article Title';
        var date = data.publishedDate['@value'];
        var momentDate = moment(new Date(data.publishedDate['@value'])).fromNow();
        var url = data.url['@id'];
        console.log(img, title, date);

        $('.blog-overview').append('<article>'+
          '<a href="' + url + '" target="_blank" class="post-thumbnail"><img src="'+ img +'" alt=""></a>'+
          '<div class="article-excerpt">'+
            '<h2><a href="#">'+ title +'</a></h2>'+
            '<time datetime="'+ date +'">' + momentDate + '</time>'+
            '<span class="read-time">10" Read</span>'+
          '</div>'+
        '</article>');
      });
    });
  });
}

function setToStore(key, content) {
  localStorage.setItem(key, content);
}

function getFromStore(key) {
  var content = localStorage.getItem(key);
}

function setBasicHeader(xhr) {
    xhr.setRequestHeader('accept', 'application/vnd.tcuk.content+ld+json');
}

function setFullHeader(xhr) {
    xhr.setRequestHeader('accept', 'application/vnd.tcuk.content+full+ld+json');
}

$(document).ready(function() {
  getArticles();
});