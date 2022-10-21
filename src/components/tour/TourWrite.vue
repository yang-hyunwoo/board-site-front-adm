<template>
    
    <div class="input-group mb-3" style="margin-top:1rem;">
        <div style="display:block; width:100%; margin:1rem;">
            도시 명 :
            <select style="width:10%;" v-model="citySelect">
                <option value="">선택하세요.</option>
                <option value="서울">서울</option>
                <option value="부산">부산</option>
                <option value="울산">울산</option>
                <option value="대구">대구</option>
                <option value="대전">대전</option>
                <option value="충남">충남</option>
                <option value="제주도">제주도</option>
            </select>
        </div>
            <input type="text" v-model="title" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" placeholder="제목을 입력해주세요.">
    </div>
        <ToastEditor  @contentChange="editorContent"></ToastEditor>
        <div>
            썸네일
            <div style="width:500px ;height:300px" v-if="preview!=''">
            <img :src="preview" style="width:100% ; height:100%;" />
             </div>
            <label class="file-label" for="chooseFile">썸네일 추가</label>
                            <input class="file" id="chooseFile"
                            type="file" 
                            @click="resetImageUploader"
                            v-on:change="upload"
                            accept="image/png, image/jpeg, image/gif"
                            ref="imageUploader"
                            >
        <button style="margin-left:1rem;" type="button" class="btn btn-primary" @Click="resetImage()">썸네일 삭제</button>
        </div>
        <div style="display:flex; justify-content:end;">
        <button type="button" class="btn btn-primary" @click="regArticle">등록</button>
        </div>
    </template>
    
    
    <script>
    
     import ToastEditor from '@/components/editor/ToastEditor.vue'
    
    export default {
        data: function () {
        return {
            articleId:0,
            contentChange:'',
            title:"",
            preview:'',
            file:'',
            citySelect:'',
            saveThumbnail_id:''
        }
      },
      components :{
            ToastEditor
      },
      created(){
      },    
      methods: {
            editorContent(value){
                this.contentChange =  value;
            },
            async regArticle(){
                 const headers = { 'Authorization': 'Bearer ' + sessionStorage.getItem("token")}
                var content = this.contentChange;
                content = content.replace(/&nbsp;/gi,"");
                content = content.replace(/<br>/gi,"");
                content = content.replace(/ /gi,"");
    
                if(this.$emptyChk(this.title)){
                    this.$swal('','제목을 입력해주세요.','warning');
                    return;
                }
                if(this.$emptyChk(this.citySelect)){
                    this.$swal('','도시를 선택하세요.','warning');
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
                    "title"  : this.title ,
                    "content" : this.contentChange,
                    "thumbnailId" : this.saveThumbnail_id,
                    "city" : this.citySelect
                }
                await this.$axios.post(process.env.VUE_APP_TOUR_INSERT ,param,{headers}).then((res) =>{
                    if(res.data.resultCode=="SUCCESS"){
                        this.$swal('',"저장되었습니다.",'success');
                        this.$router.push("/tourList"); 
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
            }
      }
    
    }
    
    </script>
    <style scoped>

#chooseFile {
    visibility: hidden;
}
.file-label {
  background-color: #5b975b;
  color: #fff;
  text-align: center;
  padding: 10px 1rem;
  border-radius: 6px;
  cursor: pointer;
}
.file {
  display: none;
}
    </style>