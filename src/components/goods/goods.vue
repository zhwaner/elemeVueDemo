<template>
    <div class="goods">
    	<div class="menu-wrapper" ref="menuWrapper">
    		<ul>
				<li v-for="(item,index) in goods" class="menu-item border-1px" :class="{'current': index=== currentIndex}" @click="selectMenu(index)">
					<span class="text">
						<span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}</span>
				</li>
    		</ul>
    	</div>
    	<div class="foods-wrapper" ref="foodsWrapper">
    		<ul>
				<li v-for="item in goods" class="food-list food-list-hook">
					<h1 class="title">{{item.name}}</h1>
					<ul>
						<li @click="goDetail(food)" v-for="food in item.foods" class="food-item border-1px">
						<div class="icon">
							<img width="57" height="57" :src="food.icon">
						</div>
						<div class="content">
							<h2 class="name">{{food.name}}</h2>
							<p class="desc">{{food.description}}</p>
							<div class="extra">
								<span class="count">月售{{food.sellCount}}份</span>
								<span>好评率{{food.rating}}%</span>
							</div>
							<div class="price">
								<span class="now">￥{{food.price}}</span>
								<span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
							</div>
							<div class="cartcontrol-wrapper">
								<cartcontrol :food="food"></cartcontrol>	
							</div>
						</div>
						</li>
					</ul>
				</li>
    		</ul>
    	</div>
        <shopcart :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
        <food :food="selectFood" ref="myFood"></food>
    </div>
</template>

<script>
	import axios from 'axios';
	import jroll from 'JRoll';
	import shopcart from 'components/shopcart/shopcart';
	import cartcontrol from 'components/cartcontrol/cartcontrol';
	import Vue from 'vue';
	import food from 'components/food/food';

    export default {
    	props: {
    		seller: {
    			type: Object
    		}
    	},
    	data() {
    		return {
    			goods: [],
    			listHeight: [],//存放右侧的区间高度
    			scrollY: 0, //右侧实时滚动的位置Y
    			selectFood: {}
    		}
    	},
    	created() {
    		this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    		axios.get('./api/goods')
    		.then(res => {
				this.goods = res.data.data;
				console.log(this.goods);
				this.$nextTick(() => {
					this._initScroll();
					this._calculateHeight();
				});
    		});
    	},

    	computed: {
    		// 左侧的索引
    		currentIndex() {
    			for (let i = 0; i < this.listHeight.length; i++) {
    				let height1 = this.listHeight[i];
    				let height2 = this.listHeight[i + 1];
    				if (height2 && this.scrollY >= height1 && this.scrollY < height2) {
    					return i;
    				}
    			}
    			return 0;
    		},
    		selectFoods() {
    			let foods = [];
    			this.goods.forEach((good) => {
    				good.foods.forEach((food) => {
    					if(food.count) {
    						foods.push(food);
    					}
    				})
    			})
    			return foods;
    		}
    	},
    	methods: {
    		goDetail(food, event) {
    			this.selectFood = food;
    			this.$refs.myFood.show();//执行子组件food.vue的show方法
    		},
    		selectMenu(index) {
    			this.foodScroll.scrollTo(0,-this.listHeight[index],300);
    		},
    		addCart(target) {

    		},
    		_initScroll() {
    			this.menuScroll = new JRoll(this.$refs.menuWrapper, {});
				this.foodScroll = new JRoll(this.$refs.foodsWrapper, {});
				
				this.foodScroll.on('scroll', (e) => {
					this.scrollY = Math.round(Math.abs((this.foodScroll.y)));
				});
    		},
    		_calculateHeight() {
    			let foodList = this.$refs.foodsWrapper.querySelectorAll(".food-list-hook");
    			let height = 0;
    			this.listHeight.push(height);
    			for (let i = 0; i < foodList.length; i++) {
    				let item = foodList[i];
    				height += item.clientHeight;
    				this.listHeight.push(height);
    			}
    			console.log(this.listHeight);
    		}
    	},
    	components: {
    		shopcart,
    		cartcontrol,
    		food
    	}
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/mixin";

	.goods
		position: absolute
		top: 174px
		bottom: 46px
		width: 100%
		display: flex
		overflow: hidden
		.menu-wrapper
			flex: 0 0 80px
			width: 80px //安卓浏览器兼容性问题
			background: #f3f5f7
			.menu-item
				display: table //可以有两行三行
				height: 54px
				width: 56px
				line-height: 14px
				padding: 0 12px
				border-1px(rgba(7, 17, 27, 0.1))
				font-weight: 200
				&.current
					background: #fff
					margin-top: -border-1px
					font-weight: 700
					.text
						border-none()
				.icon
					display: inline-block
					vertical-align: top
					margin-right: 2px
					width: 12px
					height: 12px
					background-size: 12px 12px
					background-repeat: no-repeat
					&.decrease
						bg-image('decrease_2')
					&.discount
						bg-image('discount_2')
					&.guarantee
						bg-image('guarantee_2')
					&.invoice
						bg-image('invoice_2')
					&.special
						bg-image('special_2')
				.text
					display: table-cell
					vertical-align: middle
					width: 56px
					font-size: 12px
		.foods-wrapper
			flex: 1
			.title
				padding-left: 14px
				height: 26px
				line-height: 26px
				border-left: 2px solid #d9dde1
				font-size: 12px
				color: rgb(147, 153, 159)
				background: #f3f5f7
			.food-item
				display: flex
				margin: 18px 18px 0
				padding-bottom: 18px
				border-1px(rgba(7, 17, 27, 0.1))
				&:last-child
					border-none
				.icon
					flex: 0 0 57px
					margin-right: 10px
				.content
					flex: 1
					.name
						margin: 2px 0 8px 0
						height: 14px
						line-height: 14px
						font-size: 14px
						color: rgb(7, 17, 27)
					.desc, .extra
						line-height: 10px
						font-size: 10px
						color: rgb(147, 153, 159)
					.desc
						margin-bottom: 8px
					.extra
						&.count
							margin-right: 12px
					.price
						font-weight: 700
						line-height: 24px
						.now
							margin-right: 8px
							font-size: 14px
							color: rgb(240, 20, 20)
						.old
							text-decoration: line-through
							font-size: 10px
							color: rgb(147, 153, 159)
					.cartcontrol-wrapper
						position: absolute
						right: 0
						bottom: 12px
</style>