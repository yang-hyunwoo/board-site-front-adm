<template>
<div class="input-group mb-3" style="margin-top:1rem;">
  <input type="text" v-model="title" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" placeholder="제목을 입력해주세요.">
</div>
    <ToastEditor  @contentChange="editorContent"></ToastEditor>
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
            if(content =="<p><\/p>" || content==""){
                this.$swal('','내용을 입력해주세요.','warning');
                return;
            }
            
            let param = {
                "title"  : this.title ,
                "content" : this.contentChange
            }
            this.$axios.post(process.env.VUE_APP_ARTICLE_INSERT ,param,{headers}).then((res) =>{
                if(res.data.resultCode=="SUCCESS"){
                    this.$swal('',"저장되었습니다.",'success');
                    this.$router.push("/article"); 
                }
        }).catch(() => {
            //  this.$swal('',error.response.data.result,'error');
        }).finally(() => {
        //   this.loading = false;
        });
        }
  }

}

</script>