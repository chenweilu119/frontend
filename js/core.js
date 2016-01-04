//课程begin
(function(){
    var pageNo = 1; //当前页码
    var psize = 20; //每页返回数据个数
    var type = 10; //筛选类型
    var tab1 = document.querySelector(".m-main .m-left .tab1"); //产品设计
    var tab2 = document.querySelector(".m-main .m-left .tab2"); //编程语言
    var url = "http://study.163.com/webDev/couresByCategory.htm";
    var totalPage = 1000;
    function ajax1(url,pageNo,psize,type){
        ajax({
        method : 'get',
        url : url,
        data : {
            'pageNo': pageNo,
            'psize': psize,
            'type': type
        },
        success : function (data){
                     recall(data,psize);
                  },
        async : true
        })
    }
    function recall(data,psize){
        var box = JSON.parse(data);
        totalPage = box.totalPage;
        var classes = document.querySelector(".m-classes");
        var class_one = document.querySelector(".m-class"); 
        var class_img = document.querySelector(".m-class .Bitmap"); //课程中图
        var class_name = document.querySelector(".m-class .name"); //课程名称
        var class_provider = document.querySelector(".m-class .provider"); //机构发布者
        var class_lc = document.querySelector(".m-class .learnerCount"); //在学人数
        var class_price = document.querySelector(".m-class .price"); //课程价格
        var cn = document.querySelector(".classContainer .categoryName");
        var des = document.querySelector(".classContainer .description");
        var page = document.querySelectorAll(".m-pages li");
        while(classes.hasChildNodes()){
            classes.removeChild(classes.firstChild);
        }
        for(var i=0; i<psize ;i++){
            cn.textContent = box.list[i].categoryName; //之前用了innerText，在firefox下不兼容
            des.textContent = box.list[i].description;
            class_img.src = box.list[i].middlePhotoUrl;
            class_name.textContent = box.list[i].name;
            class_provider.textContent = box.list[i].provider; 
            class_lc.textContent = box.list[i].learnerCount; 
            class_price.textContent = '￥'+box.list[i].price+'.00';
            var cNode = class_one.cloneNode(true);
            classes.appendChild(cNode);
        }
        //分页器
        if(pageNo>5&&pageNo<(parseInt(totalPage)-2)){
            for(var i=1;i<9;i++){
                page[i].textContent = pageNo-5+i;
            }
        }
        else if (pageNo>=(parseInt(totalPage)-2)){
            for(var i=1;i<9;i++){
                page[i].textContent = parseInt(totalPage)-8+i;
            }
        }
        else{
            if (page[1]!=1) {
                for(var i=1;i<9;i++){
                page[i].textContent = i;
                page[i].className = 'ho'; 
                }
                page[pageNo].className = 'select';
                page[pageNo].style.cursor = "default";
            }
        }
  
    }
    var course = function(psize){
        tab1.onclick = function(){// 产品设计
            type = 10;
            tab1.className = 'tab tab1 selected';
            tab2.className = 'tab tab2';
            pageNo = 1;
            ajax1(url,pageNo,psize,type);
        };
        tab2.onclick = function(){// 编程语言
            type = 20;
            tab2.className = 'tab tab2 selected';
            tab1.className = 'tab tab1';
            pageNo = 1;
            ajax1(url,pageNo,psize,type);
        };
       ajax1(url,pageNo,psize,type);

        //分页器
        var pages = document.querySelector(".m-pages");
        var page = document.querySelectorAll(".m-pages li");
        var rect1 = document.querySelector(".m-pages .rect1");
        var rect2 = document.querySelector(".m-pages .rect2");
        function change(pageNo){ // 判断上一页、下一页的样式
            if (pageNo<2){
                rect1.style.cursor = "default";
                rect1.style.backgroundColor="#eee";
                rect2.style.cursor = "pointer";
                rect2.style.backgroundColor="#9dd8b1"
            }
            else if(pageNo>(parseInt(totalPage)-1))
            {
                rect1.style.cursor = "pointer";
                rect1.style.backgroundColor="#9dd8b1"
                rect2.style.cursor = "default";
                rect2.style.backgroundColor="#eee";
            }
            else {
                rect1.style.cursor = "pointer";
                rect1.style.backgroundColor="#9dd8b1"
                rect2.style.cursor = "pointer";
                rect2.style.backgroundColor="#9dd8b1";
            }
        }
        function canSelect(i){//有hover状态，指针为手型
            page[i].className = 'ho';
            page[i].style.cursor = "pointer";
        }
        function cantSelect(i){//无hover状态，指针为箭头
            page[i].className = 'select';
            page[i].style.cursor = "default";
        }
        change(pageNo);     
        for (var i=1; i<9; i++){
            page[i].index = i;
            page[i].onclick = function(){
                pageNo = this.textContent;
                for (var j=1; j<9; j++){
                    canSelect(j);
                }
                if (this.textContent<6){
                    this.className = 'select'; 
                    this.style.cursor = "default";
                }
                else if(pageNo>parseInt(totalPage)-3)
                    cantSelect(8-(parseInt(totalPage)-parseInt(pageNo)));
                else cantSelect(5);
                ajax1(url,pageNo,psize,type);
                change(pageNo);
            }
        }
        page[0].onclick = function(){// 上一页
            change(parseInt(pageNo)-1);
            if(pageNo>1){
                pageNo--;
                this.style.cursor = "pointer";
                for (var j=1; j<9; j++){
                    canSelect(j);
                }
                if(pageNo<6) cantSelect(pageNo);
                else if(pageNo>parseInt(totalPage)-3)
                    cantSelect(8-(parseInt(totalPage)-parseInt(pageNo)));
                else cantSelect(5);
                ajax1(url,pageNo,psize,type);
            }
        }
       
        page[9].onclick = function(){// 下一页
            if (pageNo>=totalPage) return;
            change(parseInt(pageNo)+1);
            pageNo++;
            this.style.cursor = "pointer";
            for (var j=1; j<9; j++){
                canSelect(j);
            }
            if (pageNo <6) cantSelect(pageNo);
            else if(pageNo>parseInt(totalPage)-3)
                cantSelect(8-(parseInt(totalPage)-parseInt(pageNo)));
            else cantSelect(5);
            ajax1(url,pageNo,psize,type);
        }
    }
    //根据窗口大小调整每页返回数据个数
    if (window.innerWidth>1205) {psize=20;  course(psize);}
    else {psize=15;  course(psize);}
    window.onresize= function(){
        if (window.innerWidth>1205) {psize=20;  course(psize);}
        else {psize=15;  course(psize);}
    }
})();
//课程end

