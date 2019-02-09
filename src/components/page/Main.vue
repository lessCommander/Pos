<template>
<div class="home">
    <el-row class="main">
        <el-col :span="8" class="main-left">
            <el-tabs stretch>
                <el-tab-pane label="点餐">
                    <el-table max-height="500" border stripe :data="curGoods" show-summary :summary-method="getSum" :span-method="sumSpanMethod">
                        <el-table-column prop="name" label="商品名称"></el-table-column>
                        <el-table-column prop="num" label="数量" width="60" align="center"></el-table-column>
                        <el-table-column prop="price" label="金额(元)" width="80" align="center"></el-table-column>
                        <el-table-column label="操作" width="150" align="center">
                            <template slot-scope="scope">
                                <el-button type="primary" circle size="mini" icon="el-icon-minus" :disabled="!ifMinus(scope.row)" @click="minusGoods(scope.row)"></el-button>
                                <el-button type="primary" circle size="mini" icon="el-icon-plus" @click="addGoods(scope.row)"></el-button>
                                <el-button type="danger" circle size="mini" icon="el-icon-delete" @click="delSingleGoods(scope)"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-row class="end-btns">
                        <el-col :span="8">
                            <el-button plain type="warning" :disabled="!ifPay">挂单</el-button>
                        </el-col>
                        <el-col :span="8">
                            <el-button plain type="danger" :disabled="!ifPay" @click="delAllGoods">删除</el-button>
                        </el-col>
                        <el-col :span="8">
                            <el-button plain type="success" :disabled="!ifPay">结账</el-button>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="挂单">
                    挂单
                </el-tab-pane>
                <el-tab-pane label="外卖">
                    外卖
                </el-tab-pane>
            </el-tabs>
        </el-col>
        <el-col :span="16" class="main-right">
            <div class="often-wrap">
                <div class="often-title">热门食品</div>
                <ul class="often-list">
                    <li class="often-list-item" v-for="(g, inx) in oftenGoods" :key="inx">
                        <el-tag :type="g.color" @click="addGoods(g)">{{g.name}} {{g.price}}元</el-tag>
                    </li>
                </ul>
            </div>
            <div class="goods-list-wrap">
                <el-tabs tabPosition="left" class="goods-list-tab">
                    <el-tab-pane label="特色主食">
                        <ul class="goods-list">
                            <li class="goods-list-item" v-for="(g, inx) in goodsList.burger" :key="inx" @click="addGoods(g)">
                                <img :src="getImgUrl(g.img)" :alt="g.img">
                                <p>{{g.name}}</p>
                                <p>{{g.price}}元</p>
                            </li>
                        </ul>
                    </el-tab-pane>
                    <el-tab-pane label="美味小食">
                        <ul class="goods-list">
                            <li class="goods-list-item" v-for="(g, inx) in goodsList.snack" :key="inx" @click="addGoods(g)">
                                <img :src="getImgUrl(g.img)" :alt="g.img">
                                <p>{{g.name}}</p>
                                <p>{{g.price}}元</p>
                            </li>
                        </ul>
                    </el-tab-pane>
                    <el-tab-pane label="甜点饮料">
                        <ul class="goods-list">
                            <li class="goods-list-item" v-for="(g, inx) in goodsList.drink" :key="inx" @click="addGoods(g)">
                                <img :src="getImgUrl(g.img)" :alt="g.img">
                                <p>{{g.name}}</p>
                                <p>{{g.price}}元</p>
                            </li>
                        </ul>
                    </el-tab-pane>
                    <el-tab-pane label="超值套餐">
                        <ul class="goods-list">
                            <li class="goods-list-item" v-for="(g, inx) in goodsList.meal" :key="inx" @click="addGoods(g)">
                                <img :src="getImgUrl(g.img)" :alt="g.img">
                                <p>{{g.name}}</p>
                                <p>{{g.price}}元</p>
                            </li>
                        </ul>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-col>
    </el-row>
</div>
</template>

