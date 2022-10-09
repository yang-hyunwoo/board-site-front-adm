<template>
<div class="margincustom margintpcust">
    <h2>{{title}}</h2>
</div>
<div class="margincustom">
  도시명 :{{city}} 
</div>
<div class="margincustom">
  <span style="font-size:13px;">등록일 : {{created_at}}</span> <span style="font-size:13px; color: gray;">조회수:{{read_count}}</span>
</div>

    <ToastViewer v-if="detail_viewer" :content="content"></ToastViewer>
<div class="margincustom">
    <div class="d-flex row">
        <div class="col-md-8">
            <div class="d-flex flex-column comment-section">
                <div class="bg-white p-2" v-for="(item,index) of reply" :key="index">
                    <!-- <div class="d-flex flex-row user-info"><img class="rounded-circle" src="https://i.imgur.com/RpzrMR2.jpg" width="40"> -->
                        <div class="d-flex flex-column justify-content-start ml-2"><span class="d-block font-weight-bold name">{{item.nickname}}</span><span class="date text-black-50">{{item.created_at}}</span></div>
                    <!-- </div> -->
                    <div class="mt-2">
                        <p class="comment-text" v-if="!item.upd_chk">{{item.content}}</p>
                    <div class="d-flex flex-row align-items-start" v-if="item.upd_chk" ><textarea class="form-control ml-1 shadow-none textarea" v-model="form.new_content[index]"></textarea><button class="btn-cl-cus" @click="comment_upd_db(item.id,index)">수정</button></div>
                    </div>
                    <button v-if="item.auth" class="btn-cl-cus-upd" @click="comment_upd(index)">수정</button><button v-if="item.auth" class="btn-cl-cus-del" @click="comment_del(item.id)">삭제</button>
                </div>
                <Pagination v-if="pageChk" :pageListItem="pageListItem" @pageCurrent="pageCurr" :pageTotal="pageTotal"></Pagination>

                <div class="bg-light p-2">
                    <!-- <div class="d-flex flex-row align-items-start"><img class="rounded-circle" src="https://i.imgur.com/RpzrMR2.jpg" width="40"><textarea class="form-control ml-1 shadow-none textarea"></textarea></div> -->
                    <div class="d-flex flex-row align-items-start"><textarea class="form-control ml-1 shadow-none textarea" v-model="comment_reply_ins"></textarea><button class="btn-cl-cus" @click="comment_ins(tourId)">등록</button></div>
                </div>
            </div>
        </div>
    </div>
</div>
<BlackBg v-if="loading"></BlackBg>
</template>


<script>