//排行榜begin
 (function(){
 ajax({
    method : 'get',
    url : 'http://study.163.com/webDev/hotcouresByCategory.htm',
    data : {},
    success : function (data){
        var rank =document.querySelector(".m-rank .rank");
        var rank1 =document.querySelector(".rank1");
        var rank2 =document.querySelector(".rank2");
        var rank_one =document.querySelector(".m-rank-one");
        var rank_img = document.querySelector(".rank1 .left"); //小图
        var rank_name = document.querySelector(".rank1 .name"); //课程名称
        var rank_lc = document.querySelector(".rank1 .learnerCount"); //在学人数
        var box = JSON.parse(data);
        rank1.removeChild(rank_one);
        //显示前十个
        for(var i = 0; i < 20; i++){  
                rank_img.src = box[i].smallPhotoUrl;
                rank_name.textContent = box[i].name;
                rank_lc.textContent = box[i].learnerCount;
                var cNode = rank_one.cloneNode(true);
                rank1.appendChild(cNode); 
            }
        
        //循环
        var k = 10; 
        setInterval(function(){
            rank_img.src = box[k].smallPhotoUrl;
            rank_name.textContent = box[k].name;
            rank_lc.textContent = box[k].learnerCount;
            var cNode = rank_one.cloneNode(true);
            rank1.removeChild(rank1.firstElementChild);
            rank1.appendChild(cNode);
            k++;
            if(k>19) k=0;
            },5000)},
    async : true
});
})();
//排行榜end

// 提醒条begin
(function(){
	var bg = document.querySelector(".bg");
	var close = document.querySelector(".bg .close");
	addEvent(close,'click',function(event){
        setCookie("v_close",0,"d1");
		bg.style.display = 'none';
	});
    if (getCookie("v_close")==0) 
        bg.style.display = 'none';
})();
// 提醒条end

