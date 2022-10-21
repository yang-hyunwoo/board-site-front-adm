<template>
  <div id="contact" class="contact-area section-padding">
<div class="container">															
  <div class="row">
    <div class="col-lg-7">	
      <div class="contact">
          <div class="row" style="margin-top:2rem;">
            <div class="form-group col-md-12" >
              <input type="text" name="name" class="form-control" placeholder="여행사 명" required="required" v-model="agencyName" v-if="adminAuth=='SUPER'">
              <p v-if="adminAuth=='ADMIN'">{{agencyName}}</p>
            </div>
            <div class="form-group col-md-12" style="margin-top:1rem;">
              <input type="text" name="subject" class="form-control" placeholder="코멘트" required="required" v-model="agencyComment">
            </div>
            <div class="form-group col-md-12" style="margin-top:1rem;">
                              <ToastEditor v-if="test"  @contentChange="editorContent" :content="content"></ToastEditor>
            </div>
            <div class="col-md-12 text-center" style="margin-top:1rem;">
              <button class="btn btn-contact-bg" @Click="regAgency()">등록</button>
            </div>
          </div>
      </div>
    </div><!--- END COL --> 
    <div class="col-lg-5" style="margin-top:2rem;">
      <div class="single_address" @Click="address()" >
        <i class="fa fa-map-marker"></i>
        <h4>주소</h4>
        <p >{{roadAddress}}</p>
      </div>
      <div class="single_address">
        <i class="fa fa-phone"></i>
        <h4 style="margin-bottom:1rem;">전화번호</h4>
                  <input type="text" style="width:80px;" v-model="tel1" />-
                  <input type="text" style="width:80px;" v-model="tel2"/>-
                  <input type="text" style="width:80px;" v-model="tel3"/>
        <!-- <p>(+1) 517 397 7100</p> -->
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
<BlackBg v-if="loading"></BlackBg>
</template>


<script>

import ToastEditor from '@/components/editor/ToastModifyEditor.vue'
import BlackBg from "../loading/BlackBg"
export default {
	data: function () {
    return {
        agencyId:0,
        agencyName:'',
        agencyComment:'',
        tel1:'',
        tel2:'',
        tel3:'',
        roadAddress:'',
        contentChange:'',
        title:"",
        loading:false,
        content:"",
        test:false,
        preview:'',
        citySelect:'',
        fileId:'',
        adminAuth:'',
    }
  },
  components :{
        ToastEditor,
        BlackBg
  },
  created(){
    this.agencyId = this.$route.query.sn;
    this.init();
  },    
  methods: {
    init() {
            this.validAgency();
            this.authChk();
    },

    authChk(){
      const headers = { 
        'Authorization': 'Bearer ' + sessionStorage.getItem("token")
      }
      this.$axios.get(process.env.VUE_APP_AUTH,{headers}).then((res) =>{
          if(res.data.resultCode=="SUCCESS"){
            this.adminAuth = res.data.result.role;
          }
        }).catch(() => {
             this.$swal('','잠시후 다시 이용해주세요.','error');
        }).finally(() => {
        });
    },

    validAgency() {
        this.loading = true;
        const headers = { 'Authorization': 'Bearer ' + sessionStorage.getItem("token")}
        this.$axios.get(process.env.VUE_APP_TRAVEL_AGENCY+this.agencyId,{headers}).then((res) =>{
         if(res.data.resultCode=="SUCCESS"){
          let telSplit = res.data.result.tel.split("-");
            this.agencyName = res.data.result.name;
            this.agencyComment = res.data.result.comment;
            this.title = res.data.result.title;
            this.content = res.data.result.detail;
            this.tel1 = telSplit[0];
            this.tel2 = telSplit[1];
            this.tel3 = telSplit[2];
            this.fileId = res.data.result.fileId;
            this.roadAddress = res.data.result.address;
            this.contentChange = res.data.result.detail;
            
            if(res.data.result.fileId!=null){
              this.preview = process.env.VUE_APP_FILE_IMAGE_READ+res.data.result.fileId+"/1";
            }
          }
        }).catch((error) => {
             this.$swal('',error.response.data.result,'error');
             this.$router.push("/agencyList");
        }).finally(() => {
          this.pageChk = true;
          this.loading = false;
          this.test = true;
        });
    },
        editorContent(value){
            this.contentChange =  value;
        },
        async regAgency(){
             const headers = { 'Authorization': 'Bearer ' + sessionStorage.getItem("token")}
            var content = this.contentChange;
            content = content.replace(/&nbsp;/gi,"");
            content = content.replace(/<br>/gi,"");
            content = content.replace(/ /gi,"");
            if(this.$emptyChk(this.agencyName)){
                    this.$swal('','여행사 명을 입력해주세요.','warning');
                    return;
                }
            if(this.$emptyChk(this.tel1) || this.$emptyChk(this.tel2) || this.$emptyChk(this.tel3)){
                this.$swal('','번호를 입력해주세요.','warning');
                return;
            }
            if(content =="<p><\/p>" || content==" "){
                this.$swal('','내용을 입력해주세요.','warning');
                return;
            }
            //이미지 변경
            if(this.file!='' || this.file!=undefined) {
              const imageheaders = {
                  "content-type" : "multipart/form-data"
              }
              const formdata = new FormData();
              formdata.append("multiFile",this.file);        
              await this.$axios.post(process.env.VUE_APP_FILE_UPLOAD,formdata,{imageheaders}).then((res) =>{
                    this.fileId = res.data[0].fileId;
                }).catch(() => {
                }).finally(() => {
              });

            }
            let param = {
                    "name"  : this.agencyName ,
                    "address" : this.roadAddress ,
                    "tel" : this.tel1+"-"+this.tel2+"-"+this.tel3,
                    "detail" : this.contentChange,
                    "file_id" :this.fileId,
                    "comment" : this.agencyComment
                }
            this.loading = true;
            await this.$axios.put(process.env.VUE_APP_TRAVEL_AGENCY+this.agencyId+"/form",param,{headers}).then((res) =>{
                if(res.data.resultCode=="SUCCESS"){
                    this.$swal('',"저장되었습니다.",'success');
                        this.$router.push({
                                    path: "/agencyDetail",
                                    name: "agencyDetail",
                                    query: { sn: this.agencyId }
                                });
            }
        }).catch((error) => {
             this.$swal('',error.response.data.result,'error');
        }).finally(() => {
          this.loading = false;
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
            this.fileId ="";
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