<script>
export default {
    name: 'home',
    data() {
        return {
            curGoods: [], //当前已经点餐的食物
            oftenGoods: [], //模拟后台获取的热门食物
            goodsList: {  //模拟后台获取的所有食物
                burger: [],
                drink: [],
                meal: [],
                snack: []
            }
        }
    },
    methods: {
        //合计
        getSum({data}) {
            const sums = [];

            sums[0] = '合计：';
            sums[1] = '';
            sums[2] = '';
            sums[3] = data.reduce((prev, curr) => {
                const num = Number(curr.num),
                      price = Number(curr.price);
                if (!isNaN(num) && !isNaN(price)) {
                    return prev + num * price;
                } else {
                    return prev;
                }
            }, 0);
            sums[3] = '￥' + sums[3] + ' 元';
            return sums;
        },
        //合计行合并列
        sumSpanMethod(params){
            
        },
        //获取食品数据
        getGoodsData(){
            //热门食品
            let aColors = ['', 'success', 'info', 'warning', 'danger'],
                n = 0,
                oftenData = [];

            this.axios.get('static/often.json')
                .then(res=>{
                    oftenData = res.data.map(o=>{ // 标签获取随机颜色
                        n = this.getRndNum(0, 4);
                        return Object.assign(o, {color : aColors[n]});
                    });
                    this.oftenGoods = oftenData;
                })
                .catch(res=>{
                    this.$notify({
                        message: '获取数据失败',
                        offset: 100
                    });
                });

            //所有食品
            this.axios.get('static/goods.json')
                .then(res=>{
                    ({...this.goodsList} = res.data);
                })
                .catch(res=>{
                    this.$notify({
                        message: '获取数据失败',
                        offset: 100
                    });
                });
        },
        //获取x~y的随机数
        getRndNum(x, y){
            return x + Math.floor(Math.random()*(y-x+1));
        },
        //根据img名称返回img的url地址，注意：使用require一定要三个部分组成！！！
        getImgUrl(imgName){
            return require('assets/images/' + imgName + '.jpg');
        },
        //增加商品
        addGoods(oGoods){
            let cg = this.curGoods,
                flag = false;

            for(let i = 0; i < cg.length; i++){
                if (cg[i].name === oGoods.name) {
                    cg[i].num++;
                    cg.splice(i, 1, cg[i]);
                    flag = true;
                    break;
                }
            }
            
            if(!flag){
                cg.push(Object.assign(oGoods, {
                    num: 1
                }));
            }
        },
        //减少按钮可用状态
        ifMinus(oGoods){
            if(oGoods){
                return oGoods.num > 1 ? true : false;
            }
        },
        //减少单个商品
        minusGoods(oGoods){
            let cg = this.curGoods,
                flag = false;

            for(let i = 0; i < cg.length; i++){
                if (cg[i].name === oGoods.name) {
                    cg[i].num--;
                    cg.splice(i, 1, cg[i]);
                    break;
                }
            }
        },
        //删除单个商品
        delSingleGoods(oScope){
            this.$confirm('是否删除 ' + oScope.row.name + '？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                this.curGoods.splice(oScope.$index, 1);
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        //删除所有商品
        delAllGoods(){
            this.$confirm('是否删除所有商品？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            }).then(() => {
                this.curGoods = [];
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        }
    },
    mounted(){
        this.getGoodsData();
    },
    computed:{
        //挂单、删除所有、结账按钮可用状态
        ifPay(){
            if(this.curGoods){
                return this.curGoods.length > 0;
            }
        },
        //合计
    }
}
</script>

<style scoped>
.home{
  height: 100%;
}
.main{
  width: 95%;
  height: 100%;  
  float: left;
  text-align: center;
}
.main-left, .main-right{
  height: 100%;
}
.end-btns{
    margin-top: 10px;
}
.often-wrap{
    width: 100%;
    border-left: 1px solid #e4e7ed;
    border-bottom: 1px solid #e4e7ed;
}
.often-title{
    width: 100%;
    height: 38px;
    line-height: 40px;
    background-color: #fff;
    border-bottom: 2px solid #e4e7ed;
}
.often-list{
    height: 100%;
    max-height: 200px;
    overflow-y: scroll;
}
.often-list .often-list-item{
    float: left;
    padding: 10px;
}
.often-list .often-list-item span{
    transition: opacity .3s, box-shadow .3s;
    cursor: pointer;
}
.often-list .often-list-item span:hover{
    opacity: .7;
    box-shadow: 1px 1px 3px 0 #999;
}
.goods-list-wrap{
    height: 100%;
    padding: 10px;
}
.goods-list-tab{
    height: 100%;
}
.goods-list-item{
    width: 113px;
    height: 142px;
    float: left;
    margin: 10px;
    box-sizing: border-box;
    border: 2px solid #eee;
    border-radius: 6px;
    color: #999;
    font-size: 14px;
    transition: border-color .3s, transform .3s, box-shadow .3s;
    cursor: pointer;
    overflow: hidden;
}
.goods-list-item:hover{
    border-color: #2e6bee;
    transform: translateY(-2px);
    box-shadow: 1px 1px 3px 0 #999;
}
</style>
