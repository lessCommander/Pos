<template>
  <div class="left-nav">
      <ul>
        <li v-for="(pane, inx) in panes" :key="inx" :class="{'active': pane.txt === curActive}">
          <a href="#">
            <i class="iconfont" :class="pane.iconClass"></i>
            <p>{{pane.txt}}</p>
          </a>
        </li>
      </ul>
  </div>
</template>

<script>
export default {
  name: 'left-nav',
  data () {
    return {
      panes: [
        {iconClass: 'icon-goumai', txt: '收银'},
        {iconClass: 'icon-31dianpu', txt: '店铺'},
        {iconClass: 'icon-shipin', txt: '商品'},
        {iconClass: 'icon-zuanshi', txt: '会员'},
        {iconClass: 'icon-tongji', txt: '统计'},
        {iconClass: 'icon-31shezhi', txt: '设置'}
      ],
      curActive: '收银'
    }
  }
}
</script>

<style scoped>
.left-nav{
  width: 5%;
  height: 100%;
  float: left;
  background-color: #6b96f3;
  text-align: center;
  box-shadow: 2px 0 4px 0 rgba(0,0,0,.12);
}
.left-nav li{
  font-size: 14px;
  border-bottom: 1px solid #eee;
}
.left-nav li a{
  width: 100%;
  height: 100%;
  display: block;
  color: #eee;
  padding: 10px 0;
}
.left-nav li.active a{
  color: #fc6500;
}
.left-nav li:hover a{
  color: #fc9b67;
}
.left-nav li a i{
  font-size: 20px;
}
</style>
