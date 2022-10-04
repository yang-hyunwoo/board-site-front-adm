<template>
  <div ref="refEditor" class="margincustom margintpcust"></div>
</template>
<script setup>
import "@toast-ui/editor/dist/toastui-editor.css"; // Editor's Style
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';
import { ref, onMounted ,defineProps} from "vue";
// import { useRouter } from 'vue-router';

// const router = useRouter();
// const axios = require("axios");
// const swal = inject('$swal')
 
const props = defineProps({                     
    content : {
      type:String,
      required : false
    }
});
 
const refEditor = ref(null); // template의 ref의 값과 동일한 변수 선언
// const title = ref("");
// const emit =   defineEmits(['contentChange']);

// function tokenChk() {
//   let token = localStorage.getItem("token");
//       if(token == null || token.length==0 || token == "null" || token == "undefined" || token ==undefined) {
//           return false;
//       } 
//           return true;
// }
// function delete_click(){
//             swal.fire({
//                         title: '삭제 하시겠습니까?',
//                         text: '다시 되돌릴 수 없습니다.',
//                         icon: 'warning',
//                         showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
//                         confirmButtonColor: '#3085d6', // confrim 버튼 색깔 지정
//                         cancelButtonColor: '#d33', // cancel 버튼 색깔 지정
//                         confirmButtonText: '확인', // confirm 버튼 텍스트 지정
//                         cancelButtonText: '취소', // cancel 버튼 텍스트 지정
//                         reverseButtons: true, // 버튼 순서 거꾸로
   
//       }).then(result => {
//          if (result.isConfirmed) { // 만약 모달창에서 confirm 버튼을 눌렀다면
//              const headers = {
//                'Authorization': 'Bearer ' + localStorage.getItem("token")
//             }
//           axios.put(process.env.VUE_APP_ARTICLE_DETAIL+props.articleId+"/delete",null,{headers}).then((res) =>{
//           if(res.data.resultCode=="SUCCESS"){
//               swal('','삭제되었습니다.','success');
//               router.push("/article");
//           }
//         }).catch(() => {
//            history.back(-1);
//         }).finally(() => {
//         });
//           }
//       });
// }



onMounted( async () => { 
   console.log("onMounted")
   const xeditor = new Viewer({
    el: refEditor.value,
    height: "500px",
    initialValue: props.content,
    initialEditType: "wysiwyg",
    previewStyle: "tab",
    useDefaultHTMLSanitizer: false,
    usageStatistics: false,
    hideModeSwitch: true,   //밑에 창 
  });
  
})

</script>



