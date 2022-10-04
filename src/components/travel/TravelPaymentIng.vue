<template>

 <div class="py-4 text-center">
      <!-- <img class="d-block mx-auto mb-4" src="/docs/5.2/assets/brand/bootstrap-logo.svg" alt="" width="72" height="57"> -->
      <img v-if="img_chk" :src="img"  width="200" height="200">
      <h2>{{travel_name}}</h2>
    </div>
    <div>
    <div class="row g-5 juscustom" >
      <div class="col-md-7 col-lg-8" style="margin-left:0.5rem;">

          <div class="row g-3">
            <div class="col-11">
             <label for="email" class="form-label" >이름 </label>
              <input type="email" v-model="user_name" class="form-control"  placeholder="홍길동" >
            </div>

            <div class="col-11">
              <label for="email" class="form-label">Email</label>
              <input type="email" v-model="email" class="form-control" id="email" placeholder="you@example.com" >
            </div>
            <div class="col-11">
                인원 :    <button @click="minus" class="btn-cl" style="font-size:20px;">-</button><input type=number name=amount v-model="total_count" style="width:8%;"><button class="btn-cl" style="font-size:20px;" @click="plus">+</button>
                </div>
          </div>

          <hr class="my-4">
            
          <div class="form-check">
                주문 금액 :{{$numberWithCommas(init_sale_pay)}}원
          </div>
           <hr class="my-4">
            <div class="form-check">
            <input type="checkbox" class="form-check-input" id="save-info" v-model="pay_chk">
            <label class="form-check-label" for="save-info">결제에 동의</label>
          </div>
          <br>
          <button class="w-100 btn btn-primary btn-lg" @click="iamport">결제하기</button>

    </div>
    </div>
</div>
 <BlackBg v-if="loading"></BlackBg>
</template>

<script>
export default {
	data: function () {
    return {
        user_name : "",
        email : "",
        total_count: 1,
        travel_name: "",
        travel_list_id : this.$route.query.sn,
        travel_id : "",
        real_pay : 0 ,
        sale_pay : 0,
        init_sale_pay : 0,
        pay_chk:false,
        loading:false,
        person_count : 0,
        person_max_count : 0,
        img_chk:false,
    }
  },

  created(){
    if(this.travel_list_id == null ||this.travel_list_id== undefined || this.travel_list_id== "null" ||this.travel_list_id == "undefined") {
        history.back(-1);
    }
    this.init();

  },

  methods: {
    init() {
        this.traveDetail();
    },

    traveDetail() {
    this.$axios.get(process.env.VUE_APP_TRAVEL_DETAIL+this.travel_list_id).then((res) =>{
          if(res.data.resultCode=="SUCCESS"){
            let data = res.data.result ; 
            this.travel_name    = data.title ;
            this.real_pay       = data.real_paid ;
            this.sale_pay       = data.sale_paid ;
            this.init_sale_pay  = data.sale_paid ;
            this.travel_id      = data.travel_agency_id ;
            this.person_max_count = data.person_max_count;
            if(data.thumnbnailFileId==null){
              this.img_chk = false;
            } else{
              this.img_chk = true;
              this.img = process.env.VUE_APP_FILE_IMAGE_THUMB_READ+data.thumnbnailFileId+"/1";
            }
          }
        }).catch((error) => {
          console.log(error.response.data.result);
             this.$swal('',error.response.data.result,'error');
             this.$router.push("/travelList");
        }).finally(() => {
        });
    },

    iamport() {
        if(this.pay_chk) {
          this.$axios.get(process.env.VUE_APP_TRAVEL_DETAIL+this.travel_list_id).then((res) =>{
              if(res.data.resultCode=="SUCCESS"){
                let data = res.data.result ; 
                this.person_count = data.person_count;
              }
          }).catch(() => {
              this.$swal('','잠시후 다시 이용해주세요.','error');
          }).finally(() => {
          });
              let parameter = {
              "operland" : "plus",
              "count"  : this.total_count
              }
              console.log(this.person_count);
              console.log(this.total_count);
              console.log(this.person_max_count);
          if(this.person_count+this.total_count <= this.person_max_count) {
              this.$axios.get(process.env.VUE_APP_UPDATE_PERSON+this.travel_list_id,{params:parameter}).then(() =>{
              }).catch(() => {
                      this.$swal('','잠시후 다시 이용해주세요.','error');
              }).finally(() => {
              });

                var IMP = window.IMP;
                IMP.init(process.env.VUE_APP_IAMPORT);
                IMP.request_pay({ // param
                        pg: "html5_inicis",
                        pay_method: "card",
                        name: this.travel_name,
                        amount: this.init_sale_pay,
                        buyer_email: this.email,
                        buyer_name: this.user_name,
                }, rsp => { // callback
                    if (rsp.success) {
                          const headers = { 'Authorization': 'Bearer ' + sessionStorage.getItem("token")}
                let param = {
                  "travelAgencyId": this.travel_id,
                  "travelAgencyListId" : this.travel_list_id,
                  "merchantUid"  : rsp.merchant_uid,
                  "impUid" : rsp.imp_uid,
                  "payEmail" : this.email,
                  "payName" : this.user_name,
                  "paid"    : rsp.paid_amount,
                  "personCount" : this.total_count
                }
                  this.loading = true;
                  this.$axios.post(process.env.VUE_APP_TRAVEL_PAY ,param,{headers}).then((res) =>{
                        if(!res.data.result) {
                            this.$router.push("/travelPaymentSuccess");
                        } else {
                            this.$swal('스크립트 변조',"결제 금액이 다릅니다.\n 환불 관련은 관리자에게 문의 하세요.","error");
                        }
                    }).catch((error) => {
                        this.$swal('',error.response.data.result,'error');
                    }).finally(() => {
                        this.loading = false;
                    });
                    } else {
                        //결제 실패
                        let parameter_minus = {
                          "operland" : "minus",
                          "count"  : this.total_count
                        }
                      this.$axios.get(process.env.VUE_APP_UPDATE_PERSON+this.travel_list_id,{params:parameter_minus}).then(() =>{
                        }).catch(() => {
                                this.$swal('','잠시후 다시 이용해주세요.','error');
                        }).finally(() => {
                        });
                    }
                });
              } else {
                this.$swal('','마감 되었습니다.','info')
              }
   
        } else {
            this.$swal('','결제 동의에 체크 해주세요.','waring')
        }
    },

    minus() {
        this.total_count--;
    },

    plus() {
        this.total_count++;
    }

  },

watch: {
    total_count(){
          if(this.total_count < 1){
             this.$swal('','1이하로는 입력할수 없습니다.','error');
             this.total_count=1;
            return ;
          }
          if(this.total_count >100) {
             this.$swal('','100이상로는 입력할수 없습니다.','error');
             this.total_count = 1;
             return ;
          }
            this.init_sale_pay   = (this.sale_pay * this.total_count);
    },
}


}
</script>
<style scoped>
 .juscustom{
    justify-content: center;
    /* margin-left:0.rem; */
}
.btn-cl {
    background-color: rgba(0,0,0,0);
    color: skyblue;
    border: 0px ;
    width : 15%;
} 
.col-11 {
    margin-bottom: 0.8rem;
}
.row {
    --bs-gutter-x : 0 !important;
    --bs-gutter-y : 0 !important;
}
.deco{
  text-decoration: line-through;
}

</style>