<template>
<div class="bootstrap snippets bootdey" style="margin-top:4rem;">
    <div class="row" style="margin-left:1rem;">
        <h3>구매 내역</h3>
        <div class="col-lg-12">
            <div class="main-box no-header clearfix">
                <div class="main-box-body clearfix">
                    <div class="table-responsive">
                        <table class="table user-list">
                            <thead>
                                <tr>
                                <th><span>여행 상품명</span></th>
                                <th><span>결제일</span></th>
                                <th><span>결제 금액</span></th>
                                <th class="text-center"><span>결제 여부</span></th>
                                <th class="text-center"><span></span></th>
   
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item,index) of purchase_list" :key="index">
                                    <td>
                                        <div class="img-wrap"><img v-if="item.img_chk" :src="item.img" ></div>
                                        <span class="user-link" style="font-size:16px;">{{item.travel_nm}}</span>
                                    </td>
                                    <td>{{item.created_at}}</td>
                                    <td>{{$numberWithCommas(item.paid)}}원  
                                        <button class="btn btn-danger" v-if="item.state=='결제 완료'" style="font-size:10px;margin-left:10px;" @Click="refundClick(item.imp_uid,item.paid,item.person_count,item.id,item.list_id)">결제 취소</button></td>
                                    <td class="text-center">
                                        <span class="label label-default">{{item.state}}</span>
                                    </td>
                                    <!-- <td v-if="item.state=='결제 완료'" style=" display:flex;align-items: center;"> -->
                                        <td v-if="item.state=='결제 완료'" >
                                        <button class="btn btn-primary" style="font-size:10px;margin-left:10px" @click="qrImg(item.qrcode_id,item.qrcode_img)">qr 확인</button>
                                        
                                    </td>
                                    <td v-if="item.state=='결제 취소'">
                                      <span style="color:blue;">환불 완료</span>
                                    </td>
                                </tr>
                                <tr colspan="5" v-if="purchase_list.length==0">
                                    <td>결제 내역이 없습니다.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
   <Pagination v-if="pageChk" :pageListItem="pageListItem" @pageCurrent="pageCurr" :pageTotal="pageTotal" ></Pagination>

<BlackBg v-if="loading"></BlackBg>
<!-- <div class="qrOpenBg"  v-if="qrOpen" @click="qrOpen=!qrOpen"></div>
<div v-if="qrOpen" class="qrPopup">
   <img :src="selectQr">
</div> -->
<Dialog @close="qrOpen=false" v-if="qrOpen">
    <template #cont>
        <img :src="selectQr">
    </template>
</Dialog>
</template>
<script>
import BlackBg from "../loading/BlackBg"
import Pagination from '../layout/Pagination';
import Dialog from '../dialog/Dialog';


