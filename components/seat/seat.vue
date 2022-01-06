<template>
	<view>
		<movable-area style="width: 100%;overflow:hidden;" :style="`height:${seatRow*seatSize}px;`">
			<movable-view style="width: 100%;" :style="`height:${seatRow*seatSize}px;`" :inertia="true" :scale="true" :scale-min="0.5"
			 :scale-max="10" direction="all" @change="onMove" @scale="onScale">
				<view v-for="(item,index) in seatArray" :key="index" class="dp-f" :style="`width:${boxWidth}px;`+`height:${seatSize}px;`">
					<view v-for="(seat,col) in item" :key="col" style="display: flex;position: relative;justify-content: center;align-items: center;" :style="`width:${seatSize}px;`+`height:${seatSize}px;`"
					 @click="handleChooseSeat(index,col)"> 
						<image v-if="seat.type===-1" class="w-80 h-80" src="/static/imgs/seat/seat-unselected.png" mode="aspectFit"></image>
						<image v-else-if="seat.type===0" class="w-80 h-80" src="/static/imgs/seat/seat-bought.png" mode="aspectFit"></image>
						<image v-else-if="seat.type===1" class="w-80 h-80" src="/static/imgs/seat/seat-selecting.png" mode="aspectFit"></image>
						<image v-else-if="seat.type===2" class="w-80 h-80" src="/static/imgs/seat/seat-selected.png" mode="aspectFit"></image>
						<image v-if="djOption.left==col&&djOption.top==index" src="/static/imgs/seat/seat-dj.png" style="position: absolute;left: 0;top: 0;z-index: 1;" :style="`width:${seatSize*3}px;`+`height:${seatSize*2}px;`"></image>
					</view>
				</view>
			</movable-view>
		</movable-area>
	</view>
</template>

