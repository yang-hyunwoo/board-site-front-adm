<template>
    <div id="contact" class="contact-area section-padding">
	<div class="container">															
		<div class="row">
			<div class="col-lg-7">	
				<div class="contact">
						<div class="row" style="margin-top:2rem;">
							<div class="form-group col-md-12" >
								<input type="text" name="name" class="form-control" placeholder="제목을 입력하세요" required="required" v-model="travelTitle">
							</div>
							<div class="form-group col-md-12" style="margin-top:1rem;">
                                <ToastEditor  @contentChange="editorContent"></ToastEditor>
							</div>
							<div class="col-md-12 text-center" style="margin-top:1rem;">
								<button class="btn btn-contact-bg" @Click="regAgency()">등록</button>
							</div>
						</div>
				</div>
			</div><!--- END COL --> 
			<div class="col-lg-5" style="margin-top:2rem;">
				<div class="single_address" >
					<i class="fa fa-map-marker"></i>
                    <h4>도시 </h4>
                    <div style="margin-top:10px;">
                            <select v-model="travelCity">
                                <option value="">선택</option>
                                <option value="서울">서울</option>
                                <option value="부산">부산</option>
                                <option value="울산">울산</option>
                                <option value="대구">대구</option>
                                <option value="대전">대전</option>
                                <option value="제주">제주</option>
                            </select>
                    </div>
				</div>
                <div class="single_address">
					<i class="fa fa-user"></i>
					<h4 style="margin-bottom:1rem;">인원</h4>
                    <input type="text" style="width:80px;" v-model="personCount" />
					<!-- <p>(+1) 517 397 7100</p> -->
				</div>
                <div class="single_address">
					<i class="fa fa-plane"></i>
					<h4 style="margin-bottom:1rem;" >출발일</h4>
                    <input type="date"  :min=minDate v-model="startDate"/>
					<!-- <p>(+1) 517 397 7100</p> -->
				</div>		
                
				<div class="single_address">
					<i class="fa fa-money"></i>
					<h4 style="margin-bottom:1rem;">가격</h4>
                    원가: <input type="text" style="width:80px;" v-model="realPay" />
                    할인율: <input type="text" style="width:80px;" v-model="salePercent"/><br/>
                    <div style="margin-top:12px;">
                    현재 가격: {{$numberWithCommas(salePay)}} 원
                    </div>
				</div>	
                <div class="single_address">
					<i class="fa fa-calendar"></i>
					<h4 style="margin-bottom:1rem;">마감일</h4>
                    <input type="date"  :min=minDate v-model="endDate"/>
				</div>	
                <div class="single_address" v-if="adminAuth=='SUPER'">
					<i class="fa fa-list"></i>
					<h4 style="margin-bottom:1rem;">여행사</h4>
                    <select v-model="agencyId" >
                        <option selected value="0">선택하세요</option>
                        <option v-for="(item,index) of travelAgencyList" :key="index" :value="item.id">{{item.name}}</option>    
                    </select>
				</div>	
                <div class="single_address">
                    <label class="file-label" for="chooseFile">
                            <input class="file" id="chooseFile"
                            type="file" 
                            @click="resetImageUploader"
                            v-on:change="upload"
                            accept="image/png, image/jpeg, image/gif"
                            ref="imageUploader"
                            >
					<i class="fa fa-image"></i>
					<h4>썸네일  <button style="margin-left:1rem;" type="button" class="btn btn-primary" @Click="resetImage()">썸네일 삭제</button>
                    </h4>

                      </label>
				</div>	
                <div style="width:400px ;height:250px" v-if="preview!=''">
            <img :src="preview" style="width:100% ; height:100%;" />
             </div>		
			</div><!--- END COL --> 
		</div><!--- END ROW -->
	</div><!--- END CONTAINER -->	
</div>  
</template>
 