// 登录begin  
// 固定用户帐号：studyOnline ; 固定用户密码：study.163.com ; 
(function(){
    var closeLogin = document.querySelector('.m-login .close');
    var submit = document.querySelector(".m-login .submit");
    var userName = document.querySelector(".m-login .userName");
    var password = document.querySelector(".m-login .password");
    var login = document.querySelector('.m-login');
    var tip = document.querySelector(".m-login .tip");
    var follow = document.querySelector('.g-header .m-follow .follow');
    var followed = document.querySelector('.g-header .m-follow .followed');
    var cancel = document.querySelector(".g-header .m-follow .followed .cancel");
    var mask = document.querySelector(".mask");
    var state = function(data,v_userName,v_password,v_cancel){ // 在输入框输入不同数据时对应的不同状态
        if(parseInt(data,10)==1) {
            if(v_cancel !=0){
            setCookie("userName",v_userName,"d1");//cookies保存一天
            setCookie("password",v_password,"d1");
            follow.style.display = "none";
            followed.style.display = "inline-block";
            login.style.display = 'none';
            mask.style.display = 'none';} 
        }
        else {
            if (userName.value==""){
                userName.style.borderColor = "#ff0000";
                password.style.borderColor = "#dfdfdf";
                tip.textContent = "请输入用户名！";
                tip.style.display = "inline-block";
                userName.focus();
            }

            else if (password.value==""){
                userName.style.borderColor = "#dfdfdf";
                password.style.borderColor = "#ff0000";
                tip.textContent = "请输入密码！";
                tip.style.display = "inline-block";
                password.focus();
            }
            else{
                password.style.borderColor = "#dfdfdf";
                tip.textContent = "您输入的密码有误！";
                tip.style.display = "inline-block";
                password.focus();
            }
        }
    }
    var saved =  (function(){  // 判断刚进入页面时是否保存账号密码cookies，即是否登录
        if(getCookie("userName")!=null&&getCookie("password")!=null){
            
            follow.style.display = "none";
            followed.style.display = "inline-block";
        }
    })();

    var canceled = (function(){ // 判断刚进入页面时是否取消关注状态
        if(getCookie("v_cancel")==0){
            follow.style.display = "inline-block";
            followed.style.display = "none";
        }
    })();
    addEvent(follow,'click',function(event){
        if(getCookie("userName")==null&&getCookie("password")==null){
            login.style.display = 'block';
            mask.style.display = 'block';
            mask.style.width = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth)+'px';
            mask.style.height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)+'px';
            login.style.zIndex = 9999;
        }
        else{
            setCookie("v_cancel",1,"d99999");
            follow.style.display = "none";
            followed.style.display = "inline-block";
        }
    })
    addEvent(closeLogin,'click',function(event){
        login.style.display = 'none';
        mask.style.display = 'none';
    })
 
    addEvent(submit,'click',function(){
        v_userName = md5(userName.value);
        v_password = md5(password.value);
        setCookie("v_cancel",1,"d99999");
        ajax({
            method : 'get',
            url : 'http://study.163.com/webDev/login.htm',
            data : {
                'userName': v_userName,
                'password': v_password
            },
            success :  function (data){
                          state(data,v_userName,v_password,getCookie("v_cancel"));
                        },
            async : true
        })
    })
    addEvent(cancel,'click',function(){
        setCookie("v_cancel",0,"d99999");
        follow.style.display = "inline-block";
        followed.style.display = "none";
    })
})();
// 登录end

// 轮播begin
(function(){
    var pointer=document.querySelectorAll(".pointer"); //三个点
    var viewpaper = document.querySelectorAll(".viewpaper"); //三幅图
    var vc = document.querySelector(".viewpaperContainer"); 
    var banner_index = 0;
    //手动
    for (var i = 0; i < pointer.length; i++) {
        pointer[i].index = i;
        pointer[i].onclick = function(){
           for (var k = 0; k < pointer.length; k++) {
                viewpaper[k].className = "viewpaper";
                pointer[k].className = "pointer";
            }
            this.className = "pointer selected";//一定要用this，不能用pointer[i],i已经变成了3
            viewpaper[this.index].className = "viewpaper existed";
            banner_index = this.index;
        };
    }

    //自动轮播
    var Playing = true;
    var autoPlay = setInterval(play,5000);
    var play = function(){
                if (banner_index == pointer.length-1) banner_index = 0;
                else banner_index++;
                for (var k = 0; k < pointer.length; k++) {
                    viewpaper[k].className = "viewpaper";
                    pointer[k].className = "pointer";
                }
                pointer[banner_index].className = "pointer selected";
                viewpaper[banner_index].className = "viewpaper existed";
            };
    vc.onmouseover = function(){
        if(Playing){
            clearInterval(autoPlay);
            Playing = false;   
        }
    };
    vc.onmouseout = function(){
        if(!Playing){
            autoPlay = setInterval(play,5000);
            Playing = true;
        }
    }
})();
// 轮播end

// 视频begin
(function(){
	var openVideo = document.querySelector(".d-video");
	var video = document.querySelector(".m-video");
	var closeVideo = document.querySelector(".m-video .close");
	var mask = document.querySelector(".mask");

    addEvent(openVideo,'click',function(event){
        video.style.display = 'block';
        mask.style.display = 'block';
        mask.style.width = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth)+'px';
        mask.style.height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)+'px';
        video.style.zIndex = 9999;
    });
    
    addEvent(closeVideo,'click',function(event){
    	video.style.display = 'none';
    	mask.style.display = 'none';
    });   
})();
// 视频end
