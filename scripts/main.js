window.onscroll = function() {
	var header = document.getElementById("headCaption");
	
	if (window.pageYOffset > header.offsetTop) {
		header.classList.add("sticky");
	} else {
		header.classList.remove("sticky");
	}
};

function ip_local()
{
	var ip = false;
	window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection || false;

	if (window.RTCPeerConnection)
	{
		ip = [];
		var pc = new RTCPeerConnection({iceServers:[]}), noop = function(){};
		pc.createDataChannel('');
		pc.createOffer(pc.setLocalDescription.bind(pc), noop);

		pc.onicecandidate = function(event)
		{
			if (event && event.candidate && event.candidate.candidate)
			{
				var s = event.candidate.candidate.split('\n');
				ip.push(s[0].split(' ')[4]);
			}
		}
	}

	return ip;
}

console.log(ip_local());

var randomArticle = 0 , itemsPerPage = 9 , page = 0 ;
var article = [{name:'',details:'',url:''}] , articleList = document.getElementById("articleList") ;

var socket = io.connect('http://127.0.0.1:8080');

socket.on('articles.chat', function (data) {
	article.push ( data ) ;
	randomArticle = Math.random() * article.length ;
	
	buildArticles();
});

function technology ( ) {
	article = [] ;
	articleList.innerHTML = '';
	socket.emit('articles.chat','req.technology');
	page = 0 ;
}

function earth ( ) {
	article = [] ;
	articleList.innerHTML = '';
	socket.emit('articles.chat','req.earth');
	page = 0 ;
}

function universe ( ) {
	article = [] ;
	articleList.innerHTML = '';
	socket.emit('articles.chat','req.universe');
	page = 0 ;
}

function movePage(idx){
	page = idx + page ;
	
	if ( page * itemsPerPage > article.length ) {
		page -= idx ;
		return ;
	}
	if ( page < 0 ) {
		page = 0 ;
		return ;
	}
	
	window.scrollTo(0, 0);
	buildArticles();
}

function selectArticle ( articleIdx ) {
	console.log(article[articleIdx].url);
	window.open(article[articleIdx].url,"_self");
}

function buildArticles ( ) {
	articleList.innerHTML = '';
  
	for ( var i = itemsPerPage * page ; i < article.length && i < itemsPerPage * page + itemsPerPage ; i++ ) {
		var background = document.createElement("button");
		background.setAttribute ( "class" , "article" ) ;
		background.setAttribute ( "onclick" , "selectArticle("+i+")" ) ;
		
		var titlediv = document.createElement("div");
		titlediv.appendChild ( document.createTextNode( article[i].name ) ) ;
		titlediv.setAttribute( "class" , "articleTitle" );
		
		var descriptiondiv = document.createElement("div");
		descriptiondiv.appendChild ( document.createTextNode(article[i].details) ) ;
		descriptiondiv.setAttribute( "class" , "articleDescription" );
		
		background.appendChild ( titlediv ) ;
		background.appendChild ( descriptiondiv ) ;
		
		articleList.appendChild ( background ) ;
	}
	
	var pageButtons = document.createElement("div");
	pageButtons.setAttribute ( "class" , "page" );
	
	var prev = document.createElement("button");
	prev.setAttribute ( "class" , "pageBtn" ) ;
	prev.setAttribute ( "onclick" , "movePage(-1)" ) ;
	prev.appendChild ( document.createTextNode("prev") ) ;
	
	var next = document.createElement("button");
	next.setAttribute ( "class" , "pageBtn" ) ;
	next.setAttribute ( "onclick" , "movePage(1)" ) ;
	next.appendChild ( document.createTextNode("next") ) ;
	
	pageButtons.appendChild(prev);
	pageButtons.appendChild(next);
	
	articleList.appendChild(pageButtons);
	
}
