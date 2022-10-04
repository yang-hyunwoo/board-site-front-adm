export default{
    install(Vue){

        //이메일 정규식
        Vue.config.globalProperties.$emailValidation = function(data){
            var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
            if(regExp.test(data)){
                return true;
            }else{
                return false;
                
            }
        }
        
        //최소 8자 , 하나 이상의 문자 , 하나의 숫자 및 하나의 특수 문자 
        Vue.config.globalProperties.$passwordValidation = function(data) {
            var regExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/i;
            if(regExp.test(data)) {
                return true;
            } else {
                return false;
            }
        }

        //휴대폰 정규식
        Vue.config.globalProperties.$phoneNumberValidation = function(data) {
            var regExp = /^\d{3}-\d{3,4}-\d{4}$/i;
            if(regExp.test(data)) {
                return true;
            } else {
                return false;
            }
        }
        
        //휴대폰 입력시 (-) 자동 생성
        Vue.config.globalProperties.$phoneNumberGetMask = function(data) {
            let res = ''
            if(data.length < 8) {
                if(data.length>=4){
                    res = data.substr(0, 3) + '-' + data.substr(3,3)+ data.substr(6);
                }else{
                    res = data
                }
            } else if(data.length == 8) {
                res = data.substr(0, 3) + '-' + data.substr(3,3)+ '-' + data.substr(6)
            } else if(data.length == 9) {
                res = data.substr(0, 3) + '-' + data.substr(3, 3) + '-' + data.substr(6)
            } else if(data.length == 10) {
                res = data.substr(0, 3) + '-' + data.substr(3, 3) + '-' + data.substr(6)
            } else if(data.length > 10) {
                res = data.substr(0, 3) + '-' + data.substr(3, 4) + '-' + data.substr(7)
            }
            return res;
        }

        /*jwt 확인 여부 
         메인화면이나 / 게시글 읽기 / 여행 리스트 확인 은 토큰이 필요 없는 작업이고
         게시글 작성 등 부분은 토큰이 필요한 부분이다.
         허나 axios 를 전송시 header 토큰을 실어서 보내야 하는데 
         없을경우 back에서 호출시 동작은 되지만 error 로그가 찍혀 
         현재 임시방편으로 vue 에서 localstorage에 토큰이 담겨있는지 확인 하여 있으면 
         헤더에 실어서 보내주고 없으면 헤더에 실어서 보내주지 않게 체크 하는 함수
        */
        Vue.config.globalProperties.$tokenCheck = function() {
            let token = sessionStorage.getItem("token");
            if(token == null || token.length==0 || token == "null" || token == "undefined" || token ==undefined) {
                return false;
            } 
                return true;
        }

        Vue.config.globalProperties.$splitDateHyphen = function(data) {
            return data.substr(0,4)+"."+data.substr(4,2)+"."+data.substr(6);
        }

        Vue.config.globalProperties.$splitDateHyphenLo = function(data) {
            return data.substr(0,4)+"."+data.substr(5,2)+"."+data.substr(8,2);
        }

        Vue.config.globalProperties.$splitDateHyphenTime = function(data) {
            return data.substr(0,4)+"."+data.substr(5,2)+"."+data.substr(8,2)+" "+data.substr(11,5);
        }

        Vue.config.globalProperties.$numberWithCommas = function(data) {
            return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }

        Vue.config.globalProperties.$emptyChk = function(data) {
            var blank_pattern = /^\s+|\s+$/g;
            if( data.replace( blank_pattern, '' ) == "" ){
                return true;
            }else if( data == "" || 
                data == null || 
                data == undefined || 
                ( data != null && typeof value == "object" && !Object.keys(data).length ) ){
                return true
              } else{
                return false
              }
        }
    }
}