<script>
    
 import ToastEditor from '@/components/editor/ToastEditor.vue'
    
    export default {
        data: function () {
        return {
            articleId:0,
            contentChange:'',
            travelTitle:"",
            travelCity:'',
            preview:'',
            file:'',
            saveThumbnail_id:'',
            agencyComment:'',
            roadAddress:'',
            aa:false,
            personCount:'',
            minDate:'',
            startDate:'',
            realPay:'',
            salePay:'',
            salePercent:'',
            adminAuth:'',
            travelAgencyList:[],
            agencyId:0,
            endDate:'',
        }
      },
      components :{
            ToastEditor
      },
      created(){
            this.dateInit();
            this.authChk();
      },    
      methods: {
        authChk(){
            const headers = { 
                'Authorization': 'Bearer ' + sessionStorage.getItem("token")
            }
            this.$axios.get(process.env.VUE_APP_AUTH,{headers}).then((res) =>{
                if(res.data.resultCode=="SUCCESS"){
                    this.agencyId = res.data.result.agencyId;
                    this.adminAuth = res.data.result.role;
                    if(this.adminAuth=='SUPER'){
                        this.traveAgencyList();
                    }
                }
                }).catch(() => {
                    this.$swal('','잠시후 다시 이용해주세요.','error');
                }).finally(() => {
                });
        },
        traveAgencyList(){
            const headers = { 
                'Authorization': 'Bearer ' + sessionStorage.getItem("token")
            }
            this.$axios.get(process.env.VUE_APP_JOIN_TRIP_LIST,{headers}).then((res) =>{
                if(res.data.resultCode=="SUCCESS"){
                    this.travelAgencyList=[];
                    res.data.result.forEach(element => {
                        let obj = [];
                        obj.name   = element.name;
                        obj.id     = element.id;      
                        this.travelAgencyList.push(obj);
                    });
                }
                }).catch(() => {
                    this.$swal('','잠시후 다시 이용해주세요.','error');
                }).finally(() => {
                });
            
        },

        dateInit(){
            let myDate = new Date();
            let yy = String(myDate.getFullYear());
            let mm = String(myDate.getMonth()+1 < 10 ? '0' + myDate.getMonth()+1 : myDate.getMonth()+1);
            let dd = String(myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate());
            this.minDate=yy+"-"+mm+"-"+dd;
        },  
            editorContent(value){
                this.contentChange =  value;
            },
            async regAgency(){
                console.log(this.agencyId);
                const headers = { 'Authorization': 'Bearer ' + sessionStorage.getItem("token")}
                var content = this.contentChange;
                content = content.replace(/&nbsp;/gi,"");
                content = content.replace(/<br>/gi,"");
                content = content.replace(/ /gi,"");
    
                if(this.$emptyChk(this.travelTitle)){
                    this.$swal('','제목 을 입력해주세요.','warning');
                    return;
                }
                if(this.$emptyChk(this.travelCity)){
                    this.$swal('','도시 입력해주세요.','warning');
                    return;
                }
                if(this.$emptyChk(this.personCount)){
                    this.$swal('','인원을 입력해주세요.','warning');
                    return;
                }
                if(this.$emptyChk(this.startDate)){
                    this.$swal('','출발일을 입력해주세요.','warning');
                    return;
                }
                if(this.salePay==''){
                    this.$swal('','가격을 입력해주세요.','warning');
                    return;
                }
                if(this.$emptyChk(this.endDate)){
                    this.$swal('','마감일을 입력해주세요.','warning');
                    return;
                }
                if(this.agencyId==0){
                    this.$swal('','여행사를 입력해주세요.','warning');
                    return;
                }
                
                if(content =="<p><\/p>" || content==""){
                    this.$swal('','내용을 입력해주세요.','warning');
                    return;
                }
                if(this.file!=''){
                        const imageheaders = {
                        "content-type" : "multipart/form-data"
                        }
                            const formdata = new FormData();
                            formdata.append("multiFile",this.file);
                            
                        await this.$axios.post(process.env.VUE_APP_FILE_UPLOAD,formdata,{imageheaders}).then((res) =>{
                            this.saveThumbnail_id = res.data[0].fileId;
                        }).catch(() => {
                        }).finally(() => {
                        });
                }
                let param = {
                    "travel_agency_id"  : this.agencyId ,
                    "city" : this.travelCity ,
                    "content" : this.contentChange,
                    "person_max_count" : this.personCount,
                    "real_paid" : this.realPay,
                    "sale_paid" : this.salePay,
                    "sale_percent" : this.salePercent,
                    "title" : this.travelTitle,
                    "travel_end_at" : this.endDate.replace(/\-/g,''),
                    "travelRealTripAt" : this.startDate.replace(/\-/g,''),
                    "thumnbnailFileId" : this.saveThumbnail_id
                }
                console.log(param);
            await this.$axios.post(process.env.VUE_APP_TRAVEL_AGENCY_LIST_INSERT ,param,{headers}).then((res) =>{
                    if(res.data.resultCode=="SUCCESS"){
                        this.$swal('',"저장되었습니다.",'success');
                        this.$router.push("/travelList"); 
                    }
            }).catch((error) => {
                 this.$swal('',error.response.data.result,'error');
                 return false;
            }).finally(() => {
            //   this.loading = false;
            });
            },
            upload(e) {
                this.file = e.target.files[0];
                var url = URL.createObjectURL(this.file);
                this.preview = url;
            },
            resetImageUploader() {
                this.$refs.imageUploader.value = '';
            },
            resetImage() {
                this.file="";
                this.preview='';
                this.$refs.imageUploader.value = '';
            },
            address() {
                new window.daum.Postcode({
                    oncomplete: (data) => {
                        this.roadAddress = data.roadAddress; 
                     }
                }).open();
            },
      },
      watch: {
        personCount(){
            let check = /^[0-9]+$/; 
            if(!check.test(this.personCount)) {
                this.personCount='';
            }
            if(this.personCount.length>5){
                this.personCount='';
            }
            
        },
        realPay(){
            if(this.salePercent!='' && this.salePercent!=0){
                if(this.realPay==''){
                    this.salePay = this.realPay;
                } else {
                    this.salePay = Math.floor(parseInt(this.realPay)-parseInt(this.realPay)*(this.salePercent/100));
                }
            } else {
                this.salePay=this.realPay
            }
        },
        salePercent(){
            let check = /^[0-9]+$/; 
            if(!check.test(this.salePercent)) {
                this.salePercent='';
            }
            if(this.salePercent>100){
                this.salePercent='';
            }
            if(this.realPay!='' && this.realPay!='') {
                this.salePay = Math.floor(parseInt(this.realPay)-parseInt(this.realPay)*(this.salePercent/100));
            }
        }
      }
    
    }
    
