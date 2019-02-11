<template>
    <div class="home">
        <el-row class="main">
            <el-col :span="8" class="main-left">
                <el-tabs stretch class="tabs-wrap">
                    <el-tab-pane label="点餐">
                        <el-table max-height="500" border stripe :data="curGoods" show-summary :summary-method="getSum">
                            <el-table-column prop="name" label="商品名称"></el-table-column>
                            <el-table-column prop="num" label="数量" width="60" align="center"></el-table-column>
                            <el-table-column prop="price" label="金额(元)" width="80" align="center"></el-table-column>
                            <el-table-column label="操作" width="150" align="center">
                                <template slot-scope="scope">
                                    <el-button type="primary" circle size="mini" icon="el-icon-minus" :disabled="!ifMinus(scope.row)"
                                        @click="minusGoods(scope.row)"></el-button>
                                    <el-button type="primary" circle size="mini" icon="el-icon-plus" @click="addGoods(scope.row)"></el-button>
                                    <el-button type="danger" circle size="mini" icon="el-icon-delete" @click="delSingleGoods(scope, 'curGoods')"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-row class="end-btns">
                            <el-col :span="8">
                                <el-button plain type="warning" :disabled="!ifPay" @click="pendingOrder">挂单</el-button>
                            </el-col>
                            <el-col :span="8">
                                <el-button plain type="danger" :disabled="!ifPay" @click="delAllGoods('curGoods')">整单取消</el-button>
                            </el-col>
                            <el-col :span="8">
                                <el-button plain type="success" :disabled="!ifPay" @click="payTheBill">结账</el-button>
                            </el-col>
                        </el-row>
                    </el-tab-pane>
                    <el-tab-pane label="挂单">
                        <el-table max-height="500" border stripe :data="pendingGoods" show-summary :summary-method="getSum">
                            <el-table-column prop="name" label="商品名称"></el-table-column>
                            <el-table-column prop="num" label="数量" width="60" align="center"></el-table-column>
                            <el-table-column prop="price" label="金额(元)" width="80" align="center"></el-table-column>
                            <el-table-column label="操作" width="120" align="center">
                                <template slot-scope="scope">
                                    <el-button type="danger" size="mini" @click="delSingleGoods(scope, 'pendingGoods')">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-row class="end-btns">
                            <el-col :span="12">
                                <el-button plain type="warning" :disabled="pendingGoods.length === 0" @click="releaseOrder">全部解单</el-button>
                            </el-col>
                            <el-col :span="12">
                                <el-button plain type="danger" :disabled="pendingGoods.length === 0" @click="delAllGoods('pendingGoods')">全部删除</el-button>
                            </el-col>
                        </el-row>
                    </el-tab-pane>
                    <el-tab-pane label="外卖">
                        <div class="snack-form-wrap">
                            <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="90px">
                                <el-form-item label="客户名称" prop="name">
                                    <el-input v-model="ruleForm.name"></el-input>
                                </el-form-item>
                                <el-form-item label="客户电话" prop="phone">
                                    <el-input v-model.number="ruleForm.phone"></el-input>
                                </el-form-item>
                                <el-form-item label="送餐时间" required>
                                    <el-col :span="11">
                                        <el-form-item prop="date1">
                                            <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                    <el-col class="line" :span="2">-</el-col>
                                    <el-col :span="11">
                                        <el-form-item prop="date2">
                                            <el-time-picker type="fixed-time" placeholder="选择时间" v-model="ruleForm.date2"
                                                style="width: 100%;"></el-time-picker>
                                        </el-form-item>
                                    </el-col>
                                </el-form-item>
                                <el-form-item label="即时配送" prop="delivery">
                                    <el-switch v-model="ruleForm.delivery"></el-switch>
                                </el-form-item>
                                <el-form-item label="是否会员" prop="isVip">
                                    <el-radio-group v-model="ruleForm.isVip">
                                        <el-radio label="会员"></el-radio>
                                        <el-radio label="非会员"></el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="备注" prop="desc">
                                    <el-input type="textarea" v-model="ruleForm.desc"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="submitForm('ruleForm')">立即下单</el-button>
                                    <el-button type="warning" @click="resetForm('ruleForm')">重置</el-button>
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
            <el-col :span="16" class="main-right">
                <div class="often-wrap">
                    <div class="often-title">热门食品</div>
                    <ul class="often-list">
                        <li class="often-list-item" v-for="(g, inx) in oftenGoods" :key="inx">
                            <el-tag :type="g.color" @click.stop="addGoods(g)">{{g.name}} {{g.price}}元</el-tag>
                            <transition name="popup">
                                <em class="adot" v-if="g.dotShow">+1</em>
                            </transition>
                        </li>
                    </ul>
                </div>
                <div class="goods-list-wrap">
                    <el-tabs tabPosition="left" class="goods-list-tab">
                        <el-tab-pane label="特色主食">
                            <ul class="goods-list">
                                <li class="goods-list-item" v-for="(g, inx) in goodsList.burger" :key="inx" @click.stop="addGoods(g)">
                                    <img :src="getImgUrl(g.img)" :alt="g.img">
                                    <p>{{g.name}}</p>
                                    <p>{{g.price}}元</p>
                                    <transition name="popup">
                                        <em class="adot" v-if="g.dotShow">+1</em>
                                    </transition>
                                </li>
                            </ul>
                        </el-tab-pane>
                        <el-tab-pane label="美味小食">
                            <ul class="goods-list">
                                <li class="goods-list-item" v-for="(g, inx) in goodsList.snack" :key="inx" @click="addGoods(g)">
                                    <img :src="getImgUrl(g.img)" :alt="g.img">
                                    <p>{{g.name}}</p>
                                    <p>{{g.price}}元</p>
                                    <transition name="popup">
                                        <em class="adot" v-if="g.dotShow">+1</em>
                                    </transition>
                                </li>
                            </ul>
                        </el-tab-pane>
                        <el-tab-pane label="甜点饮料">
                            <ul class="goods-list">
                                <li class="goods-list-item" v-for="(g, inx) in goodsList.drink" :key="inx" @click="addGoods(g)">
                                    <img :src="getImgUrl(g.img)" :alt="g.img">
                                    <p>{{g.name}}</p>
                                    <p>{{g.price}}元</p>
                                    <transition name="popup">
                                        <em class="adot" v-if="g.dotShow">+1</em>
                                    </transition>
                                </li>
                            </ul>
                        </el-tab-pane>
                        <el-tab-pane label="超值套餐">
                            <ul class="goods-list">
                                <li class="goods-list-item" v-for="(g, inx) in goodsList.meal" :key="inx" @click="addGoods(g)">
                                    <img :src="getImgUrl(g.img)" :alt="g.img">
                                    <p>{{g.name}}</p>
                                    <p>{{g.price}}元</p>
                                    <transition name="popup">
                                        <em class="adot" v-if="g.dotShow">+1</em>
                                    </transition>
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
                goodsList: { //模拟后台获取的所有食物
                    burger: [],
                    drink: [],
                    meal: [],
                    snack: []
                },
                saveAllPrice: 0, //记录总价格，结账时使用
                timer: null, //用于弹出+1间隔
                timerSwitch: false, //弹出+1的开关
                pendingGoods: [], //挂单的食物
                ruleForm: { //外卖表单
                    name: '',
                    phone: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    isVip: '',
                    desc: ''
                },
                rules: { //外卖表单规则
                    name: [
                        {
                            required: true,
                            message: '请输入客户名称',
                            trigger: 'blur'
                        },
                        {
                            min: 1,
                            max: 10,
                            message: '长度在 1 到 10 个字符',
                            trigger: 'blur'
                        }
                    ],
                    phone: [
                        {
                            required: true,
                            message: '请输入客户电话',
                            trigger: 'blur'
                        },
                        {
                            type: 'number',
                            message: '电话号码必须为数字'
                        }
                    ],
                    date1: [
                        {
                            type: 'date',
                            required: true,
                            message: '请选择日期',
                            trigger: 'change'
                        }
                    ],
                    date2: [
                        {
                            type: 'date',
                            required: true,
                            message: '请选择时间',
                            trigger: 'change'
                        }
                    ],
                    isVip: [
                        {
                            required: true,
                            message: '请选择是否为会员',
                            trigger: 'change'
                        }
                    ]
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
            this.saveAllPrice = sums[3];
            sums[3] = '￥' + sums[3] + ' 元';
            return sums;
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

            if(!this.timerSwitch){
                this.timerSwitch = true;
                oGoods.dotShow = true;
                this.timer = setTimeout(()=>{
                    oGoods.dotShow = this.timerSwitch = false;
                }, 800);
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
        //删除单个商品，参数为删除的列表名：'curGoods'|'pendingGoods'
        delSingleGoods(oScope, listName){
            this.$confirm('是否删除 “' + oScope.row.name + '”？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                this[listName].splice(oScope.$index, 1);
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
        //删除所有商品，参数为删除的列表名：'curGoods'|'pendingGoods'
        delAllGoods(listName){
            this.$confirm('是否删除所有商品？', '删除提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            }).then(() => {
                this[listName] = [];
                this.$message({
                    type: 'success',
                    message: '删除成功！'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除！'
                });
            });
        },
        //结账
        payTheBill(){
            this.$confirm('共 ' + this.saveAllPrice + ' 元，是否要结账？', '结账提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'success'
            }).then(() => {
                const loading = this.$loading({
                    lock: true,
                    text: '结账中……',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });

                setTimeout(() => {
                    loading.close();
                    this.$message({
                        type: 'success',
                        message: '结账成功！'
                    });
                    this.curGoods = []; //清空点餐栏
                    this.saveAllPrice = 0;  //合计清零
                }, 2000);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消结账！'
                });
            });
        },
        //全部挂单 <=> 全部取消挂单，如果有重复的食品，则数量+1，没有就添加
        copyPlusGoods(originG, targetG){
            let ogs = originG,
                tgs = [...targetG],
                founded = false;

            for (let og of ogs){
                founded = tgs.some(tg=>{
                    if(tg.name === og.name){
                        tg.num += og.num;
                        return true;
                    }
                });
                
                if(!founded){
                    tgs.push({...og});
                }
            }

            targetG = tgs;
            originG = [];
        },
        //全部挂单
        pendingOrder(){
            this.$confirm('是否进行挂单？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                let ogs = this.curGoods,
                    tgs = [...this.pendingGoods],
                    founded = false;

                for (let og of ogs){
                    founded = tgs.some(tg=>{
                        if(tg.name === og.name){
                            tg.num += og.num;
                            return true;
                        }
                    });
                    
                    if(!founded){
                        tgs.push({...og});
                    }
                }
                
                this.pendingGoods = tgs;
                this.curGoods = [];

                // this.copyPlusGoods(this.curGoods, this.pendingGoods);

                this.$notify({
                    message: '挂单成功，请在挂单页查看。',
                    type: 'success'
                });
            }).catch(() => {
                this.$notify({
                    message: '已取消挂单。',
                    type: 'info'
                });
            });
        },
        //全部解单
        releaseOrder(){
            this.$confirm('是否全部解单？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                let ogs = this.pendingGoods,
                    tgs = [...this.curGoods],
                    founded = false;

                for (let og of ogs){
                    founded = tgs.some(tg=>{
                        if(tg.name === og.name){
                            tg.num += og.num;
                            return true;
                        }
                    });
                    
                    if(!founded){
                        tgs.push({...og});
                    }
                }

                this.curGoods = tgs;
                this.pendingGoods = [];

                this.$notify({
                    message: '解单成功，请在点餐页查看。',
                    type: 'success'
                });
            }).catch(() => {
                this.$notify({
                    message: '已取消解单。',
                    type: 'info'
                });
            });
        },
        //外卖表单提交
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$confirm('是否立即下单?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'success',
                        center: true
                    }).then(() => {
                        const loading = this.$loading({
                            lock: true,
                            text: '正在下单……',
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.6)'
                        });

                        setTimeout(() => {
                            loading.close();
                            this.$alert('已成功下单！');
                            this.$refs[formName].resetFields();
                        }, 1234);
                        
                    }).catch(() => {
                        
                    });
                } else {
                    return false;
                }
            });
        },
        //外卖表单重置
        resetForm(formName) {
            this.$confirm('是否重置表单?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                this.$refs[formName].resetFields();
            }).catch(() => {
                
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
.tabs-wrap{
    height: 100%;
    border-right: 1px solid #e4e7ed;
}
.end-btns{
    margin-top: 10px;
}
/*热门食物*/
.often-wrap{
    width: 100%;
    /* border-left: 1px solid #e4e7ed; */
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
    position: relative;
}
.often-list .often-list-item span{
    transition: opacity .3s, box-shadow .3s;
    cursor: pointer;
}
.often-list .often-list-item span:hover{
    opacity: .7;
    box-shadow: 1px 1px 3px 0 #999;
}
/*所有食物列表*/
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
    position: relative;
}
.goods-list-item:hover{
    border-color: #2e6bee;
    transform: translateY(-2px);
    box-shadow: 1px 1px 3px 0 #999;
}
/*加1数字*/
.adot{
    font-style: normal;
    width: 20px;
    height: 20px;
    text-align: center;
    color: #f40;
    font-weight: 700;
    position: absolute;
    left: 50%;
    margin-left: -10px;
}
.popup-enter, .popup-leave, .popup-leave-to{
    bottom: 10px;
    opacity: 0;
}
.popup-enter-active{
    transition: bottom .8s, opacity .8s;
}
.popup-enter-to{
    bottom: 30px;
    opacity: 1;
}
/*外卖*/
.snack-form-wrap{
    width: 95%;
    height: 100%;
    text-align: left;
}
</style>
