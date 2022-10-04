# board-site-front

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


# 2022 08 12
에디터를 사용하기 위해 많은 자료를 뒤져보고 어떤 에디터를 사용해야 되나 많이 찾았는데
tiptap / toast ui editor 가 제일 유명한거 같아
tiptap 을 다운하여 사용했는데 조금 애매한 느낌이 있어
toast ui editor 로 변경 하여 개발 했다.
현재 나의 프로젝트는 vue3으로 설정되어있어 정식적으로는 toast ui가 지원을 해주지 않아
javascript 형식으로 수정 하여 개발을 했다.

# 2022 08 20
sweetalert 사용

npm install -S vue-sweetalert2

main.js
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

app.use(VueSweetalert2);

사용
this.$swal( 'success','You clicked the <b style="color:red;">error</b> button!','success');
this.$swal(타이틀 ,내용 , "상태값");
상태값 :  success / error , waring , info ,question



2022/08/31
마이페이지 화면 및 프론트 작업 완료
