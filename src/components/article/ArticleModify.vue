<template>
<div class="input-group mb-3" style="margin-top:1rem;">
  <input type="text" v-model="title" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" placeholder="제목을 입력해주세요.">
</div>
    <ToastEditor  v-if="test" @contentChange="editorContent" :content="content"></ToastEditor>
    <div style="display:flex; justify-content:end;">
    <button type="button" class="btn btn-primary" @click="regArticle">저장</button>
    </div>
<BlackBg v-if="loading"></BlackBg>
</template>


<script>

import ToastEditor from '@/components/editor/ToastModifyEditor.vue'
import BlackBg from "../loading/BlackBg"
export default {
	data: function () {
    return {
        articleId:0,
        contentChange:'',
        title:"",
        loading:false,
        content:"",
        test:false,
    }
  },
  components :{
        ToastEditor,
        BlackBg
  },
  created(){
    this.articleId = this.$route.query.sn;
    this.init();
  },    
  methods: {
    init() {
            this.validArticle();
    },

    validArticle() {
        this.loading = true;
        const headers = { 'Authorization': 'Bearer ' + sessionStorage.getItem("token")}
        this.$axios.get(process.env.VUE_APP_ARTICLE_UPDATE_VALID+this.$route.query.sn,{headers}).then((res) =>{
         if(res.data.resultCode=="SUCCESS"){
            this.title = res.data.result.title;
            this.content = res.data.result.content;
            this.contentChange = res.data.result.content;
          }
        }).catch((error) => {
             this.$swal('',error.response.data.result,'error');
             this.$router.push("/article");
        }).finally(() => {
          this.pageChk = true;
          this.loading = false;
          this.test = true;
        });
    },
        editorContent(value){
            this.contentChange =  value;
        },
        regArticle(){
             const headers = { 'Authorization': 'Bearer ' + sessionStorage.getItem("token")}
            var content = this.contentChange;
            content = content.replace(/&nbsp;/gi,"");
            content = content.replace(/<br>/gi,"");
            content = content.replace(/ /gi,"");
            if(this.$emptyChk(this.title)){
                this.$swal('','제목을 입력해주세요.','warning');
                return;
            }
            if(content =="<p><\/p>" || content==" "){
                this.$swal('','내용을 입력해주세요.','warning');
                return;
            }
            
            let param = {
                "title"  : this.title ,
                "content" : this.contentChange
            }
            this.loading = true;
            this.$axios.post(process.env.VUE_APP_ARTICLE_DETAIL+this.articleId+"/form",param,{headers}).then((res) =>{
                if(res.data.resultCode=="SUCCESS"){
                    this.$swal('',"저장되었습니다.",'success');
                        this.$router.push({
                                    path: "/articleDetail",
                                    name: "articleDetail",
                                    query: { sn: this.articleId }
                                });
            }
        }).catch((error) => {
             this.$swal('',error.response.data.result,'error');
        }).finally(() => {
          this.loading = false;
        });
        }
  }

}

</script>