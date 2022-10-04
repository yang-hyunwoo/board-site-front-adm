<!-- eslint-disable vue/multi-word-component-names -->
<template>
<div class="pagination" >
    <b-card style="justify-content: center;">
      <div class="overflow-auto">
        <div class="mt-3">
          <b-pagination v-model="ex4CurrentPage" pills :total-rows="ex4Rows" @page-click="pageClick"  :per-page="perPage" :currPage="currPage"></b-pagination>
        </div>
      </div>
    </b-card>
  <slot/>
</div>
</template>


<style>

.card {
  --bs-card-border-width:0px !important
}

.pagination {
  justify-content : center;
}

</style>

<script>
export default {
  props :{
    pageListItem: Number,
    pageTotal: Number,
    currPage : {
        type : Number,
        default: 1,
    }
  }, 
	data: function () {
    return {
    ex4CurrentPage:this.currPage,
    ex4Rows:this.pageTotal,
    perPage : this.pageListItem
    }
  },
  created() {
    console.log(this.currPage);
  },  
  methods: {
    pageClick: function (button, page){ 
         this.ex4CurrentPage = page;
        this.$emit("pageCurrent",this.ex4CurrentPage);
      // this.getNoticeListByPage(page);
			},
  }

}

</script>