import ToastViewer from '@/components/editor/ToastViewer.vue'
import BlackBg from "../loading/BlackBg"
import Pagination from '../layout/Pagination';
export default {
	data: function () {
    return {
        tourId:0,
        contentType:'',
        tourDetail : this.$route.query.sn,
        contentChange:[],
        reply: [],
        loading:false,
        comment_reply_ins: "",
        pageListItem : 8 ,
        page : 0 ,
        pageTotal : 0 ,
        pageChk : false ,
        form: {
          new_content: []
        },
        content:"",
        title:"",
        nickname:"",
        read_count:"",
        created_at:"",
        auth_article:"",
        detail_viewer: false,
        city:"",
    }
  },
  components :{
        ToastViewer,
        BlackBg,
        Pagination,
  },
  created(){
    this.tourId=Number(this.tourDetail);
    this.contentType ="tour"
    this.init();
  },    
  methods: {
      init() {
          this.comment_detail();
          this.tourDetailAxios();
      },

      comment_detail() {
        const headers = {
            'Authorization': 'Bearer ' + sessionStorage.getItem("token")
        }
        let parameter = {
        "page" : this.page
        }

        this.loading = true;
        this.reply=[];
         this.$axios.get(process.env.VUE_APP_TOUR_COMMENT+this.tourId,this.$tokenCheck()==true?{headers,params:parameter}:{params:parameter}).then((res) =>{
          if(res.data.resultCode=="SUCCESS"){
            this.pageTotal = res.data.result.totalElements;
            res.data.result.content.forEach(element=>{
                let obj = [];
                obj.nickname    = element.nickName;
                obj.created_at  = this.$splitDateHyphenTime(element.createdAt);
                obj.content     = element.content;
                obj.auth        = true;
                obj.id          = element.id;
                obj.upd_chk     = false;
                this.reply.push(obj);
            });
            if(this.pageTotal==0){
              this.pageChk = false;
            }else {
              this.pageChk = true;
            }
          }
        }).catch((error) => {
             this.$swal('',error.response.data.result,'error');
        }).finally(() => {
          this.loading = false;
        });
      },

      tourDetailAxios() {
          const headers = {
            'Authorization': 'Bearer ' + sessionStorage.getItem("token")
          }

        this.$axios.get(process.env.VUE_APP_TOUR_DETAIL+this.tourId,this.$tokenCheck()==true?{headers}:"").then((res) =>{
            if(res.data.resultCode=="SUCCESS"){
              this.content        = res.data.result.content;
              this.title          = res.data.result.title;
              this.city           = res.data.result.city;
              this.read_count     = res.data.result.readCount;
              this.created_at     = res.data.result.createdAt.substr(0,4)+"."+res.data.result.createdAt.substr(5,2)+"."+res.data.result.createdAt.substr(8,2);
            }
          }).catch(() => {
            history.back(-1);
          }).finally(() => {
              this.detail_viewer = true;
          });
      },

      comment_ins(value) {
        if(!this.$tokenCheck()){
          this.$router.push("/login");
        } else {
            if(this.comment_reply_ins==""){
                this.$swal('','댓글을 입력해주세요.','warning');
                return;
            }
            const headers = {
                'Authorization': 'Bearer ' + sessionStorage.getItem("token")
            }
            let param = {
              tourId : value,
              content : this.comment_reply_ins
            }
            this.loading = true;
            this.$axios.post(process.env.VUE_APP_TOUR_COMMENT+"new",param,{headers}).then(() =>{
              this.comment_reply_ins = "";
              this.pageChk = false;
              this.init();
            }).catch((error) => {
                this.$swal('',error.response.data.result,'error');
            }).finally(() => {
              this.loading = false;
            });
      }
      },

      pageCurr(value){
        this.page = value-1;
        this.comment_detail();
      },

      comment_upd(index) {
        this.reply[index].upd_chk = !this.reply[index].upd_chk
        if(this.reply[index].upd_chk) {
          this.form.new_content[index] = this.reply[index].content;
        }
      },

      comment_upd_db(value,index){
        const headers = {
            'Authorization': 'Bearer ' + sessionStorage.getItem("token")
        }
        let param = {
          "tourId" : this.tourId,
          "content"   : this.form.new_content[index]
        }
         this.loading = true;
         this.$axios.put(process.env.VUE_APP_TOUR_COMMENT+value+"/form" ,param,{headers}).then(() =>{
             this.page = 0;
             this.pageChk = false;
             this.comment_detail();
        }).catch((error) => {
             this.$swal('',error.response.data.result,'error');
        }).finally(() => {
          this.loading = false;
        });
      },

      comment_del(value) {
        this.$swal.fire({
                        title: '삭제 하시겠습니까?',
                        text: '다시 되돌릴 수 없습니다.',
                        icon: 'warning',
                        showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
                        confirmButtonColor: '#3085d6', // confrim 버튼 색깔 지정
                        cancelButtonColor: '#d33', // cancel 버튼 색깔 지정
                        confirmButtonText: '확인', // confirm 버튼 텍스트 지정
                        cancelButtonText: '취소', // cancel 버튼 텍스트 지정
                        reverseButtons: true, // 버튼 순서 거꾸로
   
      }).then(result => {
         if (result.isConfirmed) { // 만약 모달창에서 confirm 버튼을 눌렀다면
        const headers = {
            'Authorization': 'Bearer ' + sessionStorage.getItem("token")
        }

         this.loading = true;
         this.$axios.put(process.env.VUE_APP_TOUR_COMMENT+value+"/delete" ,null,{headers}).then(() =>{
             this.page = 0;
             this.pageChk = false;
             this.init();
        }).catch((error) => {
             this.$swal('',error.response.data.result,'error');
        }).finally(() => {
          this.loading = false;
        });
          }
      });
      },
  }

}
</script>

<style scoped>
body{
  background: #eee
  }
.date{
  font-size: 11px
  }
.comment-text{
  font-size: 12px
}
.fs-12{
  font-size: 12px
}
.shadow-none{
  box-shadow: none
}.name{
  color: #007bff
}
.cursor:hover{
  color: blue
}
.cursor{
  cursor: pointer
}
.textarea{
  resize: none
}
  .margincustom {
    margin-left : 2rem;
  }
  .margintpcust {
    margin-top : 2rem;
  }
.deco{
  text-decoration: line-through;
}
.btn-cl-cus-upd {
    background-color: rgba(0,0,0,0);
    color: skyblue;
    border: 0px ;
    /* width : 15%; */
    font-size: 13px;
} 
.btn-cl-cus-del {
    background-color: rgba(0,0,0,0);
    color: red;
    border: 0px ;
    /* width : 15%; */
    font-size: 13px;
} 
.custom-div {
  display: flex;
  justify-content: end;
  margin-top:2rem;
}
.btn-cl-cus {
    background-color: rgba(0,0,0,0);
    color: skyblue;
    border: 0px ;
    width : 15%;
    font-size: 13px;
} 
.btn-cl-cus {
    background-color: rgba(0,0,0,0);
    color: skyblue;
    border: 0px ;
    width : 15%;
    margin-top: 1rem;
} 
</style>