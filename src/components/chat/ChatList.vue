<template>
<div class="container bootstrap snippets bootdey" style="margin-top:2rem;">




  <div class="jumbotron list-content">
    <ul class="list-group">
      <li href="#" class="list-group-item title">
        채팅방
      </li>
      <li href="#" class="list-group-item text-left" v-for="(item,index) of roomList" :key="index">
        <label class="name">
            {{item.room_name}}<br>
        </label>
        <label class="pull-right">
            <button class="btn btn-danger" style="font-size:10px" @click="chatDetail(item.id)">입장하기</button>
        </label>
        <label class="pull-right" style="margin-right:3rem;">{{item.roomPersonIngCount}} / {{item.roomCount}} 명</label>
        <div class="break"></div>
      </li>
    </ul>
  </div>
  <div style="display:flex; justify-content: end;">
     <button class="btn btn-primary" style="font-size:10px;  margin-top:1rem;" @click="newRoom">채팅방 생성</button>
    </div>
  </div>

 <Pagination v-if="pageChk" :pageListItem="pageListItem" @pageCurrent="pageCurr" :pageTotal="pageTotal"></Pagination>
<BlackBg v-if="loading"></BlackBg>
<!-- 채팅방 생성 -->
<Dialog @close="popOpen=false" v-if="popOpen">
    <template #cont>
      <div class="pop-cont">
        <h3>채팅방 제목</h3>
        <input class="form-control" type="text" name="title" id="title" v-model = popTitle>
        <h3>최대 인원</h3>
        <input class="form-control"  type="number" name="count" id="count" v-model = "popCount">
        <div class="pop-btn-area">
          <button class="btn btn-danger" @click="popOpen=false">취소</button>
          <button class="btn btn-primary" @click="popSave">확인</button>
        </div>
      </div>
        <!-- <img :src="selectQr"> -->
    </template>
</Dialog>
</template>

<script>
import Stomp from 'webstomp-client'
import SockJS from 'sockjs-client'
import Pagination from '../layout/Pagination';
import BlackBg from "../loading/BlackBg"
import Dialog from '../dialog/Dialog';

export default {
	data: function () {
    return {
        roomList: [],
        pageListItem : 10 ,
        page : 0 ,
        pageTotal : 0 ,
        pageChk : false ,
        loading : false,
        stompClient:'',
        popOpen:false,
        popTitle:'',
        popCount:2,
        
    }
  },
    components :{
         Pagination,
         BlackBg,
         Dialog
        
    },
    created() {
        this.init();
    },  
    methods: {
        init() {
                this.roomListAxios();
                this.connect();
        },
        roomListAxios() {
            let parameter = {
            "page" : this.page
            }
            // this.loading = true;
             this.$axios.get(process.env.VUE_APP_CHAT_LIST,{params:parameter}).then((res) =>{
                if(res.data.resultCode=="SUCCESS"){
                    this.pageTotal = res.data.result.totalElements;
                    this.roomList = [] ;
                    res.data.result.content.forEach(element => {
                        let obj = [];
                        obj.room_name = element.roomName;
                        obj.id        = element.id;
                        obj.roomCount = element.roomCount;
                        obj.roomPersonIngCount = element.roomPersonIngCount;
                        this.roomList.push(obj);
                    })
                }
                if(this.pageTotal==0){
                     this.pageChk = false;
                } else {
                    this.pageChk = true;
                }
            }).catch((error) => {
                this.$swal('',error.response.data.result,'error');
            }).finally(() => {
            this.loading = false;
            });
        },
        popSave(){
          if(this.popTitle==''){
            this.$swal('','제목을 입력해주세요.','warning');
            return ;
          }
          if(this.popCount<=1){
            this.$swal('','최소 인원은 2명 입니다.','warning');
            return ;
          }
          else if(this.popCount>=301){
            this.$swal('','최대 인원은 300명 입니다.','warning');
            return ;
          }

          if(this.popTitle != null && this.popCount != null ){
              let param = {
                "publicRoom" : true,
                "roomCount"  : this.popCount,
                "roomName"   : this.popTitle
            }
              const headers = {
              'Authorization': 'Bearer ' + sessionStorage.getItem("token")
              }
              this.$axios.post(process.env.VUE_APP_CHAT_ROOM_SAVE,param,{headers}).then((res) =>{
                  this.stompClient.send("/app/roomList",{},headers);
                  this.$router.push({
                      path: "/chatDetail",
                      name: "chatDetail",
                      query: { sn: res.data.result }
                    });
              }).catch((error) => {
                this.$swal('',error.response.data.result,'error');
              }).finally(() => {
              });
          }

        },
        newRoom() {
          this.popOpen=true;
        },

        connect() {
          const headers = {
            'Authorization': 'Bearer ' + sessionStorage.getItem("token")
            }
            const serverURL = "http://localhost:8081/ws/chat"
            let socket = new SockJS(serverURL);
            this.stompClient = Stomp.over(socket);
            console.log(`소켓 연결을 시도합니다. 서버 주소: ${serverURL}`)
            this.stompClient.connect(
              headers,
                frame => {
                // 소켓 연결 성공
                this.connected = true;
                // console.log('소켓 연결 성공', frame);
                
                //새 채팅글 입력시 채팅방 리로드
                this.stompClient.subscribe("/topic/roomList", res => {
                  this.roomListAxios();

                });

                //   this.stompClient.subscribe("/send", res => {
                //     console.log('구독으로 받은 메시지 입니다.', res.body);

                //     // 받은 데이터를 json으로 파싱하고 리스트에 넣어줍니다.
                //     this.recvList.push(JSON.parse(res.body))
                //   });

                },
                error => {
                // 소켓 연결 실패
                console.log('소켓 연결 실패', error);
                this.connected = false;
                }
            );        
    },
    chatDetail(value) {
      const headers = {
            'Authorization': 'Bearer ' + sessionStorage.getItem("token")
        }
         this.$axios.get(process.env.VUE_APP_CHAT_ROOM_ENTER+value,{headers}).then((res) =>{
          //방문 여부 방문시 roomList 와 room-person을 send 해준다.  
          if(res.data.resultCode=="SUCCESS"){
          if(res.data.result){
              this.stompClient.send("/app/roomList",{},headers);
              this.stompClient.send("/app/room-person/"+value,{},headers);
            }
              this.$router.push({
                path: "/chatDetail",
                name: "chatDetail",
                query: { sn: value }
            });
          }
        }).catch((error) => {
             this.$swal('',error.response.data.result,'error');
        }).finally(() => {
        });
    },

    pageCurr(value){
        this.page = value-1;
        this.roomListAxios();
      },
  }
}


</script>


<style scoped>
.list-content{
 min-height:300px;
}
.list-content .list-group .title{
  background:#5bc0de;
  border:2px solid #DDDDDD;
  font-weight:bold;
  color:#FFFFFF;
}
.list-group-item img {
    height:80px; 
    width:80px;
}

.jumbotron .btn {
    padding: 5px 5px !important;
    font-size: 12px !important;
}
.prj-name {
    color:#5bc0de;    
}
.break{
    width:100%;
    margin:20px;
}
.name {
    color:#5bc0de;    
}
.pop-cont{
  min-width: 300px;
}
.pop-cont h3{
  font-size: 16px;
}
.pop-cont >input{
  margin-bottom: 10px;
}
.pop-btn-area{
  margin-top: 30px;
  display:flex;
  justify-content: flex-end;
}
.pop-btn-area button:first-of-type{
  margin-right: 10px;
}
</style>