export default {
	data: function () {
    return {
        loading:false,
        pageListItem : 10 ,
        page : 0 ,
        pageTotal : 0 ,
        pageChk : false ,
        purchase_list:[],
        ///qr 팝업
        qrOpen:false,
        selectQr:''

    }
  },
    components :{
        BlackBg,
        Pagination,
        Dialog
        
    },
    created() {
        this.init();
    },  
    methods: {
        init() {
            this.purchaseList();
        },
        purchaseList() {
            const headers = { 'Authorization': 'Bearer ' + sessionStorage.getItem("token")}
            let parameter = {
                "page" : this.page
            }
             this.loading = true;
             this.$axios.get(process.env.VUE_APP_PURCHASE_LIST,{headers,params:parameter}).then((res) =>{
                console.log(res);
                if(res.data.resultCode=="SUCCESS"){
                    this.pageTotal = res.data.result.totalElements;
                    this.purchase_list = [] ;
                    res.data.result.content.forEach(element => {
                        let obj = [];
                        if(element.thumbFileId ==null || element.thumbFileId==""){
                            obj.img_chk = false;
                        } else{
                            obj.img_chk = true;
                        }
                            obj.img = process.env.VUE_APP_FILE_IMAGE_THUMB_READ+element.thumbFileId+"/"+1;
                            obj.agency_nm       = element.travelAgencyName;
                            obj.travel_nm       = element.travelAgencyListTitle;
                            obj.created_at      = this.$splitDateHyphenTime(element.createdAt);
                            obj.paid            = element.paid;
                            obj.imp_uid         = element.imp_uid;
                            obj.person_count    = element.personCount;
                            obj.id              = element.id;
                            obj.list_id         = element.travelAgencyListId;
                            obj.qrcode_id       = element.qrCodeId;
                            obj.qrcode_img      = process.env.VUE_APP_FILE_IMAGE_READ+element.qrCodeId+"/"+1;
                            if(element.deleted){
                                obj.state = "결제 취소";
                            } else {
                                obj.state = "결제 완료";
                            }
                        this.purchase_list.push(obj);
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

        pageCurr(value){
            this.page = value-1;
            this.purchaseList();
        },
        qrImg(value,src){
            this.selectQr=src
            this.qrOpen=true;
            console.log(value);
        },  
        refundClick(uid,paid,person_count,id,list_id) {
        this.$swal.fire({
                        title: '환불 하시겠습니까?',
                        text: '다시 되돌릴 수 없습니다.',
                        icon: 'warning',
                        showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
                        confirmButtonColor: '#3085d6', // confrim 버튼 색깔 지정
                        cancelButtonColor: '#d33', // cancel 버튼 색깔 지정
                        confirmButtonText: '확인', // confirm 버튼 텍스트 지정
                        cancelButtonText: '취소', // cancel 버튼 텍스트 지정
                        reverseButtons: true, // 버튼 순서 거꾸로
   
      }).then(result => {
         if (result.isConfirmed) {
            let param = {
                "impUid" : uid,
                "money" : paid,
                "personCount" : person_count,
                "id"           : id,
                "travelAgencyListId" : list_id
            }
            const headers = {
                'Authorization': 'Bearer ' + sessionStorage.getItem("token")
            }
         this.loading = true;
         this.$axios.post(process.env.VUE_APP_TRAVEL_REFUND ,param,{headers}).then((res) =>{
            if(res.data.result) {
                  this.$swal('',"환불이 완료 되었습니다.",'success');
                  this.purchaseList();
            }
        }).catch((error) => {
             this.$swal('',error.response.data.result,'error');
        }).finally(() => {
          this.loading = false;
        });
          }
      });
    }
  }
}


</script>
<style scoped>
body{
    background:#eee;    
}
.main-box.no-header {
    padding-top: 20px;
}
.main-box {
    background: #FFFFFF;
    -webkit-box-shadow: 1px 1px 2px 0 #CCCCCC;
    -moz-box-shadow: 1px 1px 2px 0 #CCCCCC;
    -o-box-shadow: 1px 1px 2px 0 #CCCCCC;
    -ms-box-shadow: 1px 1px 2px 0 #CCCCCC;
    box-shadow: 1px 1px 2px 0 #CCCCCC;
    margin-bottom: 16px;
    -webikt-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
}
.table a.table-link.danger {
    color: #e74c3c;
}
.label {
    border-radius: 3px;
    font-size: 0.875em;
    font-weight: 600;
}
.user-list tbody td .user-subhead {
    font-size: 0.875em;
    font-style: italic;
}
.user-list tbody td .user-link {
    display: block;
    font-size: 1.25em;
    padding-top: 3px;
    margin-left: 60px;
}
a {
    color: #3498db;
    outline: none!important;
}
.img-wrap{
    width:50px;
    height:50px;
    overflow: hidden;
    margin-right: 15px;
}
.img-wrap >img{
    width:100%;
}
.user-list tbody td>img {
    position: relative;
    max-width: 50px;
    float: left;
    margin-right: 15px;
}

.table thead tr th {
    text-transform: uppercase;
    font-size: 0.875em;
}
.table thead tr th {
    border-bottom: 2px solid #e7ebee;
}
.table tbody tr td:first-child {
    font-size: 1.125em;
    font-weight: 300;
    display: flex;
    border:none;
}
.table tbody tr td {
   border:none;
    font-size: 0.875em;
    vertical-align: middle;
    border-top: 1px solid #e7ebee;
    padding: 12px 8px;
}
a:hover{
text-decoration:none;
}
.table {
    margin-bottom :0 !important;
}
.container {
    margin-left : inherit !important;
}
.btn-cl-cus-del {
    /* background-color: rgba(247, 14, 14, 0); */
    /* color: red; */
    /* border: 1px solid red; */
    /* width : 15%; */
    /* font-size: 13px; */
} 
.qrOpenBg{
    top:0;
    left:0;
    position:fixed;
    width:100vw;
    height:100vh;
    background: rgba(0,0,0,0.3);
    z-index: 100;
    overflow: hidden;
}
.qrPopup{
    position:fixed;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
    z-index: 100;
    padding:10px;
    border-radius: 13px;
    background: #fff;
}
</style>