<script>
	import $calc from '@/utils/calc/index.js' 
	export default {
		props:{
			boxWidth: {
				type: Number,
				default () {//酒吧宽度px
					return 325
				}
			},
			singleSelect:{
				type: Boolean,
				default () {//是否单选
					return false
				}
			}, 
			date:{
				type:String,
				default:''
			}
			
		},
		data(){
			return {
				seatArray: [], //影院座位的二维数组,-1为非座位，0为未购座位，1为已选座位(绿色),2为已购座位(红色),一维行，二维列
				seatRow: 0, //影院座位行数
				seatCol: 0, //影院座位列数
				seatSize: 0, //座位尺寸
				SelectNum: 0, //选择座位数
				moveX: 0, //水平移动偏移量
				scale: 1, //放大倍数
				minRow: 0, //从第几行开始排座位
				minCol: 0, //从第几列开始排座位
				seatList: [], //接口获取的原始位置
				optArr: [], //选中的座位数组。
				djOption: {
					left:0,
					top:0,
				},
			
			}
		},
		methods:{
			initData: function(seatRow,seatCol,seatData,djOption) {
				this.seatRow = seatRow
				this.seatCol = seatCol
				this.minRow = 0
				this.minCol = 0
				this.seatList = seatData
				this.djOption = djOption
				this.optArr = []
			
			
				this.initSeatArray()
			},
			//初始座位数组
			initSeatArray: function() {
				let seatArray = Array(this.seatRow).fill(0).map(() => Array(this.seatCol).fill({
					type: -2,
					sn: '',
					row: '',
					col: '',
					canSeat:false,
				}));
				this.seatArray = seatArray
				console.log(this.boxWidth)
				this.seatSize = $calc.cDiv(this.boxWidth,this.seatCol )
				this.initNonSeatPlace();
			},
			//初始化是座位的地方
			initNonSeatPlace: function() {
				let seat = this.seatList.slice()
				let arr = this.seatArray.slice()
				for (let num in seat) {
					let status = -1 // -1为未开放（灰色），0为可预订(白色)，1为预订中(黄色)，2为已预订(红色)
					let canSeat = false
					if (seat[num].status === 'notOpen' || seat[num].hasLock) {
						status = -1
					} else if (seat[num].status === 'canBook') {
						status = 0
						canSeat = true
					} else if (seat[num].status === 'select') {
						status = 1
						if(seat[num].isMySelect) {
							canSeat = true
							// this.optArr.push({
							// 	id: seat[num].id,
							// 	type: status,
							// 	sn: seat[num].sn,
							// 	row: seat[num].top,
							// 	col: seat[num].left,
							// 	num: seat[num].seat,
							// 	count: seat[num].minimumConsumption,
							// 	canSeat:canSeat,
							// })
							this.$emit('select',{
								id: seat[num].id,
								type: status,
								sn: seat[num].sn,
								row: seat[num].top,
								col: seat[num].left,
								num: seat[num].seat,
								count: seat[num].minimumConsumption,
								canSeat:canSeat,
								selectId:seat[num].selectId
							})
						}
					} else if (seat[num].status === 'booking') {
						status = 2
					} else if (seat[num].status === 'bookSuccess') {
						status = 2
					}
					arr[parseInt(seat[num].top) - this.minRow][parseInt(seat[num].left) - this.minCol] = {
						id: seat[num].id,
						type: status,
						sn: seat[num].sn,
						row: seat[num].top,
						col: seat[num].left,
						num: seat[num].seat,
						count: seat[num].minimumConsumption,
						canSeat:canSeat,
						selectId:seat[num].selectId
					}
				}
				this.seatArray = arr.slice()
				
			},
			//放大缩小事件
			onScale: function(e) {
				// this.moveX=-e.detail.x
				let w = this.boxWidth * 0.5
				let s = 1 - e.detail.scale
				this.moveX = w * s
				this.scale = e.detail.scale
				
			},
			//移动事件
			onMove: function(e) {
				this.moveX = e.detail.x
			},
			//重置座位
			resetSeat: function() {
				this.SelectNum = 0
				this.optArr = []
				//将所有已选座位的值变为0
				let oldArray = this.seatArray.slice();
				for (let i = 0; i < this.seatRow; i++) {
					for (let j = 0; j < this.seatCol; j++) {
						if (oldArray[i][j].type === 1) {
							oldArray[i][j].type = 0
						}
					}
				}
				this.seatArray = oldArray;
			},
			//选定且购买座位
			buySeat: function() {
				if (this.SelectNum === 0) {
					return
				}
				let oldArray = [];
				for (let i = 0; i < this.seatRow; i++) {
					for (let j = 0; j < this.seatCol; j++) {
						if (this.seatArray[i][j].type === 1) {
							oldArray.push(this.seatArray[i][j].sn)
						}
					}
				}
			},
			//处理座位选择逻辑
			handleChooseSeat: async function(row, col) {
				let seatValue = this.seatArray[row][col].type;
				let canSeat = this.seatArray[row][col].canSeat;
				let newArray = this.seatArray;
				//如果是不能选择的座位，直接返回
				if (!canSeat) return
				
				//如果是已选座位点击后变未选
				if (seatValue === 0) {
					
					let {code} = await this.$u.api.selectCardTableApi({cardTableId:newArray[row][col].id,selectDate:this.date})
					this.$emit('refresh')
					// if(code==0) { 
					// 	newArray[row][col].type = 1
					// 	this.SelectNum++
					// 	this.getOptArr(newArray,newArray[row][col], 1)
					// } else {
					// 	this.$emit('refresh')
					// }
					
				} else {
					let {code} = await this.$u.api.cancelSelectCardTableApi({selectId:newArray[row][col].selectId})
					this.$emit('refresh')
					// if(code==0) { 
					// 	newArray[row][col].type = 1
					// 	this.SelectNum++
					// 	this.getOptArr(newArray,newArray[row][col], 1)
					// } else {
					// 	this.$emit('refresh')
					// }
				}
				//必须整体更新二维数组，Vue无法检测到数组某一项更新,必须slice复制一个数组才行
				// this.seatArray = newArray.slice();
			},
			//处理已选座位数组
			getOptArr: function(newArray,item, type) {
				let optArr = this.optArr
				if (type === 1) {
					if(this.singleSelect) {
						optArr.forEach(e=>{
							console.log(newArray[e.row][e.col].sn)
							newArray[e.row][e.col].type = 0
						})
						optArr = []
					}
					optArr.push(item)
					this.$emit('select' , item)
				} else if (type === 0) {
					let arr = []
					optArr.forEach(v => {
						if (v.sn !== item.sn) {
							arr.push(v)
						}
					})
					optArr = arr
					this.$emit('unselect' )
				}
				this.optArr = optArr.slice()
			},
			
			//取消选择其他的内容
			cancelOtherSelect(){
				let seatArray = this.seatArray
				seatArray.forEach(e1=>{
					e1.forEach(e2=>{
						console.log(e2)
						// e2.type = 0
					})
				})
			}
			
			
			
		}
	}
</script>

<style lang="scss">
	.dp-f {
		display: flex;
	}
	
	.jc-c {
		justify-content: center;
	}
	.dp-ib {
		display: inline-block;
	}
	.w-80 {
		width: 80%;
	}
	
	.h-80 {
		height: 80%;
	}
</style>