</script>

<style scoped>

#chooseFile {
    visibility: hidden;
}
.file-label {
  text-align: center;
  padding: 10px 1rem;
  border-radius: 6px;
  cursor: pointer;
}
.file {
  display: none;
}
body{margin-top:20px;
background:#eee;
}
.contact-area {
    background-attachment: fixed;
    background-size: cover;
    background-position: center;
}
@media only screen and (max-width:768px) {
    .contact {
        margin-bottom: 60px;
    }
}
.contact textarea {
    background: #fff;
    border: 1px solid #fff;
    border-radius: 3px;
    -webkit-box-shadow: none;
    box-shadow: none;
    color: #232434;
    font-size: 16px;
    padding: 10px;
    width: 100%;
    font-family: 'poppins', sans-serif;
    padding-left: 30px;
    -webkit-transition: all 0.3s ease 0s;
    -o-transition: all 0.3s ease 0s;
    transition: all 0.3s ease 0s;
}

.contact input:focus {
    background: #fff;
    border: 1px solid #fff;
    color: #232434;
    -webkit-box-shadow: none;
    box-shadow: none;
    outline: 0 none;
}

.contact textarea:focus {
    background: #fff;
    border: 1px solid #fff;
    color: #232434;
    -webkit-box-shadow: none;
    box-shadow: none;
    outline: 0 none;
}

.form-control::placeholder {
    color: #232434;
    opacity: 1;
}
.btn-contact-bg {
    border-radius: 30px;
    color: #fff;
    outline: medium none !important;
    padding: 15px 27px;
    text-transform: capitalize;
    -webkit-transition: all 0.3s ease 0s;
    -o-transition: all 0.3s ease 0s;
    transition: all 0.3s ease 0s;
    background: #7564e5;
    font-family: 'poppins', sans-serif;
    cursor: pointer;
    width: 100%;
}

.btn-contact-bg:hover,
.btn-contact-bg:focus {
    background: #232434;
    color: #fff;
}

/*START ADDRESS*/

.single_address {
    overflow: hidden;
    margin-bottom: 10px;
    padding-left: 40px;
}

@media only screen and (max-width:768px) {
    .single_address {
        padding-left: 0px;
    }
}

.single_address i {
    background: #f6f6f6;
    color: #7564e5;
    border-radius: 30px;
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    float: left;
    margin-right: 14px;
    font-size: 22px;
    -webkit-box-shadow: 0 5px 30px 0 rgba(0, 0, 0, 0.1);
    box-shadow: 0 5px 30px 0 rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    -webkit-transition: all 0.3s ease 0s;
    -o-transition: all 0.3s ease 0s;
    transition: all 0.3s ease 0s;
}

.single_address:hover i {
    background: #7564e5;
    color: #fff;
}

.single_address h4 {
    font-size: 18px;
    margin-bottom: 0px;
    overflow: hidden;
    font-weight: 600;
}

.single_address p {
    overflow: hidden;
    margin-top: 5px;
}

.section-title h1 {
    font-size: 44px;
    font-weight: 500;
    margin-top: 0;
    position: relative;
    text-transform: capitalize;
    margin-bottom: 15px;
}
.section-title p {
    padding: 0 10px;
    width: 70%;
    margin: auto;
    letter-spacing: 1px;
}
.section-title {
    margin-bottom: 60px;
}
.text-center {
    text-align: center!important;
}
</style>