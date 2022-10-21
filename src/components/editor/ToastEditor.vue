<template>
  <div   ref="refEditor"></div>
</template>

<script setup>
import "@toast-ui/editor/dist/toastui-editor.css"; // Editor's Style
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import Editor from "@toast-ui/editor";
// import colorSyntax from '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import { ref, onMounted,defineEmits } from "vue";

const emit =   defineEmits(['contentChange']);
const refEditor = ref(null); // template의 ref의 값과 동일한 변수 선언
const axios = require("axios");
onMounted( () => { 
   console.log("onMounted")
   const xeditor = new Editor({
    el: refEditor.value,
    height: "500px",
    initialValue: "",             //init value 
    initialEditType: "wysiwyg",
    previewStyle: "tab",
    useDefaultHTMLSanitizer: false,
    language:"ko-KR",
    usageStatistics: false,
    hideModeSwitch: true,   //밑에 창 
    hooks: {
    addImageBlobHook: (fileOrBlob, callback) => {
        const headers = {
          "content-type" : "multipart/form-data"
        }
        const formdata = new FormData();
        formdata.append("multiFile",fileOrBlob);
        axios.post(process.env.VUE_APP_FILE_UPLOAD,formdata,{headers}).then((res) =>{
          callback(process.env.VUE_APP_EDITOR_IMAGE+res.data[0].fileId+"/"+res.data[0].fileChildId);
        }).catch(() => {
        }).finally(() => {
        });
    },
    },
    events: {                                               //editor의 값이 변경 될때마다 emit으로 부모 컴포넌트에 던져 준다.
        change : ()=> emit('contentChange',xeditor.getHTML())
    },
    toolbarItems:[                                           //toolbar의 아이템
        ['heading', 'bold', 'italic', 'strike'],
        ['hr', 'quote'],
        ['ul', 'ol', 'task'],
        ['table', 'image', 'link'],
        ['scrollSync'],
    ],
    

  });
  
})

</script>


